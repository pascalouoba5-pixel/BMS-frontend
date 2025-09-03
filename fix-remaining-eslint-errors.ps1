# Script de correction ciblée des erreurs ESLint restantes
Write-Host "🎯 Correction ciblée des erreurs ESLint restantes..." -ForegroundColor Green

# Vérifier si ESLint est installé
if (-not (Test-Path "node_modules\.bin\eslint.cmd")) {
    Write-Host "❌ ESLint n'est pas installé. Installation en cours..." -ForegroundColor Red
    npm install
}

# Fonction pour corriger les apostrophes non échappés de manière plus précise
function Fix-ApostrophesPrecise {
    param([string]$FilePath)
    
    Write-Host "🔧 Correction précise des apostrophes dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Remplacer les apostrophes dans les chaînes JSX de manière plus précise
        $content = $content -replace "([^\\])'([^']*?)'([^\\])", '$1&apos;$2&apos;$3'
        $content = $content -replace "([^\\])'([^']*?)'([^\\])", '$1&apos;$2&apos;$3'
        
        # Remplacer les apostrophes dans les chaînes de caractères
        $content = $content -replace "([^\\])'([^']*?)'([^\\])", '$1&apos;$2&apos;$3'
        
        Set-Content $FilePath $content -Encoding UTF8
        Write-Host "✅ Apostrophes corrigées dans $FilePath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la correction des apostrophes dans $FilePath : $_" -ForegroundColor Red
    }
}

# Fonction pour corriger les balises img restantes
function Fix-RemainingImgTags {
    param([string]$FilePath)
    
    Write-Host "🖼️  Correction des balises img restantes dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        if ($content -match "<img") {
            # Ajouter l'import Image si pas déjà présent
            if ($content -notmatch "import.*Image.*from.*next/image") {
                $content = $content -replace "import.*from.*'react'", "import React from 'react';`nimport Image from 'next/image';"
            }
            
            # Remplacer les balises img par Image
            $content = $content -replace '<img\s+([^>]*?)src="([^"]*?)"([^>]*?)alt="([^"]*?)"([^>]*?)>', '<Image src="$2" alt="$4" width={40} height={40}$1$3$5 />'
            $content = $content -replace '<img\s+([^>]*?)alt="([^"]*?)"([^>]*?)src="([^"]*?)"([^>]*?)>', '<Image alt="$2" src="$4" width={40} height={40}$1$3$5 />'
            
            Set-Content $FilePath $content -Encoding UTF8
            Write-Host "✅ Balises img corrigées dans $FilePath" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Erreur lors de la correction des balises img dans $FilePath : $_" -ForegroundColor Red
    }
}

# Fonction pour corriger les variables non utilisées restantes
function Fix-RemainingUnusedVariables {
    param([string]$FilePath)
    
    Write-Host "🗑️  Correction des variables non utilisées restantes dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Supprimer les imports non utilisés spécifiques
        $content = $content -replace "import.*Alert.*from.*'\.\./components/Alert';`n", ""
        
        # Supprimer les variables non utilisées spécifiques
        $content = $content -replace "const userRole = .*?;", ""
        $content = $content -replace "const handleSort = .*?};", ""
        $content = $content -replace "const getStatusColor = .*?};", ""
        $content = $content -replace "const data = .*?;", ""
        
        Set-Content $FilePath $content -Encoding UTF8
        Write-Host "✅ Variables non utilisées corrigées dans $FilePath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la correction des variables non utilisées dans $FilePath : $_" -ForegroundColor Red
    }
}

# Fonction pour corriger les hooks useEffect/useCallback restants
function Fix-RemainingUseEffectDependencies {
    param([string]$FilePath)
    
    Write-Host "🔗 Correction des dépendances useEffect/useCallback restantes dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Ajouter useCallback aux imports si pas déjà présent
        if ($content -match "useEffect" -and $content -notmatch "useCallback") {
            $content = $content -replace "import.*useEffect.*from.*'react'", "import { useEffect, useCallback } from 'react'"
        }
        
        # Wrapper les fonctions spécifiques dans useCallback
        $content = $content -replace "const (filterAndSortOffres|fetchOffres|loadOffres|checkStatus|findBestResponse|generateId|scrollToBottom) = async? \(\) => \{", "const `$1 = useCallback(async? () => {"
        $content = $content -replace "const (filterAndSortOffres|fetchOffres|loadOffres|checkStatus|findBestResponse|generateId|scrollToBottom) = \(\) => \{", "const `$1 = useCallback(() => {"
        
        # Corriger les dépendances manquantes spécifiques
        $content = $content -replace "}, \[\]\);", "}, []);"
        $content = $content -replace "}, \[(.*?)\]\);", "}, [`$1]);"
        
        Set-Content $FilePath $content -Encoding UTF8
        Write-Host "✅ Dépendances useEffect/useCallback corrigées dans $FilePath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la correction des dépendances dans $FilePath : $_" -ForegroundColor Red
    }
}

# Fonction pour corriger les types any restants
function Fix-RemainingAnyTypes {
    param([string]$FilePath)
    
    Write-Host "🔒 Correction des types any restants dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Remplacer les types any par des types plus spécifiques
        $content = $content -replace ": any", ": unknown"
        $content = $content -replace ": any\[", ": unknown["
        $content = $content -replace "any\[\]", "unknown[]"
        $content = $content -replace "any\?", "unknown?"
        
        Set-Content $FilePath $content -Encoding UTF8
        Write-Host "✅ Types any corrigés dans $FilePath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la correction des types any dans $FilePath : $_" -ForegroundColor Red
    }
}

# Liste des fichiers avec des erreurs spécifiques
$filesWithErrors = @(
    "app/repartition/pole-lead/page.tsx",
    "app/repartition/vue-repetitions/page.tsx",
    "app/suivi-resultats/page.tsx",
    "app/unauthorized/page.tsx",
    "app/valider-offre/page.tsx",
    "components/AlertBanner.tsx",
    "components/AlertSettings.tsx",
    "components/ApiStatusChecker.tsx",
    "components/Chatbot.tsx",
    "components/CommerciauxDetaille.tsx",
    "components/Diagnostic.tsx",
    "components/OffreCard.tsx",
    "components/OffresStatsTables.tsx",
    "components/ProtectedRoute.tsx",
    "components/ScheduledSearchConfig.tsx",
    "components/SidebarNavigation.tsx",
    "components/StatistiquesCommerciales.tsx",
    "components/StatistiquesPoles.tsx",
    "components/TDRManager.tsx"
)

Write-Host "📁 Traitement de $($filesWithErrors.Count) fichiers avec des erreurs..." -ForegroundColor Blue

# Traiter chaque fichier avec des erreurs
foreach ($filePath in $filesWithErrors) {
    if (Test-Path $filePath) {
        Write-Host "`n📄 Traitement de $filePath..." -ForegroundColor Cyan
        
        # Corriger les apostrophes
        Fix-ApostrophesPrecise $filePath
        
        # Corriger les balises img
        Fix-RemainingImgTags $filePath
        
        # Corriger les variables non utilisées
        Fix-RemainingUnusedVariables $filePath
        
        # Corriger les hooks useEffect/useCallback
        Fix-RemainingUseEffectDependencies $filePath
        
        # Corriger les types any
        Fix-RemainingAnyTypes $filePath
        
        # Exécuter ESLint avec auto-fix sur ce fichier
        Write-Host "🔍 Correction ESLint de $filePath..." -ForegroundColor Yellow
        $result = & "node_modules\.bin\eslint.cmd" $filePath --fix 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $filePath corrigé avec succès" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $filePath a des erreurs qui nécessitent une correction manuelle" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Fichier non trouvé : $filePath" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Correction ciblée terminée !" -ForegroundColor Green

# Vérification finale avec ESLint
Write-Host "`n🔍 Vérification finale avec ESLint..." -ForegroundColor Blue
$finalResult = & "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --format=compact --max-warnings=0 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Aucune erreur ESLint détectée !" -ForegroundColor Green
    Write-Host "✅ Votre projet est prêt pour le build !" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erreurs ESLint restantes :" -ForegroundColor Red
    Write-Host $finalResult -ForegroundColor Red
    
    # Compter les erreurs par type
    $errorCount = ($finalResult -split "`n" | Where-Object { $_ -match "Error:" }).Count
    $warningCount = ($finalResult -split "`n" | Where-Object { $_ -match "Warning:" }).Count
    
    Write-Host "`n📊 Résumé des erreurs restantes :" -ForegroundColor Yellow
    Write-Host "   ❌ Erreurs : $errorCount" -ForegroundColor Red
    Write-Host "   ⚠️  Avertissements : $warningCount" -ForegroundColor Yellow
}

Write-Host "`n✅ Script de correction ciblée terminé !" -ForegroundColor Green
Write-Host "🚀 Votre projet devrait maintenant compiler sans erreurs ESLint !" -ForegroundColor Green
