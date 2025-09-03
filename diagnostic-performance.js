const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bms_db',
  user: process.env.DB_USER || 'bms_user',
  password: process.env.DB_PASSWORD || 'motdepasse_bms',
});

async function diagnosticPerformance() {
  try {
    console.log('🔍 Diagnostic de la base de données pour l\'API de performance');
    
    // 1. Vérifier la connexion
    console.log('\n1️⃣ Test de connexion...');
    const client = await pool.connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // 2. Vérifier la structure des tables
    console.log('\n2️⃣ Structure des tables...');
    const tablesResult = await client.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name IN ('offres', 'users', 'repartitions')
      ORDER BY table_name, ordinal_position
    `);
    
    console.log('📋 Colonnes des tables principales:');
    tablesResult.rows.forEach(row => {
      console.log(`   ${row.table_name}.${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // 3. Vérifier les données dans la table offres
    console.log('\n3️⃣ Données dans la table offres...');
    const offresCount = await client.query('SELECT COUNT(*) as total FROM offres');
    console.log(`📊 Total des offres: ${offresCount.rows[0].total}`);
    
    if (parseInt(offresCount.rows[0].total) > 0) {
      const offresSample = await client.query(`
        SELECT id, intitule_offre, pole_lead, pole_associes, statut, created_at
        FROM offres 
        LIMIT 5
      `);
      
      console.log('\n📋 Échantillon d\'offres:');
      offresSample.rows.forEach(offre => {
        console.log(`   ID: ${offre.id}, Titre: ${offre.intitule_offre}`);
        console.log(`      Pôle Lead: ${offre.pole_lead || 'NULL'}`);
        console.log(`      Pôle Associé: ${offre.pole_associes || 'NULL'}`);
        console.log(`      Statut: ${offre.statut}`);
        console.log(`      Créé le: ${offre.created_at}`);
        console.log('');
      });
    }
    
    // 4. Vérifier les pôles uniques
    console.log('\n4️⃣ Pôles uniques...');
    const polesResult = await client.query(`
      SELECT DISTINCT pole_lead as nom_pole FROM offres WHERE pole_lead IS NOT NULL
      UNION
      SELECT DISTINCT pole_associes as nom_pole FROM offres WHERE pole_associes IS NOT NULL
    `);
    
    console.log(`🏢 Nombre de pôles uniques: ${polesResult.rows.length}`);
    if (polesResult.rows.length > 0) {
      console.log('📋 Pôles trouvés:');
      polesResult.rows.forEach(pole => {
        console.log(`   - ${pole.nom_pole}`);
      });
    }
    
    // 5. Tester la requête simplifiée
    console.log('\n5️⃣ Test de la requête simplifiée...');
    try {
      const simpleQuery = await client.query(`
        SELECT 
          'Test' as nom_pole,
          COUNT(*) as total_offres
        FROM offres
        LIMIT 1
      `);
      console.log('✅ Requête simplifiée réussie');
      console.log(`   Résultat: ${simpleQuery.rows[0].total_offres} offres`);
    } catch (error) {
      console.log('❌ Requête simplifiée échouée:', error.message);
    }
    
    // 6. Vérifier les permissions
    console.log('\n6️⃣ Permissions de l\'utilisateur...');
    const permissionsResult = await client.query(`
      SELECT current_user, current_database(), session_user
    `);
    console.log(`👤 Utilisateur actuel: ${permissionsResult.rows[0].current_user}`);
    console.log(`🗄️ Base de données: ${permissionsResult.rows[0].current_database()}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  } finally {
    await pool.end();
  }
}

diagnosticPerformance();
