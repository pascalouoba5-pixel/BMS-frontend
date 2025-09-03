# Script PowerShell pour déployer le projet React BMS sur GitHub
Write-Host "🚀 Déploiement GitHub du projet React BMS..." -ForegroundColor Green
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Répertoire frontend détecté" -ForegroundColor Green

# Vérifier Git
Write-Host ""
Write-Host "🔧 Vérification de Git..." -ForegroundColor Yellow

try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git non trouvé"
    }
} catch {
    Write-Host "❌ Git non installé. Veuillez l'installer depuis git-scm.com" -ForegroundColor Red
    exit 1
}

# Vérifier le statut Git
Write-Host ""
Write-Host "📊 Statut Git..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
    
    # Vérifier les modifications
    $status = git status --porcelain
    if ($status) {
        Write-Host "📝 Modifications détectées:" -ForegroundColor Yellow
        $status | ForEach-Object { Write-Host "   $_" -ForegroundColor Cyan }
    } else {
        Write-Host "✅ Aucune modification" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Repository Git non initialisé. Initialisation..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
}

# Créer .gitignore si nécessaire
Write-Host ""
Write-Host "📝 Vérification du .gitignore..." -ForegroundColor Yellow

if (-not (Test-Path ".gitignore")) {
    Write-Host "⚠️  .gitignore manquant. Création..." -ForegroundColor Yellow
    
    @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
build/
dist/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs

# Cache
.cache
.eslintcache

# Test coverage
coverage/
.nyc_output

# Temporary files
*.tmp
*.temp
tmp/
temp/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    
    Write-Host "✅ .gitignore créé" -ForegroundColor Green
} else {
    Write-Host "✅ .gitignore présent" -ForegroundColor Green
}

# Ajouter les fichiers
Write-Host ""
Write-Host "📁 Ajout des fichiers..." -ForegroundColor Yellow

git add .
Write-Host "✅ Fichiers ajoutés au staging" -ForegroundColor Green

# Vérifier les fichiers à commiter
$staged = git diff --cached --name-only
if ($staged) {
    Write-Host "📋 Fichiers à commiter:" -ForegroundColor Yellow
    $staged | ForEach-Object { Write-Host "   $_" -ForegroundColor Cyan }
} else {
    Write-Host "⚠️  Aucun fichier à commiter" -ForegroundColor Yellow
}

# Demander le message de commit
Write-Host ""
Write-Host "💬 Message de commit:" -ForegroundColor Yellow
$commitMessage = Read-Host "Entrez le message de commit (ou appuyez sur Entrée pour utiliser le message par défaut)"

if (-not $commitMessage) {
    $commitMessage = "feat: Initial commit - Frontend React BMS avec configuration Vercel"
}

# Commiter
Write-Host ""
Write-Host "💾 Commit des modifications..." -ForegroundColor Yellow

try {
    git commit -m $commitMessage
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Commit créé avec succès" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors du commit" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors du commit: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Vérifier l'origine
Write-Host ""
Write-Host "🌐 Vérification de l'origine..." -ForegroundColor Yellow

$origin = git remote get-url origin 2>$null
if ($origin) {
    Write-Host "✅ Origine configurée: $origin" -ForegroundColor Green
} else {
    Write-Host "⚠️  Aucune origine configurée" -ForegroundColor Yellow
    Write-Host "   Configurez l'origine avec:" -ForegroundColor White
    Write-Host "   git remote add origin <URL_DE_VOTRE_REPO>" -ForegroundColor Cyan
}

# Instructions pour la suite
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Si pas d'origine: git remote add origin <URL_DE_VOTRE_REPO>" -ForegroundColor White
Write-Host "2. Pousser: git push -u origin main" -ForegroundColor White
Write-Host "3. Ou créer une branche: git checkout -b main" -ForegroundColor White
Write-Host "4. Pousser: git push -u origin main" -ForegroundColor White

# Demander si l'utilisateur veut pousser maintenant
Write-Host ""
Write-Host "🎯 Voulez-vous pousser sur GitHub maintenant ? (O/N)" -ForegroundColor Green
$response = Read-Host

if ($response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
    if ($origin) {
        Write-Host ""
        Write-Host "🚀 Poussée vers GitHub..." -ForegroundColor Green
        
        try {
            # Vérifier la branche
            $currentBranch = git branch --show-current
            if (-not $currentBranch) {
                Write-Host "⚠️  Aucune branche active. Création de la branche main..." -ForegroundColor Yellow
                git checkout -b main
            }
            
            # Pousser
            git push -u origin main
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Projet poussé avec succès sur GitHub !" -ForegroundColor Green
            } else {
                Write-Host "❌ Erreur lors de la poussée" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Erreur lors de la poussée: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Impossible de pousser sans origine configurée" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Poussée annulée. Exécutez manuellement:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Script terminé !" -ForegroundColor Green

# Garder la fenêtre ouverte
Read-Host "Appuyez sur Entrée pour fermer..."
