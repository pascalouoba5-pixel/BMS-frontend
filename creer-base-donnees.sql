-- Script SQL pour créer la base de données BMS
-- Exécutez ces commandes en tant que super-utilisateur PostgreSQL

-- 1. Créer la base de données
CREATE DATABASE bms_db;

-- 2. Créer l'utilisateur
CREATE USER bms_user WITH PASSWORD 'motdepasse_bms';

-- 3. Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE bms_db TO bms_user;
GRANT ALL ON SCHEMA public TO bms_user;

-- 4. Se connecter à la base de données
\c bms_db

-- 5. Accorder les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO bms_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bms_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bms_user;

-- 6. Configurer les privilèges par défaut
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bms_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bms_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO bms_user;
