# Episodi Manager 4.1

Applicazione Windows per organizzare serie ed episodi con un unico campo URL.

## Branch di questa versione

La versione 4.1 è pubblicata nel branch **`4.1`**. Il branch `main` non viene modificato da questo aggiornamento: rimane disponibile come versione precedente.

## Supporto in questa versione

- **AnimeUnity**: rilevamento tramite `info_api` a blocchi di 120 episodi e flusso di download diretto già presente nelle versioni precedenti.
- **StreamingCommunity (catalogo)**: lettura dei dati React Server Components di Next.js (`self.__next_f.push`), estrazione delle stagioni e degli episodi pubblicati e costruzione delle pagine episodio nel formato `/titles/{id}-{slug}-streaming/watching?s={stagione}&e={episodio}`.

Per StreamingCommunity questa versione si concentra sulla catalogazione: la ricerca dei link video e il download sono disabilitati nell'interfaccia. Il sorgente fornito mostra che il player è esterno (Vidxgo) e la pagina del player restituisce HTTP 403; non viene quindi inventato un URL di download.

## Black Doves — verifica sul sorgente fornito

Il sorgente HTML di `https://streaming-community.moe/titles/28300-black-doves-streaming` contiene i dati Next.js con:

- ID serie `28300`, titolo `Black Doves`;
- `numberOfSeasons = 1` e `numberOfEpisodes = 6`;
- sei episodi nominati della stagione 1;
- una seconda stagione provvisoria con titoli generici, che viene esclusa dai conteggi dichiarati della serie.

Il catalogo mostrato dall'app per questo esempio è quindi **Stagione 1, episodi 1–6**. Il sorgente della pagina episodio conferma la rotta `watching?s=1&e=1` e l'iframe del player, ma non fornisce l'ID tecnico episodio nel catalogo iniziale.

## Codice sorgente completo

Il progetto completo è incluso nell'archivio [`EpisodiManager_Sorgenti_v4_1.zip`](EpisodiManager_Sorgenti_v4_1.zip). Estrai l'archivio: troverai la cartella `EpisodiManager_Source_v4_1` con `main.go`, `main_test.go`, `go.mod`, gli adattatori specifici per Windows e gli script di compilazione.

## Avvio su Windows

Per usare l'EXE non serve installare Python, Go o .NET: estrai il pacchetto Windows della release e avvia `EpisodiManager.exe`.

## Sviluppo

Requisiti: Go 1.23 o successivo.

Dopo aver estratto l'archivio sorgente ed essere entrato nella cartella `EpisodiManager_Source_v4_1`:

```bash
go test ./...
go test -race ./...
go vet ./...
go run .
```

Per compilare Windows x64 da Windows, esegui `build_windows.bat` nella cartella sorgente. Da shell con Go:

```bash
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags="-s -w -H=windowsgui" -o EpisodiManager.exe .
```

## Note tecniche

- `main.go`: server locale, interfaccia, API, parser AnimeUnity e parser Next.js StreamingCommunity.
- `main_test.go`: test unitari e test HTTP simulati per entrambi gli adattatori.
- `process_windows.go` / `process_other.go`: avvio dei processi esterni senza finestra console su Windows.
- `CHANGELOG.md`: modifiche della versione 4.1.
- `ARCHITETTURA.md`: descrizione del flusso applicativo.
- `THIRD_PARTY_NOTICES.md`: attribuzioni e note sulle dipendenze di terze parti.

I dati della libreria sono salvati nel profilo utente in `EpisodiManager/library.json`.

## Uso responsabile

Usa l'applicazione solo per contenuti che hai il diritto o l'autorizzazione di acquisire e nel rispetto delle regole applicabili. Il parser del catalogo legge soltanto i dati esposti dalla pagina; questa versione non tenta di aggirare il blocco HTTP 403 del player.
