@echo off
echo ========================================
echo    DEMARRAGE DU FRONTEND BMS
echo ========================================
echo.

echo [1/3] Verification de la configuration...
if not exist ".env.local" (
    echo ❌ Fichier .env.local manquant
    echo 💡 Creation d'un fichier de configuration temporaire...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env.local
    echo NODE_ENV=development >> .env.local
    echo ✅ Fichier .env.local cree
) else (
    echo ✅ Fichier .env.local present
)

echo.
echo [2/3] Installation des dependances...
if not exist "node_modules" (
    echo 📦 Installation des dependances...
    npm install
) else (
    echo ✅ Dependances deja installees
)

echo.
echo [3/3] Demarrage du serveur frontend...
echo 🚀 Demarrage sur le port 3000...
echo 💡 Le frontend sera accessible sur: http://localhost:3000
echo 💡 Appuyez sur Ctrl+C pour arreter le serveur
echo.

npm run dev
