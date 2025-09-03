const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

async function testPerformanceDetailed() {
  try {
    console.log('🧪 Test de l\'API d\'analyse détaillée par pôle');
    
    // 1. Vérifier la santé de l'API
    console.log('\n1️⃣ Vérification de la santé de l\'API...');
    try {
      const healthResponse = await fetch(`${BASE_URL}/health`);
      if (healthResponse.ok) {
        console.log('✅ API accessible');
      } else {
        console.log('⚠️ API accessible mais endpoint /health non disponible');
      }
    } catch (error) {
      console.log('⚠️ Endpoint /health non disponible, continuons...');
    }

    // 2. Se connecter pour obtenir un token
    console.log('\n2️⃣ Connexion pour obtenir un token...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@bms.com',
        password: 'test123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Échec de la connexion: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    authToken = loginData.token;
    console.log('✅ Connexion réussie, token obtenu');

    // 3. Tester l'API d'analyse détaillée par pôle sans filtres
    console.log('\n3️⃣ Test de l\'API poles-detailed sans filtres...');
    const polesDetailedResponse = await fetch(`${BASE_URL}/performance/poles-detailed`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!polesDetailedResponse.ok) {
      throw new Error(`Échec de la récupération des données: ${polesDetailedResponse.status} ${polesDetailedResponse.statusText}`);
    }

    const polesDetailedData = await polesDetailedResponse.json();
    console.log('✅ Données récupérées avec succès');
    console.log(`📊 Nombre de pôles: ${polesDetailedData.data.length}`);
    
    if (polesDetailedData.data.length > 0) {
      console.log('\n📋 Premier pôle:');
      console.log(`   Nom: ${polesDetailedData.data[0].nom}`);
      console.log(`   Offres Lead attribuées: ${polesDetailedData.data[0].offresLeadAttribuees}`);
      console.log(`   Offres Associé attribuées: ${polesDetailedData.data[0].offresAssocieAttribuees}`);
      console.log(`   Offres Lead montées: ${polesDetailedData.data[0].offresLeadMontees}`);
      console.log(`   Offres Associé montées: ${polesDetailedData.data[0].offresAssocieMontees}`);
      console.log(`   Taux de succès: ${polesDetailedData.data[0].tauxSucces}%`);
      console.log(`   Taux de perte: ${polesDetailedData.data[0].tauxPerte}%`);
      console.log(`   Taux d'attente: ${polesDetailedData.data[0].tauxAttente}%`);
    }

    // 4. Tester l'API avec filtres de date
    console.log('\n4️⃣ Test de l\'API poles-detailed avec filtres de date...');
    const startDate = '2025-01-01';
    const endDate = '2025-12-31';
    
    const polesDetailedFilteredResponse = await fetch(`${BASE_URL}/performance/poles-detailed?startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!polesDetailedFilteredResponse.ok) {
      throw new Error(`Échec de la récupération des données filtrées: ${polesDetailedFilteredResponse.status} ${polesDetailedFilteredResponse.statusText}`);
    }

    const polesDetailedFilteredData = await polesDetailedFilteredResponse.json();
    console.log('✅ Données filtrées récupérées avec succès');
    console.log(`📊 Nombre de pôles (période ${startDate} à ${endDate}): ${polesDetailedFilteredData.data.length}`);

    // 5. Vérifier la structure des données
    console.log('\n5️⃣ Vérification de la structure des données...');
    if (polesDetailedData.data.length > 0) {
      const pole = polesDetailedData.data[0];
      const requiredFields = [
        'nom', 'offresLeadAttribuees', 'offresAssocieAttribuees', 
        'offresLeadMontees', 'offresAssocieMontees', 'tauxSucces', 
        'tauxPerte', 'tauxAttente', 'totalOffres', 'offresGagnees', 
        'offresPerdues', 'offresEnCours'
      ];
      
      const missingFields = requiredFields.filter(field => !(field in pole));
      if (missingFields.length === 0) {
        console.log('✅ Tous les champs requis sont présents');
      } else {
        console.log('❌ Champs manquants:', missingFields);
      }
    }

    // 6. Vérifier le tri par performance
    console.log('\n6️⃣ Vérification du tri par performance...');
    const sortedPoles = [...polesDetailedData.data].sort((a, b) => b.tauxSucces - a.tauxSucces);
    const isCorrectlySorted = JSON.stringify(sortedPoles) === JSON.stringify(polesDetailedData.data);
    
    if (isCorrectlySorted) {
      console.log('✅ Les pôles sont correctement triés par taux de succès');
    } else {
      console.log('⚠️ Les pôles ne sont pas triés par taux de succès');
    }

    console.log('\n🎉 Test de l\'API d\'analyse détaillée par pôle terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Détails de la réponse:', error.response.status, error.response.statusText);
    }
  }
}

testPerformanceDetailed();
