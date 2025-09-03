const fetch = require('node-fetch');

async function testAPIConnection() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🔍 Test de connexion à l\'API backend...');
  console.log(`📍 URL: ${baseURL}`);
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Test du health check...');
    const healthResponse = await fetch(`${baseURL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check réussi:', healthData);
    } else {
      console.log('❌ Health check échoué:', healthResponse.status);
    }
    
    // Test 2: Route auth
    console.log('\n2️⃣ Test de la route auth...');
    const authResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    if (authResponse.status === 401) {
      console.log('✅ Route auth accessible (401 attendu pour identifiants incorrects)');
    } else {
      console.log('⚠️  Route auth:', authResponse.status);
    }
    
    // Test 3: Route inexistante
    console.log('\n3️⃣ Test d\'une route inexistante...');
    const notFoundResponse = await fetch(`${baseURL}/api/route-inexistante`);
    if (notFoundResponse.status === 404) {
      console.log('✅ Gestion 404 correcte');
    } else {
      console.log('⚠️  Gestion 404:', notFoundResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n💡 Suggestions:');
    console.log('- Vérifiez que le backend est démarré sur le port 5000');
    console.log('- Vérifiez que PostgreSQL est en cours d\'exécution');
    console.log('- Vérifiez les variables d\'environnement');
  }
}

testAPIConnection();
