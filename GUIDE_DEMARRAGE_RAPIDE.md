# 🚀 **GUIDE DE DÉMARRAGE RAPIDE - BMS**

## ✅ **PRÉREQUIS**

### **1. Base de données PostgreSQL :**
```bash
# Vérifier que PostgreSQL est installé et en cours d'exécution
# Base de données : bms_db
# Utilisateur : bms_user
# Mot de passe : motdepasse_bms
```

### **2. Node.js et npm :**
```bash
# Vérifier les versions
node --version  # >= 16.x
npm --version   # >= 8.x
```

---

## 🎯 **DÉMARRAGE EN 3 ÉTAPES**

### **Étape 1 : Démarrer le Backend**
```bash
# Terminal 1
cd backend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur
npm run dev
```

**✅ Résultat attendu :**
```
🚀 Serveur BMS démarré sur le port 5000
📊 Base de données connectée
🔐 Routes d'authentification activées
📋 API offres opérationnelle
📈 Dashboard API prêt
```

### **Étape 2 : Démarrer le Frontend**
```bash
# Terminal 2
cd frontend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer l'application
npm run dev
```

**✅ Résultat attendu :**
```
✓ Ready in 2.3s
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

### **Étape 3 : Tester l'Intégration**
```bash
# Terminal 3 (optionnel - pour vérifier)
node frontend/test-integration.js
```

**✅ Résultat attendu :**
```
🎉 Tests d'intégration réussis !
✅ Backend accessible
✅ Authentification fonctionnelle
✅ API offres opérationnelle
✅ Dashboard fonctionnel
```

---

## 🌐 **ACCÈS À L'APPLICATION**

### **URLs principales :**
- **🏠 Page d'accueil :** http://localhost:3000
- **🔐 Page de connexion :** http://localhost:3000/login
- **📊 Dashboard :** http://localhost:3000/dashboard
- **📋 Gestion des offres :** http://localhost:3000/offres

### **API Backend :**
- **🔗 API Health :** http://localhost:5000/api/health
- **📡 API Documentation :** http://localhost:5000/api

---

## 🔑 **COMPTES DE TEST**

### **Compte utilisateur standard :**
- **📧 Email :** `test@bms.com`
- **🔒 Mot de passe :** `test123`
- **👤 Rôle :** Utilisateur standard

### **Compte intégration :**
- **📧 Email :** `integration@bms.com`
- **🔒 Mot de passe :** `integration123`
- **👤 Rôle :** Utilisateur intégration

---

## 🧪 **TESTS RAPIDES**

### **1. Test de connexion :**
1. Aller sur http://localhost:3000/login
2. Saisir `test@bms.com` / `test123`
3. Cliquer sur "Se connecter"
4. ✅ Redirection vers le dashboard

### **2. Test de l'API :**
```bash
# Test health check
curl http://localhost:5000/api/health

# Test authentification
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bms.com","password":"test123"}'
```

### **3. Test des fonctionnalités :**
- ✅ **Navigation** entre les pages
- ✅ **Gestion des offres** (CRUD)
- ✅ **Dashboard** avec statistiques
- ✅ **Déconnexion** et protection des routes

---

## 🛠️ **DÉPANNAGE RAPIDE**

### **Problème : Backend ne démarre pas**
```bash
# Vérifier le port 5000
netstat -ano | findstr :5000

# Redémarrer le serveur
cd backend
npm run dev
```

### **Problème : Base de données non connectée**
```bash
# Vérifier PostgreSQL
cd backend
npm run test-db

# Réinitialiser la base si nécessaire
npm run reset-db
```

### **Problème : Frontend ne se connecte pas**
```bash
# Vérifier l'API backend
curl http://localhost:5000/api/health

# Vérifier les variables d'environnement
cat frontend/.env.local
```

### **Problème : Erreur d'authentification**
```bash
# Vérifier les utilisateurs en base
cd backend
node -e "
const { query } = require('./config/database');
query('SELECT * FROM users').then(console.log);
"
```

---

## 📊 **FONCTIONNALITÉS DISPONIBLES**

### **🔐 Authentification :**
- ✅ Connexion avec email/mot de passe
- ✅ Gestion automatique des sessions JWT
- ✅ Protection des routes par rôle
- ✅ Déconnexion sécurisée

### **📋 Gestion des offres :**
- ✅ Création d'offres
- ✅ Modification d'offres
- ✅ Suppression d'offres
- ✅ Validation d'offres
- ✅ Recherche et filtrage

### **📊 Dashboard :**
- ✅ Statistiques en temps réel
- ✅ Graphiques interactifs
- ✅ Répartition par pôle
- ✅ Performance des équipes

### **👥 Gestion des utilisateurs :**
- ✅ Inscription d'utilisateurs
- ✅ Gestion des rôles
- ✅ Profils utilisateurs
- ✅ Permissions par rôle

---

## 🎉 **SUCCÈS !**

### **✅ Votre application BMS est maintenant :**
- **🚀 Entièrement fonctionnelle**
- **🔐 Sécurisée** avec authentification JWT
- **📊 Connectée** à PostgreSQL
- **🎨 Interface moderne** et responsive
- **🧪 Testée** et validée

### **💡 Prochaines étapes :**
1. **Explorer** les fonctionnalités
2. **Créer** de nouveaux utilisateurs
3. **Ajouter** des offres de test
4. **Personnaliser** l'interface
5. **Déployer** en production

---

## 📞 **SUPPORT**

### **En cas de problème :**
1. **Vérifier** les logs dans les terminaux
2. **Consulter** la documentation technique
3. **Tester** les endpoints API
4. **Redémarrer** les services si nécessaire

### **Documentation complète :**
- `INTEGRATION_FRONTEND_BACKEND_COMPLETE.md`
- `backend/DATABASE_CONFIG.md`
- `backend/INTEGRATION_COMPLETE.md`

---

*Guide créé le : 30 août 2025*
*Version : 1.0.0*
*Statut : Application BMS prête à l'emploi ✅*
