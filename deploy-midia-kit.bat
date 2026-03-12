@echo off
setlocal

REM Always run from this script folder
cd /d "%~dp0"

echo ===================================================
echo   ATUALIZACAO AUTOMATICA: GITHUB E SITE (FIREBASE)
echo ===================================================
echo.

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Git nao encontrado no PATH.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo npm nao encontrado no PATH.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo package.json nao encontrado. Rode este arquivo na raiz do projeto.
    pause
    exit /b 1
)

if not exist ".git" (
    echo Esta pasta ainda nao e um repositorio Git.
    echo.
    echo Para habilitar o passo de GitHub, execute uma vez:
    echo   git init
    echo   git branch -M main
    echo   git remote add origin URL_DO_SEU_REPO
    echo.
    echo Depois rode este script novamente.
    pause
    exit /b 1
)

echo 1. Enviando alteracoes para o GitHub...
git add .
if %errorlevel% neq 0 (
    echo Erro ao executar git add.
    pause
    exit /b %errorlevel%
)

git diff --cached --quiet
if %errorlevel% equ 0 (
    echo Nenhuma alteracao para commit. Pulando commit.
) else (
    git commit -m "Atualizacao do midia kit"
    if %errorlevel% neq 0 (
        echo Erro ao executar git commit.
        pause
        exit /b %errorlevel%
    )
)

git push
if %errorlevel% neq 0 (
    echo Erro ao executar git push.
    pause
    exit /b %errorlevel%
)
echo GitHub atualizado com sucesso!
echo.

echo 2. Construindo o projeto (npm run build)...
npm run build
if %errorlevel% neq 0 (
    echo Erro ao fazer o build. Verifique seu codigo.
    pause
    exit /b %errorlevel%
)
echo Build concluido com sucesso!
echo.

echo 3. Fazendo o deploy (npx firebase deploy)...
if not exist "firebase.json" (
    echo Aviso: firebase.json nao encontrado na raiz.
    echo Se o deploy Firebase nao estiver configurado neste projeto, este passo pode falhar.
)

npx firebase deploy
if %errorlevel% neq 0 (
    echo.
    echo Erro no Deploy! Verifique o console acima.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo   TUDO CONCLUIDO COM SUCESSO! (GITHUB E SITE)
echo ===================================================
pause
endlocal
