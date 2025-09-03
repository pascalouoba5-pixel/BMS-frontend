# 🚀 Guide de Déploiement BMS sur Render

Ce guide vous explique comment déployer l'application BMS (Business Management System) sur Render avec une base de données PostgreSQL.

## 📋 Prérequis

- Un compte Render (gratuit disponible)
- Git configuré avec votre projet
- Node.js 18+ installé localement pour les tests

## 🏗️ Architecture de Déploiement

L'application sera déployée avec 3 services sur Render :

1. **Base de données PostgreSQL** - Stockage des données
2. **Backend API** - Serveur Express.js
3. **Frontend Next.js** - Interface utilisateur

## 📦 Configuration des Services

### 1. Base de Données PostgreSQL

1. Connectez-vous à votre dashboard Render
2. Cliquez sur "New" → "PostgreSQL"
3. Configurez :
   - **Name**: `bms-database`
   - **Database**: `bms_production`
   - **User**: `bms_user`
   - **Plan**: `Starter` (gratuit)

### 2. Backend API

1. Cliquez sur "New" → "Web Service"
2. Connectez votre repository Git
3. Configurez :
   - **Name**: `bms-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Starter` (gratuit)

#### Variables d'environnement à configurer :

```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=<généré automatiquement>
FRONTEND_URL=https://bms-frontend.onrender.com
DB_HOST=<fourni par la base de données>
DB_PORT=<fourni par la base de données>
DB_NAME=<fourni par la base de données>
DB_USER=<fourni par la base de données>
DB_PASSWORD=<fourni par la base de données>
```

### 3. Frontend Next.js

1. Cliquez sur "New" → "Web Service"
2. Connectez votre repository Git
3. Configurez :
   - **Name**: `bms-frontend`
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: `Starter` (gratuit)

#### Variables d'environnement à configurer :

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://bms-backend.onrender.com
```

## 🔗 Liaison des Services

### Connexion Base de Données → Backend

1. Dans le service backend, allez dans "Environment"
2. Cliquez sur "Add Environment Variable"
3. Ajoutez les variables de base de données en utilisant les valeurs fournies par Render

### Connexion Backend → Frontend

1. Dans le service frontend, ajoutez la variable :
   - `NEXT_PUBLIC_API_URL=https://bms-backend.onrender.com`

## 🚀 Déploiement Automatique

Une fois configuré, Render déploiera automatiquement :

1. **Base de données** : Création des tables au premier démarrage
2. **Backend** : Installation des dépendances et démarrage du serveur
3. **Frontend** : Build de l'application Next.js et démarrage

## 📊 Monitoring

### Health Checks

- **Backend**: `https://bms-backend.onrender.com/api/health`
- **Frontend**: `https://bms-frontend.onrender.com`

### Logs

Accédez aux logs dans le dashboard Render pour chaque service.

## 🔧 Configuration Locale pour Tests

### Backend

```bash
cd backend
cp env.example .env
# Configurez vos variables locales
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp env.local.example .env.local
# Configurez NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
```

## 🛠️ Dépannage

### Problèmes Courants

1. **Erreur de connexion à la base de données**
   - Vérifiez les variables d'environnement DB_*
   - Assurez-vous que la base de données est active

2. **Erreur CORS**
   - Vérifiez que FRONTEND_URL pointe vers la bonne URL
   - Redéployez le backend après modification

3. **Erreur de build Next.js**
   - Vérifiez que toutes les dépendances sont installées
   - Consultez les logs de build dans Render

### Commandes Utiles

```bash
# Vérifier la santé du backend
curl https://bms-backend.onrender.com/api/health

# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_API_URL
```

## 📈 Mise à l'Échelle

Pour passer en production :

1. **Upgrade des plans** : Passez aux plans payants pour plus de ressources
2. **Custom Domain** : Configurez votre domaine personnalisé
3. **SSL** : Certificats SSL automatiques inclus
4. **Monitoring** : Utilisez les outils de monitoring de Render

## 🔒 Sécurité

- Les variables sensibles sont automatiquement chiffrées
- Les connexions à la base de données utilisent SSL
- JWT_SECRET est généré automatiquement
- CORS est configuré pour limiter les origines

## 📞 Support

En cas de problème :
1. Consultez les logs dans le dashboard Render
2. Vérifiez la configuration des variables d'environnement
3. Testez localement avant de redéployer

---

**Note** : Ce déploiement utilise le plan gratuit de Render. Pour une utilisation en production, considérez les plans payants pour de meilleures performances.
