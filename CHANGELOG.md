## 4.2.4 — FFmpeg download diagnostics

- Prefer GitHub Releases API asset endpoint with `Accept: application/octet-stream`.
- Keep the browser download URL as a fallback.
- Include final URL and a response excerpt in HTTP failures.
- Keep SHA-256 verification before archive extraction.
- Add unit test for API URL and required request headers.

## 4.2.3
- Updated FFmpeg asset URL to the GitHub release browser download URL.
- Added FFmpeg install serialization and duplicate-download protection.
