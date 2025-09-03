# Script de test de build rapide
Write-Host "🚀 Test de build rapide du projet BMS Frontend..." -ForegroundColor Green

# Vérifier les dépendances
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ Dependencies non installées. Installation en cours..." -ForegroundColor Red
    npm install
}

# Vérifier ESLint
if (-not (Test-Path "node_modules\.bin\eslint.cmd")) {
    Write-Host "❌ ESLint non installé. Installation en cours..." -ForegroundColor Red
    npm install
}

Write-Host "`n🔍 Étape 1 : Vérification ESLint..." -ForegroundColor Blue
$eslintResult = & "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --format=compact --max-warnings=0 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ESLint : Aucune erreur détectée" -ForegroundColor Green
} else {
    Write-Host "❌ ESLint : Erreurs détectées" -ForegroundColor Red
    Write-Host $eslintResult -ForegroundColor Red
    
    Write-Host "`n💡 Pour corriger automatiquement ces erreurs, exécutez :" -ForegroundColor Cyan
    Write-Host "   .\fix-remaining-eslint-errors.ps1" -ForegroundColor White
    
    exit 1
}

Write-Host "`n🔍 Étape 2 : Vérification TypeScript..." -ForegroundColor Blue
$tscResult = & "node_modules\.bin\tsc.cmd" --noEmit 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript : Aucune erreur détectée" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript : Erreurs détectées" -ForegroundColor Red
    Write-Host $tscResult -ForegroundColor Red
    exit 1
}

Write-Host "`n🔍 Étape 3 : Test de build Next.js..." -ForegroundColor Blue
$buildResult = & "node_modules\.bin\next.cmd" build 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build Next.js : Succès !" -ForegroundColor Green
} else {
    Write-Host "❌ Build Next.js : Échec" -ForegroundColor Red
    Write-Host $buildResult -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Tous les tests sont passés avec succès !" -ForegroundColor Green
Write-Host "✅ Votre projet est prêt pour la production !" -ForegroundColor Green
Write-Host "🚀 Vous pouvez maintenant déployer sans problème !" -ForegroundColor Green
