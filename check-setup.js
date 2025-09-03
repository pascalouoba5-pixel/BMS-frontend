#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration BMS 3...\n');

let allGood = true;

// Vérifier les fichiers de configuration
const checks = [
  {
    name: 'Fichier backend/.env',
    path: 'backend/.env',
    required: false,
    example: 'backend/env.example'
  },
  {
    name: 'Fichier frontend/.env.local',
    path: 'frontend/.env.local',
    required: false,
    example: 'frontend/env.local.example'
  },
  {
    name: 'Dépendances backend',
    path: 'backend/node_modules',
    required: true
  },
  {
    name: 'Dépendances frontend',
    path: 'frontend/node_modules',
    required: true
  },
  {
    name: 'Dépendances principales',
    path: 'node_modules',
    required: true
  }
];

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  const status = exists ? '✅' : (check.required ? '❌' : '⚠️');
  const message = exists ? 'Trouvé' : (check.required ? 'Manquant' : 'Optionnel');
  
  console.log(`${status} ${check.name}: ${message}`);
  
  if (!exists && check.required) {
    allGood = false;
  } else if (!exists && check.example && fs.existsSync(check.example)) {
    console.log(`   💡 Copiez ${check.example} vers ${check.path}`);
  }
});

console.log('\n📋 Résumé :');
if (allGood) {
  console.log('✅ Configuration OK - Vous pouvez démarrer l\'application avec :');
  console.log('   npm run dev');
} else {
  console.log('❌ Problèmes détectés - Veuillez les corriger avant de continuer :');
  console.log('   1. Exécutez : npm run install:all');
  console.log('   2. Copiez les fichiers d\'exemple .env');
  console.log('   3. Relancez cette vérification');
}

console.log('\n🌐 URLs d\'accès :');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('   Health:   http://localhost:5000/api/health');
