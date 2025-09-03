# 📚 Documentation des Composants de Gestion d'Erreurs et d'États Vides

## 🎯 Vue d'ensemble

Cette documentation explique comment utiliser les composants créés pour gérer automatiquement les états de chargement, d'erreur et vides dans l'application BMS. Ces composants permettent d'afficher des tableaux et statistiques vides qui se mettent à jour automatiquement avec les nouvelles données.

## 🧩 Composants Disponibles

### 1. **EmptyStateTable** - Tableau avec état vide
Affiche un tableau avec des colonnes définies mais sans données, avec un message explicatif et optionnellement un bouton d'action.

```tsx
import EmptyStateTable from '../components/EmptyStateTable';

<EmptyStateTable
  title="Liste des Offres"
  message="Aucune offre n'a encore été créée. Commencez par ajouter votre première offre."
  columns={['Intitulé', 'Bailleur', 'Statut', 'Date de dépôt', 'Actions']}
  showAddButton={true}
  onAddClick={() => router.push('/ajouter-offre')}
  addButtonText="Ajouter une offre"
/>
```

**Props :**
- `title` : Titre du tableau
- `message` : Message explicatif pour l'état vide
- `columns` : Array des noms des colonnes
- `showAddButton` : Afficher un bouton d'action (optionnel)
- `onAddClick` : Fonction appelée lors du clic sur le bouton
- `addButtonText` : Texte du bouton d'action

### 2. **EmptyStats** - Statistiques avec état vide
Affiche des statistiques vides avec un message explicatif et optionnellement un bouton d'action.

```tsx
import EmptyStats from '../components/EmptyStats';

<EmptyStats
  title="Statistiques des Offres"
  message="Aucune donnée disponible pour générer les statistiques. Ajoutez des offres pour commencer."
  showAddButton={true}
  onAddClick={() => router.push('/ajouter-offre')}
  addButtonText="Ajouter des offres"
/>
```

**Props :**
- `title` : Titre des statistiques
- `message` : Message explicatif pour l'état vide
- `showAddButton` : Afficher un bouton d'action (optionnel)
- `onAddClick` : Fonction appelée lors du clic sur le bouton
- `addButtonText` : Texte du bouton d'action

### 3. **LoadingSpinner** - Indicateur de chargement
Affiche un spinner de chargement avec un message personnalisable.

```tsx
import LoadingSpinner from '../components/LoadingSpinner';

<LoadingSpinner 
  size="lg" 
  message="Chargement des données..." 
  fullScreen={false} 
/>
```

**Props :**
- `size` : Taille du spinner ('sm', 'md', 'lg')
- `message` : Message affiché sous le spinner
- `fullScreen` : Couvrir tout l'écran (optionnel)

### 4. **SmartTable** - Tableau intelligent
Tableau qui gère automatiquement les états de chargement, d'erreur et vides.

```tsx
import SmartTable from '../components/SmartTable';

const columns = [
  { key: 'intitule_offre', header: 'Intitulé' },
  { key: 'bailleur', header: 'Bailleur' },
  { key: 'statut', header: 'Statut' },
  { 
    key: 'actions', 
    header: 'Actions',
    render: (value, item) => (
      <button onClick={() => handleEdit(item)}>Modifier</button>
    )
  }
];

<SmartTable
  data={offres}
  columns={columns}
  loading={loading}
  error={error}
  title="Liste des Offres"
  emptyMessage="Aucune offre trouvée. Commencez par en créer une."
  showAddButton={true}
  onAddClick={() => router.push('/ajouter-offre')}
  onRefresh={fetchOffres}
/>
```

**Props :**
- `data` : Données à afficher
- `columns` : Configuration des colonnes
- `loading` : État de chargement
- `error` : Message d'erreur (si présent)
- `title` : Titre du tableau
- `emptyMessage` : Message pour l'état vide
- `showAddButton` : Afficher un bouton d'ajout
- `onAddClick` : Fonction d'ajout
- `onRefresh` : Fonction de rafraîchissement

### 5. **SmartStats** - Statistiques intelligentes
Composant de statistiques qui gère automatiquement les états de chargement, d'erreur et vides.

```tsx
import SmartStats from '../components/SmartStats';

const stats = [
  {
    title: 'Total des Offres',
    value: '0',
    icon: <svg>...</svg>,
    color: 'blue'
  },
  {
    title: 'Offres en Attente',
    value: '0',
    icon: <svg>...</svg>,
    color: 'yellow'
  }
];

<SmartStats
  title="Vue d'ensemble"
  stats={stats}
  loading={loading}
  error={error}
  emptyMessage="Aucune statistique disponible. Ajoutez des données pour commencer."
  showAddButton={true}
  onAddClick={() => router.push('/ajouter-offre')}
  onRefresh={fetchStats}
  layout="grid"
/>
```

**Props :**
- `title` : Titre des statistiques
- `stats` : Array des statistiques à afficher
- `loading` : État de chargement
- `error` : Message d'erreur
- `emptyMessage` : Message pour l'état vide
- `showAddButton` : Afficher un bouton d'ajout
- `onAddClick` : Fonction d'ajout
- `onRefresh` : Fonction de rafraîchissement
- `layout` : Layout ('grid' ou 'list')

### 6. **ErrorBoundary** - Gestionnaire d'erreurs global
Capture les erreurs JavaScript et les affiche de manière élégante.

```tsx
import ErrorBoundary from '../components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 7. **GlobalErrorHandler** - Gestionnaire d'erreurs global
Affiche un bouton flottant pour voir toutes les erreurs détectées.

```tsx
import GlobalErrorHandler from '../components/GlobalErrorHandler';

<GlobalErrorHandler>
  <YourApp />
</GlobalErrorHandler>
```

### 8. **NotificationManager** - Gestionnaire de notifications
Gère les notifications toast dans toute l'application.

```tsx
import NotificationManager, { useNotifications } from '../components/NotificationManager';

// Dans le composant parent
<NotificationManager>
  <YourApp />
</NotificationManager>

// Dans un composant enfant
const { showSuccess, showError, showWarning, showInfo } = useNotifications();

showSuccess('Succès', 'L\'offre a été créée avec succès');
showError('Erreur', 'Impossible de créer l\'offre');
```

## 🔧 Hooks Personnalisés

### **useApiData** - Gestion des données d'API
Hook pour gérer les états de chargement, d'erreur et de données des API.

```tsx
import { useApiData } from '../hooks/useApiData';

const [state, refresh, clearError] = useApiData(
  () => offresAPI.getAll(),
  {
    autoRefresh: true,
    refreshInterval: 30000,
    onError: (error) => console.error('Erreur API:', error),
    onSuccess: (data) => console.log('Données récupérées:', data)
  }
);

// Utilisation
if (state.loading) return <LoadingSpinner />;
if (state.error) return <div>Erreur: {state.error}</div>;
if (!state.data) return <div>Aucune donnée</div>;

return <div>{state.data.map(item => ...)}</div>;
```

### **useApiList** - Gestion des listes d'API
Hook spécialisé pour les listes avec gestion des états vides.

```tsx
import { useApiList } from '../hooks/useApiData';

const [state, refresh, clearError, isEmpty] = useApiList(
  () => offresAPI.getAll(),
  {
    emptyMessage: 'Aucune offre trouvée',
    showEmptyState: true
  }
);
```

## 📱 Intégration dans les Pages

### Exemple d'intégration dans une page d'offres

```tsx
import React from 'react';
import { useApiData } from '../hooks/useApiData';
import SmartTable from '../components/SmartTable';
import SmartStats from '../components/SmartStats';
import { offresAPI } from '../services/api';

export default function OffresPage() {
  const [offresState, refreshOffres] = useApiData(
    () => offresAPI.getAll(),
    { autoRefresh: true, refreshInterval: 30000 }
  );

  const [statsState, refreshStats] = useApiData(
    () => offresAPI.getStats(),
    { autoRefresh: true, refreshInterval: 60000 }
  );

  const columns = [
    { key: 'intitule_offre', header: 'Intitulé' },
    { key: 'bailleur', header: 'Bailleur' },
    { key: 'statut', header: 'Statut' },
    { key: 'date_depot', header: 'Date de dépôt' }
  ];

  const stats = [
    {
      title: 'Total des Offres',
      value: statsState.data?.total || '0',
      color: 'blue'
    },
    {
      title: 'En Attente',
      value: statsState.data?.enAttente || '0',
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      <SmartStats
        title="Statistiques des Offres"
        stats={stats}
        loading={statsState.loading}
        error={statsState.error}
        emptyMessage="Aucune statistique disponible"
        onRefresh={refreshStats}
      />

      <SmartTable
        data={offresState.data}
        columns={columns}
        loading={offresState.loading}
        error={offresState.error}
        title="Liste des Offres"
        emptyMessage="Aucune offre trouvée. Commencez par en créer une."
        showAddButton={true}
        onAddClick={() => router.push('/ajouter-offre')}
        onRefresh={refreshOffres}
      />
    </div>
  );
}
```

## 🎨 Personnalisation

### Thèmes et Couleurs
Tous les composants utilisent Tailwind CSS et supportent le mode sombre automatiquement. Les couleurs peuvent être personnalisées via les classes CSS.

### Messages Personnalisés
Les messages d'état vide et d'erreur peuvent être personnalisés selon le contexte de chaque page.

### Actions Personnalisées
Les boutons d'action peuvent être configurés pour rediriger vers des pages spécifiques ou exécuter des fonctions personnalisées.

## 🚀 Bonnes Pratiques

1. **Utilisez toujours les composants intelligents** (`SmartTable`, `SmartStats`) plutôt que de gérer manuellement les états
2. **Configurez des messages explicatifs** pour les états vides
3. **Implémentez des fonctions de rafraîchissement** pour permettre aux utilisateurs de réessayer
4. **Utilisez les hooks personnalisés** pour une gestion cohérente des données d'API
5. **Enveloppez votre application** avec `ErrorBoundary` et `GlobalErrorHandler`
6. **Utilisez le système de notifications** pour informer les utilisateurs des succès et erreurs

## 🔍 Dépannage

### Problèmes courants

1. **Composant ne s'affiche pas** : Vérifiez que tous les props requis sont fournis
2. **Erreurs TypeScript** : Assurez-vous que les types des données correspondent aux interfaces
3. **Styles manquants** : Vérifiez que Tailwind CSS est correctement configuré
4. **Notifications ne s'affichent pas** : Vérifiez que `NotificationManager` enveloppe votre application

### Support
Pour toute question ou problème, consultez la documentation des composants ou contactez l'équipe de développement.
