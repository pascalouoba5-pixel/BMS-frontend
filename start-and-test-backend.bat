@echo off
echo ========================================
echo    DEMARRAGE ET TEST DU BACKEND BMS
echo ========================================
echo.

echo [1/4] Verification de l'environnement...
if not exist "backend\.env" (
    echo ❌ Fichier .env manquant dans le dossier backend
    echo 💡 Copier env.example vers .env et configurer les variables
    copy "backend\env.example" "backend\.env"
    echo ✅ Fichier .env cree
) else (
    echo ✅ Fichier .env present
)

echo.
echo [2/4] Installation des dependances...
cd backend
if not exist "node_modules" (
    echo 📦 Installation des dependances...
    npm install
) else (
    echo ✅ Dependances deja installees
)

echo.
echo [3/4] Test de la base de donnees...
echo 🗄️ Test de connexion a PostgreSQL...
node -e "
const { testConnection } = require('./config/database.js');
testConnection().then(success => {
    if (success) {
        console.log('✅ Base de donnees accessible');
        process.exit(0);
    } else {
        console.log('❌ Erreur de connexion a la base de donnees');
        process.exit(1);
    }
}).catch(err => {
    console.log('❌ Erreur:', err.message);
    process.exit(1);
});
"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERREUR: Impossible de se connecter a la base de donnees
    echo.
    echo 💡 SOLUTIONS:
    echo 1. Verifier que PostgreSQL est demarre
    echo 2. Verifier les parametres dans backend\.env
    echo 3. Creer la base de donnees: CREATE DATABASE bms_db;
    echo 4. Creer l'utilisateur: CREATE USER bms_user WITH PASSWORD 'motdepasse_bms';
    echo 5. Donner les droits: GRANT ALL PRIVILEGES ON DATABASE bms_db TO bms_user;
    echo.
    pause
    exit /b 1
)

echo.
echo [4/4] Demarrage du serveur backend...
echo 🚀 Demarrage du serveur sur le port 5000...
echo 💡 Le serveur sera accessible sur: http://localhost:5000
echo 💡 Appuyez sur Ctrl+C pour arreter le serveur
echo.

start "Backend BMS" cmd /k "npm start"

echo.
echo ⏳ Attente du demarrage du serveur...
timeout /t 5 /nobreak > nul

echo.
echo 🧪 Test de l'API...
node test-api-dashboard.js

echo.
echo ✅ Backend demarre et teste avec succes !
echo 🌐 URL: http://localhost:5000
echo 📱 Frontend: http://localhost:3000
echo.
pause
