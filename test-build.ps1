# Script de test de build pour vérifier que le projet compile sans erreurs ESLint
Write-Host "🧪 Test de build du projet BMS Frontend..." -ForegroundColor Green

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur : Ce script doit être exécuté dans le dossier frontend" -ForegroundColor Red
    exit 1
}

# Vérifier que les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
}

# Étape 1 : Vérification ESLint
Write-Host "`n🔍 Étape 1 : Vérification ESLint..." -ForegroundColor Blue
$eslintResult = & "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --format=compact --max-warnings=0 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ESLint : Aucune erreur détectée" -ForegroundColor Green
} else {
    Write-Host "❌ ESLint : Erreurs détectées" -ForegroundColor Red
    Write-Host $eslintResult -ForegroundColor Red
    Write-Host "`n💡 Exécutez d'abord le script de correction ESLint : .\fix-eslint-errors.ps1" -ForegroundColor Yellow
    exit 1
}

# Étape 2 : Vérification TypeScript
Write-Host "`n🔍 Étape 2 : Vérification TypeScript..." -ForegroundColor Blue
$tscResult = & "node_modules\.bin\tsc.cmd" --noEmit 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript : Aucune erreur de type détectée" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript : Erreurs de type détectées" -ForegroundColor Red
    Write-Host $tscResult -ForegroundColor Red
    exit 1
}

# Étape 3 : Test de build
Write-Host "`n🔍 Étape 3 : Test de build..." -ForegroundColor Blue
Write-Host "⏳ Construction du projet (cela peut prendre quelques minutes)..." -ForegroundColor Yellow

$buildResult = & npm run build 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build : Projet construit avec succès !" -ForegroundColor Green
    
    # Vérifier que le dossier .next a été créé
    if (Test-Path ".next") {
        Write-Host "✅ Dossier .next créé avec succès" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Dossier .next non trouvé" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ Build : Échec de la construction" -ForegroundColor Red
    Write-Host $buildResult -ForegroundColor Red
    exit 1
}

# Étape 4 : Vérification finale
Write-Host "`n🔍 Étape 4 : Vérification finale..." -ForegroundColor Blue

# Vérifier la taille du build
if (Test-Path ".next") {
    $buildSize = (Get-ChildItem ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "📊 Taille du build : $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
}

# Vérifier les fichiers de sortie
$outputFiles = @(
    ".next",
    "package.json",
    "next.config.ts",
    "tailwind.config.js"
)

$missingFiles = @()
foreach ($file in $outputFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file : Présent" -ForegroundColor Green
    } else {
        Write-Host "❌ $file : Manquant" -ForegroundColor Red
        $missingFiles += $file
    }
}

# Résumé final
Write-Host "`n🎉 Résumé du test de build :" -ForegroundColor Green
Write-Host "   ✅ ESLint : Passé" -ForegroundColor Green
Write-Host "   ✅ TypeScript : Passé" -ForegroundColor Green
Write-Host "   ✅ Build : Passé" -ForegroundColor Green

if ($missingFiles.Count -gt 0) {
    Write-Host "   ⚠️  Fichiers manquants : $($missingFiles.Count)" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Tous les fichiers requis sont présents" -ForegroundColor Green
}

Write-Host "`n🚀 Le projet est prêt pour la production !" -ForegroundColor Green
Write-Host "💡 Vous pouvez maintenant déployer ou démarrer le serveur de production avec :" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor White

# Nettoyage optionnel
Write-Host "`n🧹 Nettoyage du dossier .next ? (y/n)" -ForegroundColor Yellow
$cleanup = Read-Host

if ($cleanup -eq "y" -or $cleanup -eq "Y") {
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-Host "✅ Dossier .next supprimé" -ForegroundColor Green
    }
}
