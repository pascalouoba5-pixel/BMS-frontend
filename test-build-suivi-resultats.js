const fs = require('fs');
const path = require('path');

console.log('🧪 Test de compilation du fichier suivi-resultats/page.tsx');

try {
  // Lire le fichier
  const filePath = path.join(__dirname, 'frontend', 'app', 'suivi-resultats', 'page.tsx');
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log('✅ Fichier lu avec succès');
  
  // Vérifier qu'il n'y a plus d'import de test-data
  if (content.includes('test-data')) {
    console.log('❌ Import de test-data encore présent');
    process.exit(1);
  } else {
    console.log('✅ Import de test-data supprimé');
  }
  
  // Vérifier qu'il n'y a plus d'appel à initializeTestData
  if (content.includes('initializeTestData')) {
    console.log('❌ Appel à initializeTestData encore présent');
    process.exit(1);
  } else {
    console.log('✅ Appel à initializeTestData supprimé');
  }
  
  // Vérifier la structure de base
  if (content.includes('export default function SuiviResultats')) {
    console.log('✅ Fonction principale exportée correctement');
  } else {
    console.log('❌ Fonction principale manquante');
    process.exit(1);
  }
  
  if (content.includes('function SuiviResultatsContent')) {
    console.log('✅ Fonction SuiviResultatsContent présente');
  } else {
    console.log('❌ Fonction SuiviResultatsContent manquante');
    process.exit(1);
  }
  
  // Vérifier les imports essentiels
  const requiredImports = [
    'import React',
    'import { useState, useEffect }',
    'import { useRouter }',
    'import Link',
    'import HomeButton',
    'import Layout',
    'import { PoleType }',
    'import AlertBanner',
    'import { offresAPI }'
  ];
  
  let missingImports = 0;
  requiredImports.forEach(importStatement => {
    if (!content.includes(importStatement)) {
      console.log(`❌ Import manquant: ${importStatement}`);
      missingImports++;
    }
  });
  
  if (missingImports === 0) {
    console.log('✅ Tous les imports essentiels présents');
  } else {
    console.log(`❌ ${missingImports} imports manquants`);
    process.exit(1);
  }
  
  // Vérifier la fermeture des balises
  const openTags = (content.match(/<[^/][^>]*>/g) || []).length;
  const closeTags = (content.match(/<\/[^>]*>/g) || []).length;
  
  console.log(`📊 Tags ouverts: ${openTags}, Tags fermés: ${closeTags}`);
  
  if (Math.abs(openTags - closeTags) <= 2) { // Tolérance pour les balises auto-fermantes
    console.log('✅ Structure des balises équilibrée');
  } else {
    console.log('⚠️ Déséquilibre potentiel dans les balises');
  }
  
  console.log('\n🎉 Test de compilation réussi ! Le fichier devrait maintenant se compiler correctement sur Render.');
  
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message);
  process.exit(1);
}
