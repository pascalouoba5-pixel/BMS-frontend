@echo off
echo Redémarrage des serveurs BMS...

echo.
echo 1. Arrêt des processus Node.js existants...
taskkill /f /im node.exe 2>nul

echo.
echo 2. Démarrage du backend...
cd backend
start "Backend BMS" cmd /k "npm start"

echo.
echo 3. Attente de 5 secondes pour le démarrage du backend...
timeout /t 5 /nobreak >nul

echo.
echo 4. Démarrage du frontend...
cd ..\frontend
start "Frontend BMS" cmd /k "npm run dev"

echo.
echo ✅ Serveurs redémarrés !
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
