const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'bms_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bms_db',
  password: process.env.DB_PASSWORD || 'motdepasse_bms',
  port: process.env.DB_PORT || 5432,
});

async function testSQLTypesOffres() {
  console.log('🧪 Test de la requête SQL des types d\'offres...');
  
  try {
    // Test de connexion
    const client = await pool.connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // Test de la requête simple d'abord
    console.log('\n[1/3] Test de la requête simple...');
    const simpleResult = await client.query(`
      SELECT 
        type_offre,
        COUNT(*) as total
      FROM offres
      GROUP BY type_offre
      ORDER BY total DESC
    `);
    
    console.log('✅ Requête simple réussie');
    console.log('📋 Types d\'offres trouvés:');
    simpleResult.rows.forEach(row => {
      console.log(`  - "${row.type_offre}": ${row.total} offres`);
    });
    
    // Test de la requête avec normalisation
    console.log('\n[2/3] Test de la requête avec normalisation...');
    const normalizedResult = await client.query(`
      SELECT 
        CASE 
          WHEN LOWER(type_offre) = 'ao' OR LOWER(type_offre) = 'appel d''offres' THEN 'AO'
          WHEN LOWER(type_offre) = 'ami' OR LOWER(type_offre) = 'appel a manifestation d''interet' THEN 'AMI'
          WHEN LOWER(type_offre) = 'avis general' OR LOWER(type_offre) = 'avis general' THEN 'Avis Général'
          WHEN LOWER(type_offre) = 'appel a projet' OR LOWER(type_offre) = 'appel a projet' THEN 'Appel à projet'
          WHEN LOWER(type_offre) = 'accord cadre' OR LOWER(type_offre) = 'accord-cadre' THEN 'Accord cadre'
          ELSE COALESCE(type_offre, 'Non spécifié')
        END as nom,
        COUNT(*) as total
      FROM offres
      GROUP BY 
        CASE 
          WHEN LOWER(type_offre) = 'ao' OR LOWER(type_offre) = 'appel d''offres' THEN 'AO'
          WHEN LOWER(type_offre) = 'ami' OR LOWER(type_offre) = 'appel a manifestation d''interet' THEN 'AMI'
          WHEN LOWER(type_offre) = 'avis general' OR LOWER(type_offre) = 'avis general' THEN 'Avis Général'
          WHEN LOWER(type_offre) = 'appel a projet' OR LOWER(type_offre) = 'appel a projet' THEN 'Appel à projet'
          WHEN LOWER(type_offre) = 'accord cadre' OR LOWER(type_offre) = 'accord-cadre' THEN 'Accord cadre'
          ELSE COALESCE(type_offre, 'Non spécifié')
        END
      ORDER BY total DESC
    `);
    
    console.log('✅ Requête avec normalisation réussie');
    console.log('📋 Types normalisés:');
    normalizedResult.rows.forEach(row => {
      console.log(`  - ${row.nom}: ${row.total} offres`);
    });
    
    // Test de la requête complète
    console.log('\n[3/3] Test de la requête complète...');
    const fullResult = await client.query(`
      SELECT 
        CASE 
          WHEN LOWER(type_offre) = 'ao' OR LOWER(type_offre) = 'appel d''offres' THEN 'AO'
          WHEN LOWER(type_offre) = 'ami' OR LOWER(type_offre) = 'appel a manifestation d''interet' THEN 'AMI'
          WHEN LOWER(type_offre) = 'avis general' OR LOWER(type_offre) = 'avis general' THEN 'Avis Général'
          WHEN LOWER(type_offre) = 'appel a projet' OR LOWER(type_offre) = 'appel a projet' THEN 'Appel à projet'
          WHEN LOWER(type_offre) = 'accord cadre' OR LOWER(type_offre) = 'accord-cadre' THEN 'Accord cadre'
          ELSE COALESCE(type_offre, 'Non spécifié')
        END as nom,
        COUNT(*) as total,
        COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) as gagnees,
        COUNT(CASE WHEN statut = 'rejetée' THEN 1 END) as perdues,
        CAST(
          (CAST(COUNT(CASE WHEN statut = 'approuvée' THEN 1 END) AS FLOAT) / COUNT(*)) * 100 AS DECIMAL(5,1)
        ) as taux_gagnees,
        CAST(
          (CAST(COUNT(CASE WHEN statut = 'rejetée' THEN 1 END) AS FLOAT) / COUNT(*)) * 100 AS DECIMAL(5,1)
        ) as taux_perdues
      FROM offres
      GROUP BY 
        CASE 
          WHEN LOWER(type_offre) = 'ao' OR LOWER(type_offre) = 'appel d''offres' THEN 'AO'
          WHEN LOWER(type_offre) = 'ami' OR LOWER(type_offre) = 'appel a manifestation d''interet' THEN 'AMI'
          WHEN LOWER(type_offre) = 'avis general' OR LOWER(type_offre) = 'avis general' THEN 'Avis Général'
          WHEN LOWER(type_offre) = 'appel a projet' OR LOWER(type_offre) = 'appel a projet' THEN 'Appel à projet'
          WHEN LOWER(type_offre) = 'accord cadre' OR LOWER(type_offre) = 'accord-cadre' THEN 'Accord cadre'
          ELSE COALESCE(type_offre, 'Non spécifié')
        END
      ORDER BY total DESC
    `);
    
    console.log('✅ Requête complète réussie');
    console.log('📊 Statistiques complètes:');
    fullResult.rows.forEach(row => {
      console.log(`  - ${row.nom}: ${row.total} total, ${row.gagnees} gagnées, ${row.perdues} perdues, ${row.taux_gagnees}% taux gagnées, ${row.taux_perdues}% taux perdues`);
    });
    
    client.release();
    console.log('\n🎉 Tous les tests SQL réussis !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test SQL:', error.message);
    console.error('Détails:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testSQLTypesOffres();
