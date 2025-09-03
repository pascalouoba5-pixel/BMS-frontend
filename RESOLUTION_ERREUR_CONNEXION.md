# 🔧 Résolution de l'Erreur "Failed to fetch"

## 🚨 Problème Identifié

L'erreur `TypeError: Failed to fetch` indique que le frontend ne peut pas se connecter au backend. Cela se produit généralement quand :

1. **Le serveur backend n'est pas démarré**
2. **Les ports sont bloqués ou occupés**
3. **Les dépendances ne sont pas installées**
4. **Problème de CORS**

## ✅ Solution Complète

### 1. Vérification des Serveurs

#### Vérifier si les serveurs fonctionnent :

```bash
# Vérifier le backend (port 5000)
netstat -ano | findstr :5000

# Vérifier le frontend (port 3000)
netstat -ano | findstr :3000
```

#### Si les ports ne sont pas utilisés, démarrer les serveurs :

**Backend :**
```bash
cd backend
npm install
npm run dev
```

**Frontend :**
```bash
cd frontend
npm run dev
```

### 2. Installation des Dépendances Manquantes

Si vous obtenez l'erreur `Cannot find module 'node-cron'`, installez les dépendances :

```bash
cd backend
npm install axios cheerio natural node-cron
```

### 3. Script de Démarrage Automatique

Utilisez le script `start-servers.bat` pour démarrer automatiquement les deux serveurs :

```bash
# Double-cliquez sur le fichier ou exécutez :
start-servers.bat
```

### 4. Test de Connexion

Ouvrez le fichier `test-connection.html` dans votre navigateur pour vérifier la connectivité.

## 🔍 Diagnostic Détaillé

### Étape 1 : Vérifier les Logs

**Backend :**
- Ouvrez la console du backend
- Vérifiez qu'il n'y a pas d'erreurs de démarrage
- Le message devrait être : `🚀 BMS Backend server running on port 5000`

**Frontend :**
- Ouvrez la console du frontend
- Vérifiez qu'il n'y a pas d'erreurs de compilation
- Le message devrait être : `Ready - started server on 0.0.0.0:3000`

### Étape 2 : Test de l'API

Testez directement l'API backend :

```bash
curl http://localhost:5000/api/health
```

Résultat attendu :
```json
{
  "status": "OK",
  "message": "BMS Backend API is running",
  "timestamp": "2025-08-30T15:19:05.289Z"
}
```

### Étape 3 : Vérifier la Configuration

**Frontend (`frontend/services/api.ts`) :**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

**Backend (`backend/server.js`) :**
```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    // ... autres origines
  ],
  credentials: true
}));
```

## 🛠️ Solutions Spécifiques

### Problème 1 : Ports Occupés

```bash
# Arrêter tous les processus Node.js
taskkill /F /IM node.exe

# Ou arrêter un port spécifique
netstat -ano | findstr :5000
taskkill /F /PID <PID>
```

### Problème 2 : Dépendances Manquantes

```bash
cd backend
npm install
npm install axios cheerio natural node-cron
```

### Problème 3 : Erreur CORS

Vérifiez que le backend autorise les requêtes depuis `http://localhost:3000`.

### Problème 4 : Base de Données

Si vous avez des erreurs de base de données :

```bash
# Vérifier la connexion PostgreSQL
psql -U postgres -d bms_db -c "SELECT 1;"

# Exécuter les migrations si nécessaire
psql -U postgres -d bms_db -f backend/migrations/002_search_automation.sql
```

## 🎯 Test de Validation

### Test Complet

1. **Démarrer les serveurs** avec `start-servers.bat`
2. **Ouvrir** `test-connection.html`
3. **Cliquer** sur "Lancer tous les tests"
4. **Vérifier** que tous les tests passent

### Test Manuel

1. **Ouvrir** http://localhost:3000
2. **Se connecter** avec :
   - Email : `superadmin@bms.com`
   - Mot de passe : `admin1234`
3. **Vérifier** que la connexion fonctionne

## 📋 Checklist de Résolution

- [ ] Backend démarré sur le port 5000
- [ ] Frontend démarré sur le port 3000
- [ ] Dépendances installées (`axios`, `cheerio`, `natural`, `node-cron`)
- [ ] Base de données accessible
- [ ] Test de connexion réussi
- [ ] Application accessible sur http://localhost:3000

## 🆘 Support

Si le problème persiste :

1. **Vérifiez les logs** des serveurs
2. **Testez la connectivité** avec `test-connection.html`
3. **Redémarrez** les serveurs
4. **Vérifiez** que les ports ne sont pas bloqués par un firewall

## 📞 Logs Utiles

**Backend :**
```
🚀 BMS Backend server running on port 5000
📊 Health check: http://localhost:5000/api/health
🔍 Scheduler de recherche automatique démarré
```

**Frontend :**
```
Ready - started server on 0.0.0.0:3000
```

---

**Version** : 1.0.0  
**Dernière mise à jour** : Août 2024  
**Auteur** : Équipe BMS
