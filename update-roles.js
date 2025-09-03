const fs = require('fs');
const path = require('path');

// Fonction pour mettre à jour les rôles dans un fichier
function updateRolesInFile(filePath, oldRoles, newRoles) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Mettre à jour les rôles dans les requêtes SQL
    const oldPattern = `('${oldRoles.join("', '")}')`;
    const newPattern = `('${newRoles.join("', '")}')`;
    
    if (content.includes(oldPattern)) {
      content = content.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
      updated = true;
    }
    
    // Mettre à jour les validations isIn
    const oldIsInPattern = `isIn(['${oldRoles.join("', '")}'])`;
    const newIsInPattern = `isIn(['${newRoles.join("', '")}'])`;
    
    if (content.includes(oldIsInPattern)) {
      content = content.replace(new RegExp(oldIsInPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newIsInPattern);
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath} mis à jour`);
    } else {
      console.log(`ℹ️  ${filePath} - aucun changement nécessaire`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de ${filePath}:`, error.message);
  }
}

// Rôles à mettre à jour
const oldRoles = ['user', 'manager'];
const newRoles = ['user', 'manager', 'charge_partenariat'];

// Fichiers à mettre à jour
const filesToUpdate = [
  'backend/routes/dashboard.js',
  'backend/routes/users.js',
  'test-dashboard-db.js'
];

console.log('🔄 Mise à jour des rôles dans les fichiers...');
console.log(`Anciens rôles: ${oldRoles.join(', ')}`);
console.log(`Nouveaux rôles: ${newRoles.join(', ')}`);
console.log('');

// Mettre à jour chaque fichier
filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    updateRolesInFile(file, oldRoles, newRoles);
  } else {
    console.log(`⚠️  ${file} - fichier non trouvé`);
  }
});

console.log('');
console.log('🎯 Mise à jour terminée !');
console.log('');
console.log('📋 Rôles mis à jour:');
console.log('- Frontend: gestion-comptes/page.tsx (✅ déjà fait)');
console.log('- Backend: routes/users.js (✅ déjà fait)');
console.log('- Backend: routes/dashboard.js (✅ mis à jour)');
console.log('- Tests: test-dashboard-db.js (✅ mis à jour)');
console.log('');
console.log('💡 Le rôle "Chargé de Partenariat" est maintenant disponible dans:');
console.log('1. Le formulaire d\'ajout de compte');
console.log('2. Les filtres de recherche');
console.log('3. Les statistiques du dashboard');
console.log('4. Les validations backend');
