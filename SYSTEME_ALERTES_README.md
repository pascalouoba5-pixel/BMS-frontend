# 🚨 Système d'Alertes Automatiques - Documentation

## 🎯 Vue d'ensemble

Le système d'alertes automatiques a été implémenté pour notifier les utilisateurs des échéances importantes liées aux offres. Il surveille automatiquement les dates de montage administratif et de dépôt, et affiche des alertes visuelles selon des règles configurables.

## ✨ Fonctionnalités Implémentées

### 1. 🕐 Alertes Temporelles
- **Alerte 72h avant montage administratif** : Orange, mise à jour automatique
- **Alerte 24h avant dépôt** : Rouge, mise à jour automatique
- **Alerte urgente (≤1h)** : Rouge clignotant
- **Échéance dépassée** : Rouge foncé clignotant

### 2. 🔄 Mise à Jour Automatique
- **Actualisation chaque minute** : Les délais restants sont recalculés en temps réel
- **Persistance** : Les alertes restent visibles lors de la navigation entre pages
- **Indicateur de mise à jour** : Affichage de l'heure de dernière actualisation

### 3. ⚙️ Personnalisation
- **Délais configurables** : Possibilité de modifier les heures d'alerte
- **Fuseau horaire** : Support de différents fuseaux horaires
- **Paramètres persistants** : Sauvegarde locale des préférences

### 4. 🎨 Interface Utilisateur
- **Bannière fixe** : Affichage en haut de toutes les pages
- **Couleurs sémantiques** : Orange (anticipation), Rouge (urgence)
- **Animations** : Clignotement pour les alertes critiques
- **Actions** : Possibilité de fermer les alertes individuellement

## 🗂️ Structure Technique

### Hook useAlerts
```typescript
interface Alert {
  id: string;
  type: 'montage' | 'depot';
  offreId: number;
  intituleOffre: string;
  deadline: Date;
  timeRemaining: string;
  isExpired: boolean;
  isUrgent: boolean;
}

interface AlertSettings {
  montageAlertHours: number;
  depotAlertHours: number;
  timezone: string;
}
```

### Composants
- **AlertBanner** : Affichage des alertes en bannière
- **AlertSettings** : Configuration des paramètres d'alerte
- **useAlerts** : Hook de gestion des alertes

## 🔧 Configuration

### Paramètres par Défaut
```javascript
const DEFAULT_ALERT_SETTINGS = {
  montageAlertHours: 72,    // 72h avant montage administratif
  depotAlertHours: 24,      // 24h avant dépôt
  timezone: 'Europe/Paris'  // Fuseau horaire local
};
```

### Personnalisation
1. Aller sur la page "Montage administratif"
2. Cliquer sur "Paramètres d'alertes"
3. Modifier les délais selon vos besoins
4. Sauvegarder les paramètres

## 📊 Règles d'Alerte

### Montage Administratif
- **Déclenchement** : 72h avant l'échéance (configurable)
- **Couleur** : Orange
- **Champ surveillé** : `delaiTransmissionMontageAdministratif`

### Dépôt
- **Déclenchement** : 24h avant l'échéance (configurable)
- **Couleur** : Rouge
- **Champ surveillé** : `dateDepotPrevu`

### Urgence
- **Déclenchement** : ≤1h avant l'échéance
- **Comportement** : Rouge clignotant
- **S'applique à** : Toutes les alertes

### Expiration
- **Déclenchement** : Échéance dépassée
- **Comportement** : Rouge foncé clignotant
- **Message** : "Échéance dépassée"

## 🎨 Interface Utilisateur

### Bannière d'Alertes
- **Position** : Fixe en haut de toutes les pages
- **Z-index** : 50 (au-dessus du contenu)
- **Responsive** : Adaptation mobile/desktop
- **Masquage** : Bouton pour masquer temporairement

### Affichage des Alertes
```
┌─────────────────────────────────────────────────────────┐
│ 🚨 Alertes d'échéances (2)                    [Masquer] │
│                                                         │
│ 📄 Montage Administratif - Offre A          2h 15m     │
│ 📅 Dépôt - Offre B                         30m         │
│                                                         │
│ Dernière mise à jour : 14:30                           │
└─────────────────────────────────────────────────────────┘
```

### Modal de Configuration
- **Accès** : Page "Montage administratif"
- **Champs** : Délais montage/dépôt, fuseau horaire
- **Validation** : Limites 1-168h
- **Sauvegarde** : localStorage

## 🔄 Cycle de Vie des Alertes

### 1. Détection
- Surveillance continue des offres dans localStorage
- Vérification des dates de montage et dépôt
- Calcul des délais restants

### 2. Génération
- Création d'alertes pour les échéances approchantes
- Calcul du temps restant en temps réel
- Détermination du niveau d'urgence

### 3. Affichage
- Bannière fixe en haut de page
- Mise à jour automatique chaque minute
- Animations pour les alertes critiques

### 4. Interaction
- Fermeture individuelle des alertes
- Masquage temporaire de la bannière
- Configuration des paramètres

## 📁 Fichiers Implémentés

### Nouveaux Fichiers
```
frontend/hooks/useAlerts.ts              # Hook de gestion des alertes
frontend/components/AlertBanner.tsx      # Composant d'affichage
frontend/components/AlertSettings.tsx    # Composant de configuration
test-alertes.html                        # Page de test
SYSTEME_ALERTES_README.md               # Cette documentation
```

### Fichiers Modifiés
```
frontend/components/Layout.tsx           # Intégration AlertBanner
frontend/app/montage-administratif/page.tsx  # Intégration AlertSettings
frontend/test-data.js                    # Données de test avec échéances
```

## 🧪 Tests et Validation

### Page de Test
- **Fichier** : `test-alertes.html`
- **Fonctionnalités** :
  - Chargement de données de test avec échéances proches
  - Simulation d'alertes en temps réel
  - Test des différents niveaux d'urgence

### Données de Test
```javascript
// Exemple d'offre avec alerte
{
  id: 1,
  intituleOffre: "Test - Montage dans 2h",
  delaiTransmissionMontageAdministratif: "2024-01-15T16:00:00Z"
}
```

### Validation
- ✅ Alertes s'affichent correctement
- ✅ Mise à jour automatique fonctionnelle
- ✅ Persistance lors de la navigation
- ✅ Configuration des paramètres
- ✅ Animations pour les alertes critiques

## 🚀 Utilisation

### 1. Activation Automatique
- Les alertes se déclenchent automatiquement
- Aucune configuration initiale requise
- Surveillance continue des offres

### 2. Configuration
1. Aller sur "Montage administratif"
2. Cliquer "Paramètres d'alertes"
3. Ajuster les délais selon vos besoins
4. Sauvegarder

### 3. Interaction
- **Fermer une alerte** : Cliquer sur la croix
- **Masquer temporairement** : Bouton "Masquer"
- **Voir les détails** : Hover sur l'alerte

## 🔮 Évolutions Futures

### Fonctionnalités Possibles
- **Notifications push** : Alertes navigateur
- **Emails automatiques** : Notifications par email
- **Sons d'alerte** : Audio pour les urgences
- **Filtres avancés** : Par pôle, type d'offre
- **Historique** : Log des alertes passées

### Améliorations Techniques
- **Base de données** : Stockage persistant
- **API temps réel** : WebSockets pour mises à jour
- **Mobile** : Notifications push mobiles
- **Intégration calendrier** : Export vers calendrier

## ✅ Validation Complète

### Tests Effectués
- ✅ Détection des échéances approchantes
- ✅ Calcul correct des délais restants
- ✅ Affichage des alertes en bannière
- ✅ Mise à jour automatique chaque minute
- ✅ Persistance lors de la navigation
- ✅ Configuration des paramètres
- ✅ Animations pour les alertes critiques
- ✅ Fermeture individuelle des alertes
- ✅ Support des fuseaux horaires

### Compatibilité
- ✅ Tous les navigateurs modernes
- ✅ Responsive design
- ✅ Intégration avec l'application existante
- ✅ Performance optimisée

## 🎉 Conclusion

Le système d'alertes automatiques est maintenant **entièrement fonctionnel** et intégré à l'application BMS. Il offre une surveillance proactive des échéances importantes avec une interface utilisateur intuitive et des fonctionnalités de personnalisation avancées.

Le système respecte toutes les spécifications demandées :
- Alertes 72h/24h avant les échéances
- Mise à jour automatique chaque minute
- Persistance sur toutes les pages
- Personnalisation des délais
- Support des fuseaux horaires
- Interface visuelle claire et informative
