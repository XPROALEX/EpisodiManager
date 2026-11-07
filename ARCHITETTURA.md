# Architettura — Episodi Manager 4.1.1

## Avvio

`main()` carica la libreria JSON, avvia un server HTTP esclusivamente su `127.0.0.1` e apre il browser. L'interfaccia HTML/CSS/JavaScript è incorporata in `main.go`.

## AnimeUnity

`handleScanSeries` → `animeUnityParts` → `fetchAnimeUnityEpisodes`.

La scansione usa `info_api` a blocchi da 120 episodi, mantenendo separati numero visibile e ID tecnico. Il flusso preesistente di analisi e download è invariato.

## StreamingCommunity — catalogo

`handleScanSeries` → `isStreamingCommunityURL` → `fetchStreamingCommunityEpisodes`.

1. `extractNextFlightPayload` decodifica i chunk `self.__next_f.push([1, ...])` di Next.js.
2. `extractStreamingCommunityFlightCatalog` individua l'oggetto della serie prima di leggere i conteggi, evitando di prendere quelli delle schede consigliate.
3. L'array `seasons` è la fonte principale del catalogo.
4. I conteggi `numberOfSeasons` e `numberOfEpisodes` sono metadati indicativi, non limiti rigidi.
5. `isUnreleasedPlaceholderSeason` esclude solo stagioni oltre il conteggio dichiarato quando tutte le puntate hanno titoli generici e nessuna trama o immagine.
6. Gli episodi sono numerati `SxxExx`; numeri mancanti usano la posizione nell'array e i duplicati vengono rimossi.
7. Le pagine episodio seguono `watching?s={s}&e={e}`.

La lettura non può mostrare stagioni che il payload ricevuto non contiene. Per cataloghi caricati da endpoint separati servirà un adattatore aggiuntivo.

Il catalogo di Black Doves nel file fornito non contiene l'ID tecnico episodio. Il player Vidxgo ha restituito HTTP 403; per questo le azioni di analisi link e download StreamingCommunity restano disabilitate.

## Test

I test coprono i chunk Next.js, conteggi aggregati non aggiornati, filtro dei placeholder, numeri mancanti, deduplicazione, costruzione URL episodio, AnimeUnity e download di prova. I test HTTP sono simulati, non sono prove live di tutti i mirror.
