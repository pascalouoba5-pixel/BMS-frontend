# Script pour vérifier le statut ESLint du projet
Write-Host "🔍 Vérification du statut ESLint..." -ForegroundColor Green

# Vérifier si ESLint est installé
if (-not (Test-Path "node_modules\.bin\eslint.cmd")) {
    Write-Host "❌ ESLint n'est pas installé. Installation en cours..." -ForegroundColor Red
    npm install
    exit 1
}

# Fonction pour analyser un fichier et identifier les erreurs courantes
function Analyze-File {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    $issues = @()
    
    # Vérifier les apostrophes non échappés
    if ($content -match "([^\\])'([^']*?)'([^\\])") {
        $issues += "Apostrophes non échappés détectés"
    }
    
    # Vérifier les balises img
    if ($content -match "<img") {
        $issues += "Balises img détectées (doivent être remplacées par Image)"
    }
    
    # Vérifier les hooks useEffect sans dépendances
    if ($content -match "useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*\},\s*\[\s*\]\s*\)") {
        $issues += "useEffect sans dépendances détecté"
    }
    
    # Vérifier les hooks useCallback sans dépendances
    if ($content -match "useCallback\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*\},\s*\[\s*\]\s*\)") {
        $issues += "useCallback sans dépendances détecté"
    }
    
    return $issues
}

# Trouver tous les fichiers TypeScript/React
$tsxFiles = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.FullName -notmatch "node_modules|\.next|out" }

Write-Host "📁 Analyse de $($tsxFiles.Count) fichiers TypeScript/React" -ForegroundColor Blue

$totalIssues = 0
$filesWithIssues = 0

foreach ($file in $tsxFiles) {
    $issues = Analyze-File $file.FullName
    
    if ($issues.Count -gt 0) {
        $filesWithIssues++
        $totalIssues += $issues.Count
        
        Write-Host "`n⚠️  $($file.Name) :" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "   - $issue" -ForegroundColor Red
        }
    }
}

Write-Host "`n📊 Résumé de l'analyse :" -ForegroundColor Cyan
Write-Host "   Fichiers analysés : $($tsxFiles.Count)" -ForegroundColor White
Write-Host "   Fichiers avec problèmes : $filesWithIssues" -ForegroundColor White
Write-Host "   Total des problèmes : $totalIssues" -ForegroundColor White

if ($totalIssues -eq 0) {
    Write-Host "`n🎉 Aucun problème détecté ! Le projet est prêt pour le build." -ForegroundColor Green
} else {
    Write-Host "`n🔧 Problèmes détectés. Exécutez le script de correction automatique ou corrigez manuellement." -ForegroundColor Yellow
}

# Exécuter ESLint pour une vérification complète
Write-Host "`n🔍 Exécution d'ESLint pour une vérification complète..." -ForegroundColor Blue
& "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --format=compact --max-warnings=0
