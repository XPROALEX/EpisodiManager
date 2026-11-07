# Test report — 4.2.3

- `go test ./...`: superato.
- `go test -race ./...`: superato.
- `go vet ./...`: superato.
- Build Windows x64: completata.
- Test unitari per URL/SHA FFmpeg e deduplicazione job: superati.
- Verificato tramite API GitHub che asset FFmpeg 9.0.2 abbia nome e digest corrispondenti a quelli fissati nell'app.

Limite: non è stato possibile scaricare il binario FFmpeg live nel container di build; il download effettivo deve essere confermato da Windows.
