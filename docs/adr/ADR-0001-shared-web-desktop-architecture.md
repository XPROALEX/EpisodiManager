# ADR-0001 — Architettura condivisa Web + Desktop

- **Stato:** Accettata come direzione tecnica; implementazione graduale.
- **Data:** 7 novembre 2026.
- **Contesto:** EpisodiManager deve funzionare dal browser e come applicazione desktop Windows, mantenendo catalogo, watchlist e download senza duplicare la UI.

## Contesto attuale verificato nel progetto 4.5.0

- Backend e logica applicativa: Go.
- Frontend: HTML/CSS/JavaScript generato/servito dal backend, con porzioni di UI inline nel codice Go.
- Wrapper desktop: Electron, JavaScript (main/preload).
- Build desktop: npm ed electron-builder.
- Persistenza tracker: file JSON locale (`tracker.json`), non SQLite.
- Il sorgente completo della 4.5.0 è disponibile come archivio di progetto nella conversazione, ma al momento della stesura non è ancora la base di codice canonica nella radice del repository GitHub.

## Decisione

### Backend: mantenere Go

Go resta responsabile di:
- API HTTP versionata;
- adapter dei cataloghi pubblici;
- sincronizzazione pianificata;
- libreria locale e riconoscimento file;
- download manager e processi yt-dlp/FFmpeg;
- accesso ai dati e migrazioni.

Motivo: è il linguaggio già utilizzato dal core e consente un backend riutilizzabile sia in locale sia su un server web.

### Frontend: introdurre TypeScript + React + Vite

- React per componenti, pagine e stato UI.
- TypeScript per i contratti API, i modelli di dominio e il refactoring sicuro.
- Vite per sviluppo, type-aware build e generazione di asset statici.

Il frontend deve essere separato dal backend e non contenere logica di scraping/download sensibile. La stessa build web deve poter essere servita:
- dal backend locale in desktop;
- dal backend remoto o da un CDN nella futura web app.

Vite transpila TypeScript ma non esegue da solo il type-checking: la pipeline deve eseguire anche `tsc --noEmit` prima della build.

### Desktop: mantenere Electron nella prima fase

Electron usa HTML/CSS/JavaScript e incorpora Chromium e Node.js. È il percorso meno rischioso perché già presente nel progetto e permette di riutilizzare la UI web con il backend Go locale.

Prevedere due target Windows:
- portable EXE;
- installer NSIS per utente.

Valutare Tauri 2 solo dopo una versione stabile, se dimensione del pacchetto o consumo risorse diventano problemi misurati. Tauri permette frontend web esistenti ma introduce un runtime desktop basato su Rust e webview del sistema; non è necessario riscrivere il backend Go, ma occorre gestire un sidecar/integrazione.

### Persistenza

- Breve termine: mantenere compatibilità con i file JSON esistenti e aggiungere backup/export.
- Desktop locale: migrare a SQLite con migrazione idempotente e rollback/backup.
- Web hosted futuro: PostgreSQL lato server, dopo approvazione dell'utente.

SQLite è adatto a un'applicazione con dati locali e un singolo dispositivo. Per un servizio remoto con più utenti e scritture concorrenti, usare un database client/server come PostgreSQL.

## Schema logico

```text
Browser Web ───────────────┐
                           ├── React + TypeScript UI
Electron Desktop ─────────┘            │
                                      │ REST API
                       ┌──────────────┴──────────────┐
                       │           Go API            │
                       │ catalog adapters / tracker  │
                       │ downloads / local library   │
                       └──────────────┬──────────────┘
                                      │
                      ┌───────────────┴────────────────┐
                      │                                │
             Desktop local mode                Hosted web mode
             SQLite + local files               PostgreSQL
             yt-dlp / FFmpeg                     workers
```

In modalità desktop il processo Go locale possiede i dati locali e i processi download. In modalità web ospitata la UI chiama il backend remoto; i dati personali rimangono locali per default finché non viene progettata e approvata una funzione di account/sync.

## Alternative considerate

### Sostituire Go con Node/TypeScript

Respinta: duplicheremmo o riscriveremmo crawler, API e downloader già in Go. TypeScript è la scelta per il frontend, non è necessario per tutto il prodotto.

### Riscrivere subito in Rust + Tauri

Respinta per il primo step: aumenterebbe la complessità e non offre un vantaggio funzionale necessario ora. Tauri resta una possibile ottimizzazione successiva.

### Continuare con HTML generato inline dal backend

Respinta come architettura di lungo periodo: rende difficile condividere e testare la UI tra web e desktop e accoppia la presentazione alle route Go.

## Conseguenze

- Occorre importare la sorgente 4.5.0 nel repository GitHub come base canonica prima di grandi refactor.
- L'API Go deve avere contratti e test indipendenti dalla UI.
- La migrazione a React avverrà per sezioni, mantenendo la vecchia interfaccia finché la copertura non è completa.
- Non si attiva alcun servizio cloud o sincronizzazione remota senza una decisione esplicita.
