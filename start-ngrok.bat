@echo off
echo ========================================
echo    BMS 3 - Démarrage avec ngrok
echo ========================================
echo.

echo [1/3] Vérification de ngrok...
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ngrok n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer ngrok depuis https://ngrok.com/
    pause
    exit /b 1
)

echo [2/3] Démarrage du projet BMS...
start "BMS Backend" cmd /k "npm run dev:backend"
timeout /t 3 /nobreak >nul

echo [3/3] Démarrage de ngrok...
echo.
echo URLs ngrok générées :
echo Frontend: https://[votre-url].ngrok.io
echo Backend:  https://[votre-url].ngrok.io:5000
echo.
echo Appuyez sur Ctrl+C pour arrêter
echo.

ngrok http 3000 --config ngrok.yml

pause
