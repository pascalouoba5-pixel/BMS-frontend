# Script PowerShell pour créer le fichier .env.local du frontend
# Exécuter ce script dans le dossier frontend

$envContent = @"
# Configuration locale pour le frontend Next.js
NODE_ENV=development

# URL de l'API backend en local
NEXT_PUBLIC_API_URL=http://localhost:5000

# Configuration de l'environnement
NODE_ENV=development

# Configuration Next.js
NEXT_PUBLIC_APP_NAME=BMS
NEXT_PUBLIC_APP_VERSION=1.0.0
"@

# Créer le fichier .env.local
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Fichier .env.local créé avec succès !" -ForegroundColor Green
Write-Host "📋 Contenu du fichier :" -ForegroundColor Yellow
Get-Content ".env.local" | ForEach-Object { Write-Host "   $_" -ForegroundColor Cyan }

Write-Host ""
Write-Host "🚀 Vous pouvez maintenant redémarrer le frontend :" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor Blue
