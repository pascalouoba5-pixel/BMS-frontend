@echo off
echo ========================================
echo    DEPLOIEMENT VERCEL - FRONTEND BMS
echo ========================================
echo.

echo [1/5] Verification de l'environnement...
if not exist "package.json" (
    echo ERREUR: package.json non trouve. Assurez-vous d'etre dans le dossier frontend.
    pause
    exit /b 1
)

echo [2/5] Installation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo ERREUR: Echec de l'installation des dependances.
    pause
    exit /b 1
)

echo [3/5] Verification de la configuration...
if not exist "vercel.json" (
    echo ERREUR: vercel.json non trouve. Verifiez la configuration.
    pause
    exit /b 1
)

echo [4/5] Build de l'application...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Echec du build. Verifiez les erreurs TypeScript.
    pause
    exit /b 1
)

echo [5/5] Deploiement sur Vercel...
echo.
echo Instructions:
echo 1. Assurez-vous d'etre connecte a Vercel (vercel login)
echo 2. Executez: vercel --prod
echo 3. Suivez les instructions a l'ecran
echo.
echo Ou utilisez le dashboard Vercel:
echo - Allez sur vercel.com
echo - Importez votre repository
echo - Configurez le dossier racine: frontend
echo.

pause
