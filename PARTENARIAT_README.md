# 🤝 Module Partenariat - BMS

## Vue d'ensemble

Le module Partenariat permet de gérer les informations des partenaires de l'organisation, incluant leurs coordonnées, domaines d'expertise, marchés gagnés et autres informations pertinentes.

## 🎯 Fonctionnalités

### Gestion des Partenaires
- **Ajout** de nouveaux partenaires
- **Modification** des informations existantes
- **Suppression** de partenaires
- **Recherche** et **filtrage** avancés

### Champs du Formulaire
- **Nom du Bureau** * (obligatoire)
- **Contact** * (obligatoire)
- **Cabinets Ayant Postulé**
- **Contacts**
- **Domaine d'Expertise** * (obligatoire)
- **Pays** * (obligatoire)
- **Marché Gagné**
- **Durée**
- **Bailleur**
- **Valeur**
- **Marché Attribué le**

## 🔐 Permissions d'Accès

### Rôles Autorisés
- **Super Admin** (s_admin) : Accès complet
- **Admin** : Accès complet
- **Chargé de Partenariat** (charge_partenariat) : Accès complet

### Actions Disponibles
- `read` : Lecture des informations
- `write` : Création et modification
- `delete` : Suppression
- `manage` : Gestion complète

## 🚀 Utilisation

### Ajouter un Nouveau Partenaire
1. Cliquer sur le bouton "Nouveau Partenaire"
2. Remplir le formulaire avec les informations requises
3. Cliquer sur "Créer"

### Modifier un Partenaire
1. Cliquer sur l'icône ✏️ dans la liste
2. Modifier les informations souhaitées
3. Cliquer sur "Mettre à jour"

### Supprimer un Partenaire
1. Cliquer sur l'icône 🗑️ dans la liste
2. Confirmer la suppression

### Recherche et Filtrage
- **Recherche textuelle** : Recherche dans le nom, contact et domaine
- **Filtre par pays** : Sélection d'un pays spécifique
- **Filtre par domaine** : Sélection d'un domaine d'expertise

## 📱 Modes d'Affichage

### Vue Tableau
- Affichage compact en colonnes
- Informations principales visibles
- Actions rapides (édition/suppression)

### Vue Cartes
- Affichage détaillé par partenaire
- Informations complètes visibles
- Interface plus visuelle

## 💾 Stockage des Données

Les données des partenaires sont stockées localement dans le navigateur (localStorage) pour :
- **Performance** : Accès rapide aux données
- **Simplicité** : Pas de configuration serveur requise
- **Démonstration** : Fonctionnement immédiat

## 🔧 Configuration

### Ajout du Rôle
Le rôle `charge_partenariat` doit être ajouté dans le système d'authentification :

```typescript
// Dans permissions.ts
charge_partenariat: [
  { resource: 'dashboard', actions: ['read'] },
  { resource: 'partenariat', actions: ['read', 'write', 'delete', 'manage'] },
  { resource: 'recherche-automatique', actions: ['read'] }
]
```

### Menu de Navigation
Le lien vers le partenariat est automatiquement ajouté au menu pour les rôles autorisés.

## 📊 Structure des Données

```typescript
interface Partenaire {
  id: string;
  nomBureau: string;
  contact: string;
  cabinetsAyantPostule: string;
  contacts: string;
  domaineExpertise: string;
  pays: string;
  marcheGagne: string;
  duree: string;
  bailleur: string;
  valeur: string;
  marcheAttribueLe: string;
  dateCreation: string;
}
```

## 🎨 Interface Utilisateur

### Design
- **Style moderne** avec Tailwind CSS
- **Mode sombre/clair** automatique
- **Responsive** pour tous les appareils
- **Animations** fluides et transitions

### Composants
- **Formulaire** : Interface intuitive de saisie
- **Tableau** : Affichage structuré des données
- **Cartes** : Vue détaillée et visuelle
- **Filtres** : Outils de recherche avancés

## 🔍 Recherche et Filtrage

### Recherche Textuelle
- Recherche dans tous les champs textuels
- Recherche en temps réel
- Sensible à la casse

### Filtres
- **Pays** : Liste dynamique des pays existants
- **Domaine** : Liste dynamique des domaines d'expertise
- **Combinaison** : Filtres multiples simultanés

## 📱 Responsive Design

### Mobile
- Menu latéral rétractable
- Formulaire adaptatif
- Boutons tactiles optimisés

### Desktop
- Interface complète
- Navigation latérale fixe
- Affichage multi-colonnes

## 🚀 Développement Futur

### Fonctionnalités Prévues
- **Export** des données (Excel, PDF)
- **Import** en lot
- **Synchronisation** avec une base de données
- **API** pour intégration externe
- **Notifications** de modifications
- **Historique** des changements

### Améliorations Techniques
- **Validation** côté serveur
- **Authentification** avancée
- **Audit trail** des actions
- **Backup** automatique des données

## 📝 Notes Techniques

### Technologies Utilisées
- **React** avec TypeScript
- **Tailwind CSS** pour le styling
- **localStorage** pour le stockage
- **Next.js** pour le routage

### Performance
- **Lazy loading** des composants
- **Optimisation** des re-renders
- **Gestion** efficace de l'état

## 🐛 Dépannage

### Problèmes Courants
1. **Données non sauvegardées** : Vérifier le localStorage
2. **Permissions refusées** : Vérifier le rôle utilisateur
3. **Formulaire non visible** : Vérifier l'état showForm

### Solutions
- Vider le cache du navigateur
- Vérifier les permissions dans la console
- Redémarrer l'application

## 📞 Support

Pour toute question ou problème avec le module Partenariat :
- Consulter la documentation technique
- Vérifier les permissions utilisateur
- Contacter l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe BMS
