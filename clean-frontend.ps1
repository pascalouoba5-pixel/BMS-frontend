# Script PowerShell pour nettoyer le frontend avant l'import Git
Write-Host "🧹 Nettoyage du frontend BMS pour Git..." -ForegroundColor Green
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Répertoire frontend détecté" -ForegroundColor Green

# Sauvegarder les fichiers importants
Write-Host "📁 Sauvegarde des fichiers importants..." -ForegroundColor Yellow

$importantFiles = @(
    ".env.example",
    "package.json",
    "next.config.ts",
    "tailwind.config.js",
    "tsconfig.json"
)

foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file sauvegardé" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $file manquant" -ForegroundColor Yellow
    }
}

# Supprimer les dossiers volumineux
Write-Host ""
Write-Host "🗑️  Suppression des dossiers volumineux..." -ForegroundColor Yellow

$foldersToRemove = @(
    "node_modules",
    ".next",
    "out",
    "build",
    "dist",
    ".vercel",
    ".cache",
    "coverage"
)

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        try {
            Remove-Item -Path $folder -Recurse -Force
            Write-Host "✅ $folder supprimé" -ForegroundColor Green
        } catch {
            Write-Host "❌ Erreur lors de la suppression de $folder" -ForegroundColor Red
        }
    } else {
        Write-Host "ℹ️  $folder n'existe pas" -ForegroundColor Cyan
    }
}

# Supprimer les fichiers temporaires
Write-Host ""
Write-Host "🗑️  Suppression des fichiers temporaires..." -ForegroundColor Yellow

$filesToRemove = @(
    "*.log",
    "*.tmp",
    "*.temp",
    "*.cache",
    "*.tsbuildinfo",
    ".eslintcache",
    ".stylelintcache",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
)

foreach ($pattern in $filesToRemove) {
    try {
        $files = Get-ChildItem -Path . -Name $pattern -Recurse -ErrorAction SilentlyContinue
        if ($files) {
            foreach ($file in $files) {
                Remove-Item -Path $file -Force -ErrorAction SilentlyContinue
            }
            Write-Host "✅ Fichiers $pattern supprimés" -ForegroundColor Green
        }
    } catch {
        Write-Host "ℹ️  Aucun fichier $pattern trouvé" -ForegroundColor Cyan
    }
}

# Supprimer les fichiers d'environnement (sauf .env.example)
Write-Host ""
Write-Host "🗑️  Suppression des fichiers d'environnement..." -ForegroundColor Yellow

$envFiles = @(
    ".env",
    ".env.local",
    ".env.development.local",
    ".env.test.local",
    ".env.production.local"
)

foreach ($file in $envFiles) {
    if (Test-Path $file) {
        try {
            Remove-Item -Path $file -Force
            Write-Host "✅ $file supprimé" -ForegroundColor Green
        } catch {
            Write-Host "❌ Erreur lors de la suppression de $file" -ForegroundColor Red
        }
    }
}

# Vérifier la taille du répertoire
Write-Host ""
Write-Host "📊 Vérification de la taille du répertoire..." -ForegroundColor Yellow

try {
    $size = (Get-ChildItem -Path . -Recurse -Force | Measure-Object -Property Length -Sum).Sum
    $sizeMB = [math]::Round($size / 1MB, 2)
    Write-Host "📁 Taille totale: $sizeMB MB" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Impossible de calculer la taille" -ForegroundColor Yellow
}

# Compter le nombre de fichiers
try {
    $fileCount = (Get-ChildItem -Path . -Recurse -Force | Measure-Object).Count
    Write-Host "📄 Nombre de fichiers: $fileCount" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Impossible de compter les fichiers" -ForegroundColor Yellow
}

# Instructions pour Git
Write-Host ""
Write-Host "🚀 Instructions pour Git:" -ForegroundColor Green
Write-Host "1. Initialiser Git: git init" -ForegroundColor White
Write-Host "2. Ajouter les fichiers: git add ." -ForegroundColor White
Write-Host "3. Premier commit: git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "4. Ajouter l'origine: git remote add origin <votre-repo>" -ForegroundColor White
Write-Host "5. Pousser: git push -u origin main" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Après l'import Git:" -ForegroundColor Yellow
Write-Host "1. Réinstaller les dépendances: npm install" -ForegroundColor White
Write-Host "2. Recréer les fichiers .env si nécessaire" -ForegroundColor White
Write-Host "3. Démarrer: npm run dev" -ForegroundColor White

Write-Host ""
Write-Host "✅ Nettoyage terminé ! Le frontend est maintenant prêt pour Git." -ForegroundColor Green

# Garder la fenêtre ouverte
Read-Host "Appuyez sur Entrée pour fermer..."
