const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

async function testScheduledSearches() {
  try {
    console.log('🧪 Test de l\'API des recherches programmées...\n');

    // 1. Connexion pour obtenir un token
    console.log('1️⃣ Connexion pour obtenir un token...');
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

    // 2. Récupérer les recherches programmées existantes
    console.log('\n2️⃣ Récupération des recherches programmées existantes...');
    const getResponse = await fetch(`${BASE_URL}/scheduled-searches`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (getResponse.ok) {
      const searchesData = await getResponse.json();
      console.log('✅ Recherches programmées récupérées:');
      console.log(`   - Total: ${searchesData.searches.length} recherches`);
      if (searchesData.searches.length > 0) {
        searchesData.searches.forEach((search, index) => {
          console.log(`   ${index + 1}. "${search.keywords}" (${search.frequency}) - ${search.is_active ? 'Active' : 'Inactive'}`);
        });
      }
    } else {
      console.log('❌ Échec de la récupération des recherches programmées');
      const errorData = await getResponse.json();
      console.log('Erreur:', errorData);
    }

    // 3. Créer une nouvelle recherche programmée
    console.log('\n3️⃣ Création d\'une nouvelle recherche programmée...');
    const createResponse = await fetch(`${BASE_URL}/scheduled-searches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        keywords: 'développement web',
        frequency: 'daily',
        customSchedule: {
          weekDays: [1, 2, 3, 4, 5], // Lundi à vendredi
          hours: [9, 14] // 9h et 14h
        }
      })
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Nouvelle recherche programmée créée:');
      console.log(`   - ID: ${createData.search.id}`);
      console.log(`   - Mots-clés: "${createData.search.nom_recherche}"`);
      console.log(`   - Fréquence: ${createData.search.frequence}`);
      console.log(`   - Prochaine exécution: ${new Date(createData.search.prochaine_execution).toLocaleString('fr-FR')}`);
      console.log(`   - Message: ${createData.message}`);
    } else {
      console.log('❌ Échec de la création de la recherche programmée');
      const errorData = await createResponse.json();
      console.log('Erreur:', errorData);
    }

    // 4. Récupérer à nouveau pour vérifier l'ajout
    console.log('\n4️⃣ Vérification de l\'ajout...');
    const getResponse2 = await fetch(`${BASE_URL}/scheduled-searches`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (getResponse2.ok) {
      const searchesData2 = await getResponse2.json();
      console.log('✅ Recherches programmées après ajout:');
      console.log(`   - Total: ${searchesData2.searches.length} recherches`);
      searchesData2.searches.forEach((search, index) => {
        console.log(`   ${index + 1}. "${search.keywords}" (${search.frequency}) - ${search.is_active ? 'Active' : 'Inactive'}`);
      });
    } else {
      console.log('❌ Échec de la récupération après ajout');
    }

    // 5. Test des statistiques
    console.log('\n5️⃣ Test des statistiques...');
    const statsResponse = await fetch(`${BASE_URL}/scheduled-searches/statistiques`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Statistiques récupérées:');
      console.log(`   - Total: ${statsData.total_recherches} recherches`);
      console.log(`   - Actives: ${statsData.recherches_actives} recherches`);
      console.log(`   - Inactives: ${statsData.recherches_inactives} recherches`);
      console.log(`   - Par fréquence: ${JSON.stringify(statsData.par_frequence)}`);
    } else {
      console.log('❌ Échec de la récupération des statistiques');
      const errorData = await statsResponse.json();
      console.log('Erreur:', errorData);
    }

    console.log('\n🎉 Tests des recherches programmées terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests
testScheduledSearches();
