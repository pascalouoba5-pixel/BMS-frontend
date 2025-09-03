# 🔧 Guide de Dépannage ngrok - BMS 3

## Problèmes Courants et Solutions

### ❌ **Problème 1 : Erreurs CORS avec ngrok**

**Symptômes :**
- Erreurs CORS dans la console du navigateur
- Les requêtes API échouent
- Les restrictions d'utilisateurs ne fonctionnent pas

**Solutions :**

1. **Vérifier la configuration CORS du backend :**
   ```bash
   # Le backend doit accepter les domaines ngrok
   # Vérifiez que le fichier backend/server.js contient :
   app.use(cors({
     origin: [
       process.env.FRONTEND_URL || 'http://localhost:3000',
       /^https:\/\/.*\.ngrok\.io$/,
       /^https:\/\/.*\.ngrok-free\.app$/,
       /^https:\/\/.*\.ngrok\.app$/
     ],
     credentials: true
   }));
   ```

2. **Redémarrer le backend après modification :**
   ```bash
   # Arrêter le serveur (Ctrl+C)
   # Puis redémarrer
   npm run dev:backend
   ```

### ❌ **Problème 2 : Les données ne s'actualisent pas**

**Symptômes :**
- Les nouvelles offres n'apparaissent pas
- Les modifications ne sont pas visibles
- Synchronisation manuelle nécessaire

**Solutions :**

1. **Utiliser le nouveau système de synchronisation :**
   ```javascript
   // Dans vos composants, utilisez :
   import { useOffresSync } from '../../utils/dataSync';
   
   const { offres, addOffre, updateOffre, deleteOffre } = useOffresSync();
   ```

2. **Vérifier que le système de synchronisation est actif :**
   - Ouvrir la console du navigateur
   - Vérifier qu'il n'y a pas d'erreurs
   - Les données doivent se synchroniser toutes les 5 secondes

### ❌ **Problème 3 : ngrok ne démarre pas**

**Symptômes :**
- Erreur "ngrok command not found"
- Impossible de créer le tunnel

**Solutions :**

1. **Installer ngrok :**
   ```bash
   # Télécharger depuis https://ngrok.com/
   # Ou utiliser npm (si disponible)
   npm install -g ngrok
   ```

2. **Configurer l'authtoken :**
   ```bash
   ngrok authtoken YOUR_AUTH_TOKEN
   ```

3. **Vérifier le PATH :**
   ```bash
   # Windows
   where ngrok
   
   # Linux/Mac
   which ngrok
   ```

### ❌ **Problème 4 : URLs ngrok inaccessibles**

**Symptômes :**
- Erreur 404 sur les URLs ngrok
- Impossible d'accéder à l'application

**Solutions :**

1. **Vérifier que les services sont démarrés :**
   ```bash
   # Backend doit être sur le port 5000
   curl http://localhost:5000/api/health
   
   # Frontend doit être sur le port 3000
   curl http://localhost:3000
   ```

2. **Utiliser les bons ports dans ngrok :**
   ```bash
   # Pour le frontend
   ngrok http 3000
   
   # Pour le backend (si nécessaire)
   ngrok http 5000
   ```

### ❌ **Problème 5 : Restrictions d'utilisateurs ne fonctionnent pas**

**Symptômes :**
- Tous les utilisateurs ont accès à toutes les pages
- Les rôles ne sont pas respectés

**Solutions :**

1. **Vérifier la configuration des permissions :**
   ```javascript
   // Vérifier que le fichier permissions.ts est correct
   // Les rôles doivent être bien définis
   ```

2. **Vérifier l'authentification :**
   ```javascript
   // Dans la console du navigateur
   console.log(localStorage.getItem('userRole'));
   console.log(localStorage.getItem('user'));
   ```

3. **Redémarrer l'application complètement :**
   ```bash
   # Arrêter tous les processus
   # Vider le cache du navigateur
   # Redémarrer
   npm run dev
   ```

## 🚀 **Démarrage Recommandé avec ngrok**

### Option 1 : Script automatique
```bash
# Windows
start-ngrok.bat

# Linux/Mac
chmod +x start-ngrok.sh
./start-ngrok.sh
```

### Option 2 : Manuel
```bash
# 1. Démarrer le backend
npm run dev:backend

# 2. Dans un autre terminal, démarrer ngrok
ngrok http 3000

# 3. Copier l'URL HTTPS générée
# 4. Partager cette URL
```

## 🔍 **Vérifications de Diagnostic**

### 1. **Vérifier les services :**
```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000
```

### 2. **Vérifier les logs :**
```bash
# Backend logs
# Vérifier la console du terminal backend

# Frontend logs
# Ouvrir la console du navigateur (F12)
```

### 3. **Vérifier la configuration :**
```bash
# Variables d'environnement
cat backend/.env
cat frontend/.env.local
```

## 📞 **Support**

Si les problèmes persistent :
1. Vérifier les logs d'erreur
2. Tester en local (sans ngrok)
3. Vérifier la version de ngrok
4. Consulter la documentation ngrok

## 🔄 **Mise à Jour du Système**

Pour mettre à jour le système de synchronisation :
```bash
# Redémarrer complètement l'application
npm run dev

# Vider le cache du navigateur
# Tester avec ngrok
```
