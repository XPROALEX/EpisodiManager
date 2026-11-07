# Episodi Manager 4.2.2

Branch di versione per EpisodiManager 4.2.2 (Windows x64).

## Novità

- Migliorata la scelta delle tracce audio/video in yt-dlp.
- FFmpeg e FFprobe vengono scaricati e verificati automaticamente su Windows.
- Finalizzazione media senza ricodifica: MP4 con indice fast-start; fallback MKV per codec non compatibili.
- Verifica automatica di traccia video e durata.
- Il codice sorgente completo è incluso nell'archivio sotto `source/`.

## Download e sorgenti

Apri la cartella `source/` e scarica `EpisodiManager_Source_v4_2_2.tar.xz`.
Su Windows puoi estrarlo con 7-Zip. Dopo l'estrazione, il progetto Go si trova nella directory `EpisodiManager_Source_v4_2_2`.

Il pacchetto Windows eseguibile è distribuito separatamente in questa conversazione; il repository contiene il sorgente completo e la documentazione.

## Limitazioni verificate

I test automatizzati e il test locale di finalizzazione MPEG-TS → MP4 sono superati. Non è stato verificato un download live da Dailymotion o da altri siti esterni. StreamingCommunity resta supportato per la lettura del catalogo, non per il download.

Usa il downloader soltanto con contenuti che hai il diritto o l'autorizzazione di acquisire. L'app non tenta di aggirare DRM, HTTP 403 o controlli di accesso.
