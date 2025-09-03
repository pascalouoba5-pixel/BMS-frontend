@echo off
echo ========================================
echo    TEST RAPIDE DU DASHBOARD BMS
echo ========================================
echo.

echo [1/3] Test du backend...
curl -s http://localhost:5000/api/health >nul
if %ERRORLEVEL% equ 0 (
    echo ✅ Backend accessible sur http://localhost:5000
) else (
    echo ❌ Backend non accessible
    echo 💡 Demarrez le backend avec: cd backend && npm start
    pause
    exit /b 1
)

echo.
echo [2/3] Test du frontend...
curl -s http://localhost:3000 >nul
if %ERRORLEVEL% equ 0 (
    echo ✅ Frontend accessible sur http://localhost:3000
) else (
    echo ❌ Frontend non accessible
    echo 💡 Demarrez le frontend avec: cd frontend && npm run dev
    pause
    exit /b 1
)

echo.
echo [3/3] Test de l'API dashboard...
curl -s "http://localhost:5000/api/dashboard/complete?period=month" | findstr "Token d'authentification requis" >nul
if %ERRORLEVEL% equ 0 (
    echo ✅ API dashboard protegee par authentification
) else (
    echo ❌ API dashboard non accessible ou non protegee
)

echo.
echo ========================================
echo ✅ Tests termines !
echo ========================================
echo.
echo 🌐 URLs d'acces:
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo 📱 Pour tester le dashboard:
echo    1. Ouvrez http://localhost:3000
echo    2. Connectez-vous avec un compte valide
echo    3. Accedez a /dashboard
echo.
echo 💡 Si vous n'avez pas de compte, utilisez:
echo    Email: test@bms.com
echo    Mot de passe: test123
echo.
pause
