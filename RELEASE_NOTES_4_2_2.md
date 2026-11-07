# Episodi Manager 4.2.2

Questa versione migliora la fase di acquisizione e finalizzazione dei file video.

## Modifiche principali

- yt-dlp preferisce le migliori tracce video e audio separate.
- FFmpeg 9.0.2 Essentials e FFprobe vengono scaricati al primo download su Windows x64; l'archivio viene verificato tramite SHA-256 e vengono estratti soltanto gli eseguibili necessari.
- I file vengono rimuxati senza ricodifica in MP4 con `-movflags +faststart`.
- Se i codec non sono adatti a MP4, viene tentato un contenitore MKV.
- FFprobe verifica la presenza della traccia video e una durata valida.
- In caso di errore di finalizzazione, il file originale viene conservato.

## Verifiche

- `go test ./...`
- `go test -race ./...`
- `go vet ./...`
- Build Windows x64.
- Test locale MPEG-TS → MP4 e verifica con FFprobe.

Non è stato eseguito un download live da Dailymotion; la compatibilità effettiva va verificata sulla sorgente autorizzata usata dall'utente.
