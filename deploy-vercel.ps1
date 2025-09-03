# Script PowerShell pour déployer le frontend BMS sur Vercel
Write-Host "🚀 Déploiement du Frontend BMS sur Vercel..." -ForegroundColor Green
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Répertoire frontend détecté" -ForegroundColor Green

# Vérifier que Vercel CLI est installé
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel CLI détecté: $vercelVersion" -ForegroundColor Green
    } else {
        throw "Vercel CLI non trouvé"
    }
} catch {
    Write-Host "❌ Vercel CLI non installé. Installation en cours..." -ForegroundColor Red
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation de Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

# Vérifier la configuration
Write-Host ""
Write-Host "🔧 Vérification de la configuration..." -ForegroundColor Yellow

$configFiles = @(
    "vercel.json",
    "next.config.ts",
    "package.json"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
        exit 1
    }
}

# Vérifier les variables d'environnement
Write-Host ""
Write-Host "🌍 Configuration des variables d'environnement..." -ForegroundColor Yellow

$envVars = @{
    "NEXT_PUBLIC_API_URL" = "https://bms-backend-9k8n.onrender.com"
    "NEXT_PUBLIC_APP_NAME" = "BMS Frontend"
    "NODE_ENV" = "production"
}

foreach ($key in $envVars.Keys) {
    Write-Host "   $key = $($envVars[$key])" -ForegroundColor Cyan
}

# Nettoyer le projet
Write-Host ""
Write-Host "🧹 Nettoyage du projet..." -ForegroundColor Yellow

if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "✅ Dossier .next supprimé" -ForegroundColor Green
}

if (Test-Path "node_modules") {
    Write-Host "⚠️  node_modules détecté - sera géré par Vercel" -ForegroundColor Yellow
}

# Instructions de déploiement
Write-Host ""
Write-Host "🚀 Instructions de déploiement:" -ForegroundColor Green
Write-Host "1. Se connecter à Vercel: vercel login" -ForegroundColor White
Write-Host "2. Déployer: vercel --prod" -ForegroundColor White
Write-Host "3. Ou déployer avec configuration: vercel --prod --yes" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Configuration recommandée lors du déploiement:" -ForegroundColor Yellow
Write-Host "- Framework: Next.js" -ForegroundColor White
Write-Host "- Build Command: npm run build" -ForegroundColor White
Write-Host "- Output Directory: .next" -ForegroundColor White
Write-Host "- Install Command: npm install" -ForegroundColor White

Write-Host ""
Write-Host "🌍 Variables d'environnement à configurer sur Vercel:" -ForegroundColor Yellow
Write-Host "- NEXT_PUBLIC_API_URL = https://bms-backend-9k8n.onrender.com" -ForegroundColor Cyan
Write-Host "- NODE_ENV = production" -ForegroundColor Cyan

# Démarrer le déploiement
Write-Host ""
Write-Host "🎯 Voulez-vous démarrer le déploiement maintenant ? (O/N)" -ForegroundColor Green
$response = Read-Host

if ($response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🚀 Démarrage du déploiement..." -ForegroundColor Green
    
    try {
        # Vérifier la connexion
        Write-Host "📡 Vérification de la connexion Vercel..." -ForegroundColor Yellow
        vercel whoami
        
        # Déployer
        Write-Host "📤 Déploiement en cours..." -ForegroundColor Yellow
        vercel --prod --yes
        
    } catch {
        Write-Host "❌ Erreur lors du déploiement: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Essayez de vous connecter d'abord: vercel login" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Déploiement annulé. Exécutez manuellement:" -ForegroundColor Yellow
    Write-Host "   vercel --prod" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Script terminé !" -ForegroundColor Green

# Garder la fenêtre ouverte
Read-Host "Appuyez sur Entrée pour fermer..."
