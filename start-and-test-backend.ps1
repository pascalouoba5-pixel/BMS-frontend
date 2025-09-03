Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    DEMARRAGE ET TEST DU BACKEND BMS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Verification de l'environnement..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ Fichier .env manquant dans le dossier backend" -ForegroundColor Red
    Write-Host "💡 Copier env.example vers .env et configurer les variables" -ForegroundColor Yellow
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✅ Fichier .env cree" -ForegroundColor Green
} else {
    Write-Host "✅ Fichier .env present" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/4] Installation des dependances..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dependances..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependances deja installees" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/4] Test de la base de donnees..." -ForegroundColor Yellow
Write-Host "🗄️ Test de connexion a PostgreSQL..." -ForegroundColor Yellow

try {
    node -e "
    const { testConnection } = require('./config/database.js');
    testConnection().then(success => {
        if (success) {
            console.log('SUCCESS');
            process.exit(0);
        } else {
            console.log('FAILED');
            process.exit(1);
        }
    }).catch(err => {
        console.log('ERROR: ' + err.message);
        process.exit(1);
    });
    "
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de donnees accessible" -ForegroundColor Green
    } else {
        throw "Test de connexion echoue"
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERREUR: Impossible de se connecter a la base de donnees" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUTIONS:" -ForegroundColor Yellow
    Write-Host "1. Verifier que PostgreSQL est demarre" -ForegroundColor White
    Write-Host "2. Verifier les parametres dans backend\.env" -ForegroundColor White
    Write-Host "3. Creer la base de donnees: CREATE DATABASE bms_db;" -ForegroundColor White
    Write-Host "4. Creer l'utilisateur: CREATE USER bms_user WITH PASSWORD 'motdepasse_bms';" -ForegroundColor White
    Write-Host "5. Donner les droits: GRANT ALL PRIVILEGES ON DATABASE bms_db TO bms_user;" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entree pour continuer"
    exit 1
}

Write-Host ""
Write-Host "[4/4] Demarrage du serveur backend..." -ForegroundColor Yellow
Write-Host "🚀 Demarrage du serveur sur le port 5000..." -ForegroundColor Yellow
Write-Host "💡 Le serveur sera accessible sur: http://localhost:5000" -ForegroundColor Cyan
Write-Host "💡 Appuyez sur Ctrl+C pour arreter le serveur" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal

Write-Host ""
Write-Host "⏳ Attente du demarrage du serveur..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🧪 Test de l'API..." -ForegroundColor Yellow
node test-api-dashboard.js

Write-Host ""
Write-Host "✅ Backend demarre et teste avec succes !" -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Read-Host "Appuyez sur Entree pour continuer"
