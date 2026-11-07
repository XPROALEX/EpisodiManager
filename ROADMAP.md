# EpisodiManager — Roadmap di prodotto e tecnica

Ultimo aggiornamento: 7 novembre 2026  
Documento vivo: aggiornare questo file quando cambiano priorità, decisioni o stato delle funzionalità.

## 1. Visione

EpisodiManager deve diventare un media manager personale che consenta di:

1. esplorare in un unico posto cataloghi di serie TV e anime;
2. tenere traccia di cosa si è visto e dell'ultimo episodio completato;
3. organizzare i video già presenti sul PC;
4. gestire download da sorgenti ufficialmente supportate e per cui l'utente ha diritto di scaricare;
5. usare la stessa esperienza via browser e come applicazione desktop Windows;
6. eventualmente pubblicare una versione web ospitata, solo dopo aver stabilizzato e verificato il prodotto locale.

La priorità non è pubblicare subito un servizio online: prima vogliamo una base di codice unica, testabile, sicura e stabile. La pubblicazione pubblica sarà una fase separata da approvare insieme.

## 2. Decisioni confermate dall'utente

Queste scelte sono requisiti, non proposte aperte:

- **Cataloghi iniziali:** StreamingCommunity e AnimeUnity.
- **Frequenza di aggiornamento cataloghi:** ogni 24 ore.
- **Tracciamento personale:** solo locale, senza account o cloud.
- **Stati della watchlist:** Da iniziare, In visione, Completato, In pausa, Abbandonato.
- **Tracciamento episodio per episodio:** sì.
- **Interfaccia:** minimal, modalità notte predefinita.
- **Piattaforme desiderate:** web app e programma desktop Windows; in futuro installer Windows e, dopo stabilizzazione, servizio web pubblico.
- **Dati personali:** non devono essere caricati su servizi esterni senza una nuova decisione esplicita dell'utente.

Il tracciamento locale significa che i progressi sono conservati sul dispositivo o nel profilo browser in uso. Una futura sincronizzazione tra più dispositivi richiederebbe un cambiamento di questa decisione e un consenso esplicito.

## 3. Esperienza di prodotto

### 3.1 Navigazione principale

La navigazione desiderata è:

- **Dashboard:** riprendi la visione, attività recenti, statistiche e novità.
- **Esplora:** catalogo unificato, ricerca, filtri, generi, anno, tipo, sorgente e novità.
- **La mia lista:** watchlist e stati personali.
- **Download:** coda, stato, cronologia e impostazioni.
- **Libreria locale:** scansione delle cartelle del PC, riconoscimento dei file e confronto con gli episodi attesi.
- **Impostazioni:** cartelle, sincronizzazione, backup, interfaccia e diagnostica.

### 3.2 Catalogo unificato

Obiettivi:

- importare le schede pubbliche dei cataloghi StreamingCommunity e AnimeUnity;
- seguire la paginazione e deduplicare i titoli presenti su più sorgenti;
- conservare i collegamenti alle singole sorgenti, senza perdere la provenienza;
- mostrare titolo, titolo originale, anno, descrizione, poster, tipo e generi quando disponibili;
- distinguere dati mancanti da dati non verificati;
- mostrare stato e data dell'ultima sincronizzazione per ciascuna sorgente;
- offrire sincronizzazione manuale e automatica ogni 24 ore;
- riprendere una sincronizzazione scaduta al successivo avvio se l'app era chiusa;
- non cancellare dalla watchlist un titolo solo perché temporaneamente assente dal catalogo di origine.

Non si deve promettere l'importazione dell'intero catalogo finché non è stata verificata la copertura reale, il numero di pagine, la stabilità degli URL e il comportamento dei siti su una rete Windows normale.

### 3.3 Watchlist e cronologia personale

Ogni titolo può avere:

- stato: Da iniziare, In visione, Completato, In pausa o Abbandonato;
- episodi e stagioni visti;
- ultimo episodio completato e prossimo episodio suggerito;
- voto personale, note e date di inizio/completamento;
- progresso percentuale;
- sorgente preferita, quando il titolo è presente in più cataloghi.

Regole:

- spuntare un episodio aggiorna il progresso;
- completare tutti gli episodi conosciuti può portare lo stato a Completato;
- deselezionare un episodio rende di nuovo il titolo In visione;
- gli aggiornamenti del catalogo non devono sovrascrivere le scelte personali;
- quando arrivano nuovi episodi, un titolo completato deve poter mostrare nuovi episodi non visti senza perdere la cronologia precedente.

### 3.4 Metadati

Valutare integrazioni con AniList per anime e TMDB per serie TV, solo come fonti di metadati e solo dopo aver verificato API, licenze, attribuzione e condizioni d'uso.

I metadati esterni devono migliorare identificazione e qualità delle schede, non sostituire la provenienza dei cataloghi scelti dall'utente. Le chiavi API, se necessarie, non devono essere incluse nel repository o nell'eseguibile.

### 3.5 Libreria locale

- scegliere una o più cartelle da scansire;
- riconoscere serie, stagioni ed episodi dai nomi dei file;
- associare i file a titoli del catalogo usando titolo, anno e numerazione;
- segnalare abbinamenti incerti per conferma;
- mostrare episodi presenti, mancanti e duplicati;
- non spostare, rinominare o eliminare file senza un'azione esplicita dell'utente;
- consentire di correggere manualmente un abbinamento.

### 3.6 Download manager

Per sorgenti supportate e contenuti che l'utente è autorizzato a scaricare:

- analisi della sorgente e delle qualità;
- coda, priorità e limiti di concorrenza;
- pausa/ripresa quando supportata dalla sorgente;
- retry con backoff per errori temporanei;
- avanzamento, velocità, ETA e log diagnostico;
- cronologia completati/falliti/annullati;
- scelta cartella, formato contenitore e qualità;
- selezione audio e sottotitoli quando il formato e la sorgente li espongono;
- unione e verifica con FFmpeg/FFprobe;
- rilevamento file incompleti o danneggiati.

**Limite di sicurezza e conformità:** niente bypass di DRM, paywall, login, HTTP 403 o controlli di accesso; niente estrazione di flussi protetti. L'assenza di un estrattore supportato va mostrata chiaramente.

## 4. Architettura desiderata

### 4.1 Stack raccomandato

- **Backend/API:** Go. È già il linguaggio del motore, dei crawler, del download manager e delle API esistenti; mantenerlo riduce riscritture e consente di condividere la logica tra desktop e web.
- **Frontend:** TypeScript + React. La UI deve diventare un progetto autonomo, separato dai template HTML/JavaScript attualmente contenuti nel backend.
- **Build frontend:** Vite, con output statico riutilizzabile dal browser e dal wrapper desktop.
- **Desktop:** Electron nella prima fase, perché è già presente nel progetto e incorpora Chromium. Produrre sia portable EXE sia installer Windows.
- **Database locale:** migrare gradualmente dai file JSON a SQLite per catalogo, watchlist, progressi e impostazioni.
- **Database web ospitato, futuro:** PostgreSQL per dati condivisi lato server; non usare un file SQLite su una cartella di rete come database centrale multiutente.
- **Contratto API:** REST versionata, documentata con OpenAPI e testata separatamente dall'interfaccia.

Un'unica frontend React/TypeScript deve poter parlare con:
1. il backend Go locale quando viene eseguita come desktop app;
2. un backend Go remoto quando viene servita dal web.

La web app pubblica e la desktop app non devono diventare due progetti UI differenti.

### 4.2 Distribuzione prevista

- **Sviluppo:** frontend Vite + backend Go in locale.
- **Web locale:** frontend servito dal backend locale o da un dev server con proxy API.
- **Desktop portable:** Electron avvia il backend Go locale e apre la UI condivisa.
- **Installer Windows:** stesso frontend e backend, con installazione per utente e gestione aggiornamenti.
- **Web online, fase futura:** hosting frontend statico/CDN, API Go su server, PostgreSQL, HTTPS, autenticazione, backup e monitoraggio. Questa fase richiede un'approvazione esplicita prima di acquistare servizi, pubblicare dati o aprire il servizio al pubblico.

### 4.3 Dati locali e privacy

La scelta attuale rimane local-first:

- desktop: dati in una cartella dell'utente, con database SQLite dopo la migrazione;
- web non ospitato: dati nel browser/dispositivo, con export/import;
- web ospitato in futuro: nessun trasferimento automatico dei progressi locali; un eventuale account/sync richiede opt-in e una decisione separata.

Prevedere backup, esportazione e ripristino prima di cambiare formato di archiviazione.

## 5. Roadmap per fasi

Le versioni sono obiettivi di pianificazione, non promesse di rilascio. Ogni fase può essere suddivisa in più branch e più release.

### Fase 0 — mettere in sicurezza la base (subito)

- [ ] stabilire un'unica copia canonica del sorgente 4.5.0 nel repository GitHub;
- [ ] verificare che il branch di release contenga sorgenti, test, documentazione e script necessari;
- [ ] aggiungere CI per test Go, vet, build Windows e controlli frontend;
- [ ] definire API e tipi condivisi;
- [ ] registrare come non verificati i test live che non sono stati eseguiti;
- [ ] aggiungere backup/export dei dati personali.

**Criterio di completamento:** un clone pulito del repository deve essere sufficiente a eseguire test e produrre il backend Windows senza dipendere da file presenti soltanto in una conversazione.

### Fase 1 — piattaforma frontend condivisa (obiettivo 4.6.x)

- [ ] introdurre React + TypeScript + Vite;
- [ ] dividere la UI in pagine e componenti;
- [ ] creare un client API tipizzato;
- [ ] mantenere tema scuro, layout responsive e accessibilità da tastiera;
- [ ] servire lo stesso build statico dal backend Go;
- [ ] far aprire a Electron la UI condivisa senza duplicare schermate;
- [ ] conservare temporaneamente la vecchia UI finché la nuova non copre tutte le funzioni.

**Criterio di completamento:** tutte le funzioni esistenti sono raggiungibili dalla nuova UI su browser e desktop, con test API e smoke test su Windows.

### Fase 2 — persistenza affidabile (obiettivo 4.7.x)

- [ ] migrare catalogo, watchlist, episodi e sincronizzazioni da JSON a SQLite;
- [ ] migrazione idempotente e backup automatico prima della conversione;
- [ ] indici per ricerca, provider e stato;
- [ ] transazioni e gestione dei conflitti;
- [ ] import/export JSON e CSV;
- [ ] test di recupero dopo arresto anomalo.

**Criterio di completamento:** nessuna perdita di progressi in migrazione, backup e ripristino verificati.

### Fase 3 — cataloghi affidabili (obiettivo 4.8.x)

- [ ] separare StreamingCommunity e AnimeUnity in adapter indipendenti;
- [ ] test fixture HTML versionate per ogni sorgente;
- [ ] monitorare errori, pagine lette, nuovi titoli e duplicati;
- [ ] sincronizzazione incrementale ogni 24 ore;
- [ ] retry e ripartenza dopo interruzioni;
- [ ] gestione cambi URL, paginazione e markup;
- [ ] deduplicazione con possibilità di unione manuale;
- [ ] arricchimento metadati opzionale e verificabile.

**Criterio di completamento:** test automatici su fixture e almeno una verifica live controllata per ciascun catalogo; mostrare i limiti di copertura.

### Fase 4 — watchlist completa (obiettivo 4.9.x)

- [ ] Dashboard “continua a guardare”;
- [ ] progressi per stagione/episodio;
- [ ] gestione speciali, OVA, film e stagioni non numerate;
- [ ] nuovi episodi dopo aver completato una serie;
- [ ] voti, note e date;
- [ ] filtri e statistiche;
- [ ] suggerimenti per riprendere una visione interrotta.

**Criterio di completamento:** progressi e stati sopravvivono agli aggiornamenti catalogo, ai riavvii e alle migrazioni.

### Fase 5 — libreria e download (obiettivo 4.10.x)

- [ ] scansione cartelle locale;
- [ ] riconoscimento file e gestione ambiguità;
- [ ] confronto tra episodi catalogati e file locali;
- [ ] coda download, retry, priorità e limiti;
- [ ] validazione output con FFprobe;
- [ ] sottotitoli, lingue audio e contenitori dove disponibili;
- [ ] test reali solo su sorgenti autorizzate e supportate.

**Criterio di completamento:** non vengono alterati file locali senza consenso; download falliti e completati sono distinguibili; i file vengono verificati.

### Fase 6 — distribuzione desktop stabile (obiettivo 4.11.x)

- [ ] portable EXE;
- [ ] installer Windows NSIS per utente;
- [ ] icona, versione, percorso dati e disinstallazione;
- [ ] aggiornamento automatico solo da release firmate/verificate;
- [ ] code signing quando sarà disponibile un certificato;
- [ ] test installazione, upgrade, uninstall e preservazione dati.

**Criterio di completamento:** installazione e aggiornamento provati su Windows pulito e su una macchina con dati preesistenti.

### Fase 7 — web hosted (obiettivo 5.0, solo dopo stabilità)

- [ ] definire hosting, dominio, costi e responsabile;
- [ ] definire modello utenti e privacy;
- [ ] autenticazione, rate limiting, CORS, protezione API e logging;
- [ ] PostgreSQL, migrazioni, backup e ripristino;
- [ ] separare cataloghi pubblici e dati personali;
- [ ] definire condizioni d'uso, diritti dei contenuti e policy del servizio;
- [ ] beta privata;
- [ ] approvazione dell'utente prima di qualsiasi pubblicazione pubblica.

**Criterio di completamento:** sicurezza, backup, costi, privacy e procedure di incident response verificati prima del lancio.

## 6. Test e qualità obbligatori

Ogni update significativo deve includere, dove applicabile:

- unit test Go;
- race test e go vet;
- test API con risposte e codici HTTP;
- test fixture dei cataloghi;
- test migrazione e backup dati;
- TypeScript typecheck;
- build frontend;
- smoke test browser;
- build Windows x64;
- test portable e installer su Windows;
- controllo dipendenze e vulnerabilità;
- note di rilascio e limiti conosciuti.

Non dichiarare un test superato se è stato soltanto simulato. Specificare sempre l'ambiente e il tipo di verifica.

## 7. Fuori ambito / limiti permanenti

- aggiramento di DRM, paywall, login o controlli di accesso;
- bypass di HTTP 403 o protezioni anti-bot;
- conservazione o condivisione non autorizzata di contenuti;
- upload dei progressi personali senza consenso;
- pubblicazione web, apertura di porte o creazione di account cloud senza approvazione;
- memorizzazione di segreti/API key nel repository o nel client.

## 8. Registro decisioni

| Decisione | Stato |
|---|---|
| Cataloghi iniziali StreamingCommunity + AnimeUnity | Confermata |
| Sync ogni 24 ore | Confermata |
| Tracking solo locale | Confermata |
| Web app e desktop dalla stessa UI | Obiettivo approvato |
| Go backend | Raccomandato, da mantenere |
| TypeScript + React + Vite | Raccomandato per la nuova UI |
| Electron per desktop iniziale | Raccomandato per riuso |
| SQLite locale | Raccomandato, non ancora implementato |
| PostgreSQL per futuro servizio hosted | Raccomandato, non ancora implementato |
| Web pubblico | Non autorizzato/da pianificare con l'utente |

## 9. Come aggiornare questo documento

Ogni nuova funzionalità va registrata qui con:
- identificativo/versione;
- branch GitHub;
- stato (proposta, in sviluppo, implementata, verificata);
- test richiesti;
- eventuali azioni che richiedono l'utente.

Le attività completate non vanno cancellate: si aggiornano con link al branch/PR e data di verifica.


## 10. Diario avanzamento

### 7 novembre 2026 — roadmap e base frontend 4.6.0

**Completato nella branch `roadmap`:**
- Roadmap di prodotto e tecnica formalizzata.
- Decisioni confermate: tracking locale, StreamingCommunity + AnimeUnity, sincronizzazione ogni 24 ore.
- Regole di contribuzione, branching, versionamento e test.
- ADR-0001 per la direzione Go + React/TypeScript + Electron + persistenza locale.
- Audit che distingue sorgente effettivamente disponibile, codice pubblicato su GitHub e test live non verificati.

**Implementazione iniziale in branch separati:**
- `feature/4.6.0-web-frontend-foundation`: base React/TypeScript/Vite, tipi API, client REST e shell UI dark. Esplora e watchlist sono collegate agli endpoint tracker esistenti; Download e Libreria sono schermate di transizione.
- `fix/4.6.0-web-front-end-stability`: callback di ricerca stabilizzate (nessuna richiesta a ogni tasto), rimossa la richiesta di Google Fonts esterna, font di sistema per uso locale/offline.
- ADR-0002 documenta il bootstrap del frontend.

**Da fare prima di dichiarare completata la 4.6.0:**
- Importare il sorgente Go/Electron 4.5.0 completo nella repository come base canonica, inclusi test e documentazione.
- Collegare il server Go alla build `web/dist` e fissare una modalità development con porta configurabile.
- Integrare e verificare le API esistenti dopo un clone pulito.
- Eseguire typecheck/build del frontend in GitHub Actions; la build locale non è stata eseguita in questa sessione perché il registro npm non era raggiungibile.
- Verificare il flusso desktop Electron sulla UI nuova.

**Non ancora verificato:**
- sincronizzazione live e copertura effettiva dei cataloghi su Windows;
- download live su Dailymotion o altra sorgente esterna autorizzata;
- generazione del portable EXE Electron e installer Windows;
- web deployment.

Queste funzionalità non vanno segnate come completate finché non esistono test riproducibili e prove reali registrate.
