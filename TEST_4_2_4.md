# Test report — EpisodiManager 4.2.4

- Unit tests: pass.
- Race tests: pass.
- Go vet: pass.
- Windows x64 cross-build: pass.
- Test verifies the pinned API asset endpoint and the binary Accept header.
- SHA-256 remains pinned to the public release asset metadata.

Limitation: this build environment has no DNS resolution, therefore the FFmpeg asset could not be downloaded live here. Validate the first-run installation on the Windows PC. If it fails, the UI now reports both attempted URLs, final redirect URL and HTTP response excerpt.
