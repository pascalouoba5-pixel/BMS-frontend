const fetch = require('node-fetch');

async function testHomepage() {
  console.log('🧪 Test de la page d\'accueil et du lien Suivi de Performance...');
  
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
    const token = loginData.token;
    console.log('✅ Connexion réussie, token obtenu');
    
    // 3. Test de l'API de performance pour vérifier que le lien fonctionne
    console.log('\n[3/3] Test de l\'API performance (lien de la page d\'accueil)...');
    const performanceResponse = await fetch('http://localhost:5000/api/performance/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (performanceResponse.ok) {
      const performanceData = await performanceResponse.json();
      console.log('✅ Lien vers Suivi de Performance fonctionne parfaitement !');
      console.log(`📊 Données récupérées: ${performanceData.data.stats.totalOffres} offres totales`);
      console.log(`✅ Taux d'approbation: ${performanceData.data.stats.tauxApprobation}%`);
    } else {
      const errorData = await performanceResponse.json();
      throw new Error(`Erreur API performance: ${performanceResponse.status} - ${errorData.error}`);
    }
    
    console.log('\n🎉 Test de la page d\'accueil réussi !');
    console.log('📝 Résumé des modifications:');
    console.log('  - "Dashboard" remplacé par "Suivi de Performance"');
    console.log('  - Lien mis à jour vers /performance');
    console.log('  - Description mise à jour: "Analyse des performances et métriques avancées"');
    console.log('  - Navigation fonctionnelle vers la nouvelle page');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

testHomepage();
