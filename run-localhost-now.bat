@echo off
setlocal

cd /d "%~dp0"

echo ======================================
echo   INICIANDO LOCALHOST EM NOVA JANELA
echo ======================================
echo.

where npm >nul 2>&1
if errorlevel 1 (
  echo npm nao encontrado no PATH.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo Falha no npm install.
    pause
    exit /b 1
  )
)

echo Abrindo servidor em nova janela...
start "Midia Kit - Dev Server" cmd /k "cd /d ""%~dp0"" && call npm run dev:windows"

echo Aguarde 5 segundos e abrindo navegador...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"

echo Verificando se a porta 3000 esta ativa...
netstat -ano | findstr ":3000" >nul
if errorlevel 1 (
  echo Nao detectei servidor na porta 3000.
  echo Veja a janela "Midia Kit - Dev Server" para identificar o erro e me envie as ultimas linhas.
) else (
  echo Servidor detectado na porta 3000.
)

echo Pronto.
endlocal
