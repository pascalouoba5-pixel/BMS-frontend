# Script de vérification rapide des erreurs ESLint
Write-Host "🔍 Vérification rapide des erreurs ESLint..." -ForegroundColor Green

# Vérifier si ESLint est installé
if (-not (Test-Path "node_modules\.bin\eslint.cmd")) {
    Write-Host "❌ ESLint n'est pas installé. Installation en cours..." -ForegroundColor Red
    npm install
}

# Exécuter ESLint sur tout le projet avec format compact
Write-Host "`n🔍 Exécution d'ESLint sur tout le projet..." -ForegroundColor Blue
$result = & "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --format=compact --max-warnings=0 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Aucune erreur ESLint détectée !" -ForegroundColor Green
    Write-Host "✅ Votre projet est prêt pour le build !" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erreurs ESLint détectées :" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    
    # Compter les erreurs par type
    $errorCount = ($result -split "`n" | Where-Object { $_ -match "Error:" }).Count
    $warningCount = ($result -split "`n" | Where-Object { $_ -match "Warning:" }).Count
    
    Write-Host "`n📊 Résumé des erreurs :" -ForegroundColor Yellow
    Write-Host "   ❌ Erreurs : $errorCount" -ForegroundColor Red
    Write-Host "   ⚠️  Avertissements : $warningCount" -ForegroundColor Yellow
    
    Write-Host "`n💡 Pour corriger automatiquement toutes les erreurs, exécutez :" -ForegroundColor Cyan
    Write-Host "   .\fix-all-eslint-errors.ps1" -ForegroundColor White
}

Write-Host "`n✅ Vérification terminée !" -ForegroundColor Green
