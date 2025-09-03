@echo off
echo ========================================
echo 🧪 TEST DE L'API DASHBOARD BMS
echo ========================================
echo.

echo Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

echo Test de l'API Dashboard...
echo.

cd frontend
node test-dashboard-api.js

echo.
echo ========================================
echo 🏁 TEST TERMINÉ
echo ========================================
pause
