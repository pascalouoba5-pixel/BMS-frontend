# 🔧 Guide de Correction des Erreurs ESLint

Ce guide explique comment corriger automatiquement et manuellement les erreurs ESLint dans le projet BMS Frontend.

## 📋 Erreurs ESLint Courantes

### 1. **react-hooks/exhaustive-deps**
- **Problème** : Hooks `useEffect` et `useCallback` sans dépendances complètes
- **Solution** : Ajouter toutes les dépendances manquantes ou désactiver la règle si nécessaire

```tsx
// ❌ Incorrect
useEffect(() => {
  fetchData();
}, []); // Dépendance manquante

// ✅ Correct
useEffect(() => {
  fetchData();
}, [fetchData]); // Dépendance ajoutée

// ✅ Alternative : Désactiver la règle si nécessaire
useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

### 2. **react/no-unescaped-entities**
- **Problème** : Apostrophes non échappés dans le JSX
- **Solution** : Remplacer `'` par `&apos;` ou `&#39;`

```tsx
// ❌ Incorrect
<p>L'utilisateur n'a pas les permissions</p>

// ✅ Correct
<p>L&apos;utilisateur n&apos;a pas les permissions</p>
```

### 3. **@typescript-eslint/no-unused-vars**
- **Problème** : Variables déclarées mais non utilisées
- **Solution** : Supprimer ou commenter les variables inutilisées

```tsx
// ❌ Incorrect
const [unusedState, setUnusedState] = useState(false);

// ✅ Correct
// const [unusedState, setUnusedState] = useState(false); // À implémenter plus tard
```

### 4. **@next/next/no-img-element**
- **Problème** : Balises `<img>` au lieu du composant `Image` de Next.js
- **Solution** : Remplacer par `<Image>` avec props `width`, `height` et `alt`

```tsx
// ❌ Incorrect
import React from 'react';
<img src="/logo.png" alt="Logo" />

// ✅ Correct
import React from 'react';
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={40} height={40} />
```

## 🚀 Correction Automatique

### Script PowerShell de Correction Automatique

Exécutez le script `fix-eslint-errors.ps1` pour corriger automatiquement la plupart des erreurs :

```powershell
# Dans le dossier frontend
.\fix-eslint-errors.ps1
```

Ce script :
- ✅ Corrige automatiquement les apostrophes non échappés
- ✅ Remplace les balises `<img>` par `<Image>`
- ✅ Exécute ESLint avec auto-fix
- ✅ Affiche un rapport des corrections effectuées

### Script de Vérification

Exécutez le script `check-eslint-status.ps1` pour vérifier l'état du projet :

```powershell
# Dans le dossier frontend
.\check-eslint-status.ps1
```

Ce script :
- 🔍 Analyse tous les fichiers TypeScript/React
- 📊 Identifie les problèmes restants
- 📋 Fournit un rapport détaillé

## 🛠️ Correction Manuelle

### Étape 1 : Vérifier les Erreurs

```bash
# Exécuter ESLint sur tout le projet
npm run lint

# Ou directement avec npx
npx eslint . --ext .ts,.tsx,.js,.jsx --format=compact
```

### Étape 2 : Corriger les Erreurs Une par Une

#### Correction des Hooks useEffect/useCallback

```tsx
// Avant
useEffect(() => {
  if (isClient) {
    checkAuth();
  }
}, [isClient]);

// Après - Ajouter checkAuth aux dépendances
useEffect(() => {
  if (isClient) {
    checkAuth();
  }
}, [isClient, checkAuth]);

// Ou utiliser useCallback pour mémoriser la fonction
const checkAuth = useCallback(() => {
  // ... logique de vérification
}, []);

useEffect(() => {
  if (isClient) {
    checkAuth();
  }
}, [isClient, checkAuth]);
```

#### Correction des Apostrophes

```tsx
// Avant
<h3>Besoin d'aide ?</h3>
<p>L'utilisateur n'a pas les permissions</p>

// Après
<h3>Besoin d&apos;aide ?</h3>
<p>L&apos;utilisateur n&apos;a pas les permissions</p>
```

#### Remplacement des Balises img

```tsx
// Avant
import React from 'react';
<img src="/logo.png" alt="Logo" className="h-10" />

// Après
import React from 'react';
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10" />
```

## 📁 Fichiers Déjà Corrigés

Les composants suivants ont été corrigés :

- ✅ `app/page.tsx` - Apostrophes et balises img corrigés
- ✅ `components/Chatbot.tsx` - Hooks et apostrophes corrigés
- ✅ `components/NotificationManager.tsx` - Hooks useCallback corrigés
- ✅ `components/SidebarNavigation.tsx` - Hooks et apostrophes corrigés
- ✅ `components/AlertBanner.tsx` - Apostrophes corrigés
- ✅ `components/ApiStatusChecker.tsx` - Hooks useEffect corrigés
- ✅ `components/AlertSettings.tsx` - Apostrophes corrigés
- ✅ `components/OffresStatsTables.tsx` - Hooks useEffect corrigés
- ✅ `components/RechercheStats.tsx` - Hooks useEffect corrigés
- ✅ `components/NotificationToast.tsx` - Hooks useEffect corrigés
- ✅ `components/PoleOffresTable.tsx` - Hooks useEffect corrigés
- ✅ `components/StatistiquesPoles.tsx` - Hooks useEffect corrigés
- ✅ `components/ScheduledSearchConfig.tsx` - Hooks useEffect corrigés
- ✅ `components/TDRManager.tsx` - Hooks useEffect corrigés
- ✅ `components/Navigation.tsx` - Balises img remplacées par Image

## 🔄 Processus de Correction Recommandé

1. **Exécuter le script de correction automatique**
   ```powershell
   .\fix-eslint-errors.ps1
   ```

2. **Vérifier l'état du projet**
   ```powershell
   .\check-eslint-status.ps1
   ```

3. **Corriger manuellement les erreurs restantes**

4. **Vérifier que le projet build correctement**
   ```bash
   npm run build
   ```

5. **Exécuter ESLint une dernière fois**
   ```bash
   npm run lint
   ```

## ⚠️ Points d'Attention

- **Ne pas désactiver les règles ESLint globalement** - Utilisez les commentaires d'exclusion uniquement quand nécessaire
- **Toujours tester le projet** après les corrections pour s'assurer que la logique fonctionne
- **Vérifier les dépendances des hooks** - Ajoutez toutes les variables/fonctions utilisées dans le hook
- **Utiliser le composant Image de Next.js** pour toutes les images - Cela améliore les performances

## 🎯 Objectif Final

L'objectif est d'avoir un projet qui :
- ✅ Build sans erreurs ESLint
- ✅ Respecte les bonnes pratiques React/Next.js
- ✅ A une logique fonctionnelle intacte
- ✅ Est prêt pour la production

## 📞 Support

Si vous rencontrez des problèmes lors de la correction des erreurs ESLint :

1. Vérifiez que toutes les dépendances sont installées
2. Exécutez les scripts de correction automatique
3. Consultez la documentation ESLint et Next.js
4. Testez chaque composant après correction

---

**Note** : Ce guide est mis à jour régulièrement. Vérifiez la version la plus récente pour les dernières recommandations.
