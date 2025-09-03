const { Pool } = require('pg');

// Configuration de la base de données
const pool = new Pool({
  user: 'bms_user',
  host: 'localhost',
  database: 'bms_db',
  password: 'motdepasse_bms',
  port: 5432,
});

async function checkDatabaseData() {
  try {
    console.log('🔍 Vérification des données dans la base de données...');
    
    const client = await pool.connect();
    
    // Vérifier la table users
    const usersResult = await client.query('SELECT COUNT(*) as total FROM users');
    console.log(`\n👥 Utilisateurs: ${usersResult.rows[0].total}`);
    
    // Vérifier la table offres
    const offresResult = await client.query('SELECT COUNT(*) as total FROM offres');
    console.log(`📋 Offres: ${offresResult.rows[0].total}`);
    
    // Vérifier quelques offres
    if (offresResult.rows[0].total > 0) {
      const sampleOffres = await client.query('SELECT id, statut, pole_lead, created_at FROM offres LIMIT 5');
      console.log('\n📋 Exemples d\'offres:');
      sampleOffres.rows.forEach((offre, index) => {
        console.log(`  ${index + 1}. ID: ${offre.id}, Statut: ${offre.statut}, Pôle: ${offre.pole_lead || 'Aucun'}, Créé: ${offre.created_at}`);
      });
    }
    
    // Vérifier la structure de la table offres
    const structureResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'offres' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n🏗️  Structure de la table offres:');
    structureResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabaseData();
