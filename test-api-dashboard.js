const API_BASE_URL = 'http://localhost:5000';

async function testDashboardAPI() {
  try {
    console.log('🧪 Test de l\'API Dashboard...');
    console.log('URL de test:', `${API_BASE_URL}/api/dashboard/complete?period=month`);
    
    // Test 1: Vérifier si le serveur répond
    console.log('\n📡 Test 1: Connexion au serveur');
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/complete?period=month`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });
      
      console.log('✅ Serveur accessible');
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données reçues:', {
          success: data.success,
          hasData: !!data.data,
          stats: data.data?.stats ? 'Présent' : 'Manquant',
          commerciaux: data.data?.commerciaux ? 'Présent' : 'Manquant',
          poles: data.data?.poles ? 'Présent' : 'Manquant',
          resultats: data.data?.resultats ? 'Présent' : 'Manquant'
        });
        
        if (data.data?.stats) {
          console.log('📊 Statistiques:', data.data.stats);
        }
      } else {
        console.log('❌ Erreur HTTP:', response.status);
        const errorText = await response.text();
        console.log('Détails de l\'erreur:', errorText);
      }
      
    } catch (fetchError) {
      console.log('❌ Erreur de connexion:', fetchError.message);
      
      if (fetchError.code === 'ECONNREFUSED') {
        console.log('💡 Le serveur backend n\'est pas démarré');
        console.log('💡 Démarrer avec: cd backend && npm start');
      } else if (fetchError.message.includes('fetch')) {
        console.log('💡 Erreur de réseau ou CORS');
      }
    }
    
    // Test 2: Vérifier les routes disponibles
    console.log('\n🔍 Test 2: Routes disponibles');
    const routes = [
      '/api/dashboard/stats',
      '/api/dashboard/commerciaux',
      '/api/dashboard/poles',
      '/api/dashboard/resultats',
      '/api/dashboard/complete'
    ];
    
    for (const route of routes) {
      try {
        const response = await fetch(`${API_BASE_URL}${route}?period=month`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          }
        });
        
        console.log(`${response.ok ? '✅' : '❌'} ${route}: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log(`  Erreur: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ ${route}: ${error.message}`);
      }
      
      // Attendre un peu entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Test 3: Vérifier la base de données
    console.log('\n🗄️ Test 3: Vérification de la base de données');
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats?period=month`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Base de données accessible');
        console.log('Données:', data);
      } else {
        console.log('❌ Erreur base de données:', response.status);
      }
    } catch (error) {
      console.log('❌ Erreur base de données:', error.message);
    }
    
    console.log('\n🎯 Diagnostic terminé !');
    console.log('\n💡 Solutions possibles:');
    console.log('1. Vérifier que le serveur backend est démarré (port 5000)');
    console.log('2. Vérifier la connexion à la base de données');
    console.log('3. Vérifier les logs du serveur backend');
    console.log('4. Vérifier que la table "offres" existe et contient des données');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testDashboardAPI();
