# Script pour corriger automatiquement les erreurs ESLint
Write-Host "🔧 Correction automatique des erreurs ESLint..." -ForegroundColor Green

# Vérifier si ESLint est installé
if (-not (Test-Path "node_modules\.bin\eslint.cmd")) {
    Write-Host "❌ ESLint n'est pas installé. Installation en cours..." -ForegroundColor Red
    npm install
}

# Fonction pour corriger les erreurs dans un fichier
function Fix-ESLintErrors {
    param([string]$FilePath)
    
    Write-Host "🔍 Vérification de $FilePath..." -ForegroundColor Yellow
    
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

# Fonction pour remplacer les apostrophes non échappés
function Fix-Apostrophes {
    param([string]$FilePath)
    
    Write-Host "🔧 Correction des apostrophes dans $FilePath..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Remplacer les apostrophes non échappés dans le JSX
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

# Fonction pour remplacer les balises img par Image
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
    
    # Corriger les erreurs ESLint
    Fix-ESLintErrors $file.FullName
}

Write-Host "`n🎉 Correction automatique terminée !" -ForegroundColor Green
Write-Host "💡 Vérifiez les résultats et corrigez manuellement les erreurs restantes si nécessaire." -ForegroundColor Yellow

# Exécuter ESLint sur tout le projet pour vérifier
Write-Host "`n🔍 Vérification finale avec ESLint..." -ForegroundColor Blue
& "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --format=compact
