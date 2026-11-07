# Episodi Manager 4.2.2

Branch di versione per EpisodiManager 4.2.2 (Windows x64).

## Novità

- Migliorata la selezione delle tracce audio/video in yt-dlp.
- FFmpeg e FFprobe vengono scaricati e verificati automaticamente su Windows.
- Finalizzazione dei file senza ricodifica: MP4 con indice fast-start; fallback MKV quando necessario.
- Verifica automatica della traccia video e della durata.
- Conservazione del file originale se la finalizzazione non riesce.

## Stato del repository

Questo branch contiene note di rilascio, documentazione e report dei test della versione 4.2.2. Il codice Go completo non è ancora pubblicato come file singoli nella radice del branch; è distribuito separatamente nel pacchetto sorgente allegato alla versione 4.2.2 in questa conversazione.

## Verifiche

I test automatizzati e il test locale di finalizzazione MPEG-TS → MP4 sono superati. Non è stato verificato un download live da Dailymotion o da altri siti esterni.

StreamingCommunity resta supportato per la lettura del catalogo, non per il download. Usa il downloader soltanto con contenuti che hai il diritto o l'autorizzazione di acquisire. L'app non tenta di aggirare DRM, HTTP 403 o controlli di accesso.
