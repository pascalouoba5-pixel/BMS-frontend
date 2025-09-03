Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    DEMARRAGE DU FRONTEND BMS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Verification de la configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Fichier .env.local manquant" -ForegroundColor Red
    Write-Host "💡 Creation d'un fichier de configuration temporaire..." -ForegroundColor Yellow
    
    @"
# Configuration de l'API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Configuration de l'environnement
NODE_ENV=development

# Configuration Next.js
NEXT_PUBLIC_APP_NAME=BMS
NEXT_PUBLIC_APP_VERSION=1.0.0
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✅ Fichier .env.local cree" -ForegroundColor Green
} else {
    Write-Host "✅ Fichier .env.local present" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] Installation des dependances..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dependances..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependances deja installees" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/3] Demarrage du serveur frontend..." -ForegroundColor Yellow
Write-Host "🚀 Demarrage sur le port 3000..." -ForegroundColor Yellow
Write-Host "💡 Le frontend sera accessible sur: http://localhost:3000" -ForegroundColor Cyan
Write-Host "💡 Appuyez sur Ctrl+C pour arreter le serveur" -ForegroundColor Cyan
Write-Host ""

npm run dev
