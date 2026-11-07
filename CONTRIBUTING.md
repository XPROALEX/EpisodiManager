# Contribuire a EpisodiManager

## Regola Git obbligatoria

Non lavorare direttamente su `main`. Ogni aggiornamento significativo, fix o versione deve avere un branch dedicato.

### Convenzione branch

- `roadmap`: documento vivo di prodotto, decisioni e priorità.
- `feature/<versione>-<nome>`: funzionalità (es. `feature/4.6.0-web-frontend`).
- `fix/<versione>-<nome>`: correzioni (es. `fix/4.6.1-catalog-pagination`).
- `release/<versione>`: candidato di release e verifiche finali.
- `docs/<nome>`: documentazione indipendente.

Ogni versione pubblicata deve avere un branch identificabile con la versione. Evitare branch numerici duplicati: se il nome esiste già, usare un suffisso esplicito, non sovrascrivere la storia.

## Flusso di lavoro

1. Aggiornare il branch `roadmap` solo quando cambiano requisiti, priorità o decisioni.
2. Creare un branch di lavoro dal branch stabile più aggiornato.
3. Sviluppare una sola area coerente per branch; piccoli fix indipendenti possono avere branch separati.
4. Aggiungere test e aggiornare README/CHANGELOG/roadmap.
5. Eseguire test locali e CI.
6. Aprire una Pull Request verso `main` quando i criteri di accettazione sono soddisfatti.
7. Non unire in `main` finché non sono superati test e revisione delle modifiche.
8. Taggare la release e allegare artefatti solo dopo aver verificato la build reale.

## Versionamento

Seguire Semantic Versioning:
- PATCH: correzioni compatibili;
- MINOR: nuove funzionalità compatibili;
- MAJOR: modifiche incompatibili o migrazioni importanti.

Una versione non è “rilasciata” solo perché esiste un branch: build, test e artefatti devono essere realmente verificati.

## Regole per i test e le dichiarazioni

- Distinguere test unitari, integrazione, test live e test manuali.
- Non definire “live verified” una chiamata esterna non eseguita.
- Non dire che esiste un installer/EXE se non è stato effettivamente generato e controllato.
- Registrare versioni runtime e toolchain.
- Non ignorare errori di test senza registrarli e motivarli.

## Sicurezza e dati utente

- Nessuna chiave API, password, token o cookie nel repository.
- Il tracking resta locale finché l'utente non approva un cambiamento.
- Nessun deploy, acquisto di dominio, hosting o pubblicazione pubblica senza approvazione esplicita.
- Non implementare bypass di DRM, paywall, login, HTTP 403 o altri controlli di accesso.

## Quando serve l'utente

Procedere autonomamente per codice, test, documentazione e branch. Fermarsi e chiedere l'azione dell'utente soltanto quando serve:
- una chiave API personale o un account non disponibile;
- una scelta che cambia la privacy o la sincronizzazione dei dati;
- una decisione su hosting, dominio, costi o deploy;
- una verifica su Windows o un test live che richiede la sua rete/dispositivo;
- una valutazione/approvazione di condizioni legali o diritti su contenuti.

## Struttura ideale del repository

Obiettivo progressivo, non ancora stato attuale:

```text
/
  backend/          # API Go, crawler, download workers
  web/              # React + TypeScript + Vite, condiviso da browser/desktop
  desktop/           # Electron main/preload e configurazione packaging
  docs/
    adr/
    release/
  .github/workflows/
  ROADMAP.md
  CONTRIBUTING.md
```
