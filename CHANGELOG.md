# Changelog

## 4.1.0 — lettura catalogo StreamingCommunity

- Aggiunto parser per i chunk React Server Components `self.__next_f.push` di Next.js.
- Lettura diretta di titolo, ID, conteggi di stagioni/episodi e titoli delle puntate.
- Gestita la rotta reale `/titles/{id}-{slug}-streaming/watching?s={s}&e={e}`.
- Se l'utente incolla la pagina `/watching`, l'app recupera la pagina titolo per leggere il catalogo completo.
- Filtrate le stagioni/episodi provvisori oltre i conteggi dichiarati dal catalogo.
- Disabilitate nella UI le azioni di analisi link/download per StreamingCommunity finché il player non espone un collegamento accessibile verificato.
- AnimeUnity mantiene il proprio flusso senza modifiche funzionali.
- Aggiunti test per il parsing Next.js, le stagioni, gli episodi, la costruzione delle pagine episodio e i casi di catalogo incompleto.

## 4.0.0

- Aggiunto il riconoscimento del dominio StreamingCommunity.
- Aggiunto l'adattatore iniziale basato sul vecchio formato `data-page`.
- Preservato il flusso AnimeUnity.
