@echo off
setlocal

cd /d "%~dp0"

echo ======================================
echo   INICIANDO MIDIA KIT EM LOCALHOST
echo ======================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nao encontrado no PATH.
  echo Instale em: https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo npm nao encontrado no PATH.
  pause
  exit /b 1
)

if not exist "package.json" (
  echo package.json nao encontrado nesta pasta.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)

echo Verificando se a porta 3000 esta ocupada...
netstat -ano | findstr ":3000" >nul
if not errorlevel 1 (
  echo A porta 3000 ja esta em uso por outro processo.
  echo Feche o processo atual ou altere a porta.
  echo.
)

echo Abrindo: http://localhost:3000
start "" "http://localhost:3000"

echo Iniciando servidor Vite na porta 3000...
call npm run dev:windows
if errorlevel 1 (
  echo.
  echo Falha ao iniciar localhost.
  echo Veja o erro acima e me envie as ultimas linhas.
  pause
  exit /b 1
)

endlocal
