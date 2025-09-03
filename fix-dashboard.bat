@echo off
echo 🔧 Correction automatique du Dashboard BMS
echo ===========================================
echo.

echo 📋 Vérification de l'environnement...
echo.

echo 1️⃣ Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js détecté

echo.
echo 2️⃣ Vérification de PostgreSQL...
pg_isready -U bms_user -d bms_db >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ PostgreSQL n'est pas accessible
    echo Vérifiez que PostgreSQL est démarré
    echo.
    echo Tentative de démarrage de PostgreSQL...
    net start postgresql-x64-15 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ PostgreSQL démarré avec succès
    ) else (
        echo ❌ Impossible de démarrer PostgreSQL
        echo Vérifiez l'installation et les services
    )
) else (
    echo ✅ PostgreSQL accessible
)

echo.
echo 3️⃣ Installation des dépendances...
echo.

echo 📦 Installation des dépendances backend...
cd backend
if not exist node_modules (
    echo Installation des modules backend...
    npm install
) else (
    echo ✅ Modules backend déjà installés
)

echo.
echo 📦 Installation des dépendances frontend...
cd ..\frontend
if not exist node_modules (
    echo Installation des modules frontend...
    npm install
) else (
    echo ✅ Modules frontend déjà installés
)

echo.
echo 4️⃣ Test de la base de données...
cd ..\backend
echo Test de connexion à la base de données...
node test-dashboard-db.js
if %errorlevel% neq 0 (
    echo ❌ Erreur de connexion à la base de données
    echo Vérifiez les variables d'environnement dans .env
    echo.
    echo Variables d'environnement requises:
    echo - DB_HOST=localhost
    echo - DB_PORT=5432
    echo - DB_NAME=bms_db
    echo - DB_USER=bms_user
    echo - DB_PASSWORD=motdepasse_bms
    echo.
    pause
    exit /b 1
)

echo.
echo 5️⃣ Démarrage des services...
echo.

echo 🚀 Démarrage du serveur backend...
start "Backend BMS" cmd /k "cd backend && npm start"

echo ⏳ Attente du démarrage du backend...
timeout /t 5 /nobreak >nul

echo 🌐 Démarrage du frontend...
start "Frontend BMS" cmd /k "cd frontend && npm run dev"

echo.
echo 6️⃣ Test de l'API...
timeout /t 3 /nobreak >nul
echo Test de l'API dashboard...
node test-dashboard-api.js

echo.
echo ✅ Configuration terminée !
echo.
echo 📱 Le dashboard devrait maintenant fonctionner sur:
echo    - Frontend: http://localhost:3000
echo    - Backend: http://localhost:5000
echo.
echo 🔍 Si des problèmes persistent, consultez:
echo    - DASHBOARD_TROUBLESHOOTING.md
echo    - Les logs dans les consoles des services
echo.
pause
