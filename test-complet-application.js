#!/usr/bin/env node

/**
 * 🧪 TEST COMPLET DE L'APPLICATION BMS
 * Vérifie que l'application frontend-backend fonctionne entièrement
 */

// Utiliser fetch intégré de Node.js (disponible depuis Node.js 18+)
// Si vous utilisez une version antérieure, installez node-fetch: npm install node-fetch

// Configuration
const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
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
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function testBackendHealth() {
  try {
    logInfo('Test 1: Vérification du backend...');
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok && (data.status === 'ok' || data.status === 'OK')) {
      logSuccess('Backend accessible et fonctionnel');
      return true;
    } else {
      logError('Backend accessible mais réponse invalide');
      return false;
    }
  } catch (error) {
    logError(`Backend inaccessible: ${error.message}`);
    return false;
  }
}

async function testAuthentication() {
  try {
    logInfo('Test 2: Test d\'authentification...');
    
    const loginData = {
      email: 'test@bms.com',
      password: 'test123'
    };
    
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
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
    logError(`Erreur d'authentification: ${error.message}`);
    return null;
  }
}

async function testOffersAPI(token) {
  try {
    logInfo('Test 3: Test de l\'API des offres...');
    
    const response = await fetch(`${BACKEND_URL}/api/offres`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && (Array.isArray(data) || (data && typeof data === 'object'))) {
      const count = Array.isArray(data) ? data.length : (data.length || 0);
      logSuccess(`API offres fonctionnelle - ${count} offres trouvées`);
      return true;
    } else {
      logError(`Erreur API offres: ${data.error || 'Erreur inconnue'}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur API offres: ${error.message}`);
    return false;
  }
}

async function testDashboardAPI(token) {
  try {
    logInfo('Test 4: Test de l\'API dashboard...');
    
    const response = await fetch(`${BACKEND_URL}/api/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data) {
      logSuccess('API dashboard fonctionnelle');
      return true;
    } else {
      logError(`Erreur API dashboard: ${data.error || 'Erreur inconnue'}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur API dashboard: ${error.message}`);
    return false;
  }
}

async function testFrontendAccess() {
  try {
    logInfo('Test 5: Vérification du frontend...');
    
    const response = await fetch(FRONTEND_URL);
    
    if (response.ok) {
      logSuccess('Frontend accessible');
      return true;
    } else {
      logError(`Frontend accessible mais erreur HTTP: ${response.status}`);
      return false;
    }
  } catch (error) {
    logWarning(`Frontend non accessible: ${error.message}`);
    logInfo('Le frontend peut ne pas être démarré ou être sur un port différent');
    return false;
  }
}

async function testTokenVerification(token) {
  try {
    logInfo('Test 6: Vérification du token JWT...');
    
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && (data.valid || data.user)) {
      logSuccess('Token JWT valide');
      return true;
    } else {
      logError(`Token JWT invalide: ${data.error || 'Erreur inconnue'}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur vérification token: ${error.message}`);
    return false;
  }
}

async function runCompleteTest() {
  log('\n' + '='.repeat(60), 'bold');
  log('🧪 TEST COMPLET DE L\'APPLICATION BMS', 'bold');
  log('='.repeat(60), 'bold');
  
  const results = {
    backend: false,
    auth: false,
    offers: false,
    dashboard: false,
    frontend: false,
    token: false
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
  
  // Test 3: Offers API (nécessite token)
  if (token) {
    results.offers = await testOffersAPI(token);
  }
  
  // Test 4: Dashboard API (nécessite token)
  if (token) {
    results.dashboard = await testDashboardAPI(token);
  }
  
  // Test 5: Frontend Access
  results.frontend = await testFrontendAccess();
  
  // Test 6: Token Verification
  if (token) {
    results.token = await testTokenVerification(token);
  }
  
  // Résumé des résultats
  log('\n' + '='.repeat(60), 'bold');
  log('📊 RÉSUMÉ DES TESTS', 'bold');
  log('='.repeat(60), 'bold');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  log(`\nTests réussis: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${status} ${test}: ${passed ? 'OK' : 'ÉCHEC'}`, color);
  });
  
  // Recommandations
  log('\n' + '='.repeat(60), 'bold');
  log('💡 RECOMMANDATIONS', 'bold');
  log('='.repeat(60), 'bold');
  
  if (results.backend && results.auth && results.offers && results.dashboard && results.token) {
    logSuccess('🎉 Application BMS entièrement fonctionnelle !');
    logInfo('Vous pouvez maintenant utiliser l\'application complète.');
  } else if (results.backend && results.auth) {
    logWarning('⚠️  Backend fonctionnel mais certains tests ont échoué.');
    logInfo('Vérifiez les logs pour plus de détails.');
  } else if (results.backend) {
    logError('❌ Backend accessible mais authentification défaillante.');
    logInfo('Vérifiez la base de données et les utilisateurs de test.');
  } else {
    logError('❌ Backend inaccessible.');
    logInfo('Démarrez le serveur backend avec: cd backend && npm run dev');
  }
  
  if (!results.frontend) {
    logWarning('⚠️  Frontend non accessible.');
    logInfo('Démarrez le frontend avec: cd frontend && npm run dev');
  }
  
  // Instructions de démarrage
  log('\n' + '='.repeat(60), 'bold');
  log('🚀 INSTRUCTIONS DE DÉMARRAGE', 'bold');
  log('='.repeat(60), 'bold');
  
  log('\n1. Démarrer le backend:');
  log('   cd backend && npm run dev', 'blue');
  
  log('\n2. Démarrer le frontend:');
  log('   cd frontend && npm run dev', 'blue');
  
  log('\n3. Accéder à l\'application:');
  log('   Frontend: http://localhost:3000', 'blue');
  log('   Backend: http://localhost:5000', 'blue');
  
  log('\n4. Comptes de test:');
  log('   Email: test@bms.com / Mot de passe: test123', 'blue');
  log('   Email: integration@bms.com / Mot de passe: integration123', 'blue');
  
  return results;
}

// Exécution du test
if (require.main === module) {
  runCompleteTest()
    .then(() => {
      log('\n🎯 Test terminé !', 'bold');
      process.exit(0);
    })
    .catch((error) => {
      logError(`Erreur lors du test: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runCompleteTest };
