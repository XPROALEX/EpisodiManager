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
