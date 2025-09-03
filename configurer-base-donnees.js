const fs = require('fs');
const path = require('path');

// Informations de base de données fournies par l'utilisateur
const dbConfig = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'bms_db',
  DB_USER: 'bms_user',
  DB_PASSWORD: 'motdepasse_bms'
};

// Configuration complète de l'environnement
const envConfig = {
  ...dbConfig,
  NODE_ENV: 'development',
  PORT: '5000',
  JWT_SECRET: 'votre_secret_jwt_tres_securise_ici',
  JWT_EXPIRES_IN: '24h',
  LOG_LEVEL: 'info',
  CORS_ORIGIN: 'http://localhost:3000'
};

console.log('🔧 Configuration de la base de données BMS...');
console.log('');

// 1. Créer le fichier .env
const envPath = path.join(__dirname, 'backend', '.env');
const envContent = Object.entries(envConfig)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Fichier .env créé avec succès');
  console.log(`📁 Chemin: ${envPath}`);
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env:', error.message);
  console.log('💡 Créez manuellement le fichier backend/.env avec le contenu suivant:');
  console.log('');
  console.log(envContent);
  console.log('');
}

// 2. Vérifier la configuration de la base de données
console.log('');
console.log('📊 Configuration de la base de données:');
console.log(`🌐 Host: ${dbConfig.DB_HOST}`);
console.log(`🔌 Port: ${dbConfig.DB_PORT}`);
console.log(`🗄️  Base: ${dbConfig.DB_NAME}`);
console.log(`👤 Utilisateur: ${dbConfig.DB_USER}`);
console.log(`🔑 Mot de passe: ${dbConfig.DB_PASSWORD ? '***configuré***' : '❌ manquant'}`);

// 3. Instructions pour créer la base de données
console.log('');
console.log('🚀 Instructions pour créer la base de données PostgreSQL:');
console.log('');
console.log('1. Connectez-vous à PostgreSQL en tant que super-utilisateur:');
console.log('   psql -U postgres');
console.log('');
console.log('2. Créez la base de données:');
console.log(`   CREATE DATABASE ${dbConfig.DB_NAME};`);
console.log('');
console.log('3. Créez l\'utilisateur:');
console.log(`   CREATE USER ${dbConfig.DB_USER} WITH PASSWORD '${dbConfig.DB_PASSWORD}';`);
console.log('');
console.log('4. Accordez les privilèges:');
console.log(`   GRANT ALL PRIVILEGES ON DATABASE ${dbConfig.DB_NAME} TO ${dbConfig.DB_USER};`);
console.log(`   GRANT ALL ON SCHEMA public TO ${dbConfig.DB_USER};`);
console.log('');
console.log('5. Quittez psql:');
console.log('   \\q');
console.log('');

// 4. Script SQL pour créer la base de données
const sqlScript = `-- Script SQL pour créer la base de données BMS
-- Exécutez ces commandes en tant que super-utilisateur PostgreSQL

-- 1. Créer la base de données
CREATE DATABASE ${dbConfig.DB_NAME};

-- 2. Créer l'utilisateur
CREATE USER ${dbConfig.DB_USER} WITH PASSWORD '${dbConfig.DB_PASSWORD}';

-- 3. Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE ${dbConfig.DB_NAME} TO ${dbConfig.DB_USER};
GRANT ALL ON SCHEMA public TO ${dbConfig.DB_USER};

-- 4. Se connecter à la base de données
\\c ${dbConfig.DB_NAME}

-- 5. Accorder les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO ${dbConfig.DB_USER};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${dbConfig.DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${dbConfig.DB_USER};
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ${dbConfig.DB_USER};

-- 6. Configurer les privilèges par défaut
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${dbConfig.DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${dbConfig.DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ${dbConfig.DB_USER};
`;

const sqlPath = path.join(__dirname, 'creer-base-donnees.sql');
try {
  fs.writeFileSync(sqlPath, sqlScript, 'utf8');
  console.log('✅ Script SQL créé avec succès');
  console.log(`📁 Chemin: ${sqlPath}`);
} catch (error) {
  console.error('❌ Erreur lors de la création du script SQL:', error.message);
}

// 5. Script de test de connexion
const testScript = `const { Pool } = require('pg');
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
    console.log(\`🕐 Heure du serveur: \${result.rows[0].current_time}\`);
    console.log(\`📋 Version PostgreSQL: \${result.rows[0].db_version.split(' ')[1]}\`);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    console.log('');
    console.log('🔍 Vérifiez que:');
    console.log('1. PostgreSQL est démarré');
    console.log('2. La base de données ${dbConfig.DB_NAME} existe');
    console.log('3. L\'utilisateur ${dbConfig.DB_USER} a les bons privilèges');
    console.log('4. Le mot de passe est correct');
    console.log('5. Le port ${dbConfig.DB_PORT} est accessible');
  }
}

testConnection();
`;

const testPath = path.join(__dirname, 'test-connexion-db.js');
try {
  fs.writeFileSync(testPath, testScript, 'utf8');
  console.log('✅ Script de test de connexion créé avec succès');
  console.log(`📁 Chemin: ${testPath}`);
} catch (error) {
  console.error('❌ Erreur lors de la création du script de test:', error.message);
}

console.log('');
console.log('🎯 Configuration terminée !');
console.log('');
console.log('📋 Fichiers créés:');
console.log(`- backend/.env (configuration de l'environnement)`);
console.log(`- creer-base-donnees.sql (script SQL)`);
console.log(`- test-connexion-db.js (test de connexion)`);
console.log('');
console.log('🚀 Prochaines étapes:');
console.log('1. Créez la base de données avec le script SQL');
console.log('2. Testez la connexion: node test-connexion-db.js');
console.log('3. Démarrez le serveur: npm start');
console.log('');
console.log('💡 En cas de problème, vérifiez les logs et la configuration réseau PostgreSQL');
