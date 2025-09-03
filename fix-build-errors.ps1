# Script PowerShell pour corriger les erreurs de build
Write-Host "🔧 Correction des erreurs de build BMS..." -ForegroundColor Green
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Répertoire frontend détecté" -ForegroundColor Green

# 1. Installer les dépendances manquantes
Write-Host ""
Write-Host "📦 Installation des dépendances manquantes..." -ForegroundColor Yellow

try {
    Write-Host "   Installation de recharts..." -ForegroundColor White
    npm install recharts@^2.12.0
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ recharts installé avec succès" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de l'installation de recharts" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors de l'installation: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Vérifier et corriger les erreurs de syntaxe
Write-Host ""
Write-Host "🔍 Vérification des erreurs de syntaxe..." -ForegroundColor Yellow

# Vérifier le fichier login/page.tsx
$loginFile = "app/login/page.tsx"
if (Test-Path $loginFile) {
    $content = Get-Content $loginFile -Raw
    $lines = $content.Split("`n")
    
    # Vérifier les accolades en trop
    $openBraces = ($content | Select-String -Pattern "{" -AllMatches).Matches.Count
    $closeBraces = ($content | Select-String -Pattern "}" -AllMatches).Matches.Count
    
    if ($closeBraces -gt $openBraces) {
        Write-Host "⚠️  Accolades fermantes en trop détectées dans $loginFile" -ForegroundColor Yellow
        
        # Corriger automatiquement
        $correctedContent = $content -replace "}\s*}\s*$", "}"
        Set-Content -Path $loginFile -Value $correctedContent -Encoding UTF8
        Write-Host "✅ Correction automatique appliquée" -ForegroundColor Green
    } else {
        Write-Host "✅ $loginFile - Syntaxe correcte" -ForegroundColor Green
    }
} else {
    Write-Host "❌ $loginFile non trouvé" -ForegroundColor Red
}

# 3. Vérifier le fichier performance/page.tsx
$performanceFile = "app/performance/page.tsx"
if (Test-Path $performanceFile) {
    $content = Get-Content $performanceFile -Raw
    
    # Vérifier l'import de recharts
    if ($content -match "from 'recharts'") {
        Write-Host "✅ $performanceFile - Import recharts correct" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $performanceFile - Import recharts manquant" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ $performanceFile non trouvé" -ForegroundColor Red
}

# 4. Nettoyer le cache
Write-Host ""
Write-Host "🧹 Nettoyage du cache..." -ForegroundColor Yellow

$cacheFolders = @(".next", "node_modules/.cache", ".eslintcache")
foreach ($folder in $cacheFolders) {
    if (Test-Path $folder) {
        try {
            Remove-Item -Path $folder -Recurse -Force
            Write-Host "✅ $folder supprimé" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Impossible de supprimer $folder" -ForegroundColor Yellow
        }
    }
}

# 5. Test de build
Write-Host ""
Write-Host "🏗️  Test de build..." -ForegroundColor Yellow

try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build réussi !" -ForegroundColor Green
    } else {
        Write-Host "❌ Build échoué" -ForegroundColor Red
        Write-Host "   Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur lors du build: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Instructions pour le déploiement
Write-Host ""
Write-Host "📋 Instructions pour le déploiement:" -ForegroundColor Yellow
Write-Host "1. Si le build réussit, commitez les corrections:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'fix: Correction des erreurs de build'" -ForegroundColor Cyan
Write-Host "   git push" -ForegroundColor Cyan

Write-Host ""
Write-Host "2. Vercel redéploiera automatiquement" -ForegroundColor White
Write-Host "3. Vérifiez le statut sur le dashboard Vercel" -ForegroundColor White

Write-Host ""
Write-Host "✅ Script de correction terminé !" -ForegroundColor Green

# Garder la fenêtre ouverte
Read-Host "Appuyez sur Entrée pour fermer..."
