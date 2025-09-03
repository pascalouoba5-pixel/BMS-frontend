const { Pool } = require('pg');

// Configuration de la base de données
const pool = new Pool({
  user: 'bms_user',
  host: 'localhost',
  database: 'bms_db',
  password: 'motdepasse_bms',
  port: 5432,
});

async function testPerformanceSQL() {
  try {
    console.log('🧪 Test direct des requêtes SQL de l\'API de performance...');
    
    const client = await pool.connect();
    
    // Test 1: Statistiques globales
    console.log('\n[1/4] Test des statistiques globales...');
    try {
      const statsResult = await client.query(`
        SELECT 
          COUNT(*) as total_offres,
          COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) as offres_approuvees,
          COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as offres_en_attente,
          COUNT(CASE WHEN statut = 'rejetée' THEN 1 END) as offres_rejetees,
          COUNT(CASE WHEN priorite = 'haute' THEN 1 END) as offres_prioritaires
        FROM offres
      `);
      console.log('✅ Statistiques globales:', statsResult.rows[0]);
    } catch (error) {
      console.error('❌ Erreur statistiques globales:', error.message);
    }
    
    // Test 2: Évolution sur 12 mois
    console.log('\n[2/4] Test de l\'évolution sur 12 mois...');
    try {
      const evolutionResult = await client.query(`
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') as mois,
          COUNT(*) as total_offres,
          COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) as offres_approuvees
        FROM offres
        WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY mois DESC
        LIMIT 12
      `);
      console.log('✅ Évolution sur 12 mois:', evolutionResult.rows.length, 'lignes');
    } catch (error) {
      console.error('❌ Erreur évolution:', error.message);
    }
    
    // Test 3: Top 5 des commerciaux
    console.log('\n[3/4] Test du top 5 des commerciaux...');
    try {
      const topPerformersResult = await client.query(`
        SELECT 
          u.username as nom_commercial,
          COUNT(o.id) as total_offres,
          COUNT(CASE WHEN o.statut = 'approuvée' THEN 1 END) as offres_approuvees,
          CAST(
            (CAST(COUNT(CASE WHEN o.statut = 'approuvée' THEN 1 END) AS FLOAT) / COUNT(o.id)) * 100 AS DECIMAL(5,1)
          ) as taux_reussite
        FROM users u
        LEFT JOIN offres o ON u.id = o.created_by
        WHERE u.role IN ('user', 'manager', 'charge_partenariat')
        GROUP BY u.id, u.username
        HAVING COUNT(o.id) > 0
        ORDER BY taux_reussite DESC
        LIMIT 5
      `);
      console.log('✅ Top 5 des commerciaux:', topPerformersResult.rows.length, 'lignes');
      if (topPerformersResult.rows.length > 0) {
        console.log('  Premier:', topPerformersResult.rows[0]);
      }
    } catch (error) {
      console.error('❌ Erreur top commerciaux:', error.message);
    }
    
    // Test 4: Analyse par pôle
    console.log('\n[4/4] Test de l\'analyse par pôle...');
    try {
      const polesResult = await client.query(`
        SELECT 
          pole_lead as nom_pole,
          COUNT(*) as total_offres,
          COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) as offres_approuvees,
          COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as offres_en_attente,
          COUNT(CASE WHEN statut = 'rejetée' THEN 1 END) as offres_rejetees,
          COUNT(CASE WHEN priorite = 'haute' THEN 1 END) as offres_prioritaires,
          CAST(
            (CAST(COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) AS FLOAT) / COUNT(*)) * 100 AS DECIMAL(5,1)
          ) as taux_reussite
        FROM offres
        WHERE pole_lead IS NOT NULL
        GROUP BY pole_lead
        ORDER BY taux_reussite DESC
      `);
      console.log('✅ Analyse par pôle:', polesResult.rows.length, 'lignes');
      if (polesResult.rows.length > 0) {
        console.log('  Premier pôle:', polesResult.rows[0]);
      }
    } catch (error) {
      console.error('❌ Erreur analyse par pôle:', error.message);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  } finally {
    await pool.end();
  }
}

testPerformanceSQL();
