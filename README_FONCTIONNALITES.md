# Fonctionnalités de Tri et Affichage Conditionnel

## Vue d'ensemble

Cette application implémente un système complet de tri et d'affichage conditionnel des données basé sur deux modalités principales : **Pôle LEAD** et **Pôle ASSOCIÉS**.

## Fonctionnalités Implémentées

### 1. Page "Gestion de Répartition"

#### ✅ Filtres Principaux
- **Pôle LEAD** : Liste déroulante avec toutes les options de pôles
- **Pôle ASSOCIÉS** : Liste déroulante avec toutes les options de pôles
- **Recherche** : Recherche par titre, bailleur, pôle
- **Pays** : Filtre par pays
- **Priorité** : Filtre par niveau de priorité

#### ✅ Affichage Conditionnel
- Lorsqu'un utilisateur choisit un **Pôle LEAD**, seules les offres liées à ce pôle s'affichent
- Lorsqu'un utilisateur choisit un **Pôle ASSOCIÉS**, seules les offres liées à ce pôle s'affichent
- Les données sont mises à jour dynamiquement sans rechargement complet de la page
- Les choix effectués influencent l'affichage sur toutes les autres pages concernées

#### ✅ Fonctionnalités Avancées
- **Tri** : Tri par colonnes (Intitulé, Bailleur, Priorité, Pôle LEAD, Pôle ASSOCIÉS)
- **Téléchargement TDR** : Bouton pour télécharger les fichiers TDR associés
- **Export Excel** : Export des données filtrées
- **Modales** : Visualisation et modification des offres

### 2. Page "Vue des Répartitions"

#### ✅ Affichage Complet
- Affiche **toutes** les informations enregistrées, sans filtrage
- Tableau complet avec toutes les colonnes
- Recherche globale sur tous les champs

#### ✅ Téléchargement TDR
- Chaque ligne comporte un bouton de téléchargement TDR
- Les TDR sont stockés de manière sécurisée
- Téléchargement via lien direct protégé

#### ✅ Fonctionnalités
- **Tri** : Tri par toutes les colonnes
- **Recherche** : Recherche globale
- **Affichage** : Tous les statuts (brouillon, en attente, approuvée, rejetée)

### 3. Système de Filtres Globaux

#### ✅ État Global
- Les filtres de pôles sont sauvegardés dans le localStorage
- Persistance des choix entre les sessions
- Synchronisation entre toutes les pages

#### ✅ Hook Personnalisé
- `useGlobalFilters` : Hook réutilisable pour gérer l'état global
- Gestion automatique de la sauvegarde et du chargement
- Interface TypeScript complète

### 4. Options de Pôles Disponibles

```typescript
const POLE_OPTIONS = [
  'Pôle santé',
  'Pôle Wash',
  'Pôle Education',
  'Pôle Climat',
  'Pôle Enquêtes',
  'Pôle Modélisation',
  'Pôle Finances Publiques',
  'Pôle Décentralisation',
  'Pôle Cohésion sociale',
  'Pôle Anglophone',
  'Pôle SIDIA'
]
```

## Architecture Technique

### Structure des Données

```typescript
interface Offre {
  id: number;
  intituleOffre?: string;
  titre?: string;
  bailleur?: string;
  client?: string;
  pays?: string[];
  priorite?: 'Opportunité intermédiaire' | 'Priorité haute' | 'Stratégique' | '';
  statut?: 'brouillon' | 'en_attente' | 'approuvée' | 'rejetée';
  poleLead?: PoleType;
  poleAssocies?: PoleType;
  tdrFile?: string;
  // ... autres champs
}
```

### Composants Principaux

1. **`useGlobalFilters`** : Hook pour la gestion des filtres globaux
2. **`Navigation`** : Composant de navigation réutilisable
3. **`GestionRepartition`** : Page principale de gestion
4. **`VueRepartitions`** : Page de vue complète

### Fonctionnalités Techniques

#### ✅ Performance
- Filtrage optimisé pour de gros volumes de données
- Mise à jour dynamique sans rechargement
- Tri côté client pour rapidité

#### ✅ Modularité
- Code modulaire pour faciliter l'ajout de nouvelles modalités
- Composants réutilisables
- Hooks personnalisés

#### ✅ Sécurité
- Validation des types TypeScript
- Gestion sécurisée des fichiers TDR
- Protection contre les erreurs de données

## Utilisation

### Navigation
1. Accédez à **"Gestion de Répartition"** pour filtrer les offres par pôle
2. Accédez à **"Vue des Répartitions"** pour voir toutes les offres
3. Utilisez les filtres de pôles pour afficher les données conditionnellement

### Filtrage
1. Sélectionnez un **Pôle LEAD** pour filtrer les offres principales
2. Sélectionnez un **Pôle ASSOCIÉS** pour filtrer les offres secondaires
3. Les filtres sont automatiquement sauvegardés et synchronisés

### Téléchargement TDR
1. Cliquez sur le bouton de téléchargement dans la colonne TDR
2. Le fichier sera téléchargé automatiquement
3. Le nom du fichier inclut l'identifiant de l'offre

## Maintenance et Évolutions

### Ajout de Nouveaux Pôles
1. Ajoutez le nouveau pôle dans `POLE_OPTIONS`
2. Mettez à jour le type `PoleType`
3. Les filtres se mettront à jour automatiquement

### Ajout de Nouvelles Modalités
1. Créez un nouveau hook personnalisé si nécessaire
2. Ajoutez les nouveaux champs dans l'interface `Offre`
3. Mettez à jour les composants d'affichage

### Optimisations Futures
- Pagination pour de gros volumes de données
- Cache côté client pour améliorer les performances
- API REST pour la gestion des fichiers TDR
- Système de notifications en temps réel
