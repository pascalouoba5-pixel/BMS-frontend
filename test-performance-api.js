const fetch = require('node-fetch');

async function testPerformanceAPI() {
  console.log('🧪 Test de l\'API Suivi de Performance');
  console.log('=====================================');
  
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
    
    // 3. Test de l'API de performance - Vue d'ensemble
    console.log('\n[3/4] Test de l\'API performance/overview...');
    const overviewResponse = await fetch('http://localhost:5000/api/performance/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (overviewResponse.ok) {
      const overviewData = await overviewResponse.json();
      console.log('✅ API performance/overview fonctionne');
      console.log(`📊 Total offres: ${overviewData.data.stats.totalOffres}`);
      console.log(`✅ Offres approuvées: ${overviewData.data.stats.offresApprouvees}`);
      console.log(`📈 Taux d'approbation: ${overviewData.data.stats.tauxApprobation}%`);
    } else {
      const errorData = await overviewResponse.json();
      throw new Error(`Erreur API overview: ${overviewResponse.status} - ${errorData.error}`);
    }
    
    // 4. Test de l'API de performance - Pôles
    console.log('\n[4/4] Test de l\'API performance/poles...');
    const polesResponse = await fetch('http://localhost:5000/api/performance/poles', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (polesResponse.ok) {
      const polesData = await polesResponse.json();
      console.log('✅ API performance/poles fonctionne');
      console.log(`🏢 Nombre de pôles: ${polesData.data.length}`);
      if (polesData.data.length > 0) {
        console.log(`📋 Premier pôle: ${polesData.data[0].nom} (${polesData.data[0].totalOffres} offres)`);
      }
    } else {
      const errorData = await polesResponse.json();
      throw new Error(`Erreur API poles: ${polesResponse.status} - ${errorData.error}`);
    }
    
    console.log('\n🎉 Tous les tests de l\'API Suivi de Performance sont réussis !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

testPerformanceAPI();
