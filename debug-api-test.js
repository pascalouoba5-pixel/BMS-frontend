#!/usr/bin/env node

/**
 * 🐛 DEBUG API TEST
 * Test détaillé des APIs problématiques
 */

// Configuration
const BACKEND_URL = 'http://localhost:5000';

async function debugAPI() {
  console.log('🔍 DEBUG API TEST');
  console.log('='.repeat(50));
  
  try {
    // 1. Test de connexion
    console.log('\n1️⃣ Test de connexion...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // 2. Test d'authentification
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
    
    if (!loginData.token) {
      console.log('❌ Pas de token reçu');
      return;
    }
    
    const token = loginData.token;
    console.log('✅ Token reçu:', token.substring(0, 20) + '...');
    
    // 3. Test API offres
    console.log('\n3️⃣ Test API offres...');
    const offresResponse = await fetch(`${BACKEND_URL}/api/offres`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status:', offresResponse.status);
    console.log('📊 Headers:', Object.fromEntries(offresResponse.headers.entries()));
    
    const offresData = await offresResponse.json();
    console.log('✅ Offres response:', offresData);
    
    // 4. Test vérification token
    console.log('\n4️⃣ Test vérification token...');
    const verifyResponse = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status:', verifyResponse.status);
    const verifyData = await verifyResponse.json();
    console.log('✅ Verify response:', verifyData);
    
    // 5. Test dashboard
    console.log('\n5️⃣ Test dashboard...');
    const dashboardResponse = await fetch(`${BACKEND_URL}/api/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const dashboardData = await dashboardResponse.json();
    console.log('✅ Dashboard response:', dashboardData);
    
    console.log('\n🎉 Tous les tests terminés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugAPI();
