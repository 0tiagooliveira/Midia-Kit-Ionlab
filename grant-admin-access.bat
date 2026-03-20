@echo off
setlocal

cd /d "%~dp0"

echo ======================================
echo   LIBERAR ACESSO ADMIN - MIDIA KIT
echo ======================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nao encontrado no PATH.
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

if "%GOOGLE_APPLICATION_CREDENTIALS%"=="" (
  set /p GOOGLE_APPLICATION_CREDENTIALS=Informe o caminho completo do serviceAccountKey.json: 
)

if not exist "%GOOGLE_APPLICATION_CREDENTIALS%" (
  echo Arquivo da service account nao encontrado: %GOOGLE_APPLICATION_CREDENTIALS%
  pause
  exit /b 1
)

if "%ADMIN_PASSWORD%"=="" (
  set ADMIN_PASSWORD=Ionlab123.
)

echo.
echo Instalando dependencias (se necessario)...
call npm install
if errorlevel 1 (
  echo Falha no npm install.
  pause
  exit /b 1
)

echo.
echo Aplicando senha, claim admin=true e admins/{uid}...
call npm run auth:set-admin-passwords
if errorlevel 1 (
  echo Falha ao liberar acesso admin.
  pause
  exit /b 1
)

echo.
echo Concluido com sucesso.
echo Agora faca logout e login novamente no painel /admin.
pause
endlocal
