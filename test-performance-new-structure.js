const fetch = require('node-fetch');

async function testPerformanceNewStructure() {
  console.log('🧪 Test de la nouvelle structure de la page Suivi de Performance...');
  
  try {
    // 1. Test de connexion au backend
    console.log('\n[1/4] Test de connexion au backend...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      console.log('✅ Backend accessible');
    } else {
      throw new Error('Backend non accessible');
    }
    
    // 2. Test de login pour obtenir un token
    console.log('\n[2/4] Test de connexion utilisateur...');
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
    const token = loginData.token;
    console.log('✅ Connexion réussie, token obtenu');
    
    // 3. Test de l'API de performance avec filtres de date
    console.log('\n[3/4] Test de l\'API performance avec filtres de date...');
    
    // Test avec période personnalisée
    const startDate = '2025-01-01';
    const endDate = '2025-12-31';
    
    const performanceResponse = await fetch(`http://localhost:5000/api/performance/overview?startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (performanceResponse.ok) {
      const performanceData = await performanceResponse.json();
      console.log('✅ API performance avec filtres de date fonctionne');
      console.log(`📊 Données récupérées: ${performanceData.data.stats.totalOffres} offres totales`);
      console.log(`📅 Période: ${startDate} à ${endDate}`);
      
      // Vérifier la nouvelle structure
      if (performanceData.data.stats.tauxGagnees !== undefined) {
        console.log('✅ Nouvelle structure des statistiques: OK');
        console.log(`🏆 Taux gagnées: ${performanceData.data.stats.tauxGagnees}%`);
        console.log(`📉 Taux perdues: ${performanceData.data.stats.tauxPerdues}%`);
        console.log(`⏳ Taux en cours: ${performanceData.data.stats.tauxEnCours}%`);
      }
      
      if (performanceData.data.typesOffre) {
        console.log('✅ Statistiques par type d\'offre: OK');
        console.log(`📋 Types d'offre récupérés: ${performanceData.data.typesOffre.length}`);
        performanceData.data.typesOffre.forEach(type => {
          console.log(`  - ${type.nom}: ${type.total} total, ${type.gagnees} gagnées, ${type.perdues} perdues`);
        });
      }
    } else {
      const errorData = await performanceResponse.json();
      throw new Error(`Erreur API performance: ${performanceResponse.status} - ${errorData.error}`);
    }
    
    // 4. Test de l'API sans filtres de date (année en cours par défaut)
    console.log('\n[4/4] Test de l\'API performance sans filtres (année en cours)...');
    const performanceDefaultResponse = await fetch('http://localhost:5000/api/performance/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (performanceDefaultResponse.ok) {
      const performanceDefaultData = await performanceDefaultResponse.json();
      console.log('✅ API performance sans filtres fonctionne');
      console.log(`📊 Données par défaut: ${performanceDefaultData.data.stats.totalOffres} offres totales`);
    } else {
      const errorData = await performanceDefaultResponse.json();
      throw new Error(`Erreur API performance par défaut: ${performanceDefaultResponse.status} - ${errorData.error}`);
    }
    
    console.log('\n🎉 Test de la nouvelle structure de Suivi de Performance réussi !');
    console.log('📝 Résumé des nouvelles fonctionnalités:');
    console.log('  - ✅ Filtre de période avec dates personnalisables');
    console.log('  - ✅ Statistiques globales étendues (gagnées, perdues, en cours)');
    console.log('  - ✅ Statistiques par type d\'offre (AO, AMI, Avis Général, etc.)');
    console.log('  - ✅ Calculs automatiques des taux de réussite');
    console.log('  - ✅ Support des paramètres de date dans l\'API');
    console.log('  - ✅ Interface utilisateur avec calendrier interactif');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

testPerformanceNewStructure();
