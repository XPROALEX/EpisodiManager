# Episodi Manager 4.2.4

Version branch for Windows x64.

## FFmpeg HTTP 404 fix candidate

The 4.2.3 used the browser download URL as its primary request. In 4.2.4, FFmpeg 9.0.2 Essentials is requested first through the GitHub Releases API asset endpoint using `Accept: application/octet-stream`, as documented by GitHub. The browser download URL remains a fallback.

- API asset: https://api.github.com/repos/GyanD/codexffmpeg/releases/assets/574302090
- Fallback: https://github.com/GyanD/codexffmpeg/releases/download/9.0.2/ffmpeg-9.0.2-essentials_build.zip
- SHA-256: `60f467265b1e312373dbcd92200c2618a74850f98d3d078e94296bb3fa2047ba`

HTTP errors now include the final URL and a short response excerpt to make failures diagnosable.

## Tests and caveat

Go unit tests, race tests, vet and Windows x64 cross-build pass. This build environment has no DNS access, so a live download of the FFmpeg asset could not be confirmed here. The Windows client should be used to verify the download end-to-end.

The complete updated Go source is distributed separately in the version source archive; this branch contains release documentation and metadata.
