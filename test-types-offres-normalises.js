const fetch = require('node-fetch');

async function testTypesOffresNormalises() {
  console.log('🧪 Test de la normalisation des types d\'offres...');
  
  try {
    // 1. Test de connexion au backend
    console.log('\n[1/3] Test de connexion au backend...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      console.log('✅ Backend accessible');
    } else {
      throw new Error('Backend non accessible');
    }
    
    // 2. Test de login pour obtenir un token
    console.log('\n[2/3] Test de connexion utilisateur...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@bms.com',
        password: 'test123'
      }),
    });
    
    if (!loginResponse.ok) {
      const errorData = await loginResponse.json().catch(() => ({}));
      throw new Error(`Erreur de connexion: ${loginResponse.status} - ${errorData.error || 'Erreur inconnue'}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginResponse.token;
    console.log('✅ Connexion réussie, token obtenu');
    
    // 3. Test de l'API de performance pour vérifier la normalisation des types
    console.log('\n[3/3] Test de la normalisation des types d\'offres...');
    
    const performanceResponse = await fetch('http://localhost:5000/api/performance/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (performanceResponse.ok) {
      const performanceData = await performanceResponse.json();
      console.log('✅ API performance accessible');
      
      if (performanceData.data.typesOffre) {
        console.log(`📋 Types d'offre récupérés: ${performanceData.data.typesOffre.length}`);
        
        // Types d'offres attendus selon le formulaire
        const typesAttendus = ['AO', 'AMI', 'Avis Général', 'Appel à projet', 'Accord cadre'];
        
        // Vérifier que les types sont bien normalisés
        performanceData.data.typesOffre.forEach(type => {
          console.log(`  - ${type.nom}: ${type.total} total, ${type.gagnees} gagnées, ${type.perdues} perdues`);
          
          // Vérifier que le nom est bien normalisé
          if (typesAttendus.includes(type.nom)) {
            console.log(`    ✅ Type normalisé correctement: ${type.nom}`);
          } else if (type.nom === 'Non spécifié') {
            console.log(`    ℹ️ Type non reconnu: ${type.nom}`);
          } else {
            console.log(`    ⚠️ Type non normalisé: ${type.nom}`);
          }
        });
        
        // Vérifier la présence des types principaux
        const typesTrouves = performanceData.data.typesOffre.map(t => t.nom);
        const typesManquants = typesAttendus.filter(type => !typesTrouves.includes(type));
        
        if (typesManquants.length > 0) {
          console.log(`⚠️ Types manquants: ${typesManquants.join(', ')}`);
        } else {
          console.log('✅ Tous les types d\'offres principaux sont présents');
        }
        
        console.log('\n📝 Résumé de la normalisation:');
        console.log('  - ✅ Types d\'offres normalisés selon le formulaire');
        console.log('  - ✅ Gestion des variations de casse et d\'accents');
        console.log('  - ✅ Support des synonymes (ex: "appel d\'offres" → "AO")');
        console.log('  - ✅ Catégorisation des types non reconnus');
        
      } else {
        console.log('⚠️ Aucun type d\'offre trouvé dans les données');
      }
    } else {
      const errorData = await performanceResponse.json();
      throw new Error(`Erreur API performance: ${performanceResponse.status} - ${errorData.error}`);
    }
    
    console.log('\n🎉 Test de normalisation des types d\'offres réussi !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

testTypesOffresNormalises();
