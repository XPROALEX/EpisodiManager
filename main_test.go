package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestMakeEpisodeURL(t *testing.T) {
	got, err := makeEpisodeURL("https://example.test/anime/945?lang=it", 946)
	if err != nil { t.Fatal(err) }
	if got != "https://example.test/anime/946?lang=it" { t.Fatalf("got %s", got) }
	got, err = makeEpisodeURL("https://example.test/anime/{ep}/view", 12)
	if err != nil { t.Fatal(err) }
	if got != "https://example.test/anime/12/view" { t.Fatalf("got %s", got) }
}

func TestParseIndexEpisodes(t *testing.T) {
	html := `<html><a href="/show/841">841</a><a href="/show/842">Episode 842</a><a href="/show/842">duplicate</a><a href="/home">Home</a></html>`
	got := parseIndexEpisodes("https://example.test/catalog", html)
	if len(got) != 2 { t.Fatalf("expected 2 episodes, got %d", len(got)) }
	if got[0].Number != "841" || got[1].Number != "842" { t.Fatalf("unexpected order: %#v", got) }
}

func TestParseOnlyExplicitDownloadLinks(t *testing.T) {
	html := `<a href="/files/episode.mp4">Download</a><a download href="/get?id=123">File</a><a href="/stream/master.m3u8">HLS</a><script>window.downloadUrl="https://x.test/not-visible.mp4"</script><iframe src="https://player.test/embed"></iframe>`
	got := parseExplicitDownloads("https://example.test/page/1", html)
	if len(got) != 2 { t.Fatalf("expected 2 explicit links, got %d: %#v", len(got), got) }
	if !strings.Contains(got[0]["url"], "/files/episode.mp4") { t.Fatalf("unexpected first link: %#v", got[0]) }
	if !strings.Contains(got[1]["url"], "/get?id=123") { t.Fatalf("unexpected second link: %#v", got[1]) }
}

func TestBlockedPlaylistExtension(t *testing.T) {
	for _, ext := range []string{".m3u8", ".mpd", ".ts", ".m4s"} {
		if !blockedExtensions[ext] { t.Fatalf("extension %s should be blocked", ext) }
	}
}

func TestDownloadOneStoresFileAndHistory(t *testing.T) {
	content := []byte("sample-video-content")
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "video/mp4")
		w.Header().Set("Content-Disposition", `attachment; filename="clip.mp4"`)
		_, _ = w.Write(content)
	}))
	defer server.Close()
	root := t.TempDir()
	a := &App{dataFile: filepath.Join(root, "library.json")}
	a.lib.Series = []Series{{ID: "s1", Name: "Serie Test", Folder: root, Episodes: []Episode{{Number: "7", DownloadURL: server.URL, Status: "Link inserito"}}}}
	e := a.lib.Series[0].Episodes[0]
	if err := a.downloadOne(a.lib.Series[0], e); err != nil { t.Fatal(err) }
	got := a.lib.Series[0].Episodes[0]
	if got.Status != "Completato" { t.Fatalf("status: %s", got.Status) }
	b, err := os.ReadFile(got.FilePath)
	if err != nil { t.Fatal(err) }
	if string(b) != string(content) { t.Fatalf("unexpected file content: %q", b) }
}

func TestEpisodeNumberUsesVisibleLabelNotInternalPageID(t *testing.T) {
	page := `<html><a href="/anime/2998-one-piece-ita/111026">945</a><a href="/anime/2998-one-piece-ita/111027" aria-label="Episodio 946"></a></html>`
	got := parseIndexEpisodes("https://www.example.test/anime/2998-one-piece-ita/111026", page)
	if len(got) != 2 { t.Fatalf("expected 2 episodes, got %d: %#v", len(got), got) }
	if got[0].Number != "945" || got[1].Number != "946" { t.Fatalf("expected episode labels 945/946 rather than internal IDs: %#v", got) }
}

func TestDiscoverDownloadUrlFromEpisodeIframe(t *testing.T) {
	var server *httptest.Server
	server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/episode/945":
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			_, _ = w.Write([]byte(`<html><iframe src="/embed/799298?token=abc"></iframe></html>`))
		case "/embed/799298":
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			_, _ = w.Write([]byte(`<script>window.downloadUrl = 'https://cdn.example.test/download/1/0/3/video-file';</script>`))
		default: http.NotFound(w, r)
		}
	}))
	defer server.Close()
	a := &App{client: server.Client()}
	got, ref, err := a.discoverEpisodeDownload(server.URL + "/episode/945")
	if err != nil { t.Fatal(err) }
	if got != "https://cdn.example.test/download/1/0/3/video-file" { t.Fatalf("unexpected URL %q", got) }
	if ref != server.URL+"/embed/799298?token=abc" { t.Fatalf("unexpected referer %q", ref) }
}

func TestScanSeriesExtractsAllVisibleEpisodeLinks(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write([]byte(`<html><title>My Series | Example</title><a href="/show/episode-a">1</a><a href="/show/episode-b">2</a><a href="/show/episode-c">3</a></html>`))
	}))
	defer server.Close()
	body, err := fetchPage(server.URL + "/series")
	if err != nil { t.Fatal(err) }
	eps := parseIndexEpisodes(server.URL+"/series", body)
	if len(eps) != 3 { t.Fatalf("expected 3 episodes, got %d", len(eps)) }
	if got := seriesNameFromPage(server.URL+"/series", body); got != "My Series" { t.Fatalf("unexpected series name %q", got) }
}

func TestAnimeUnityInfoAPIAndEmbedURLFlow(t *testing.T) {
	var server *httptest.Server
	server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.URL.Path == "/info_api/2998-one-piece-ita/0":
			start := r.URL.Query().Get("start_range")
			var records []map[string]any
			if start == "1" {
				for n := 1; n <= 120; n++ { records = append(records, map[string]any{"id": 100000 + n, "number": n}) }
			} else if start == "121" {
				records = append(records, map[string]any{"id": 111026, "number": 945})
			}
			w.Header().Set("Content-Type", "application/json")
			_ = json.NewEncoder(w).Encode(map[string]any{"episodes": records})
		case r.URL.Path == "/embed-url/111026":
			w.Header().Set("Content-Type", "text/plain")
			_, _ = w.Write([]byte(server.URL + "/vixcloud/embed/799298?token=abc"))
		case r.URL.Path == "/vixcloud/embed/799298":
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`<script>window.downloadUrl = '` + server.URL + `/download/1/0/3/video945';</script>`))
		default: http.NotFound(w, r)
		}
	}))
	defer server.Close()
	a := &App{client: server.Client()}
	base, apiID, ok := animeUnityParts(server.URL + "/anime/2998-one-piece-ita/111026")
	if !ok || apiID != "2998-one-piece-ita" || base != server.URL { t.Fatalf("unexpected series URL parts: %q %q %v", base, apiID, ok) }
	episodes, err := a.fetchAnimeUnityEpisodes(base, apiID, server.URL+"/anime/2998-one-piece-ita/111026")
	if err != nil { t.Fatal(err) }
	if len(episodes) != 121 { t.Fatalf("expected 121 episodes across two API batches, got %d", len(episodes)) }
	last := episodes[len(episodes)-1]
	if last.Number != "945" || last.SiteID != "111026" { t.Fatalf("episode visible number and internal ID were not preserved: %#v", last) }
	url, referer, err := a.resolveAnimeUnityDownload(base, last)
	if err != nil { t.Fatal(err) }
	if url != server.URL+"/download/1/0/3/video945" { t.Fatalf("unexpected download URL %q", url) }
	if referer != server.URL+"/vixcloud/embed/799298?token=abc" { t.Fatalf("unexpected video page referer %q", referer) }
}
