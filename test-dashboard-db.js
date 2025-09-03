const { query } = require('./backend/config/database');

// Fonction de test de la base de données
async function testDashboardDatabase() {
  console.log('🧪 Test de la base de données pour le dashboard...\n');

  try {
    // Test 1: Vérifier la connexion
    console.log('🔌 Test de connexion...');
    const connectionTest = await query('SELECT NOW() as current_time');
    console.log('✅ Connexion réussie:', connectionTest.rows[0].current_time);

    // Test 2: Vérifier la table offres
    console.log('\n📊 Test de la table offres...');
    const offresCount = await query('SELECT COUNT(*) as total FROM offres');
    console.log('✅ Nombre total d\'offres:', offresCount.rows[0].total);

    // Test 3: Vérifier la table users
    console.log('\n👥 Test de la table users...');
    const usersCount = await query('SELECT COUNT(*) as total FROM users');
    console.log('✅ Nombre total d\'utilisateurs:', usersCount.rows[0].total);

    // Test 4: Test de la requête des statistiques
    console.log('\n📈 Test de la requête des statistiques...');
    const statsTest = await query(`
      SELECT 
        COUNT(*) as total_offres,
        COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as offres_en_attente,
        COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) as offres_approuvees,
        COUNT(CASE WHEN statut = 'rejetée' THEN 1 END) as offres_rejetees,
        COALESCE(SUM(CASE WHEN statut = 'approuvée' THEN montant ELSE 0 END), 0) as total_budget
      FROM offres
    `);
    console.log('✅ Statistiques récupérées:', statsTest.rows[0]);

    // Test 5: Test de la requête des commerciaux
    console.log('\n👤 Test de la requête des commerciaux...');
    const commerciauxTest = await query(`
      SELECT 
        COUNT(DISTINCT u.id) as total_commerciaux,
        COUNT(CASE WHEN o.statut = 'approuvée' THEN 1 END) as objectifs_atteints,
        COUNT(CASE WHEN o.statut = 'en_attente' THEN 1 END) as en_cours
      FROM users u
      LEFT JOIN offres o ON u.id = o.created_by
      WHERE u.role IN ('user', 'manager', 'charge_partenariat')
    `);
    console.log('✅ Données des commerciaux:', commerciauxTest.rows[0]);

    // Test 6: Test de la requête des pôles
    console.log('\n🏢 Test de la requête des pôles...');
    const polesTest = await query(`
      SELECT 
        pole_lead as nom_pole,
        COUNT(*) as offres_traitees,
        COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) as offres_validees
      FROM offres
      WHERE pole_lead IS NOT NULL
      GROUP BY pole_lead
      ORDER BY offres_traitees DESC
      LIMIT 3
    `);
    console.log('✅ Données des pôles:', polesTest.rows);

    // Test 7: Test de la requête des résultats
    console.log('\n💰 Test de la requête des résultats...');
    const resultatsTest = await query(`
      SELECT 
        COALESCE(SUM(montant), 0) as ca_genere,
        COUNT(*) as total_offres,
        COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) as offres_validees
      FROM offres
    `);
    console.log('✅ Données des résultats:', resultatsTest.rows[0]);

    console.log('\n🎉 Tous les tests de base de données sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test de la base de données:', error.message);
    console.error('🔍 Détails:', error);
  }
}

// Exécuter le test
testDashboardDatabase();
