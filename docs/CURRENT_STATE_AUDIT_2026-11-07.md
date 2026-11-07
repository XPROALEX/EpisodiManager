# Audit stato progetto — 7 novembre 2026

Questo file separa ciò che è presente nel progetto sorgente esaminato da ciò che è già pubblicato in GitHub e da ciò che resta da verificare.

## Repository GitHub al momento dell'audit

Branch pubblicati:
- `main`
- `4.1`
- `4.2.2`
- `4.2.3`
- `4.2.4`

L'ultimo branch versionato disponibile nel repository prima della creazione di questa roadmap è `4.2.4`. La sua root contiene documentazione e report della release; non contiene `main.go` come sorgente completa dell'app.

## Progetto 4.5.0 esaminato come archivio locale della conversazione

Il pacchetto `EpisodiManager_Electron_Portable_v4_5_0_Project.zip` contiene:
- `backend/main.go`, `tracker.go`, `tracker_ui.go` e test Go;
- `electron/main.js` e `electron/preload.js`;
- `package.json` con Electron 45.2.3 ed electron-builder 26.18.1;
- backend Go in modulo `episodimanager`, `go 1.23.0`;
- script di build Windows e documentazione.

### Funzionalità presenti nel codice sorgente 4.5.0

- API Go per libreria locale e download manager.
- API tracker: status, catalog, watchlist, sync, add/remove/detail/update/episode.
- sorgenti catalogo StreamingCommunity e AnimeUnity.
- intervallo di sincronizzazione catalogo 24 ore.
- tracking locale con 5 stati, episodi, voto, note e date.
- wrapper Electron desktop con finestra Chromium e avvio/arresto backend.
- persistenza del tracker in JSON locale.

### Limiti/non verificati dichiarati nel progetto

- La sincronizzazione live dei cataloghi non è stata verificata nella sessione di build descritta dal report 4.5.0.
- Il singolo EXE Electron non era stato generato nel pacchetto esaminato; il build finale richiede `npm install` e `npm run dist` su Windows/rete funzionante.
- I crawler seguono pagine pubbliche riconoscibili; non garantiscono cataloghi privati o non esposti.
- Non si deve considerare verificato un download reale Dailymotion o un download FFmpeg live senza una prova specifica sulla macchina utente.
- Il downloader non deve aggirare DRM, login, paywall o HTTP 403.

## Rischio principale da correggere

La sorgente di lavoro 4.5.0 è ancora in un archivio condiviso nella conversazione, non nella struttura canonica GitHub. Prima di grandi refactor bisogna commettere il sorgente reale, i test, il packaging e i file di licenza/documentazione nella repository. Gli artefatti binari generati non vanno usati come sostituto del sorgente.

## Stato dati

Il progetto 4.5.0 usa `Data/tracker.json`. SQLite è una decisione architetturale futura, non una funzione attualmente implementata.

## Prossimi controlli

1. Importare e revisionare il sorgente 4.5.0 nel repository.
2. Riprodurre i test Go in CI da un clone pulito.
3. Verificare il packaging Electron su Windows.
4. Eseguire sincronizzazione controllata dei due cataloghi da Windows, registrando conteggi ed errori.
5. Verificare un download su una sorgente autorizzata supportata.
