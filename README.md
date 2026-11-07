# Episodi Manager 4.2.3

Branch di versione 4.2.3 (Windows x64).

## Correzione FFmpeg HTTP 404

La 4.2.2 puntava a un vecchio percorso Gyan che restituiva HTTP 404. La 4.2.3 usa l'asset ZIP della release FFmpeg 9.0.2 pubblicata sul mirror GitHub ufficiale GyanD/codexffmpeg.

- URL: https://github.com/GyanD/codexffmpeg/releases/download/9.0.2/ffmpeg-9.0.2-essentials_build.zip
- SHA-256 asset: `60f467265b1e312373dbcd92200c2618a74850f98d3d078e94296bb3fa2047ba`
- Nome archivio locale: `ffmpeg-9.0.2-essentials_build.zip`

## Stabilità download

- Installazione FFmpeg serializzata per evitare gare tra job.
- Blocco dei doppi clic e deduplicazione dei job identici ancora attivi.

## Sorgenti

Il codice Go completo della 4.2.3 è distribuito nel pacchetto sorgente separato allegato alla versione; i singoli file Go aggiornati non sono ancora pubblicati nella radice del repository.

## Test

`go test ./...`, `go test -race ./...` e `go vet ./...` superati; build Windows x64 completata. Non è stato eseguito un download live del binario FFmpeg nel container, quindi il test finale va effettuato sul PC Windows.
