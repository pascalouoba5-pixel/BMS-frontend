# Système de Permissions BMS - Mise à Jour

## Vue d'ensemble

Le système de permissions BMS a été mis à jour pour donner un accès complet à l'administrateur système (S.admin) à toute l'application.

## Rôles et Permissions

### S.Admin (Super Administrateur) - Accès Complet
- **Accès total** : L'administrateur système a accès à toutes les fonctionnalités de l'application
- **Aucune restriction** : Peut accéder à toutes les pages et effectuer toutes les actions
- **Gestion complète** : Peut gérer tous les utilisateurs, offres, et paramètres système

### Admin (Administrateur)
- Gestion des utilisateurs et validation
- Accès à la plupart des fonctionnalités
- Restrictions sur certaines pages sensibles

### Autres Rôles
- **charge_ajout_offre** : Ajout et gestion des offres
- **cma** : Montage administratif
- **cmt** : Montage technique

## Pages Accessibles par Rôle

### S.Admin (Accès Complet)
- ✅ Dashboard
- ✅ Offres
- ✅ Nouvelle offre
- ✅ Valider offre
- ✅ Offre du jour
- ✅ Répartition
- ✅ Gestion de répartition
- ✅ Gestion des comptes
- ✅ Offres validées
- ✅ Montage administratif
- ✅ Pôle Lead
- ✅ Vue des répartitions
- ✅ Recherche automatique
- ✅ Accès réservé

### Admin
- ✅ Dashboard
- ✅ Offres
- ✅ Nouvelle offre
- ✅ Offre du jour
- ✅ Répartition
- ✅ Gestion de répartition
- ✅ Gestion des comptes
- ✅ Offres validées
- ✅ Vue des répartitions
- ✅ Recherche automatique
- ✅ Accès réservé
- ❌ Valider offre (réservé au S.Admin)

### Autres Rôles
- Accès limité selon leurs responsabilités spécifiques

## Recherche Automatique - Nouvelle API

### Fonctionnalités
- **Recherche par mots-clés** : Peut chercher n'importe quel mot, même s'il n'est pas dans la base de données
- **Génération dynamique** : L'API génère des opportunités basées sur les mots-clés saisis
- **Filtres avancés** : Pays, type d'offre, bailleur, période
- **Scores de similarité** : Calcul automatique de la pertinence des résultats

### Endpoints API
- `POST /api/recherche/keywords` : Recherche par mots-clés
- `POST /api/recherche/similar` : Recherche d'opportunités similaires

### Sources Supportées
- Tenders Info
- DevelopmentAid
- DgMarket
- UN Development Business
- World Bank
- African Development Bank
- European Commission
- USAID
- AFD
- KfW
- Inter-American Development Bank
- Asian Development Bank
- J360
- Coordination Sud
- Relief Web Dev
- BM

## Sécurité

### Authentification
- Toutes les routes API nécessitent un token JWT valide
- Vérification des permissions côté serveur et client
- Protection contre les accès non autorisés

### Validation
- Validation des données d'entrée
- Sanitisation des mots-clés
- Protection contre les injections

## Utilisation

### Pour l'Administrateur Système
1. Connectez-vous avec un compte S.Admin
2. Accédez à toutes les fonctionnalités sans restriction
3. Gérez les utilisateurs et les paramètres système
4. Validez les offres et gérez les répartitions

### Pour la Recherche Automatique
1. Accédez à la page "Recherche Automatique"
2. Choisissez le mode de recherche (offres ou mots-clés)
3. Saisissez vos mots-clés (même nouveaux)
4. Appliquez des filtres si nécessaire
5. Consultez les résultats avec scores de similarité

## Maintenance

### Mise à Jour des Permissions
Les permissions sont définies dans `frontend/utils/permissions.ts`

### Ajout de Nouvelles Sources
Les sources sont configurées dans `backend/routes/recherche.js`

### Monitoring
- Logs des recherches effectuées
- Statistiques d'utilisation
- Suivi des performances

## Support

Pour toute question concernant les permissions ou la recherche automatique, contactez l'équipe technique.
