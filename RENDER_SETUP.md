# 🚀 Configuration Render - BMS

## ✅ Configuration Terminée

L'application BMS est maintenant configurée pour le déploiement sur Render avec une base de données PostgreSQL.

## 📁 Fichiers Créés/Modifiés

### Configuration Render
- ✅ `render.yaml` - Configuration des services Render
- ✅ `DEPLOYMENT.md` - Guide de déploiement complet

### Backend
- ✅ `backend/config/database.js` - Configuration PostgreSQL
- ✅ `backend/package.json` - Scripts et dépendances
- ✅ `backend/server.js` - Initialisation automatique de la DB
- ✅ `backend/scripts/init-db.js` - Script d'initialisation
- ✅ `backend/migrations/001_initial_schema.sql` - Schéma initial
- ✅ `backend/env.production.example` - Variables d'environnement

### Frontend
- ✅ `frontend/next.config.ts` - Configuration Next.js pour Render
- ✅ `frontend/services/api.ts` - Configuration API
- ✅ `frontend/env.production.example` - Variables d'environnement

### Docker (Optionnel)
- ✅ `Dockerfile` - Backend container
- ✅ `frontend/Dockerfile` - Frontend container
- ✅ `docker-compose.yml` - Développement local
- ✅ `.dockerignore` - Optimisation des builds

### CI/CD
- ✅ `.github/workflows/deploy.yml` - GitHub Actions
- ✅ `scripts/deploy.sh` - Script de déploiement

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   Next.js       │◄──►│   Express.js    │◄──►│   Database      │
│   Render        │    │   Render        │    │   Render        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Étapes de Déploiement

### 1. Préparer le Repository
```bash
# Commiter tous les changements
git add .
git commit -m "Configure Render deployment"
git push origin main
```

### 2. Créer les Services Render

#### Base de Données PostgreSQL
1. Dashboard Render → "New" → "PostgreSQL"
2. Name: `bms-database`
3. Database: `bms_production`
4. User: `bms_user`
5. Plan: `Starter`

#### Backend API
1. Dashboard Render → "New" → "Web Service"
2. Connect repository Git
3. Name: `bms-backend`
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Plan: `Starter`

#### Frontend Next.js
1. Dashboard Render → "New" → "Web Service"
2. Connect repository Git
3. Name: `bms-frontend`
4. Build Command: `cd frontend && npm install && npm run build`
5. Start Command: `cd frontend && npm start`
6. Plan: `Starter`

### 3. Configurer les Variables d'Environnement

#### Backend Variables
```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=<généré automatiquement>
FRONTEND_URL=https://bms-frontend.onrender.com
DB_HOST=<fourni par PostgreSQL>
DB_PORT=<fourni par PostgreSQL>
DB_NAME=<fourni par PostgreSQL>
DB_USER=<fourni par PostgreSQL>
DB_PASSWORD=<fourni par PostgreSQL>
```

#### Frontend Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://bms-backend.onrender.com
```

## 🔧 Développement Local

### Avec Docker
```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### Sans Docker
```bash
# Backend
cd backend
cp env.example .env
npm install
npm run dev

# Frontend (nouveau terminal)
cd frontend
cp env.local.example .env.local
npm install
npm run dev
```

## 📊 Monitoring

### Health Checks
- Backend: `https://bms-backend.onrender.com/api/health`
- Frontend: `https://bms-frontend.onrender.com`

### Logs
- Accédez aux logs dans le dashboard Render pour chaque service

## 🔒 Sécurité

- ✅ Variables sensibles chiffrées automatiquement
- ✅ Connexions SSL à la base de données
- ✅ JWT_SECRET généré automatiquement
- ✅ CORS configuré pour limiter les origines

## 🛠️ Dépannage

### Problèmes Courants
1. **Erreur de connexion DB**: Vérifiez les variables DB_*
2. **Erreur CORS**: Vérifiez FRONTEND_URL
3. **Erreur de build**: Consultez les logs Render

### Commandes Utiles
```bash
# Vérifier la santé du backend
curl https://bms-backend.onrender.com/api/health

# Initialiser la base de données localement
cd backend && npm run init-db
```

## 📈 Mise à l'Échelle

Pour la production :
1. Upgrade vers les plans payants
2. Configurer un domaine personnalisé
3. Activer le monitoring avancé
4. Configurer les sauvegardes automatiques

---

**🎉 Configuration terminée ! Votre application BMS est prête pour le déploiement sur Render.**
