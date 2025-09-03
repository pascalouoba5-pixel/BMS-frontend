const API_BASE_URL = 'http://localhost:5000';

async function testCommerciauxDetaille() {
  try {
    console.log('🧪 Test des statistiques détaillées des commerciaux...');
    
    // Test avec différentes périodes
    const periods = ['today', 'week', 'month', 'quarter', 'year'];
    
    for (const period of periods) {
      console.log(`\n📅 Test avec la période: ${period}`);
      
      const response = await fetch(`${API_BASE_URL}/api/dashboard/commerciaux-detaille?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token' // Token de test
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Succès pour ${period}:`, {
          offresParAgent: data.data.offresParAgent?.length || 0,
          typesOffresParAgent: data.data.typesOffresParAgent?.length || 0,
          offresStatutParAgent: data.data.offresStatutParAgent?.length || 0,
          offresParSite: data.data.offresParSite?.length || 0,
          offresParBailleur: data.data.offresParBailleur?.length || 0,
          typesOffresStatutParAgent: data.data.typesOffresStatutParAgent?.length || 0,
          tauxValidationParAgent: data.data.tauxValidationParAgent?.length || 0
        });
      } else {
        const errorData = await response.json();
        console.log(`❌ Erreur pour ${period}:`, errorData);
      }
    }
    
    // Test avec des dates personnalisées
    console.log('\n📅 Test avec des dates personnalisées...');
    const customResponse = await fetch(`${API_BASE_URL}/api/dashboard/commerciaux-detaille?period=custom&startDate=2024-01-01&endDate=2024-12-31`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (customResponse.ok) {
      const data = await customResponse.json();
      console.log('✅ Succès pour les dates personnalisées:', {
        offresParAgent: data.data.offresParAgent?.length || 0,
        typesOffresParAgent: data.data.typesOffresParAgent?.length || 0,
        offresStatutParAgent: data.data.offresStatutParAgent?.length || 0,
        offresParSite: data.data.offresParSite?.length || 0,
        offresParBailleur: data.data.offresParBailleur?.length || 0,
        typesOffresStatutParAgent: data.data.typesOffresStatutParAgent?.length || 0,
        tauxValidationParAgent: data.data.tauxValidationParAgent?.length || 0
      });
    } else {
      const errorData = await customResponse.json();
      console.log('❌ Erreur pour les dates personnalisées:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Lancer le test
testCommerciauxDetaille();
