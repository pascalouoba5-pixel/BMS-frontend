// Utiliser fetch natif de Node.js

async function testAPI() {
  try {
    console.log('🧪 Test de l\'API des recherches programmées...');
    
    const response = await fetch('http://localhost:5000/api/scheduled-searches?userId=test-user');
    const data = await response.json();
    
    console.log('✅ Réponse de l\'API:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('🎉 API fonctionne correctement !');
      console.log(`📊 Nombre de recherches programmées: ${data.searches.length}`);
    } else {
      console.log('❌ Erreur dans la réponse de l\'API');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API:', error.message);
  }
}

testAPI();
