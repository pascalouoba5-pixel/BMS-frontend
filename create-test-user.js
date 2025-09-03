const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bms_db',
  user: process.env.DB_USER || 'bms_user',
  password: process.env.DB_PASSWORD || 'motdepasse_bms',
});

async function createTestUser() {
  try {
    console.log('🔧 Création d\'un utilisateur de test...');
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['test@bms.com']
    );
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Utilisateur de test existe déjà');
      return;
    }
    
    // Créer un hash du mot de passe
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    // Insérer l'utilisateur de test
    const result = await pool.query(`
      INSERT INTO users (username, email, password_hash, role, nom, prenom)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, role
    `, [
      'testuser',
      'test@bms.com',
      hashedPassword,
      'admin',
      'Test',
      'User'
    ]);
    
    console.log('✅ Utilisateur de test créé avec succès:');
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Username: ${result.rows[0].username}`);
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Role: ${result.rows[0].role}`);
    console.log('   Mot de passe: test123');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur de test:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();
