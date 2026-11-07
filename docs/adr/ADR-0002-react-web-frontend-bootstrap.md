# ADR-0002 — Bootstrap frontend React/TypeScript

- Stato: implementazione iniziale in branch `feature/4.6.0-web-frontend-foundation`.
- Data: 7 novembre 2026.

## Decisione

Aggiungere un'app frontend separata in `web/` costruita con React 19.3.1, TypeScript 7.0.2 e Vite 8.3.6. La UI usa le API REST tracker già presenti nel backend 4.5.0.

## Motivazione

- Una singola UI può essere servita dal backend Go locale, dal wrapper Electron o da un server web.
- TypeScript dà tipi espliciti per catalogo, watchlist, stati ed episodi.
- Vite produce asset statici che possono essere distribuiti senza un server Node in produzione.
- Il backend resta Go; il frontend non contiene scraper né logica download.

## Limiti dell'incremento

Il backend Go non è ancora aggiornato in questo branch per servire `web/dist`, né per fissare la porta in modalità sviluppo. La UI può essere avviata in modo indipendente, ma per le chiamate reali richiede un backend disponibile e una destinazione proxy/API corretta. Download e Libreria locale hanno ancora schermate di transizione.

## Verifiche richieste in CI

- `npm install`
- `npm run typecheck`
- `npm run build`

Il build locale non è stato dichiarato superato: il registro npm non è stato disponibile nell'ambiente di lavoro. GitHub Actions eseguirà i controlli con rete.
