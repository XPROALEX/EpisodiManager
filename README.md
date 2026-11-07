# Episodi Manager 4.1.1

Applicazione Windows per organizzare serie ed episodi con un unico campo URL.

## Supporto

- **AnimeUnity**: rilevamento tramite `info_api` a blocchi di 120 episodi e flusso di download diretto già presente.
- **StreamingCommunity (catalogo)**: lettura dei dati React Server Components di Next.js (`self.__next_f.push`), estrazione delle stagioni e degli episodi, creazione degli URL `/titles/{id}-{slug}-streaming/watching?s={s}&e={e}`.

Per StreamingCommunity questa versione si concentra sulla catalogazione. Analisi dei link video e download restano disabilitati perché il player esterno Vidxgo ha restituito HTTP 403 nel sorgente condiviso. Non viene inventato un URL di download.

## Correzione 4.1.1: stagioni mancanti

La 4.1.0 usava `numberOfSeasons` e `numberOfEpisodes` come limiti rigidi. Se i conteggi riepilogativi del sito erano vecchi o incompleti, veniva scartata l'ultima stagione o parte dei suoi episodi.

La 4.1.1:
- identifica prima l'oggetto della serie, per non confondere i conteggi con quelli delle schede consigliate;
- considera l'array `seasons` la fonte principale;
- non tronca la scansione al raggiungimento di `numberOfEpisodes`;
- non scarta una stagione soltanto perché supera `numberOfSeasons`;
- filtra solo stagioni segnaposto oltre il conteggio pubblicato, quando tutte le voci hanno titoli generici e nessuna trama/immagine;
- usa l'ordine dell'array come fallback per numeri mancanti e rimuove duplicati `SxxExx`.

La lettura resta limitata alle stagioni effettivamente presenti nel payload ricevuto. Se una stagione viene caricata solo tramite una chiamata API separata, occorrerà un adattatore per quell'endpoint.

## Black Doves — fixture verificata

Il sorgente HTML fornito per `https://streaming-community.moe/titles/28300-black-doves-streaming` contiene sei episodi nominati della stagione 1 e una stagione 2 composta da voci segnaposto. Il parser mostra S01E01–S01E06 e ignora la stagione 2 provvisoria.

## Codice sorgente

Il pacchetto sorgente completo della revisione 4.1.1 è distribuito separatamente come `EpisodiManager_Sorgenti_v4_1_1.zip` nella conversazione. Il branch documenta le modifiche, i test di regressione e la procedura di build; il pacchetto contiene il codice Go completo.

## Avvio Windows

L'EXE non richiede Python, Go o .NET. Per compilare dai sorgenti serve Go 1.23 o successivo:

```bash
go test ./...
go test -race ./...
go vet ./...
go run .
```

## File principali

- `main.go`: server locale, interfaccia, API e parser.
- `main_test.go`: test automatici e test HTTP simulati.
- `CHANGELOG.md`: cronologia modifiche.
- `ARCHITETTURA.md`: descrizione tecnica.
- `THIRD_PARTY_NOTICES.md`: attribuzioni.

AnimeUnity mantiene il flusso precedente. Il parser StreamingCommunity legge i dati esposti dalla pagina e non tenta di aggirare il blocco HTTP 403 del player.
