# Script de déploiement Vercel pour le Frontend BMS
# Exécutez ce script depuis le dossier frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    DEPLOIEMENT VERCEL - FRONTEND BMS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification de l'environnement
Write-Host "[1/5] Vérification de l'environnement..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: package.json non trouvé. Assurez-vous d'être dans le dossier frontend." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

# Installation des dépendances
Write-Host "[2/5] Installation des dépendances..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "Échec de l'installation des dépendances"
    }
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

# Vérification de la configuration
Write-Host "[3/5] Vérification de la configuration..." -ForegroundColor Yellow
if (-not (Test-Path "vercel.json")) {
    Write-Host "ERREUR: vercel.json non trouvé. Vérifiez la configuration." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

# Build de l'application
Write-Host "[4/5] Build de l'application..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Échec du build. Vérifiez les erreurs TypeScript."
    }
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

# Déploiement sur Vercel
Write-Host "[5/5] Déploiement sur Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Green
Write-Host "1. Assurez-vous d'être connecté à Vercel (vercel login)" -ForegroundColor White
Write-Host "2. Exécutez: vercel --prod" -ForegroundColor White
Write-Host "3. Suivez les instructions à l'écran" -ForegroundColor White
Write-Host ""
Write-Host "Ou utilisez le dashboard Vercel:" -ForegroundColor Green
Write-Host "- Allez sur vercel.com" -ForegroundColor White
Write-Host "- Importez votre repository" -ForegroundColor White
Write-Host "- Configurez le dossier racine: frontend" -ForegroundColor White
Write-Host ""

# Vérification de Vercel CLI
Write-Host "Vérification de Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>$null
    if ($vercelVersion) {
        Write-Host "✅ Vercel CLI installé: $vercelVersion" -ForegroundColor Green
        Write-Host ""
        Write-Host "Voulez-vous déployer maintenant? (y/n)" -ForegroundColor Cyan
        $deploy = Read-Host
        if ($deploy -eq "y" -or $deploy -eq "Y") {
            Write-Host "Déploiement en cours..." -ForegroundColor Green
            vercel --prod
        }
    } else {
        Write-Host "⚠️  Vercel CLI non installé. Installez-le avec: npm install -g vercel" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Vercel CLI non installé. Installez-le avec: npm install -g vercel" -ForegroundColor Yellow
}

Read-Host "Appuyez sur Entrée pour continuer"
