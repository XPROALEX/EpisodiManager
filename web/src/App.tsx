import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type {
  CatalogTitle,
  TrackerStatus,
  WatchEntry,
  WatchStatus
} from "./types";

type View = "dashboard" | "explore" | "watchlist" | "downloads" | "library" | "settings";

const navigation: Array<{ id: View; label: string; symbol: string; group: string }> = [
  { id: "dashboard", label: "Panoramica", symbol: "⌂", group: "Workspace" },
  { id: "explore", label: "Esplora", symbol: "◈", group: "Catalogo" },
  { id: "watchlist", label: "La mia lista", symbol: "▤", group: "Catalogo" },
  { id: "downloads", label: "Download", symbol: "↓", group: "Gestione" },
  { id: "library", label: "Libreria locale", symbol: "▣", group: "Gestione" },
  { id: "settings", label: "Impostazioni", symbol: "⚙", group: "Sistema" }
];

const statusOptions: WatchStatus[] = [
  "Da iniziare",
  "In visione",
  "Completato",
  "In pausa",
  "Abbandonato"
];

const providerNames: Record<string, string> = {
  streamingcommunity: "StreamingCommunity",
  animeunity: "AnimeUnity"
};

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [status, setStatus] = useState<TrackerStatus | null>(null);
  const [catalog, setCatalog] = useState<CatalogTitle[]>([]);
  const [watchlist, setWatchlist] = useState<WatchEntry[]>([]);
  const [query, setQuery] = useState("");
  const [watchQuery, setWatchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    const current = await api.trackerStatus();
    setStatus(current);
  }, []);

  const loadCatalog = useCallback(async (search: string) => {
    const result = await api.catalog(search, 0, 100);
    setCatalog(result.items);
  }, []);

  const loadWatchlist = useCallback(async (search: string) => {
    const result = await api.watchlist(search, "");
    setWatchlist(result.items);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadStatus(), loadWatchlist("")]);
      if (view === "explore") await loadCatalog("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backend non raggiungibile");
    } finally {
      setLoading(false);
    }
  }, [loadCatalog, loadStatus, loadWatchlist, view]);

  useEffect(() => {
    void refreshAll();
    const timer = window.setInterval(() => {
      void loadStatus().catch(() => undefined);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [refreshAll, loadStatus]);

  useEffect(() => {
    if (view === "explore") {
      void loadCatalog(query).catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Catalogo non disponibile");
      });
    }
    if (view === "watchlist") {
      void loadWatchlist(watchQuery).catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Lista non disponibile");
      });
    }
  }, [view, loadCatalog, loadWatchlist]);

  const currentTitle = navigation.find((item) => item.id === view)?.label ?? "EpisodiManager";
  const inProgress = useMemo(
    () => watchlist.filter((entry) => entry.status === "In visione"),
    [watchlist]
  );
  const completed = useMemo(
    () => watchlist.filter((entry) => entry.status === "Completato").length,
    [watchlist]
  );

  async function syncProvider(provider: string) {
    setNotice("");
    setError("");
    try {
      const result = await api.syncCatalog(provider);
      setNotice(result.state || "Sincronizzazione avviata");
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sincronizzazione non riuscita");
    }
  }

  async function addTitle(title: CatalogTitle) {
    setError("");
    try {
      await api.addToWatchlist(title.id);
      setNotice(`«${title.name}» aggiunto alla tua lista.`);
      await Promise.all([loadWatchlist(""), loadCatalog("")]);
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile aggiungere il titolo");
    }
  }

  async function changeStatus(entry: WatchEntry, next: WatchStatus) {
    try {
      await api.updateWatchEntry(entry, next);
      await loadWatchlist("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile aggiornare lo stato");
    }
  }

  async function toggleEpisodes(entry: WatchEntry) {
    if (expandedEntry === entry.id) {
      setExpandedEntry(null);
      return;
    }
    setExpandedEntry(entry.id);
    try {
      const detailed = await api.trackerDetail(entry.id);
      setWatchlist((current) => current.map((item) => item.id === entry.id ? detailed : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Episodi non disponibili");
    }
  }

  async function toggleEpisode(entry: WatchEntry, number: string, watched: boolean) {
    try {
      await api.setEpisodeWatched(entry.id, number, watched);
      await loadWatchlist("");
      const detailed = await api.trackerDetail(entry.id);
      setWatchlist((current) => current.map((item) => item.id === entry.id ? detailed : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile aggiornare l'episodio");
    }
  }

  async function removeEntry(entry: WatchEntry) {
    if (!window.confirm(`Rimuovere «${entry.title}» dalla tua lista? I progressi locali verranno eliminati.`)) return;
    try {
      await api.removeFromWatchlist(entry.id);
      setExpandedEntry(null);
      await Promise.all([loadWatchlist(""), loadStatus()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile rimuovere il titolo");
    }
  }

  const providerEntries = Object.entries(status?.providers ?? {});

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">E</div>
          <div>
            <div className="brand-name">episodi<span>manager</span></div>
            <div className="brand-caption">Your personal watchspace</div>
          </div>
        </div>

        <div className="sidebar-label">MENU</div>
        {["Workspace", "Catalogo", "Gestione", "Sistema"].map((group) => (
          <div className="nav-group" key={group}>
            {navigation.filter((item) => item.group === group).map((item) => (
              <button
                className={`nav-item ${view === item.id ? "active" : ""}`}
                key={item.id}
                onClick={() => { setView(item.id); setError(""); setNotice(""); }}
              >
                <span className="nav-symbol">{item.symbol}</span>
                <span>{item.label}</span>
                {item.id === "watchlist" && watchlist.length > 0 && (
                  <span className="nav-count">{watchlist.length}</span>
                )}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="local-card">
            <span className="local-dot" />
            <div>
              <strong>Modalità locale</strong>
              <small>I tuoi progressi restano qui</small>
            </div>
          </div>
          <div className="version-label">VERSIONE WEB IN SVILUPPO · 4.6</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">EPISODIMANAGER / {view.toUpperCase()}</div>
            <h1>{currentTitle}</h1>
          </div>
          <div className="top-actions">
            <div className="sync-chip"><span className="pulse-dot" /> Sync ogni 24 ore</div>
            <button className="icon-button" title="Aggiorna" onClick={() => void refreshAll()} disabled={loading}>↻</button>
            <div className="avatar">A</div>
          </div>
        </header>

        <div className="content">
          {error && <div className="alert error"><strong>Attenzione</strong><span>{error}</span><button onClick={() => setError("")}>×</button></div>}
          {notice && <div className="alert success"><strong>Operazione</strong><span>{notice}</span><button onClick={() => setNotice("")}>×</button></div>}

          {view === "dashboard" && (
            <>
              <section className="welcome">
                <div>
                  <div className="eyebrow">IL TUO SPAZIO PERSONALE</div>
                  <h2>Ritrova il filo.<br /><span>Riprendi da dove eri rimasto.</span></h2>
                  <p>Un unico posto per esplorare, organizzare e tenere traccia delle tue serie e dei tuoi anime.</p>
                  <button className="primary-button" onClick={() => setView("explore")}>Esplora il catalogo <span>→</span></button>
                </div>
                <div className="welcome-art" aria-hidden="true">
                  <div className="art-orbit orbit-one" />
                  <div className="art-orbit orbit-two" />
                  <div className="art-core">▶</div>
                  <div className="art-star star-one">✦</div>
                  <div className="art-star star-two">✧</div>
                </div>
              </section>

              <section className="stats-grid">
                <StatCard label="Titoli catalogati" value={status?.catalogCount ?? "—"} detail="StreamingCommunity + AnimeUnity" icon="◈" />
                <StatCard label="Nella tua lista" value={status?.watchlistCount ?? watchlist.length} detail="Tutti i tuoi percorsi" icon="▤" />
                <StatCard label="In visione" value={inProgress.length} detail="Pronti da riprendere" icon="▷" />
                <StatCard label="Completati" value={completed} detail="Storie concluse" icon="✓" />
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div><div className="eyebrow">IL TUO PERCORSO</div><h2>Continua a guardare</h2></div>
                  <button className="text-button" onClick={() => setView("watchlist")}>Vedi la lista <span>→</span></button>
                </div>
                {inProgress.length === 0 ? (
                  <EmptyState title="Nessuna serie in corso" detail="Aggiungi un titolo alla tua lista e aggiorna i progressi episodio per episodio." />
                ) : (
                  <div className="watch-grid">
                    {inProgress.slice(0, 4).map((entry) => <WatchCard key={entry.id} entry={entry} onOpen={() => { setView("watchlist"); void toggleEpisodes(entry); }} />)}
                  </div>
                )}
              </section>

              <section className="section-block">
                <div className="section-heading"><div><div className="eyebrow">SORGENTI</div><h2>Stato cataloghi</h2></div></div>
                <div className="source-grid">
                  {(["streamingcommunity", "animeunity"] as const).map((provider) => {
                    const current = status?.providers?.[provider];
                    return (
                      <div className="source-card" key={provider}>
                        <div className="source-icon">{provider === "animeunity" ? "A" : "S"}</div>
                        <div className="source-info">
                          <strong>{providerNames[provider]}</strong>
                          <small>{current?.itemsFound ? `${current.itemsFound.toLocaleString("it-IT")} titoli trovati` : "In attesa di sincronizzazione"}</small>
                        </div>
                        <span className={`status-pill ${current?.state === "completed" ? "ok" : ""}`}>{current?.state || "Pronto"}</span>
                        <button className="small-button" onClick={() => void syncProvider(provider)}>Sincronizza</button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {view === "explore" && (
            <section className="section-block">
              <div className="page-intro">
                <div><div className="eyebrow">CATALOGO UNIFICATO</div><h2>Trova la prossima storia.</h2><p>I titoli importati dai cataloghi pubblici vengono raccolti e deduplicati in un'unica lista.</p></div>
                <div className="source-actions">
                  <button className="secondary-button" onClick={() => void syncProvider("streamingcommunity")}>↻ StreamingCommunity</button>
                  <button className="secondary-button" onClick={() => void syncProvider("animeunity")}>↻ AnimeUnity</button>
                </div>
              </div>
              <div className="search-row">
                <span>⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void loadCatalog(query); }} placeholder="Cerca serie, anime o titolo..." />
                <button className="primary-button compact" onClick={() => void loadCatalog(query)}>Cerca</button>
              </div>
              <div className="results-meta">{catalog.length} titoli caricati · catalogo personale</div>
              {catalog.length === 0 ? (
                <EmptyState title="Catalogo vuoto o non ancora sincronizzato" detail="Avvia la sincronizzazione di una sorgente. L'importazione live va verificata con la tua connessione." />
              ) : (
                <div className="catalog-grid">
                  {catalog.map((title) => (
                    <CatalogCard key={title.id} title={title} onAdd={() => void addTitle(title)} />
                  ))}
                </div>
              )}
            </section>
          )}

          {view === "watchlist" && (
            <section className="section-block">
              <div className="page-intro"><div><div className="eyebrow">IL TUO TRACKER</div><h2>La tua lista, le tue regole.</h2><p>Stati, episodi visti, voto e note vengono conservati localmente.</p></div></div>
              <div className="search-row">
                <span>⌕</span>
                <input value={watchQuery} onChange={(event) => setWatchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void loadWatchlist(watchQuery); }} placeholder="Cerca nella tua lista..." />
                <button className="primary-button compact" onClick={() => void loadWatchlist(watchQuery)}>Cerca</button>
              </div>
              {watchlist.length === 0 ? (
                <EmptyState title="La tua lista è ancora vuota" detail="Apri Esplora e aggiungi le serie o gli anime che vuoi seguire." />
              ) : (
                <div className="watchlist">
                  {watchlist.map((entry) => (
                    <article className="watchlist-row" key={entry.id}>
                      <div className="poster-placeholder">{entry.poster ? <img src={entry.poster} alt="" loading="lazy" /> : <span>{entry.title.slice(0, 1).toUpperCase()}</span>}</div>
                      <div className="watchlist-main">
                        <div className="watch-title-line"><h3>{entry.title}</h3>{entry.year && <span>{entry.year}</span>}</div>
                        <div className="muted-line">{entry.kind || "Titolo"} · {entry.sources?.map((source) => providerNames[source.provider] || source.provider).join(" + ")}</div>
                        <div className="progress-line"><div className="progress-track"><span style={{ width: `${progress(entry)}%` }} /></div><small>{watchedCount(entry)} / {entry.episodes?.length ?? 0} episodi</small></div>
                        {expandedEntry === entry.id && (
                          <div className="episode-list">
                            {(entry.episodes || []).length === 0 ? <small>Dettaglio episodi non ancora disponibile per questo titolo.</small> : entry.episodes.map((episode) => (
                              <label className="episode-item" key={episode.number}>
                                <input type="checkbox" checked={episode.watched} onChange={(event) => void toggleEpisode(entry, episode.number, event.target.checked)} />
                                <span>{episode.title || episode.number}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="watchlist-controls">
                        <select value={entry.status} onChange={(event) => void changeStatus(entry, event.target.value as WatchStatus)}>
                          {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                        <button className="small-button" onClick={() => void toggleEpisodes(entry)}>{expandedEntry === entry.id ? "Chiudi episodi" : "Episodi"}</button>
                        <button className="remove-button" title="Rimuovi dalla lista" onClick={() => void removeEntry(entry)}>×</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {view === "downloads" && (
            <FeaturePlaceholder icon="↓" title="Download manager" detail="La prossima integrazione porterà qui coda, priorità, pause/ripresa quando supportate, retry, velocità, ETA, cronologia e verifica FFmpeg/FFprobe. Il motore Go esistente verrà collegato dopo la migrazione della UI." />
          )}

          {view === "library" && (
            <FeaturePlaceholder icon="▣" title="Libreria locale" detail="Qui potrai scegliere le cartelle del PC, scansionare i video, riconoscere serie/stagioni/episodi, individuare duplicati e confrontare i file locali con gli episodi del catalogo. Nessun file sarà spostato o cancellato senza conferma." />
          )}

          {view === "settings" && (
            <section className="section-block settings-panel">
              <div className="eyebrow">PREFERENZE PERSONALI</div><h2>Impostazioni</h2>
              <div className="setting-row"><div><strong>Tracciamento</strong><small>Progressi conservati solo su questo dispositivo.</small></div><span className="status-pill ok">Locale</span></div>
              <div className="setting-row"><div><strong>Frequenza sincronizzazione</strong><small>Controllo cataloghi quando l'app è aperta; recupero al prossimo avvio se era chiusa.</small></div><span className="status-pill">24 ore</span></div>
              <div className="setting-row"><div><strong>Cataloghi attivi</strong><small>StreamingCommunity e AnimeUnity.</small></div><span className="status-pill ok">2 sorgenti</span></div>
              <div className="setting-row"><div><strong>Backup e migrazioni</strong><small>Funzione da completare prima della migrazione JSON → SQLite.</small></div><span className="status-pill">In roadmap</span></div>
            </section>
          )}
        </div>
        <footer className="footer"><span>EPISODIMANAGER</span><span>Il tuo spazio. La tua watchlist. I tuoi dati.</span></footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><b>{icon}</b></div><strong>{value}</strong><small>{detail}</small></div>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><div className="empty-symbol">✦</div><h3>{title}</h3><p>{detail}</p></div>;
}

function FeaturePlaceholder({ icon, title, detail }: { icon: string; title: string; detail: string }) {
  return <div className="feature-placeholder"><div className="feature-icon">{icon}</div><div className="eyebrow">IN SVILUPPO</div><h2>{title}</h2><p>{detail}</p><span className="status-pill">Prossime fasi</span></div>;
}

function CatalogCard({ title, onAdd }: { title: CatalogTitle; onAdd: () => void }) {
  return <article className="catalog-card">
    <div className="catalog-poster">{title.poster ? <img src={title.poster} alt="" loading="lazy" /> : <span>{title.name.slice(0, 1).toUpperCase()}</span>}</div>
    <div className="catalog-card-body">
      <div className="catalog-meta">{title.kind || "Titolo"} {title.year ? `· ${title.year}` : ""}</div>
      <h3>{title.name}</h3>
      <div className="source-tags">{title.sources?.map((source) => <span key={source.sourceId || source.url}>{providerNames[source.provider] || source.provider}</span>)}</div>
      <button className={`small-button full-width ${title.inList ? "added" : ""}`} onClick={onAdd} disabled={title.inList}>{title.inList ? "✓ Nella tua lista" : "+ Aggiungi alla lista"}</button>
    </div>
  </article>;
}

function WatchCard({ entry, onOpen }: { entry: WatchEntry; onOpen: () => void }) {
  return <button className="watch-card" onClick={onOpen}>
    <div className="watch-card-poster">{entry.poster ? <img src={entry.poster} alt="" loading="lazy" /> : <span>{entry.title.slice(0, 1)}</span>}</div>
    <div className="watch-card-info"><strong>{entry.title}</strong><small>{entry.kind || "Serie"} · {entry.year || "—"}</small><div className="progress-track"><span style={{ width: `${progress(entry)}%` }} /></div><small>{watchedCount(entry)} episodi visti</small></div>
  </button>;
}

function watchedCount(entry: WatchEntry) {
  return (entry.episodes || []).filter((episode) => episode.watched).length;
}

function progress(entry: WatchEntry) {
  const total = entry.episodes?.length || 0;
  return total > 0 ? Math.round((watchedCount(entry) / total) * 100) : 0;
}

export default App;
