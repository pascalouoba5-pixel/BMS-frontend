# Guide de Déploiement Vercel pour le Frontend BMS

## 🚀 Préparation du Déploiement

### 1. Installation de Vercel CLI (optionnel mais recommandé)
```bash
npm install -g vercel
```

### 2. Connexion à Vercel
```bash
vercel login
```

## 📁 Fichiers de Configuration Créés

- `vercel.json` - Configuration principale de Vercel
- `.vercelignore` - Fichiers à exclure du déploiement
- `env.vercel.example` - Variables d'environnement pour Vercel
- `next.config.ts` - Configuration Next.js optimisée pour Vercel

## 🔧 Configuration des Variables d'Environnement

### Dans Vercel Dashboard :
1. Allez dans votre projet
2. Section "Settings" > "Environment Variables"
3. Ajoutez :
   ```
   NEXT_PUBLIC_API_URL=https://votre-backend-url.com
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

## 🚀 Déploiement

### Option 1 : Via Vercel Dashboard (Recommandé)
1. Connectez-vous à [vercel.com](https://vercel.com)
2. Cliquez "New Project"
3. Importez votre repository GitHub/GitLab
4. Configurez :
   - **Framework Preset** : Next.js
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
   - **Install Command** : `npm install`

### Option 2 : Via Vercel CLI
```bash
cd frontend
vercel
```

### Option 3 : Déploiement Automatique
1. Connectez votre repository GitHub
2. Vercel déploiera automatiquement à chaque push
3. Branches : `main` → Production, autres → Preview

## ⚙️ Configuration Avancée

### Régions de Déploiement
- **Europe** : `cdg1` (Paris) - Configuré par défaut
- **Amérique du Nord** : `iad1` (Washington DC)
- **Asie** : `hnd1` (Tokyo)

### Optimisations Actives
- ✅ Export statique optimisé
- ✅ Compression CSS automatique
- ✅ En-têtes de sécurité
- ✅ Routing SPA optimisé
- ✅ Images non optimisées (pour compatibilité)

## 🔍 Vérification du Déploiement

### 1. Test de l'Application
- Vérifiez que l'application se charge
- Testez la navigation entre les pages
- Vérifiez les appels API vers votre backend

### 2. Vérification des Performances
- Utilisez Lighthouse dans Chrome DevTools
- Vérifiez les métriques Vercel Analytics
- Testez la vitesse de chargement

## 🐛 Résolution des Problèmes Courants

### Erreur de Build
```bash
# Vérifiez les erreurs TypeScript
npm run lint

# Nettoyez le cache
rm -rf .next node_modules
npm install
```

### Problèmes de Routing
- Vérifiez que `trailingSlash: true` est configuré
- Assurez-vous que les redirections sont correctes

### Variables d'Environnement
- Vérifiez que `NEXT_PUBLIC_API_URL` est configurée
- Redéployez après modification des variables

## 📊 Monitoring et Analytics

### Vercel Analytics
- Activable dans le dashboard
- Métriques de performance
- Analyse des utilisateurs

### Logs et Debugging
- Logs de build dans le dashboard
- Logs de runtime disponibles
- Debugging en temps réel

## 🔄 Mise à Jour et Redéploiement

### Mise à Jour Automatique
- Chaque push sur `main` déclenche un redéploiement
- Les autres branches créent des previews

### Redéploiement Manuel
```bash
vercel --prod
```

## 🌐 Domaines Personnalisés

1. Allez dans "Settings" > "Domains"
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions Vercel

## 📱 Optimisations Mobile

- ✅ Design responsive avec Tailwind CSS
- ✅ PWA ready (Progressive Web App)
- ✅ Optimisations de performance automatiques

## 🔒 Sécurité

- ✅ En-têtes de sécurité configurés
- ✅ Protection XSS
- ✅ Protection contre le clickjacking
- ✅ Content-Type validation

---

## 🎯 Prochaines Étapes

1. **Déployez sur Vercel** en suivant ce guide
2. **Configurez les variables d'environnement**
3. **Testez l'application** en production
4. **Configurez un domaine personnalisé** si nécessaire
5. **Activez Vercel Analytics** pour le monitoring

## 📞 Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)
- **Communauté** : [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
