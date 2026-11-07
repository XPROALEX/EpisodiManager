# Test report — Episodi Manager 4.2.2

## Modifiche validate

- Selezione tracce yt-dlp: preferenza `bv+ba/b` e risoluzioni massime 1080p/720p/480p.
- Passaggio di `--ffmpeg-location` e `--merge-output-format mkv` ai processi yt-dlp.
- Download e verifica SHA-256 dell'archivio FFmpeg Windows ed estrazione controllata degli eseguibili richiesti.
- Rimux MP4 senza ricodifica con `+faststart`, validazione con FFprobe e fallback MKV.
- Conservazione del file originale in caso di errore di finalizzazione.

## Test automatizzati

- `go test ./...`
- `go test -race ./...`
- `go vet ./...`
- Compilazione Windows x64.
- Test simulati per downloader, tool FFmpeg e finalizzazione.
- Test d'integrazione locale: generazione di un breve MPEG-TS con video/audio, rimux in MP4 e verifica con FFprobe.

## Limiti

Non è stato effettuato un download reale da Dailymotion né da altri servizi esterni. La finalizzazione non ricodifica i flussi: rimuxa in MP4 con fast-start o ripiega su MKV.
