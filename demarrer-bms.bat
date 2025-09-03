@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 Démarrage de l'application BMS
echo ========================================
echo.

:: Vérifier si Node.js est installé
echo 🔍 Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo 💡 Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js détecté

:: Vérifier si PostgreSQL est installé
echo.
echo 🔍 Vérification de PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL n'est pas détecté dans le PATH
    echo 💡 Assurez-vous que PostgreSQL est installé et configuré
    echo 💡 Ajoutez le dossier bin de PostgreSQL au PATH si nécessaire
    echo.
    echo 📋 Vérifiez que PostgreSQL est démarré et accessible
    echo.
)

:: Vérifier si le fichier .env existe
echo.
echo 🔍 Vérification de la configuration...
if not exist "backend\.env" (
    echo ❌ Fichier .env manquant dans le dossier backend
    echo 💡 Exécutez d'abord: node configurer-base-donnees.js
    pause
    exit /b 1
)
echo ✅ Fichier .env trouvé

:: Installer les dépendances si nécessaire
echo.
echo 📦 Vérification des dépendances...
if not exist "node_modules" (
    echo 🔧 Installation des dépendances...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
) else (
    echo ✅ Dépendances déjà installées
)

:: Installer les dépendances backend si nécessaire
if not exist "backend\node_modules" (
    echo.
    echo 🔧 Installation des dépendances backend...
    cd backend
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances backend
        pause
        exit /b 1
    )
    echo ✅ Dépendances backend installées
    cd ..
) else (
    echo ✅ Dépendances backend déjà installées
)

:: Tester la connexion à la base de données
echo.
echo 🔍 Test de connexion à la base de données...
node test-connexion-db.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ Échec de la connexion à la base de données
    echo.
    echo 🔧 Solutions possibles:
    echo 1. Vérifiez que PostgreSQL est démarré
    echo 2. Créez la base de données avec le script SQL
    echo 3. Vérifiez les informations de connexion dans backend\.env
    echo.
    echo 📋 Script SQL disponible: creer-base-donnees.sql
    echo.
    echo Voulez-vous continuer malgré l'erreur de base de données? (O/N)
    set /p choice=
    if /i "%choice%"=="N" (
        pause
        exit /b 1
    )
) else (
    echo ✅ Connexion à la base de données réussie
)

:: Démarrer le serveur backend
echo.
echo 🚀 Démarrage du serveur backend...
start "Serveur Backend BMS" cmd /k "cd backend && npm start"

:: Attendre un peu que le serveur démarre
timeout /t 3 /nobreak >nul

:: Démarrer le frontend
echo.
echo 🚀 Démarrage du frontend...
start "Frontend BMS" cmd /k "npm run dev"

echo.
echo ========================================
echo ✅ Application BMS démarrée avec succès !
echo ========================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 💡 Gardez ces fenêtres ouvertes pour l'application
echo 💡 Fermez-les pour arrêter l'application
echo.
pause
