# Architecture — Episodi Manager 4.2.4

## FFmpeg bootstrap

1. Request the FFmpeg 9.0.2 Essentials release asset through the GitHub Releases API with `Accept: application/octet-stream`.
2. If that fails, retry using the browser download URL for the same pinned asset.
3. Report HTTP status, final URL after redirects and a short response body excerpt.
4. Verify the downloaded archive SHA-256 before extracting `ffmpeg.exe` and `ffprobe.exe`.

## Media processing

yt-dlp downloads supported formats. FFmpeg merges separate audio/video tracks and remuxes without re-encoding; MP4 fast-start is preferred and MKV is the fallback where needed. FFprobe validates the resulting video stream and duration.

StreamingCommunity remains catalog-only. The app does not bypass DRM, HTTP 403 or access controls.
