# Architettura — Episodi Manager 3.0

## Avvio

`main()` individua la cartella dati dell'utente, carica `library.json`, registra le rotte `/api/...`, apre un listener HTTP su `127.0.0.1` e lancia il browser predefinito.

## Livelli principali

- **Interfaccia:** HTML/CSS/JavaScript incorporato nel sorgente Go, servito da `handleHome`.
- **API locale:** handler Go per libreria, creazione serie, scansione, analisi episodio, download, esportazione e chiusura.
- **Adattatore sito:** riconoscimento URL serie, lettura dei blocchi API e risoluzione della pagina video.
- **Analizzatore generico:** analisi dei link e delle risorse iframe/script dichiarate nel markup.
- **Download e archivio:** scaricamento dei file e aggiornamento della libreria JSON.

## Scansione specifica

`handleScanSeries` → `animeUnityParts` → `fetchAnimeUnityEpisodes`.

L'API è consultata per finestre di 120 episodi; il numero pubblico dell'episodio e l'ID tecnico sono conservati in campi distinti (`Number` e `SiteID`).

## Risoluzione download

`handleAnalyze` → `analyzeEpisode` → `resolveAnimeUnityDownload` → `extractDownloadURLs`.

Se il percorso specifico non è utilizzabile, `discoverEpisodeDownload` prova a seguire le risorse iframe/script esplicitamente referenziate nel markup, entro limiti di profondità e numero di richieste.

## Persistenza

La libreria è serializzata in JSON. Gli aggiornamenti vengono scritti prima su un file temporaneo e poi rinominati, per ridurre il rischio di lasciare un file incompleto.
