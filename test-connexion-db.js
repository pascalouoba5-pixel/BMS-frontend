const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    client.release();
    
    console.log('✅ Connexion à la base de données réussie !');
    console.log(`🕐 Heure du serveur: ${result.rows[0].current_time}`);
    console.log(`📋 Version PostgreSQL: ${result.rows[0].db_version.split(' ')[1]}`);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    console.log('');
    console.log('🔍 Vérifiez que:');
    console.log('1. PostgreSQL est démarré');
    console.log('2. La base de données bms_db existe');
    console.log('3. L'utilisateur bms_user a les bons privilèges');
    console.log('4. Le mot de passe est correct');
    console.log('5. Le port 5432 est accessible');
  }
}

testConnection();
