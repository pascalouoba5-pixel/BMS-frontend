# 🔍 Recherches Programmées Avancées - BMS

## 📋 Vue d'ensemble

Le système de recherches programmées a été considérablement amélioré pour offrir des options de planification personnalisables et flexibles. Les utilisateurs peuvent maintenant configurer des recherches automatiques avec des plannings sur mesure selon leurs besoins spécifiques.

## ✨ Nouvelles Fonctionnalités

### 1. Fréquences Étendues
- **Toutes les heures** : Exécution toutes les heures
- **Quotidienne** : Exécution une fois par jour
- **Hebdomadaire** : Exécution une fois par semaine
- **Mensuelle** : Exécution une fois par mois
- **Personnalisée** : Planning sur mesure avec options avancées

### 2. Options de Planification Personnalisées

#### 🗓️ Jours de la Semaine
- Sélection de jours spécifiques (Lundi, Mardi, Mercredi, etc.)
- Support des plannings irréguliers (ex: Lundi + Mercredi + Vendredi)

#### 🕐 Heures d'Exécution
- Choix d'heures précises (9h, 14h, 18h, etc.)
- Exécution à des moments stratégiques de la journée

#### ⏱️ Intervalles Personnalisés
- Configuration d'intervalles en heures (toutes les 6h, 12h, etc.)
- Flexibilité pour des besoins spécifiques

#### 📅 Jours du Mois
- Sélection de dates précises (1er, 15e, dernier jour du mois)
- Idéal pour les rapports mensuels ou les vérifications périodiques

## 🚀 Utilisation

### Interface Utilisateur

1. **Accès** : Onglet "Recherches Programmées" dans la page de recherche automatique
2. **Création** : Bouton "Nouvelle Recherche" pour ouvrir le modal de configuration
3. **Configuration** : Interface intuitive avec options visuelles
4. **Gestion** : Boutons pour modifier, activer/désactiver, supprimer

### Configuration d'une Recherche Personnalisée

```typescript
// Exemple de configuration
const customSchedule = {
  weekDays: [1, 3, 5],        // Lundi, Mercredi, Vendredi
  hours: [9, 14, 18],         // 9h, 14h, 18h
  intervalHours: null,         // Pas d'intervalle fixe
  monthDays: [1, 15]          // 1er et 15 du mois
};
```

## 🔧 Architecture Technique

### Backend

#### Services
- **`scheduler.js`** : Moteur de planification avec calculs intelligents
- **`scheduled-searches.js`** : Routes API pour la gestion des recherches

#### Base de Données
- **Table** : `scheduled_searches`
- **Nouveau champ** : `custom_schedule` (TEXT/JSON)
- **Migration** : Script SQL automatique

#### Fonctionnalités
- Calcul automatique des prochaines exécutions
- Gestion des erreurs et fallbacks
- Exécution toutes les heures (cron job)
- Support des plannings complexes

### Frontend

#### Composants
- **`ScheduledSearchConfig.tsx`** : Interface de configuration avancée
- **`RechercheAutomatique`** : Page principale mise à jour

#### Interface
- Modal de configuration avec onglets
- Sélecteurs visuels pour les options
- Résumé en temps réel du planning
- Validation des configurations

## 📊 Exemples de Cas d'Usage

### 1. Veille Quotidienne
- **Fréquence** : Quotidienne
- **Heure** : 9h00
- **Usage** : Vérification matinale des nouvelles opportunités

### 2. Suivi Hebdomadaire
- **Fréquence** : Hebdomadaire
- **Jour** : Lundi
- **Heure** : 8h00
- **Usage** : Rapport de début de semaine

### 3. Planning Personnalisé Complexe
- **Jours** : Lundi, Mercredi, Vendredi
- **Heures** : 9h00, 14h00, 18h00
- **Usage** : Suivi intensif pendant les jours ouvrés

### 4. Vérification Mensuelle
- **Fréquence** : Mensuelle
- **Jour** : 1er du mois
- **Heure** : 10h00
- **Usage** : Bilan mensuel des opportunités

## 🛠️ Installation et Configuration

### 1. Migration de la Base de Données
```bash
cd backend
node run-migration.js
```

### 2. Test des Fonctionnalités
```bash
node test-scheduled-searches.js
```

### 3. Redémarrage des Serveurs
```bash
# Utiliser le script de redémarrage
.\restart-servers.bat
```

## 🔍 Monitoring et Maintenance

### Logs
- Exécution des recherches programmées
- Calculs des prochaines exécutions
- Gestion des erreurs

### Performance
- Exécution toutes les heures (au lieu de toutes les 6h)
- Gestion des timeouts entre recherches
- Fallbacks en cas d'échec des APIs

## 🚨 Gestion des Erreurs

### Scénarios Couverts
- APIs externes indisponibles
- Erreurs de base de données
- Configurations invalides
- Conflits de planification

### Stratégies de Fallback
- Utilisation de données mockées
- Retry automatique
- Logs détaillés pour le debugging

## 🔮 Évolutions Futures

### Fonctionnalités Prévues
- Notifications par email/SMS
- Rapports de performance
- Intégration avec calendriers
- Templates de configuration
- Planification par équipe

### Améliorations Techniques
- Cache des résultats
- Optimisation des requêtes
- Métriques de performance
- API GraphQL

## 📝 Notes de Développement

### Dépendances
- `node-cron` : Planification des tâches
- `pg` : Connexion PostgreSQL
- `axios` : Appels HTTP

### Compatibilité
- Node.js 18+
- PostgreSQL 12+
- React 18+
- TypeScript 4.8+

### Tests
- Tests unitaires des fonctions de calcul
- Tests d'intégration des APIs
- Tests de performance des planifications

---

**Version** : 2.0.0  
**Date** : 19 décembre 2024  
**Auteur** : Équipe BMS  
**Statut** : ✅ Production Ready
