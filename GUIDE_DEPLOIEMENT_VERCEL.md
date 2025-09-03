# 🚀 Guide de Déploiement Vercel - Frontend React BMS

## 🎯 **Vue d'ensemble**

Ce guide vous accompagne pour déployer votre frontend React BMS sur Vercel, connecté à votre backend Render à l'adresse `https://amd-back-parc.onrender.com`.

## 📋 **Prérequis**

- ✅ Projet React configuré
- ✅ Backend déployé sur Render
- ✅ Compte GitHub
- ✅ Compte Vercel
- ✅ Node.js et npm installés

## 🔧 **1. Configuration du projet**

### **Fichier `vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://amd-back-parc.onrender.com"
  }
}
```

### **Variables d'environnement**
Créez un fichier `.env.local` :
```bash
REACT_APP_API_URL=https://amd-back-parc.onrender.com
```

## 🧪 **2. Test local du projet**

### **Exécuter le script de vérification**
```powershell
cd frontend
.\check-local.ps1
```

### **Vérifications manuelles**
```bash
# Installer les dépendances
npm install

# Tester le build
npm run build

# Démarrer en local
npm start
```

### **Tester la connexion API**
Ouvrez `http://localhost:3000` et vérifiez que :
- ✅ L'application se charge
- ✅ Les appels API fonctionnent
- ✅ La variable `REACT_APP_API_URL` est correcte

## 📤 **3. Déploiement sur GitHub**

### **Exécuter le script de déploiement GitHub**
```powershell
cd frontend
.\deploy-github.ps1
```

### **Configuration manuelle Git**
```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter les fichiers
git add .

# Premier commit
git commit -m "feat: Initial commit - Frontend React BMS"

# Ajouter l'origine (remplacez par votre URL)
git remote add origin https://github.com/votre-username/votre-repo.git

# Pousser
git push -u origin main
```

## 🌐 **4. Connexion à Vercel**

### **Méthode 1: Dashboard Vercel (Recommandée)**

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec GitHub**
3. **Cliquer sur "New Project"**
4. **Importer votre repository GitHub**
5. **Configuration automatique :**
   - Framework: **React**
   - Root Directory: `frontend` (si votre repo contient plusieurs dossiers)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### **Méthode 2: Vercel CLI**

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

## ⚙️ **5. Configuration des variables d'environnement sur Vercel**

### **Dans le dashboard Vercel :**

1. **Aller dans votre projet**
2. **Onglet "Settings"**
3. **Section "Environment Variables"**
4. **Ajouter :**

| Variable | Valeur | Environnement |
|----------|---------|---------------|
| `REACT_APP_API_URL` | `https://amd-back-parc.onrender.com` | Production, Preview, Development |

### **Via Vercel CLI :**
```bash
vercel env add REACT_APP_API_URL
# Entrer: https://amd-back-parc.onrender.com
```

## 🚀 **6. Déploiement et test**

### **Déploiement automatique**
- ✅ Chaque push sur `main` déclenche un déploiement
- ✅ Vercel détecte automatiquement les changements
- ✅ Build et déploiement automatiques

### **Vérification du déploiement**
1. **Attendre la fin du build**
2. **Vérifier l'URL de déploiement**
3. **Tester l'application déployée**

### **Test de la connexion API**
1. **Ouvrir l'application déployée**
2. **Vérifier que les appels API fonctionnent**
3. **Tester l'authentification**
4. **Vérifier le dashboard**

## 🔍 **7. Dépannage**

### **Erreur de build**
```bash
# Vérifier localement
npm run build

# Vérifier les variables d'environnement
echo $REACT_APP_API_URL
```

### **Erreur de connexion API**
- ✅ Vérifier `REACT_APP_API_URL` sur Vercel
- ✅ Vérifier que le backend Render est actif
- ✅ Tester l'URL du backend directement

### **Erreur de routage**
- ✅ Vérifier que `vercel.json` est correct
- ✅ Vérifier que toutes les routes redirigent vers `index.html`

## 📊 **8. Monitoring et maintenance**

### **Vercel Analytics**
- ✅ Activer dans les paramètres du projet
- ✅ Surveiller les performances
- ✅ Analyser les erreurs

### **Logs de déploiement**
- ✅ Vérifier les logs de build
- ✅ Surveiller les erreurs de runtime
- ✅ Optimiser les performances

## 🎯 **9. Prochaines étapes**

### **Optimisations recommandées**
- ✅ Lazy loading des composants
- ✅ Optimisation des images
- ✅ Compression des assets
- ✅ Cache des ressources statiques

### **Fonctionnalités avancées**
- ✅ Domaines personnalisés
- ✅ Certificats SSL automatiques
- ✅ Déploiements preview
- ✅ Rollback automatique

## 📞 **Support**

### **En cas de problème :**
1. **Vérifier les logs Vercel**
2. **Tester localement**
3. **Vérifier la configuration**
4. **Consulter la documentation Vercel**

---

**🎉 Félicitations ! Votre frontend React BMS est maintenant déployé sur Vercel !**

**URL de votre application :** `https://votre-projet.vercel.app`
**Backend connecté :** `https://amd-back-parc.onrender.com`
