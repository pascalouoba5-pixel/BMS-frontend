# Script PowerShell pour tester le frontend BMS et l'API
Write-Host "🧪 Test du Frontend BMS et de l'API..." -ForegroundColor Green
Write-Host "🌐 Backend: https://bms-backend-9k8n.onrender.com" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Répertoire frontend détecté" -ForegroundColor Green

# Vérifier les dépendances
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

# Vérifier la configuration
Write-Host ""
Write-Host "🔧 Vérification de la configuration..." -ForegroundColor Yellow

# Vérifier les fichiers de configuration
$configFiles = @(
    "next.config.ts",
    "config/api.ts",
    "services/api.ts",
    "hooks/useApi.ts"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

# Vérifier les composants
Write-Host ""
Write-Host "🧩 Vérification des composants..." -ForegroundColor Yellow

$components = @(
    "components/ApiStatusChecker.tsx",
    "components/HomeButton.tsx",
    "app/login/page.tsx",
    "app/api-test/page.tsx"
)

foreach ($component in $components) {
    if (Test-Path $component) {
        Write-Host "✅ $component" -ForegroundColor Green
    } else {
        Write-Host "❌ $component manquant" -ForegroundColor Red
    }
}

# Vérifier les variables d'environnement
Write-Host ""
Write-Host "🌍 Vérification des variables d'environnement..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local présent" -ForegroundColor Green
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "NEXT_PUBLIC_API_URL") {
            Write-Host "   $($_.Trim())" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠️  .env.local manquant - création recommandée" -ForegroundColor Yellow
}

if (Test-Path ".env.production") {
    Write-Host "✅ .env.production présent" -ForegroundColor Green
    Get-Content ".env.production" | ForEach-Object {
        if ($_ -match "NEXT_PUBLIC_API_URL") {
            Write-Host "   $($_.Trim())" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠️  .env.production manquant - création recommandée" -ForegroundColor Yellow
}

# Test de l'API backend
Write-Host ""
Write-Host "🔍 Test de l'API backend..." -ForegroundColor Yellow

try {
    Write-Host "📡 Test de /api/health..." -ForegroundColor White
    $healthResponse = Invoke-RestMethod -Uri "https://bms-backend-9k8n.onrender.com/api/health" -Method Get
    Write-Host "✅ Health check OK: $($healthResponse.message)" -ForegroundColor Green
    Write-Host "   Port: $($healthResponse.port)" -ForegroundColor Cyan
    Write-Host "   Environment: $($healthResponse.environment)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health check échoué: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "📡 Test de /api/auth/test..." -ForegroundColor White
    $authTestResponse = Invoke-RestMethod -Uri "https://bms-backend-9k8n.onrender.com/api/auth/test" -Method Get
    Write-Host "✅ Auth test OK: $($authTestResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Auth test échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test de la route login
Write-Host ""
Write-Host "🔐 Test de la route login..." -ForegroundColor Yellow

try {
    $loginData = @{
        email = "test@bms.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "https://bms-backend-9k8n.onrender.com/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login OK: $($loginResponse.message)" -ForegroundColor Green
    Write-Host "   Utilisateur: $($loginResponse.user.email)" -ForegroundColor Cyan
    Write-Host "   Token: $($loginResponse.token.Substring(0, [Math]::Min(20, $loginResponse.token.Length)))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Instructions de démarrage
Write-Host ""
Write-Host "🚀 Instructions de démarrage:" -ForegroundColor Green
Write-Host "1. Démarrer le frontend: npm run dev" -ForegroundColor White
Write-Host "2. Ouvrir: http://localhost:3000" -ForegroundColor White
Write-Host "3. Tester la connexion: http://localhost:3000/login" -ForegroundColor White
Write-Host "4. Tester l'API: http://localhost:3000/api-test" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Configuration recommandée:" -ForegroundColor Yellow
Write-Host "Créer .env.local avec:" -ForegroundColor White
Write-Host "NEXT_PUBLIC_API_URL=http://localhost:10000" -ForegroundColor Cyan

Write-Host ""
Write-Host "🌐 Pour la production Vercel:" -ForegroundColor Yellow
Write-Host "Créer .env.production avec:" -ForegroundColor White
Write-Host "NEXT_PUBLIC_API_URL=https://bms-backend-9k8n.onrender.com" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎯 Tests disponibles:" -ForegroundColor Green
Write-Host "- Page de connexion: /login" -ForegroundColor White
Write-Host "- Test de l'API: /api-test" -ForegroundColor White
Write-Host "- Compte de test: test@bms.com / password123" -ForegroundColor White

# Garder la fenêtre ouverte
Read-Host "Appuyez sur Entrée pour fermer..."
