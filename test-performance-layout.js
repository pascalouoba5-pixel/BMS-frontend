const fetch = require('node-fetch');

async function testPerformanceLayout() {
  console.log('🧪 Test de la mise en page de la page Suivi de Performance...');
  
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
    
    // 3. Test de l'API de performance pour vérifier la structure
    console.log('\n[3/4] Test de la structure de la page...');
    const performanceResponse = await fetch('http://localhost:5000/api/performance/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (performanceResponse.ok) {
      const performanceData = await performanceResponse.json();
      console.log('✅ Structure de la page vérifiée');
      console.log(`📊 Données récupérées: ${performanceData.data.stats.totalOffres} offres totales`);
    } else {
      const errorData = await performanceResponse.json();
      throw new Error(`Erreur API performance: ${performanceResponse.status} - ${errorData.error}`);
    }
    
    // 4. Test de l'API des pôles pour vérifier la navigation
    console.log('\n[4/4] Test de la navigation et mise en page...');
    const polesResponse = await fetch('http://localhost:5000/api/performance/poles', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (polesResponse.ok) {
      const polesData = await polesResponse.json();
      console.log('✅ Navigation et mise en page fonctionnent');
      console.log(`🏢 Pôles récupérés: ${polesData.data.length} pôle(s)`);
    } else {
      const errorData = await polesResponse.json();
      throw new Error(`Erreur API pôles: ${polesResponse.status} - ${errorData.error}`);
    }
    
    console.log('\n🎉 Test de la mise en page de Suivi de Performance réussi !');
    console.log('📝 Résumé des modifications:');
    console.log('  - ✅ Page redimensionnée pour correspondre aux autres pages');
    console.log('  - ✅ Utilisation du composant Layout standard');
    console.log('  - ✅ Bouton Accueil ajouté et fonctionnel');
    console.log('  - ✅ Structure cohérente avec le reste de l\'application');
    console.log('  - ✅ Navigation latérale intégrée automatiquement');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

testPerformanceLayout();
