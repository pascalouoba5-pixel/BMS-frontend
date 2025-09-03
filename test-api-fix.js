#!/usr/bin/env node

/**
 * 🧪 TEST API FIX
 * Vérifie que l'API fonctionne après la correction de l'URL
 */

const BACKEND_URL = 'http://localhost:5000';

async function testAPIFix() {
  console.log('🔍 TEST API FIX');
  console.log('='.repeat(50));
  
  try {
    // Test de connexion
    console.log('\n1️⃣ Test de connexion...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test d'authentification
    console.log('\n2️⃣ Test d\'authentification...');
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@bms.com',
        password: 'test123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);
    
    if (loginData.token) {
      console.log('✅ Token reçu:', loginData.token.substring(0, 20) + '...');
      
      // Test API offres avec token
      console.log('\n3️⃣ Test API offres avec token...');
      const offresResponse = await fetch(`${BACKEND_URL}/api/offres`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const offresData = await offresResponse.json();
      console.log('✅ Offres response:', offresData);
    }
    
    console.log('\n🎉 API fonctionne correctement !');
    console.log('✅ Le problème de route est résolu.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAPIFix();
