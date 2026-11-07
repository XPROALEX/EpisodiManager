@echo off
setlocal
cd /d "%~dp0"

set "SRC=%~dp0EpisodiManager_Source_v4_1"
if not exist "%SRC%\main.go" (
  echo Estrazione dei sorgenti 4.1...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%~dp0EpisodiManager_Sorgenti_v4_1.zip' -DestinationPath '%~dp0' -Force"
  if errorlevel 1 (
    echo Impossibile estrarre l'archivio sorgente.
    pause
    exit /b 1
  )
)

if not exist "%SRC%\main.go" (
  echo Non trovo la cartella EpisodiManager_Source_v4_1.
  pause
  exit /b 1
)

cd /d "%SRC%"
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

echo Compilazione Episodi Manager 4.1 per Windows x64...
go build -trimpath -ldflags="-s -w -H=windowsgui" -o EpisodiManager.exe .
if errorlevel 1 (
  echo Compilazione non riuscita.
  pause
  exit /b 1
)

echo.
echo Creato: %SRC%\EpisodiManager.exe
pause
