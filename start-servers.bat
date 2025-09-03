@echo off
echo ========================================
echo    DEMARRAGE DES SERVEURS BMS
echo ========================================
echo.

echo [1/3] Verification des ports...
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ❌ Le port 5000 est deja utilise
    echo Arret du processus sur le port 5000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 >nul
)

netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ❌ Le port 3000 est deja utilise
    echo Arret du processus sur le port 3000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 >nul
)

echo ✅ Ports libres
echo.

echo [2/3] Demarrage du serveur backend...
cd backend
start "BMS Backend" cmd /k "npm run dev"
timeout /t 3 >nul

echo [3/3] Demarrage du serveur frontend...
cd ..\frontend
start "BMS Frontend" cmd /k "npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo    SERVEURS DEMARRES
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo 📊 Health:   http://localhost:5000/api/health
echo.
echo 📝 Test de connexion: Ouvrez test-connection.html
echo.
echo Appuyez sur une touche pour ouvrir le navigateur...
pause >nul

start http://localhost:3000
start test-connection.html

echo.
echo ✅ Application BMS demarree avec succes !
echo.
pause
