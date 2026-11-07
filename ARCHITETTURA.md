# Architettura — Episodi Manager 4.1

## Avvio e interfaccia

`main()` carica la libreria JSON, avvia un server HTTP solo su `127.0.0.1` e apre il browser. L'interfaccia HTML/CSS/JavaScript è incorporata in `main.go`.

## AnimeUnity

`handleScanSeries` → `animeUnityParts` → `fetchAnimeUnityEpisodes`.

La scansione utilizza `info_api` a blocchi da 120 episodi, mantenendo distinti numero visibile e ID interno. Il flusso preesistente di analisi e download rimane invariato.

## StreamingCommunity — lettura del catalogo

`handleScanSeries` → `isStreamingCommunityURL` → `fetchStreamingCommunityEpisodes`.

1. `extractNextFlightPayload` individua i chunk `self.__next_f.push([1, ...])` emessi da Next.js e decodifica le stringhe JSON.
2. `extractStreamingCommunityFlightCatalog` individua l'oggetto della serie, i metadati `numberOfSeasons` / `numberOfEpisodes` e l'array `seasons`.
3. Il parser costruisce una voce per ogni episodio pubblicato, usando `SxxExx`, titolo e la rotta `watching?s={s}&e={e}`.
4. Le stagioni che superano `numberOfSeasons` e gli episodi oltre `numberOfEpisodes` vengono esclusi: questo evita di mostrare le voci provvisorie `Episodio N` della seconda stagione di Black Doves.
5. Se l'URL incollato è una pagina `/watching`, l'app torna alla pagina titolo per leggere il catalogo completo.

Le voci catalogo analizzate nel sorgente fornito non contengono l'ID tecnico dell'episodio; il parser non ne inventa uno. La pagina di riproduzione conferma il formato della rotta e l'iframe, ma il server Vidxgo ha restituito 403 nel file condiviso. Per questo la UI disabilita temporaneamente analisi link e download per StreamingCommunity.

## Test

`main_test.go` copre i chunk Next.js, il filtro dei placeholder, la costruzione delle pagine episodio, AnimeUnity, il download di prova e i parser comuni. I test sono simulati; non costituiscono un test live del sito.
