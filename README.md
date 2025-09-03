# BMS 3 - Système de Gestion des Offres

## 🚀 Guide de Démarrage Rapide

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation et Démarrage

#### Option 1 : Démarrage Automatique (Recommandé)

**Windows :**
```bash
# Double-cliquer sur start.bat ou exécuter :
start.bat
```

**Linux/Mac :**
```bash
# Rendre le script exécutable et l'exécuter :
chmod +x start.sh
./start.sh
```

#### Option 2 : Démarrage Manuel

1. **Installation des dépendances :**
```bash
# Dépendances principales
npm install

# Dépendances backend
cd backend
npm install
cd ..

# Dépendances frontend
cd frontend
npm install
cd ..
```

2. **Configuration des variables d'environnement :**

**Backend** - Créer `backend/.env` :
```bash
# Copier le fichier d'exemple
cp backend/env.example backend/.env
```

**Frontend** - Créer `frontend/.env.local` :
```bash
# Copier le fichier d'exemple
cp frontend/env.local.example frontend/.env.local
```

3. **Démarrage de l'application :**
```bash
# Démarrage simultané backend + frontend
npm run dev
```

### URLs d'Accès
- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:5000
- **Health Check :** http://localhost:5000/api/health

## 🔧 Configuration

### Variables d'Environnement Backend

Créer le fichier `backend/.env` :
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration CORS
FRONTEND_URL=http://localhost:3000

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Configuration des logs
LOG_LEVEL=info
```

### Variables d'Environnement Frontend

Créer le fichier `frontend/.env.local` :
```env
# Configuration API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Configuration Next.js
NEXT_PUBLIC_APP_NAME=BMS 3
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🐛 Problèmes Courants et Solutions

### 1. Erreur "Module not found"
```bash
# Réinstaller les dépendances
npm run install:all
```

### 2. Port déjà utilisé
- Backend : Changer `PORT` dans `backend/.env`
- Frontend : Changer le port dans `frontend/package.json` (script dev)

### 3. Erreur CORS
- Vérifier que `FRONTEND_URL` dans `backend/.env` correspond à l'URL du frontend

### 4. Erreur JWT
- Vérifier que `JWT_SECRET` est défini dans `backend/.env`

## 📋 Fonctionnalités Implémentées

### 1. Ajout d'Offres
- Formulaire complet avec tous les champs demandés
- Champ "Offre trouvée par" qui se remplit automatiquement
- Sauvegarde dans localStorage

### 2. Validation d'Offres (Super Administrateurs uniquement)
- Accès restreint aux super administrateurs
- Affichage uniquement des offres du jour
- Interface de validation/rejet avec commentaires

### 3. Protection d'Accès
- `SuperAdminGuard` pour protéger les pages sensibles
- Vérification du rôle utilisateur

## 🧪 Test des Fonctionnalités

### Test de la Validation d'Offres

1. **Se connecter en tant que super administrateur :**
   - Email: `admin@bms.com`
   - Mot de passe: `password`
   - Cela définit automatiquement le rôle `admin`

2. **Ajouter une offre :**
   - Aller sur `/ajouter-offre`
   - Remplir le formulaire
   - La date de soumission pour validation doit être aujourd'hui
   - Le champ "Offre trouvée par" se remplit automatiquement

3. **Valider l'offre :**
   - Aller sur `/valider-offre`
   - Seuls les admins peuvent accéder
   - Voir l'offre créée avec tous les détails
   - Valider ou rejeter l'offre

### Test de l'Accès Restreint

- **Utilisateur normal :** Email sans "admin" → Accès refusé à `/valider-offre`
- **Admin :** Email avec "admin" → Accès autorisé à `/valider-offre`

## 📊 Structure des Données

Les offres sont stockées avec cette structure :
```json
{
  "id": 1234567890,
  "intituleOffre": "Développement application mobile",
  "offreTrouveePar": "Utilisateur Connecté",
  "bailleur": "Client XYZ",
  "pays": "France",
  "objectifs": "Créer une app mobile...",
  "montant": "50000",
  "devise": "EUR",
  "dateSoumissionValidation": "2024-01-15"
}
```

## 🏗️ Architecture

```
BMS_3/
├── backend/                 # API Express.js
│   ├── routes/             # Routes API
│   ├── server.js           # Serveur principal
│   └── package.json        # Dépendances backend
├── frontend/               # Application Next.js
│   ├── app/               # Pages et composants
│   ├── components/        # Composants réutilisables
│   └── package.json       # Dépendances frontend
├── start.bat              # Script de démarrage Windows
├── start.sh               # Script de démarrage Linux/Mac
└── package.json           # Dépendances principales
```

## 🔄 Scripts Disponibles

- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run start` - Démarrage en mode production
- `npm run install:all` - Installation de toutes les dépendances
- `npm run lint` - Vérification du code

## 📞 Support

En cas de problème, vérifiez :
1. Les variables d'environnement sont correctement configurées
2. Toutes les dépendances sont installées
3. Les ports 3000 et 5000 sont disponibles
4. Les logs dans la console pour les erreurs spécifiques
