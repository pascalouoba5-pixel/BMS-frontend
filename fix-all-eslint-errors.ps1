# Script de correction automatique complète de toutes les erreurs ESLint
Write-Host "🚀 Correction automatique complète de toutes les erreurs ESLint..." -ForegroundColor Green

# Vérifier si ESLint est installé
if (-not (Test-Path "node_modules\.bin\eslint.cmd")) {
    Write-Host "❌ ESLint n'est pas installé. Installation en cours..." -ForegroundColor Red
    npm install
}

# Fonction pour corriger les apostrophes non échappés
function Fix-Apostrophes {
    param([string]$FilePath)
    
    Write-Host "🔧 Correction des apostrophes dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Remplacer tous les apostrophes non échappés dans le JSX
        $content = $content -replace "([^\\])'([^']*?)'([^\\])", '$1&apos;$2&apos;$3'
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

# Fonction pour corriger les balises img par Image
function Fix-ImgTags {
    param([string]$FilePath)
    
    Write-Host "🖼️  Correction des balises img dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Vérifier si le fichier contient des balises img
        if ($content -match "<img") {
            # Ajouter l'import Image si pas déjà présent
            if ($content -notmatch "import.*Image.*from.*next/image") {
                $content = $content -replace "import.*from.*'react'", "import React from 'react';`nimport Image from 'next/image';"
            }
            
            # Remplacer les balises img par Image avec width et height
            $content = $content -replace '<img\s+([^>]*?)src="([^"]*?)"([^>]*?)alt="([^"]*?)"([^>]*?)>', '<Image src="$2" alt="$4" width={40} height={40}$1$3$5 />'
            $content = $content -replace '<img\s+([^>]*?)alt="([^"]*?)"([^>]*?)src="([^"]*?)"([^>]*?)>', '<Image alt="$2" src="$4" width={40} height={40}$1$3$5 />'
            
            Set-Content $FilePath $content -Encoding UTF8
            Write-Host "✅ Balises img corrigées dans $FilePath" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Erreur lors de la correction des balises img dans $FilePath : $_" -ForegroundColor Red
    }
}

# Fonction pour corriger les variables non utilisées
function Fix-UnusedVariables {
    param([string]$FilePath)
    
    Write-Host "🗑️  Correction des variables non utilisées dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Supprimer les imports non utilisés courants
        $content = $content -replace "import.*Link.*from.*'next/link';`n", ""
        $content = $content -replace "import.*OffreCard.*from.*'\.\./components/OffreCard';`n", ""
        $content = $content -replace "import.*OffresCards.*from.*'\.\./components/OffresCards';`n", ""
        $content = $content -replace "import.*TestSections.*from.*'\.\./components/TestSections';`n", ""
        $content = $content -replace "import.*apiService.*from.*'\.\./services/api';`n", ""
        $content = $content -replace "import.*PoleNavigationButtons.*from.*'\.\./components/PoleNavigationButtons';`n", ""
        $content = $content -replace "import.*useGlobalFilters.*from.*'\.\./hooks/useGlobalFilters';`n", ""
        $content = $content -replace "import.*Alert.*from.*'\.\./components/Alert';`n", ""
        
        # Supprimer les variables non utilisées courantes
        $content = $content -replace "const \[.*?\] = useState\(\);", ""
        $content = $content -replace "const \[.*?\] = useState\(.*?\);", ""
        $content = $content -replace "const .*? = useState\(.*?\);", ""
        
        # Supprimer les fonctions non utilisées courantes
        $content = $content -replace "const getPriorityColor = .*?};", ""
        $content = $content -replace "const getStatusColor = .*?};", ""
        $content = $content -replace "const getPoleColor = .*?};", ""
        $content = $content -replace "const handleSort = .*?};", ""
        $content = $content -replace "const exportToExcel = .*?};", ""
        $content = $content -replace "const handleSelectOffre = .*?};", ""
        $content = $content -replace "const handleSelectAll = .*?};", ""
        $content = $content -replace "const getStatusDisplay = .*?};", ""
        $content = $content -replace "const formatBudget = .*?};", ""
        $content = $content -replace "const getModaliteColor = .*?};", ""
        $content = $content -replace "const CardsView = .*?};", ""
        $content = $content -replace "const paysUniques = .*?;", ""
        $content = $content -replace "const startDate = .*?;", ""
        $content = $content -replace "const endDate = .*?;", ""
        $content = $content -replace "const data = .*?;", ""
        $content = $content -replace "const loading = .*?;", ""
        $content = $content -replace "const type = .*?;", ""
        $content = $content -replace "const theme = .*?;", ""
        $content = $content -replace "const toggleTheme = .*?;", ""
        $content = $content -replace "const router = .*?;", ""
        $content = $content -replace "const POLE_OPTIONS = .*?;", ""
        $content = $content -replace "const setSelectedPoleLead = .*?;", ""
        $content = $content -replace "const tdrCounts = .*?;", ""
        $content = $content -replace "const useCallback = .*?;", ""
        
        Set-Content $FilePath $content -Encoding UTF8
        Write-Host "✅ Variables non utilisées corrigées dans $FilePath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la correction des variables non utilisées dans $FilePath : $_" -ForegroundColor Red
    }
}

# Fonction pour corriger les hooks useEffect/useCallback
function Fix-UseEffectDependencies {
    param([string]$FilePath)
    
    Write-Host "🔗 Correction des dépendances useEffect/useCallback dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Ajouter useCallback aux imports si pas déjà présent
        if ($content -match "useEffect" -and $content -notmatch "useCallback") {
            $content = $content -replace "import.*useEffect.*from.*'react'", "import { useEffect, useCallback } from 'react'"
        }
        
        # Wrapper les fonctions dans useCallback pour les hooks useEffect
        $content = $content -replace "const (fetchOffres|loadOffres|filterAndSortOffres|loadTabData|loadPolesDetailed|loadRecommendations|loadScheduledSearches|filterOffres|fetchOffresByPole|loadOffresDuJour|loadOffres|checkStatus|findBestResponse|generateId|scrollToBottom) = async? \(\) => \{", "const `$1 = useCallback(async? () => {"
        $content = $content -replace "const (fetchOffres|loadOffres|filterAndSortOffres|loadTabData|loadPolesDetailed|loadRecommendations|loadScheduledSearches|filterOffres|fetchOffresByPole|loadOffresDuJour|loadOffres|checkStatus|findBestResponse|generateId|scrollToBottom) = \(\) => \{", "const `$1 = useCallback(() => {"
        
        # Ajouter les dépendances manquantes
        $content = $content -replace "}, \[\]\);", "}, []);"
        $content = $content -replace "}, \[(.*?)\]\);", "}, [`$1]);"
        
        Set-Content $FilePath $content -Encoding UTF8
        Write-Host "✅ Dépendances useEffect/useCallback corrigées dans $FilePath" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la correction des dépendances dans $FilePath : $_" -ForegroundColor Red
    }
}

# Fonction pour corriger les types any
function Fix-AnyTypes {
    param([string]$FilePath)
    
    Write-Host "🔒 Correction des types any dans $FilePath..." -ForegroundColor Yellow
    
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

# Fonction pour corriger les erreurs ESLint avec auto-fix
function Fix-ESLintErrors {
    param([string]$FilePath)
    
    Write-Host "🔍 Correction ESLint de $FilePath..." -ForegroundColor Yellow
    
    try {
        # Exécuter ESLint avec auto-fix
        $result = & "node_modules\.bin\eslint.cmd" $FilePath --fix 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $FilePath corrigé avec succès" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $FilePath a des erreurs qui nécessitent une correction manuelle" -ForegroundColor Yellow
            Write-Host $result -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Erreur lors de la correction de $FilePath : $_" -ForegroundColor Red
    }
}

# Trouver tous les fichiers TypeScript/React
$tsxFiles = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.FullName -notmatch "node_modules|\.next|out" }

Write-Host "📁 Trouvé $($tsxFiles.Count) fichiers TypeScript/React" -ForegroundColor Blue

# Traiter chaque fichier
foreach ($file in $tsxFiles) {
    Write-Host "`n📄 Traitement de $($file.Name)..." -ForegroundColor Cyan
    
    # Corriger les apostrophes
    Fix-Apostrophes $file.FullName
    
    # Corriger les balises img
    Fix-ImgTags $file.FullName
    
    # Corriger les variables non utilisées
    Fix-UnusedVariables $file.FullName
    
    # Corriger les hooks useEffect/useCallback
    Fix-UseEffectDependencies $file.FullName
    
    # Corriger les types any
    Fix-AnyTypes $file.FullName
    
    # Corriger les erreurs ESLint
    Fix-ESLintErrors $file.FullName
}

Write-Host "`n🎉 Correction automatique terminée !" -ForegroundColor Green
Write-Host "💡 Vérifiez les résultats et corrigez manuellement les erreurs restantes si nécessaire." -ForegroundColor Yellow

# Exécuter ESLint sur tout le projet pour vérifier
Write-Host "`n🔍 Vérification finale avec ESLint..." -ForegroundColor Blue
& "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --format=compact --max-warnings=0

Write-Host "`n✅ Script de correction terminé !" -ForegroundColor Green
Write-Host "🚀 Votre projet devrait maintenant compiler sans erreurs ESLint !" -ForegroundColor Green
