@echo off
echo ========================================
echo    TEST COMPLET DU DASHBOARD BMS
echo ========================================
echo.

echo [1/4] Test de la base de donnees...
cd backend
node test-database.js
if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur de base de donnees
    pause
    exit /b 1
)
echo ✅ Base de donnees OK
cd ..

echo.
echo [2/4] Demarrage du serveur backend...
cd backend
start "Backend BMS" cmd /k "npm start"
cd ..
echo ⏳ Attente du demarrage du serveur...
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Test de l'API backend...
curl -s http://localhost:5000/api/health >nul
if %ERRORLEVEL% neq 0 (
    echo ❌ API backend non accessible
    echo 💡 Verifiez que le serveur backend est demarre
    pause
    exit /b 1
)
echo ✅ API backend accessible

echo.
echo [4/4] Demarrage du frontend...
cd frontend
start "Frontend BMS" cmd /k "start-frontend.bat"
cd ..

echo.
echo ========================================
echo ✅ Tests termines avec succes !
echo ========================================
echo.
echo 🌐 URLs d'acces:
echo    Backend API: http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo 📱 Pour tester le dashboard:
echo    1. Ouvrez http://localhost:3000
echo    2. Connectez-vous avec un compte valide
echo    3. Accedez a la page /dashboard
echo.
echo 💡 Le composant de test affichera les diagnostics
echo.
pause
