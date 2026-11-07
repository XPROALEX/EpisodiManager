# Architettura — Episodi Manager 4.2.2

Questa pagina è il riferimento sintetico della versione 4.2.2. Il codice Go completo, con la documentazione architetturale dettagliata, è distribuito nel pacchetto sorgente separato associato a questa versione; non è ancora presente come file singoli nella radice del branch.

La 4.2.2 usa yt-dlp per le sorgenti supportate e FFmpeg/FFprobe per unire e finalizzare i file. La finalizzazione prova MP4 con `+faststart`, verifica il risultato con FFprobe e usa MKV come fallback quando necessario. I flussi vengono rimuxati senza ricodifica.

StreamingCommunity resta in sola lettura catalogo. Nessuna funzionalità tenta di aggirare DRM, HTTP 403, login o altri controlli di accesso.
