const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Test de connexion simple à PostgreSQL...');
console.log('');

// Afficher la configuration
console.log('📊 Configuration de la base de données:');
console.log(`🌐 Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`🔌 Port: ${process.env.DB_PORT || '5432'}`);
console.log(`🗄️  Base: ${process.env.DB_NAME || 'bms_db'}`);
console.log(`👤 Utilisateur: ${process.env.DB_USER || 'bms_user'}`);
console.log(`🔑 Mot de passe: ${process.env.DB_PASSWORD ? '***configuré***' : '❌ manquant'}`);
console.log('');

// Créer le pool de connexion
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test de connexion simple
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connexion échouée', err.stack);
    console.log('');
    console.log('🔍 Détails de l\'erreur:');
    console.log(`Code: ${err.code}`);
    console.log(`Message: ${err.message}`);
    console.log('');
    console.log('💡 Solutions possibles:');
    console.log('1. Vérifiez que PostgreSQL est démarré');
    console.log('2. Vérifiez que la base de données existe');
    console.log('3. Vérifiez les informations de connexion');
    console.log('4. Vérifiez que l\'utilisateur a les bons privilèges');
  } else {
    console.log('✅ Connecté à PostgreSQL avec succès !');
    console.log(`🕐 Heure du serveur: ${res.rows[0].now}`);
    console.log('');
    console.log('🎯 Connexion établie, vous pouvez maintenant:');
    console.log('- Démarrer le serveur backend');
    console.log('- Accéder au dashboard');
    console.log('- Utiliser toutes les fonctionnalités BMS');
  }
  
  // Fermer le pool
  pool.end();
});
