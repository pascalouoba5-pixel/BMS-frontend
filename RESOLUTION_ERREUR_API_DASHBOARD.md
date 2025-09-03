# 🔧 Résolution de l'Erreur API Dashboard BMS

## 🚨 Erreur Rencontrée

```
Error: Erreur API: Erreur lors de la récupération des données complètes
    at apiCall (webpack-internal:///(app-pages-browser)/./services/api.ts:71:15)
    at async useDashboardSync.useCallback[fetchData] (webpack-internal:///(app-pages-browser)/./hooks/useDashboardSync.ts:58:34)
```

## 🔍 Diagnostic du Problème

Cette erreur indique que le frontend ne peut pas communiquer avec l'API backend. Voici les causes possibles et leurs solutions :

## 🚀 Solution Rapide

### 1. Script de Démarrage Automatique

**Windows (CMD) :**
```bash
start-and-test-backend.bat
```

**Windows (PowerShell) :**
```powershell
.\start-and-test-backend.ps1
```

**Linux/Mac :**
```bash
cd backend
npm install
npm start
```

### 2. Test Manuel de l'API

```bash
cd backend
node test-api-dashboard.js
```

## 📋 Vérifications Étape par Étape

### Étape 1: Vérifier le Serveur Backend

1. **Vérifier que le serveur est démarré :**
   ```bash
   cd backend
   npm start
   ```

2. **Vérifier le port :**
   - Le serveur doit être accessible sur `http://localhost:5000`
   - Vérifier qu'aucun autre service n'utilise le port 5000

3. **Vérifier les logs du serveur :**
   - Regarder la console du serveur backend
   - Vérifier les messages d'erreur

### Étape 2: Vérifier la Base de Données

1. **Vérifier PostgreSQL :**
   ```bash
   # Windows
   services.msc
   # Chercher "PostgreSQL" et vérifier qu'il est démarré
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Vérifier la connexion :**
   ```bash
   cd backend
   node -e "
   const { testConnection } = require('./config/database.js');
   testConnection().then(console.log).catch(console.error);
   "
   ```

3. **Vérifier les tables :**
   ```sql
   -- Se connecter à PostgreSQL
   psql -U bms_user -d bms_db
   
   -- Lister les tables
   \dt
   
   -- Vérifier la table offres
   SELECT COUNT(*) FROM offres;
   ```

### Étape 3: Vérifier la Configuration

1. **Fichier .env :**
   ```bash
   cd backend
   # Copier le fichier d'exemple
   copy env.example .env
   ```

2. **Variables d'environnement :**
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bms_db
   DB_USER=bms_user
   DB_PASSWORD=motdepasse_bms
   ```

3. **Vérifier package.json :**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

## 🗄️ Configuration de la Base de Données

### 1. Créer la Base de Données

```sql
-- Se connecter à PostgreSQL en tant qu'administrateur
psql -U postgres

-- Créer la base de données
CREATE DATABASE bms_db;

-- Créer l'utilisateur
CREATE USER bms_user WITH PASSWORD 'motdepasse_bms';

-- Donner les droits
GRANT ALL PRIVILEGES ON DATABASE bms_db TO bms_user;

-- Se connecter à la base de données
\c bms_db

-- Donner les droits sur les tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bms_user;
```

### 2. Initialiser les Tables

```bash
cd backend
node -e "
const { initDatabase } = require('./config/database.js');
initDatabase().then(() => {
    console.log('✅ Base de données initialisée');
    process.exit(0);
}).catch(err => {
    console.error('❌ Erreur:', err);
    process.exit(1);
});
"
```

## 🔧 Résolution des Problèmes Courants

### Problème 1: Port 5000 Occupé

**Solution :**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Problème 2: Erreur de Connexion PostgreSQL

**Solutions :**
1. Vérifier que PostgreSQL est démarré
2. Vérifier les paramètres de connexion
3. Vérifier que l'utilisateur a les droits
4. Vérifier le pare-feu

### Problème 3: Erreur CORS

**Solution :** Vérifier la configuration CORS dans `server.js`

### Problème 4: Erreur de Token JWT

**Solution :** Vérifier que `JWT_SECRET` est défini dans `.env`

## 🧪 Tests de Validation

### 1. Test de l'API

```bash
# Test de la route principale
curl -X GET "http://localhost:5000/api/dashboard/complete?period=month" \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json"
```

### 2. Test de la Base de Données

```bash
cd backend
node -e "
const { getDatabaseStats } = require('./config/database.js');
getDatabaseStats().then(stats => {
    console.log('📊 Statistiques de la base:', stats);
    process.exit(0);
}).catch(err => {
    console.error('❌ Erreur:', err);
    process.exit(1);
});
"
```

### 3. Test des Routes

```bash
# Tester toutes les routes du dashboard
node test-api-dashboard.js
```

## 📱 Vérification Frontend

### 1. Vérifier la Console du Navigateur

- Ouvrir les outils de développement (F12)
- Aller dans l'onglet Console
- Vérifier les erreurs réseau et JavaScript

### 2. Vérifier les Requêtes Réseau

- Onglet Network des outils de développement
- Vérifier que les requêtes vers `/api/dashboard/complete` sont envoyées
- Vérifier les codes de statut HTTP

### 3. Vérifier l'URL de l'API

Dans `frontend/services/api.ts`, vérifier que l'URL de base est correcte :
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

## 🚨 Erreurs Spécifiques

### Erreur "ECONNREFUSED"
- Le serveur backend n'est pas démarré
- Solution : Démarrer le serveur avec `npm start`

### Erreur "ENOTFOUND"
- Problème de résolution DNS
- Solution : Vérifier l'URL de l'API

### Erreur "ETIMEDOUT"
- Timeout de connexion
- Solution : Vérifier la base de données et augmenter le timeout

### Erreur "ER_ACCESS_DENIED"
- Problème d'authentification PostgreSQL
- Solution : Vérifier l'utilisateur et le mot de passe

## 📞 Support et Débogage

### 1. Logs Détaillés

Activer les logs de débogage dans le backend :
```javascript
// Dans server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

### 2. Test de Connexion

```bash
# Test simple de connexion
cd backend
node -e "
const { pool } = require('./config/database.js');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur:', err.message);
  } else {
    console.log('✅ Connexion réussie:', res.rows[0]);
  }
  process.exit();
});
"
```

### 3. Vérification des Dépendances

```bash
cd backend
npm list
npm audit
```

## ✅ Checklist de Résolution

- [ ] Serveur backend démarré sur le port 5000
- [ ] Base de données PostgreSQL accessible
- [ ] Tables créées et initialisées
- [ ] Fichier .env configuré
- [ ] Dépendances installées
- [ ] Routes API fonctionnelles
- [ ] Frontend accessible sur le port 3000
- [ ] CORS configuré correctement
- [ ] JWT_SECRET défini

## 🎯 Résumé

L'erreur API du dashboard est généralement causée par :
1. **Serveur backend non démarré** (80% des cas)
2. **Problème de connexion à la base de données** (15% des cas)
3. **Configuration incorrecte** (5% des cas)

Utilisez les scripts de démarrage automatique pour résoudre rapidement le problème et vérifiez chaque étape du diagnostic.

---

**Note** : Si le problème persiste après avoir suivi ce guide, vérifiez les logs du serveur backend et de la base de données pour des erreurs spécifiques.
