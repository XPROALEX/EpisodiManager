## 4.2.2 — miglioramento download e finalizzazione media

- Selezione delle migliori tracce video/audio separate con yt-dlp (`bv+ba/b`).
- Download verificato di FFmpeg/FFprobe su Windows x64.
- Rimux MP4 senza ricodifica con `+faststart` e fallback MKV quando necessario.
- Verifica della traccia video e della durata tramite FFprobe.
- Conservazione del file originale se la finalizzazione non riesce.
- Test d'integrazione locale MPEG-TS → MP4 superato; non è stato eseguito un download live da Dailymotion.

# Changelog

## 4.1.1 — correzione stagioni mancanti

- Rimosso `numberOfSeasons` come limite rigido alla lista `seasons`.
- Rimosso il tetto globale `numberOfEpisodes` che poteva troncare l'ultima stagione.
- I conteggi vengono letti nel contesto dell'oggetto serie, non dalle schede consigliate.
- Le stagioni segnaposto oltre il conteggio pubblicato sono escluse solo se hanno esclusivamente titoli generici e nessuna trama/immagine.
- Aggiunto fallback per numeri stagione/episodio mancanti e deduplicazione `SxxExx`.
- Aggiunti test di regressione per conteggi riepilogativi non aggiornati.
- AnimeUnity non modificato.

## 4.1.0 — catalogo StreamingCommunity

- Aggiunto parser Next.js React Server Components.
- Rilevamento di titolo, ID, stagioni, episodi e rotta `watching?s=&e=`.
- Download StreamingCommunity lasciato disabilitato finché non è disponibile un URL player verificato.

## 4.0.0

- Aggiunto un primo adattatore StreamingCommunity basato su `data-page`.
- Preservato il flusso AnimeUnity.
