# Script PowerShell pour vérifier le projet React BMS localement
Write-Host "🔍 Vérification locale du projet React BMS..." -ForegroundColor Green
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Répertoire frontend détecté" -ForegroundColor Green

# Vérifier la configuration
Write-Host ""
Write-Host "🔧 Vérification de la configuration..." -ForegroundColor Yellow

$configFiles = @(
    "vercel.json",
    "package.json",
    "src/services/api.js"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
        exit 1
    }
}

# Vérifier les dépendances
Write-Host ""
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dépendances non installées. Installation en cours..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dépendances déjà installées" -ForegroundColor Green
}

# Vérifier les variables d'environnement
Write-Host ""
Write-Host "🌍 Vérification des variables d'environnement..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local présent" -ForegroundColor Green
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "REACT_APP_API_URL") {
            Write-Host "   $($_.Trim())" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠️  .env.local manquant - création recommandée" -ForegroundColor Yellow
    Write-Host "   Créez .env.local avec:" -ForegroundColor White
    Write-Host "   REACT_APP_API_URL=https://amd-back-parc.onrender.com" -ForegroundColor Cyan
}

# Test de build
Write-Host ""
Write-Host "🏗️  Test de build..." -ForegroundColor Yellow

try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build réussi" -ForegroundColor Green
    } else {
        Write-Host "❌ Build échoué" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors du build: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Vérifier le dossier build
Write-Host ""
Write-Host "📁 Vérification du dossier build..." -ForegroundColor Yellow

if (Test-Path "build") {
    $buildFiles = Get-ChildItem -Path "build" -Recurse | Measure-Object
    Write-Host "✅ Dossier build créé avec $($buildFiles.Count) fichiers" -ForegroundColor Green
    
    if (Test-Path "build/index.html") {
        Write-Host "✅ index.html présent" -ForegroundColor Green
    } else {
        Write-Host "❌ index.html manquant" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Dossier build non créé" -ForegroundColor Red
    exit 1
}

# Test de démarrage local
Write-Host ""
Write-Host "🚀 Test de démarrage local..." -ForegroundColor Yellow
Write-Host "   Le projet va démarrer dans 3 secondes..." -ForegroundColor White
Start-Sleep -Seconds 3

try {
    Start-Process "npm" -ArgumentList "start" -NoNewWindow
    Write-Host "✅ Projet démarré localement" -ForegroundColor Green
    Write-Host "   Ouvrez: http://localhost:3000" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors du démarrage: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Vérification locale terminée !" -ForegroundColor Green
Write-Host ""

# Instructions pour la suite
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Tester l'application localement" -ForegroundColor White
Write-Host "2. Pousser sur GitHub" -ForegroundColor White
Write-Host "3. Connecter à Vercel" -ForegroundColor White
Write-Host "4. Déployer" -ForegroundColor White

# Garder la fenêtre ouverte
Read-Host "Appuyez sur Entrée pour fermer..."
