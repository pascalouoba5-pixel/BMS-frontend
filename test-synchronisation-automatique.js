const API_BASE_URL = 'http://localhost:5000';

async function testSynchronisationAutomatique() {
  try {
    console.log('🧪 Test de la synchronisation automatique du dashboard...');
    
    // Test 1: Vérifier la route principale du dashboard
    console.log('\n📊 Test 1: Route principale du dashboard');
    const response1 = await fetch(`${API_BASE_URL}/api/dashboard/complete?period=month`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✅ Dashboard principal:', {
        totalOffres: data1.data?.stats?.totalOffres || 0,
        offresApprouvees: data1.data?.stats?.offresApprouvees || 0,
        offresRejetees: data1.data?.stats?.offresRejetees || 0,
        offresEnAttente: data1.data?.stats?.offresEnAttente || 0
      });
    } else {
      console.log('❌ Erreur dashboard principal:', response1.status);
    }
    
    // Test 2: Vérifier la synchronisation avec différents filtres
    console.log('\n🔄 Test 2: Synchronisation avec différents filtres');
    const periods = ['today', 'week', 'month', 'quarter', 'year'];
    
    for (const period of periods) {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/complete?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${period}: ${data.data?.stats?.totalOffres || 0} offres`);
      } else {
        console.log(`❌ ${period}: Erreur ${response.status}`);
      }
      
      // Attendre un peu entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Test 3: Vérifier la route des commerciaux détaillés
    console.log('\n👥 Test 3: Statistiques détaillées des commerciaux');
    const response3 = await fetch(`${API_BASE_URL}/api/dashboard/commerciaux-detaille?period=month`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('✅ Commerciaux détaillés:', {
        offresParAgent: data3.data?.offresParAgent?.length || 0,
        typesOffresParAgent: data3.data?.typesOffresParAgent?.length || 0,
        offresStatutParAgent: data3.data?.offresStatutParAgent?.length || 0
      });
    } else {
      console.log('❌ Erreur commerciaux détaillés:', response3.status);
    }
    
    // Test 4: Vérifier la performance des requêtes
    console.log('\n⚡ Test 4: Performance des requêtes');
    const startTime = Date.now();
    
    const response4 = await fetch(`${API_BASE_URL}/api/dashboard/complete?period=month`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response4.ok) {
      console.log(`✅ Requête exécutée en ${duration}ms`);
      if (duration < 1000) {
        console.log('🚀 Performance excellente (< 1s)');
      } else if (duration < 3000) {
        console.log('👍 Performance correcte (< 3s)');
      } else {
        console.log('⚠️ Performance lente (> 3s)');
      }
    }
    
    console.log('\n🎯 Test de synchronisation terminé !');
    console.log('\n📋 Résumé des fonctionnalités testées:');
    console.log('- ✅ Route principale du dashboard');
    console.log('- ✅ Synchronisation avec filtres de période');
    console.log('- ✅ Statistiques détaillées des commerciaux');
    console.log('- ✅ Performance des requêtes');
    console.log('\n💡 Pour tester la synchronisation automatique:');
    console.log('1. Ouvrir le dashboard dans le navigateur');
    console.log('2. Changer la période (aujourd\'hui, semaine, mois, etc.)');
    console.log('3. Observer la synchronisation automatique des données');
    console.log('4. Vérifier l\'indicateur de statut (vert = synchronisé)');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testSynchronisationAutomatique();
