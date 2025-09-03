// Test de l'API Dashboard BMS
const BACKEND_URL = 'http://localhost:5000';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

async function testBackendHealth() {
  try {
    logInfo('Test 1: Vérification de la santé du backend...');
    
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok && data.status === 'OK') {
      logSuccess('Backend accessible et fonctionnel');
      return true;
    } else {
      logError(`Backend non accessible: ${data.message || 'Erreur inconnue'}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur de connexion au backend: ${error.message}`);
    return false;
  }
}

async function testAuthentication() {
  try {
    logInfo('Test 2: Test de l\'authentification...');
    
    const credentials = {
      email: 'test@bms.com',
      password: 'test123'
    };
    
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      logSuccess('Authentification réussie');
      return data.token;
    } else {
      logError(`Échec de l'authentification: ${data.error || 'Erreur inconnue'}`);
      return null;
    }
  } catch (error) {
    logError(`Erreur lors de l'authentification: ${error.message}`);
    return null;
  }
}

async function testDashboardComplete(token) {
  try {
    logInfo('Test 3: Test de l\'endpoint /api/dashboard/complete...');
    
    const response = await fetch(`${BACKEND_URL}/api/dashboard/complete?period=month`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      logSuccess('Endpoint /complete fonctionnel');
      logInfo(`Données récupérées: ${JSON.stringify(data.data, null, 2)}`);
      return true;
    } else {
      logError(`Erreur endpoint /complete: ${data.error || 'Erreur inconnue'}`);
      logInfo(`Status: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test /complete: ${error.message}`);
    return false;
  }
}

async function testDashboardStats(token) {
  try {
    logInfo('Test 4: Test de l\'endpoint /api/dashboard/stats...');
    
    const response = await fetch(`${BACKEND_URL}/api/dashboard/stats?period=month`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      logSuccess('Endpoint /stats fonctionnel');
      return true;
    } else {
      logError(`Erreur endpoint /stats: ${data.error || 'Erreur inconnue'}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test /stats: ${error.message}`);
    return false;
  }
}

async function testOffresAPI(token) {
  try {
    logInfo('Test 5: Test de l\'API offres...');
    
    const response = await fetch(`${BACKEND_URL}/api/offres`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && Array.isArray(data)) {
      logSuccess(`API offres fonctionnelle - ${data.length} offres trouvées`);
      return true;
    } else {
      logError(`Erreur API offres: ${data.error || 'Erreur inconnue'}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test API offres: ${error.message}`);
    return false;
  }
}

async function runCompleteTest() {
  log('\n' + '='.repeat(60), 'bright');
  log('🧪 TEST COMPLET DE L\'API DASHBOARD BMS', 'bright');
  log('='.repeat(60), 'bright');
  
  const results = {
    backend: false,
    auth: false,
    complete: false,
    stats: false,
    offres: false
  };
  
  // Test 1: Backend Health
  results.backend = await testBackendHealth();
  
  if (!results.backend) {
    logError('Le backend n\'est pas accessible. Arrêt des tests.');
    return results;
  }
  
  // Test 2: Authentication
  const token = await testAuthentication();
  results.auth = !!token;
  
  if (!results.auth) {
    logError('L\'authentification a échoué. Tests API limités.');
  }
  
  // Test 3: Dashboard Complete (nécessite token)
  if (token) {
    results.complete = await testDashboardComplete(token);
  }
  
  // Test 4: Dashboard Stats (nécessite token)
  if (token) {
    results.stats = await testDashboardStats(token);
  }
  
  // Test 5: Offres API (nécessite token)
  if (token) {
    results.offres = await testOffresAPI(token);
  }
  
  // Résumé des résultats
  log('\n' + '='.repeat(60), 'bright');
  log('📊 RÉSUMÉ DES TESTS', 'bright');
  log('='.repeat(60), 'bright');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  log(`\nTests réussis: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${status} ${test}: ${passed ? 'OK' : 'ÉCHEC'}`, color);
  });
  
  // Recommandations
  log('\n' + '='.repeat(60), 'bright');
  log('💡 RECOMMANDATIONS', 'bright');
  log('='.repeat(60), 'bright');
  
  if (results.backend && results.auth && results.complete && results.stats && results.offres) {
    logSuccess('🎉 Tous les tests sont passés ! L\'API dashboard fonctionne parfaitement.');
  } else if (results.backend && results.auth) {
    logWarning('⚠️ Le backend et l\'authentification fonctionnent, mais certains endpoints ont des problèmes.');
    if (!results.complete) {
      logInfo('🔧 Vérifiez l\'endpoint /api/dashboard/complete dans le backend');
    }
    if (!results.stats) {
      logInfo('🔧 Vérifiez l\'endpoint /api/dashboard/stats dans le backend');
    }
    if (!results.offres) {
      logInfo('🔧 Vérifiez l\'endpoint /api/offres dans le backend');
    }
  } else if (results.backend) {
    logWarning('⚠️ Le backend est accessible mais l\'authentification échoue.');
    logInfo('🔧 Vérifiez la configuration de la base de données et les utilisateurs de test');
  } else {
    logError('❌ Le backend n\'est pas accessible.');
    logInfo('🔧 Vérifiez que le serveur backend est démarré sur le port 5000');
  }
  
  return results;
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runCompleteTest()
    .then(() => {
      log('\n' + '='.repeat(60), 'bright');
      log('🏁 TESTS TERMINÉS', 'bright');
      log('='.repeat(60), 'bright');
      process.exit(0);
    })
    .catch((error) => {
      logError(`Erreur fatale lors des tests: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  testBackendHealth,
  testAuthentication,
  testDashboardComplete,
  testDashboardStats,
  testOffresAPI,
  runCompleteTest
};
