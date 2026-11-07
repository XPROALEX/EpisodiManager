# Test di regressione — Episodi Manager 4.1.1

I test aggiunti al pacchetto sorgente 4.1.1 coprono questi casi:

1. **Conteggi stagioni non aggiornati:** il payload dichiara 2 stagioni, ma contiene 3 stagioni con episodi reali. Il parser conserva anche la terza stagione.
2. **Conteggio totale episodi non aggiornato:** il payload dichiara un totale più basso del numero di episodi effettivamente presenti. La scansione non si interrompe al raggiungimento del totale.
3. **Stagione segnaposto:** una stagione oltre il conteggio pubblicato, con sole voci generiche (ad esempio "Episodio 1") e senza trama o immagine, viene esclusa.
4. **Stagione con dati reali:** una stagione oltre il conteggio dichiarato ma con metadati di episodio effettivi non viene eliminata.
5. **Deduplicazione e fallback:** vengono evitati duplicati SxxExx e viene usata la posizione nell'array quando un numero è assente.

I test Go vengono eseguiti con:

```bash
go test ./...
go test -race ./...
go vet ./...
```

I test di rete usano server HTTP locali simulati: verificano il parser e non rappresentano un controllo live su ogni mirror del sito.
