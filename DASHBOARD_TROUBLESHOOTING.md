# 🔧 Guide de Dépannage du Dashboard

## ❌ Erreur : "Erreur lors de la récupération des données complètes"

### 🔍 Diagnostic

Cette erreur indique un problème avec la route `/api/dashboard/complete` du backend.

### 🚀 Solutions

#### 1. Vérifier le serveur backend

```bash
# Démarrer le serveur backend
cd backend
npm start

# Vérifier que le serveur fonctionne sur le port 5000
curl http://localhost:5000/api/dashboard/stats
```

#### 2. Vérifier la base de données

```bash
# Tester la connexion à la base
node test-dashboard-db.js

# Vérifier que les tables existent
psql -U bms_user -d bms_db -c "\dt"
```

#### 3. Vérifier les logs du serveur

```bash
# Regarder les logs en temps réel
tail -f backend/logs/server.log

# Ou dans la console du serveur
```

#### 4. Tester l'API manuellement

```bash
# Installer node-fetch si nécessaire
npm install node-fetch

# Tester l'API
node test-dashboard-api.js
```

### 🐛 Problèmes Courants

#### Problème 1: Erreur de syntaxe SQL
**Symptôme**: Erreur 500 avec message SQL
**Solution**: Vérifier la syntaxe des requêtes dans `backend/routes/dashboard.js`

#### Problème 2: Connexion à la base de données
**Symptôme**: "Connection refused" ou "ECONNREFUSED"
**Solution**: 
- Vérifier que PostgreSQL est démarré
- Vérifier les variables d'environnement dans `.env`
- Tester la connexion avec `test-dashboard-db.js`

#### Problème 3: Tables manquantes
**Symptôme**: "relation does not exist"
**Solution**: Exécuter les migrations de base de données

```bash
cd backend
node run-migration.js
```

#### Problème 4: Authentification
**Symptôme**: "Token d'authentification requis"
**Solution**: Vérifier que l'utilisateur est connecté et a un token valide

### 🔧 Correction de la Route /complete

La route `/complete` a été corrigée pour :

1. **Gérer correctement les filtres de date**
2. **Éviter les erreurs de syntaxe SQL**
3. **Retourner une structure de données cohérente**

### 📊 Structure des Données Attendues

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalOffres": 0,
      "offresEnAttente": 0,
      "offresApprouvees": 0,
      "offresRejetees": 0,
      "totalBudget": "0 €"
    },
    "commerciaux": {
      "totalCommerciaux": 0,
      "objectifsAtteints": 0,
      "enCours": 0,
      "performanceMoyenne": 0,
      "topPerformers": []
    },
    "poles": [],
    "resultats": {
      "caGenere": "0 €",
      "tauxConversion": 0,
      "roiMoyen": "0x",
      "satisfaction": 0,
      "evolution": [],
      "objectifs": []
    }
  }
}
```

### 🧪 Tests de Validation

#### Test 1: Base de données
```bash
node test-dashboard-db.js
```

#### Test 2: API
```bash
node test-dashboard-api.js
```

#### Test 3: Frontend
- Ouvrir le dashboard dans le navigateur
- Vérifier la console pour les erreurs
- Vérifier l'onglet Network des outils de développement

### 📝 Logs de Débogage

Ajouter des logs dans le frontend :

```typescript
// Dans useDashboardSync.ts
console.log('🔍 Filtres appliqués:', filters);
console.log('📡 Appel API vers:', endpoint);
console.log('📊 Réponse reçue:', response);
```

### 🚨 Erreurs Spécifiques

#### Erreur: "Cannot read property 'rows' of undefined"
**Cause**: La requête SQL a échoué
**Solution**: Vérifier la syntaxe SQL et la connexion à la base

#### Erreur: "Invalid date format"
**Cause**: Format de date incorrect dans les filtres
**Solution**: Vérifier le format des dates (YYYY-MM-DD)

#### Erreur: "Permission denied"
**Cause**: Droits insuffisants sur la base de données
**Solution**: Vérifier les permissions de l'utilisateur PostgreSQL

### 🔄 Redémarrage Complet

Si rien ne fonctionne, redémarrer complètement :

```bash
# 1. Arrêter tous les processus
pkill -f "node.*server"
pkill -f "next"

# 2. Redémarrer PostgreSQL
sudo systemctl restart postgresql

# 3. Redémarrer le backend
cd backend && npm start

# 4. Redémarrer le frontend
cd frontend && npm run dev

# 5. Tester
node test-dashboard-db.js
node test-dashboard-api.js
```

### 📞 Support

Si le problème persiste :

1. **Vérifier les logs** du serveur et de la base de données
2. **Tester chaque composant** individuellement
3. **Vérifier la version** de PostgreSQL et Node.js
4. **Consulter la documentation** officielle

### ✅ Checklist de Validation

- [ ] Serveur backend démarré sur le port 5000
- [ ] Base de données PostgreSQL accessible
- [ ] Tables `users`, `offres` existent
- [ ] Variables d'environnement configurées
- [ ] Routes API répondent correctement
- [ ] Frontend peut se connecter au backend
- [ ] Dashboard affiche les données correctement

---

**Note**: Ce guide couvre les problèmes les plus courants. Pour des erreurs spécifiques, vérifiez les logs et utilisez les outils de test fournis.
