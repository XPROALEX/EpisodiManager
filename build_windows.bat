@echo off
setlocal
cd /d "%~dp0"

where go >nul 2>nul
if errorlevel 1 (
  echo Go non e' installato. Installa Go 1.23 o successivo da https://go.dev/dl/
  pause
  exit /b 1
)

set GOOS=windows
set GOARCH=amd64
set CGO_ENABLED=0

echo Test del progetto...
go test ./...
if errorlevel 1 (
  echo Test non superati.
  pause
  exit /b 1
)

echo Compilazione Episodi Manager 4.1.1 per Windows x64...
go build -trimpath -ldflags="-s -w -H=windowsgui" -o EpisodiManager.exe .
if errorlevel 1 (
  echo Compilazione non riuscita.
  pause
  exit /b 1
)

echo Creato: %~dp0EpisodiManager.exe
pause
