# Episodi Manager 3.0 — Codice sorgente

Applicazione desktop per Windows (e altri sistemi compatibili con Go) che mostra nel browser una piccola interfaccia locale per catalogare serie ed episodi, trovare i collegamenti diretti esposti dalle pagine, scaricare i file autorizzati e tenere uno storico locale.

> L'interfaccia HTML, CSS e JavaScript è incorporata direttamente in `main.go`; non servono cartelle frontend o dipendenze npm.

## Requisiti

- Go 1.23 o successivo.
- Connessione Internet per analizzare le pagine e scaricare contenuti.
- Nessuna dipendenza Go esterna: il progetto usa solo la libreria standard.

Per usare il programma già compilato su Windows non serve installare Go: serve soltanto `EpisodiManager.exe`.

## Avvio in sviluppo

```bash
go run .
```

L'app avvia un server HTTP legato esclusivamente a `127.0.0.1` su una porta locale libera e apre l'interfaccia nel browser predefinito.

## Test

```bash
go test ./...
go vet ./...
```

I test coprono la lettura dei link episodio, la distinzione tra numero visibile e ID interno, l'estrazione di `window.downloadUrl`, il flusso API/player simulato e il salvataggio di un download di prova.

## Compilazione Windows x64

Su Windows, con Go installato, fai doppio clic su `build_windows.bat`, oppure esegui:

```powershell
$env:GOOS = "windows"
$env:GOARCH = "amd64"
$env:CGO_ENABLED = "0"
go build -trimpath -ldflags="-s -w -H=windowsgui" -o EpisodiManager.exe .
```

Il file risultante è autonomo e non richiede Python o .NET.

Per compilare per il sistema operativo corrente:

```bash
go build -o EpisodiManager .
```

## Struttura

- `main.go`: server locale, API interne dell'interfaccia, HTML/CSS/JavaScript e logica di scansione, analisi e download.
- `main_test.go`: test automatici dei parser e dei flussi principali.
- `go.mod`: modulo Go.
- `build_windows.bat`: script per produrre l'eseguibile Windows a 64 bit.

## Flusso automatico della serie supportata

1. `animeUnityParts` riconosce l'identificativo serie dall'URL.
2. `fetchAnimeUnityEpisodes` interroga `info_api` usando intervalli di 120 episodi e registra sia il numero visualizzato sia l'ID tecnico.
3. `resolveAnimeUnityDownload` consulta `embed-url`, apre l'URL video restituito e cerca il valore `window.downloadUrl`.
4. `extractDownloadURLs` normalizza e valida gli URL trovati.
5. La logica di download salva i file nella cartella scelta e aggiorna lo stato nella libreria JSON locale.

Per siti con struttura diversa è presente anche un percorso generico che esamina i link della pagina e le risorse iframe/script esposte nell'HTML. La compatibilità dipende dalla struttura effettiva del sito.

## Dati e privacy

La libreria è salvata localmente nel profilo utente (`%APPDATA%\\EpisodiManager\\library.json` su Windows). Il server dell'interfaccia ascolta solo su `127.0.0.1`; non è un server pubblicato su Internet.

## Uso responsabile

Usa il programma soltanto con contenuti che hai il diritto o l'autorizzazione di scaricare. Il progetto non ricostruisce playlist HLS/DASH, non scarica segmenti, non aggira DRM, paywall o controlli di accesso e non gestisce credenziali del browser.

## Licenza

Nessuna licenza open-source è stata assegnata. Prima di riutilizzare o ridistribuire il progetto, scegli e aggiungi una licenza.
