# EpisodiManager Web UI — foundation 4.6.0

Questa directory avvia la nuova UI React + TypeScript + Vite. È un frontend condivisibile tra browser e wrapper desktop; non è ancora la UI predefinita del backend 4.5.0.

## Requisiti

- Node.js 22.12 o successivo
- npm 10 o successivo

## Avvio frontend

```powershell
cd web
npm install
npm run dev
```

Vite ascolta su `http://127.0.0.1:5173`. Le chiamate `/api/*` passano dal proxy configurato in `vite.config.ts`, predefinito su `http://127.0.0.1:8080`. Il backend 4.5.0 sceglie attualmente una porta casuale: fino all'aggiunta di una modalità dev con porta fissa, imposta `VITE_API_PROXY_TARGET` alla porta locale effettiva oppure usa `VITE_API_BASE_URL` per puntare all'API.

Per impostare la destinazione del proxy in PowerShell:

```powershell
$env:VITE_API_PROXY_TARGET = "http://127.0.0.1:8080"
npm run dev
```

Per una API remota di sviluppo:

```powershell
$env:VITE_API_BASE_URL = "https://api.example.test"
npm run dev
```

## Build

```powershell
npm run typecheck
npm run build
```

La build statica è prodotta in `web/dist`. Il prossimo passaggio backend sarà servirla dalla stessa origine delle API, così la desktop app Electron e la web app useranno lo stesso frontend senza CORS e senza duplicare l'interfaccia.

## Stato di integrazione

- Dashboard: collegata alle API tracker esistenti.
- Esplora: collegata a catalogo, ricerca, aggiunta in watchlist e sync.
- La mia lista: collegata a watchlist, stato, dettaglio episodi e marcatura visto.
- Download e Libreria locale: layout iniziale; integrazione funzionale da completare nelle fasi successive.
- Settings: riepilogo delle scelte locali già concordate.

Questa è una base di migrazione, non una release desktop/web completa. Non sostituisce ancora la UI incorporata nel backend Go.


## Privacy and offline presentation

The UI uses system fonts only; it does not load fonts or analytics from third-party CDNs. Search inputs are submitted explicitly (Enter or the Search button), not on every keystroke.