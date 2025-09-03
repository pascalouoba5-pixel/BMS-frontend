@echo off
echo ========================================
echo    BMS 3 - Démarrage du Projet
echo ========================================
echo.

echo [1/4] Installation des dépendances principales...
call npm install

echo.
echo [2/4] Installation des dépendances backend...
cd backend
call npm install
cd ..

echo.
echo [3/4] Installation des dépendances frontend...
cd frontend
call npm install
cd ..

echo.
echo [4/4] Démarrage du projet...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Appuyez sur Ctrl+C pour arrêter
echo.

call npm run dev

pause 