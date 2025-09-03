const fetch = require('node-fetch');

async function diagnosticAPIs() {
  console.log('🔍 Diagnostic complet des API BMS...\n');
  
  let token = null;
  const errors = [];
  const workingAPIs = [];
  
  // 1. Test de santé du backend
  console.log('📊 [1] Test de santé du backend...');
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Backend accessible:', data.message);
      workingAPIs.push('Health Check');
    } else {
      console.log('❌ Backend non accessible:', healthResponse.status);
      errors.push(`Health Check: ${healthResponse.status}`);
    }
  } catch (error) {
    console.log('💥 Erreur backend:', error.message);
    errors.push(`Health Check: ${error.message}`);
  }
  
  // 2. Test de connexion
  console.log('\n📊 [2] Test de connexion utilisateur...');
  try {
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@bms.com',
        password: 'admin1234'
      })
    });
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      token = data.token;
      console.log('✅ Connexion réussie avec superadmin@bms.com');
      workingAPIs.push('Authentification');
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Échec de connexion:', errorData.error || loginResponse.status);
      errors.push(`Authentification: ${errorData.error || loginResponse.status}`);
    }
  } catch (error) {
    console.log('💥 Erreur lors du test de connexion:', error.message);
    errors.push(`Authentification: ${error.message}`);
  }
  
  if (!token) {
    console.log('⚠️ Impossible de continuer sans token d\'authentification\n');
    console.log('📋 RÉSUMÉ DES ERREURS:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
    return;
  }
  
  // 3. Test de toutes les API avec authentification
  const apisToTest = [
    { name: 'API Offres - GET', url: '/api/offres', method: 'GET' },
    { name: 'API Offres - POST', url: '/api/offres', method: 'POST', body: {
      intitule_offre: 'Test Diagnostic',
      bailleur: 'Test',
      pays: ['France'],
      date_depot: new Date().toISOString().slice(0, 10),
      statut: 'en_attente',
      priorite: 'Normale',
      pole_lead: 'Informatique',
      pole_associes: '',
      commentaire: 'Test diagnostic API',
      montant: 10000,
      type_offre: 'AO'
    }},
    { name: 'API Performance - Vue d\'ensemble', url: '/api/performance/overview', method: 'GET' },
    { name: 'API Performance - Vue d\'ensemble avec dates', url: '/api/performance/overview?startDate=2025-01-01&endDate=2025-12-31', method: 'GET' },
    { name: 'API Répartition', url: '/api/repartition', method: 'GET' },
    { name: 'API Suivi Résultats', url: '/api/suivi-resultats', method: 'GET' },
    { name: 'API Suivi Résultats - Statistiques', url: '/api/suivi-resultats/statistiques', method: 'GET' },
    { name: 'API Modalités Pôles', url: '/api/modalites-poles', method: 'GET' },
    { name: 'API Modalités Pôles - Statistiques', url: '/api/modalites-poles/statistiques', method: 'GET' },
    { name: 'API Alertes', url: '/api/alertes', method: 'GET' },
    { name: 'API Alertes - Actives', url: '/api/alertes/actives', method: 'GET' },
    { name: 'API Alertes - Statistiques', url: '/api/alertes/statistiques', method: 'GET' },
    { name: 'API Users', url: '/api/users', method: 'GET' },
    { name: 'API Search', url: '/api/search', method: 'GET' },
    { name: 'API Scheduled Searches', url: '/api/scheduled-searches', method: 'GET' }
  ];
  
  console.log('\n📊 [3] Test de toutes les API...');
  
  for (let i = 0; i < apisToTest.length; i++) {
    const api = apisToTest[i];
    console.log(`\n[${i + 3}] ${api.name}...`);
    
    try {
      const requestOptions = {
        method: api.method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      if (api.body && api.method === 'POST') {
        requestOptions.body = JSON.stringify(api.body);
      }
      
      const response = await fetch(`http://localhost:5000${api.url}`, requestOptions);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${api.name} - SUCCÈS`);
        workingAPIs.push(api.name);
        
        // Afficher des détails selon l'API
        if (api.name.includes('Offres') && Array.isArray(data)) {
          console.log(`   📊 ${data.length} offres récupérées`);
        } else if (api.name.includes('Performance')) {
          console.log(`   📊 ${data.totalOffres || 0} offres totales`);
        } else if (api.name.includes('Statistiques')) {
          console.log(`   📊 Données statistiques récupérées`);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.log(`❌ ${api.name} - ERREUR ${response.status}: ${errorData.error || 'Erreur inconnue'}`);
        errors.push(`${api.name}: ${response.status} - ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.log(`💥 ${api.name} - ERREUR: ${error.message}`);
      errors.push(`${api.name}: ${error.message}`);
    }
  }
  
  // Résumé final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DU DIAGNOSTIC');
  console.log('='.repeat(60));
  console.log(`✅ API Fonctionnelles: ${workingAPIs.length}`);
  console.log(`❌ API avec Erreurs: ${errors.length}`);
  console.log(`📊 Total Testé: ${workingAPIs.length + errors.length}`);
  
  if (workingAPIs.length > 0) {
    console.log('\n✅ API FONCTIONNELLES:');
    workingAPIs.forEach((api, index) => {
      console.log(`   ${index + 1}. ${api}`);
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ ERREURS IDENTIFIÉES:');
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  console.log('\n🎯 RECOMMANDATIONS:');
  if (errors.length === 0) {
    console.log('   🎉 Toutes les API fonctionnent parfaitement !');
  } else if (errors.length <= 3) {
    console.log('   ⚠️  Quelques erreurs mineures à corriger');
  } else if (errors.length <= 7) {
    console.log('   🔧 Plusieurs erreurs à résoudre');
  } else {
    console.log('   🚨 Nombreuses erreurs critiques à résoudre en priorité');
  }
}

// Exécuter le diagnostic
diagnosticAPIs().catch(console.error);
