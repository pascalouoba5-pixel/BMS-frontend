# 🔐 Guide de Gestion de l'Authentification - BMS

## Vue d'ensemble

Ce document décrit le système d'authentification complet du projet BMS, incluant la gestion des tokens JWT, la protection des routes et la gestion des erreurs.

## 🏗️ Architecture du Système

### Composants Principaux

1. **`useAuth.ts`** - Hook principal pour la gestion de l'authentification
2. **`useToken.ts`** - Hook spécialisé pour la gestion des tokens
3. **`api.ts`** - Service API avec gestion automatique des tokens
4. **`AuthGuard.tsx`** - Composant de protection des routes
5. **`login/page.tsx`** - Page de connexion
6. **`unauthorized/page.tsx`** - Page d'erreur d'autorisation

## 🔑 Gestion des Tokens

### Stockage
- **localStorage** : Stockage principal du token
- **sessionStorage** : Non utilisé (pourrait être une option)
- **Cookies** : Non utilisé (pourrait être une option pour la sécurité)

### Format du Token
```
Authorization: Bearer <token>
```

### Validation Automatique
- Vérification de l'expiration toutes les minutes
- Détection des tokens expirant dans moins de 5 minutes
- Suppression automatique des tokens invalides

## 🚀 Utilisation

### Protection d'une Route

```tsx
import AuthGuard from '../components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard requiredRole="admin">
      <div>Contenu protégé</div>
    </AuthGuard>
  );
}
```

### Vérification de l'Authentification

```tsx
import { useAuth } from '../hooks/useAuth';

export default function MyComponent() {
  const { isAuthenticated, user, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }
  
  return <div>Bienvenue {user?.prenom} !</div>;
}
```

### Gestion des Tokens

```tsx
import { useToken } from '../hooks/useToken';

export default function TokenManager() {
  const { token, isTokenValid, tokenExpiry, removeToken } = useToken();
  
  return (
    <div>
      <p>Token valide: {isTokenValid ? 'Oui' : 'Non'}</p>
      <p>Expire le: {tokenExpiry?.toLocaleString()}</p>
      <button onClick={removeToken}>Se déconnecter</button>
    </div>
  );
}
```

## 🔍 Logs et Débogage

### Console Logs
Tous les composants d'authentification génèrent des logs détaillés :

```
🔐 [API] Appel vers: /api/offres
🔑 [API] Token présent: OUI
🔑 [API] Token (premiers caractères): eyJhbGciOiJIUzI1NiIs...
🔑 [API] Longueur du token: 123
📡 [API] Réponse: 200 OK
✅ [API] Succès: /api/offres
```

### Logs par Composant
- **`[API]`** : Service API
- **`[useAuth]`** : Hook d'authentification
- **`[useToken]`** : Hook de gestion des tokens
- **`[Login]`** : Page de connexion
- **`[AuthGuard]`** : Protection des routes

## 🛡️ Sécurité

### Gestion des Erreurs 401
- Détection automatique des tokens invalides
- Suppression immédiate du token du localStorage
- Redirection automatique vers `/login`
- Nettoyage complet des données utilisateur

### Protection des Routes
- Vérification de l'authentification avant rendu
- Vérification des rôles et permissions
- Redirection automatique en cas d'accès refusé
- Gestion des états de chargement

### Expiration des Tokens
- Détection automatique de l'expiration
- Prévention des appels API avec des tokens expirés
- Nettoyage automatique des tokens invalides

## 🔧 Configuration

### Variables d'Environnement
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

### Durée de Vie des Tokens
- **Développement** : 24 heures
- **Production** : Configurable via `JWT_EXPIRES_IN`

## 🚨 Gestion des Erreurs

### Types d'Erreurs Gérées

1. **Token Manquant**
   - Erreur : `Token manquant`
   - Action : Redirection vers `/login`

2. **Token Invalide**
   - Erreur : `Token invalide`
   - Action : Suppression du token, redirection vers `/login`

3. **Token Expiré**
   - Erreur : `Token expiré`
   - Action : Suppression du token, redirection vers `/login`

4. **Permissions Insuffisantes**
   - Erreur : `Accès refusé`
   - Action : Redirection vers `/unauthorized`

### Messages d'Erreur Utilisateur
- Messages clairs et informatifs
- Suggestions d'actions à effectuer
- Pas d'exposition d'informations sensibles

## 📱 Responsive et UX

### États de Chargement
- Spinners pendant la vérification
- Messages informatifs
- Transitions fluides

### Gestion des Erreurs
- Affichage en temps réel
- Messages d'erreur contextuels
- Actions de récupération suggérées

## 🧪 Tests

### Tests Automatiques
```bash
# Test de la base de données
npm run test-db

# Test de l'API
npm run test-api
```

### Tests Manuels
1. **Connexion** : Vérifier le stockage du token
2. **Navigation** : Vérifier la protection des routes
3. **Expiration** : Tester avec un token expiré
4. **Déconnexion** : Vérifier le nettoyage

## 🔄 Maintenance

### Nettoyage Automatique
- Suppression des tokens expirés
- Nettoyage des données utilisateur invalides
- Gestion des erreurs de connexion

### Monitoring
- Logs détaillés pour le débogage
- Détection des problèmes d'authentification
- Métriques de performance

## 🚀 Améliorations Futures

### Fonctionnalités Prévues
- **Refresh Tokens** : Renouvellement automatique
- **Multi-Factor Authentication** : 2FA
- **Session Management** : Gestion des sessions multiples
- **Audit Trail** : Traçabilité des connexions

### Sécurité Avancée
- **Rate Limiting** : Protection contre les attaques
- **IP Whitelisting** : Restriction par adresse IP
- **Device Fingerprinting** : Identification des appareils
- **Geolocation** : Restriction par localisation

## 📞 Support et Dépannage

### Problèmes Courants

1. **"Token invalide"**
   - Vérifier l'expiration du token
   - Vérifier la signature JWT
   - Vérifier la configuration du serveur

2. **Redirection en boucle**
   - Vérifier la logique de protection des routes
   - Vérifier les conditions d'authentification
   - Vérifier la configuration des redirections

3. **Permissions refusées**
   - Vérifier le rôle de l'utilisateur
   - Vérifier la configuration des permissions
   - Vérifier la logique de vérification

### Contact
Pour toute question ou problème :
- Consulter les logs de la console
- Vérifier la configuration
- Contacter l'équipe de développement

---

**Version** : 2.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe BMS
