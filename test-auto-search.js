const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

async function testAutoSearch() {
  try {
    console.log('🧪 Test de l\'API de recherche automatique...\n');

    // 1. Test de santé du serveur
    console.log('1️⃣ Test de santé du serveur...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Serveur en ligne');
    } else {
      console.log('❌ Serveur hors ligne');
      return;
    }

    // 2. Connexion pour obtenir un token
    console.log('\n2️⃣ Connexion pour obtenir un token...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'superadmin@bms.com',
        password: 'admin1234'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      authToken = loginData.token;
      console.log('✅ Connexion réussie, token obtenu');
    } else {
      console.log('❌ Échec de la connexion');
      const errorData = await loginResponse.json();
      console.log('Erreur:', errorData);
      return;
    }

    // 3. Test de la liste des sites supportés
    console.log('\n3️⃣ Test de la liste des sites supportés...');
    const sitesResponse = await fetch(`${BASE_URL}/auto-search/sites`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (sitesResponse.ok) {
      const sitesData = await sitesResponse.json();
      console.log('✅ Sites supportés récupérés:');
      console.log(`   - Total: ${sitesData.total_sites} sites`);
      sitesData.sites.forEach(site => {
        console.log(`   - ${site.icon} ${site.name}: ${site.description}`);
      });
    } else {
      console.log('❌ Échec de la récupération des sites');
      const errorData = await sitesResponse.json();
      console.log('Erreur:', errorData);
    }

    // 4. Test du statut des sites
    console.log('\n4️⃣ Test du statut des sites...');
    const statusResponse = await fetch(`${BASE_URL}/auto-search/status`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Statut des sites récupéré:');
      console.log(`   - Total: ${statusData.summary.total_sites} sites`);
      console.log(`   - En ligne: ${statusData.summary.online_sites} sites`);
      console.log(`   - Hors ligne: ${statusData.summary.offline_sites} sites`);
    } else {
      console.log('❌ Échec de la récupération du statut');
      const errorData = await statusResponse.json();
      console.log('Erreur:', errorData);
    }

    // 5. Test de recherche automatique
    console.log('\n5️⃣ Test de recherche automatique...');
    const searchResponse = await fetch(`${BASE_URL}/auto-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        keywords: 'développement informatique',
        maxResults: 20
      })
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ Recherche automatique réussie:');
      console.log(`   - Mots-clés: "${searchData.keywords}"`);
      console.log(`   - Sites recherchés: ${searchData.sites_searched.length}`);
      console.log(`   - Résultats trouvés: ${searchData.total_results}`);
      console.log(`   - Sites réussis: ${searchData.search_summary.sites_successful}`);
      console.log(`   - Sites échoués: ${searchData.search_summary.sites_failed}`);
      
      if (searchData.results.length > 0) {
        console.log('\n   📋 Exemples de résultats:');
        searchData.results.slice(0, 3).forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.title}`);
          console.log(`      Source: ${result.source} | Pertinence: ${(result.relevance * 100).toFixed(1)}%`);
          console.log(`      Valeur: ${result.estimated_value?.toLocaleString('fr-FR')} € | Localisation: ${result.location}`);
        });
      }
    } else {
      console.log('❌ Échec de la recherche automatique');
      const errorData = await searchResponse.json();
      console.log('Erreur:', errorData);
    }

    console.log('\n🎉 Tests terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests
testAutoSearch();
