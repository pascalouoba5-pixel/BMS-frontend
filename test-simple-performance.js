const fetch = require('node-fetch');

async function testSimplePerformance() {
  console.log('🧪 Test simple de l\'API de performance...');
  
  try {
    // 1. Login
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@bms.com', password: 'test123' }),
    });
    
    if (!loginResponse.ok) {
      throw new Error('Erreur de connexion');
    }
    
    const { token } = await loginResponse.json();
    console.log('✅ Connexion réussie');
    
    // 2. Test de l'API overview avec gestion d'erreur détaillée
    console.log('\n🔍 Test de l\'API overview...');
    const overviewResponse = await fetch('http://localhost:5000/api/performance/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`📊 Status: ${overviewResponse.status}`);
    console.log(`📊 StatusText: ${overviewResponse.statusText}`);
    
    const responseText = await overviewResponse.text();
    console.log(`📊 Response body: ${responseText}`);
    
    if (overviewResponse.ok) {
      console.log('✅ API overview fonctionne');
    } else {
      console.log('❌ API overview a échoué');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testSimplePerformance();
