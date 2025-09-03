const { Pool } = require('pg');

// Configuration de la base de données
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bms_db',
  password: 'postgres',
  port: 5432,
});

async function checkUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs dans la base de données...');
    
    const client = await pool.connect();
    
    // Vérifier la table users
    const usersResult = await client.query('SELECT id, email, username, role, created_at FROM users ORDER BY id');
    
    console.log(`\n📊 Table users: ${usersResult.rows.length} utilisateur(s)`);
    usersResult.rows.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email}, Username: ${user.username}, Rôle: ${user.role}, Créé: ${user.created_at}`);
    });
    
    // Vérifier la table offres
    const offresResult = await client.query('SELECT COUNT(*) as total FROM offres');
    console.log(`\n📋 Table offres: ${offresResult.rows[0].total} offre(s)`);
    
    // Vérifier la structure de la table users
    const structureResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n🏗️  Structure de la table users:');
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

checkUsers();
