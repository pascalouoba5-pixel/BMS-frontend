# 🎨 Système de Thèmes Sombre/Clair - BMS

## 📋 Vue d'ensemble

Le système de thèmes permet aux utilisateurs de basculer entre un mode clair et un mode sombre dans l'application BMS. Le thème choisi est sauvegardé dans le localStorage et persiste entre les sessions.

## 🚀 Fonctionnalités

- ✅ **Basculement automatique** entre thème clair et sombre
- ✅ **Persistance** du choix utilisateur dans localStorage
- ✅ **Détection automatique** de la préférence système
- ✅ **Transitions fluides** entre les thèmes
- ✅ **Support complet** de Tailwind CSS avec classes `dark:`
- ✅ **Pas de clignotement** lors du chargement (gestion de l'hydratation)

## 🛠️ Architecture

### Composants principaux

1. **`useTheme`** - Hook personnalisé pour gérer l'état du thème
2. **`ThemeProvider`** - Provider React pour le contexte du thème
3. **`ThemeToggle`** - Bouton de basculement avec animation
4. **`ThemeDemo`** - Composant de démonstration et test

### Structure des fichiers

```
frontend/
├── hooks/
│   └── useTheme.ts              # Hook principal du thème
├── components/
│   ├── ThemeProvider.tsx        # Provider React
│   ├── ThemeToggle.tsx          # Bouton de basculement
│   └── ThemeDemo.tsx            # Composant de démonstration
├── app/
│   ├── layout.tsx               # Layout avec ThemeProvider
│   └── globals.css              # Styles CSS pour le mode sombre
└── tailwind.config.js           # Configuration Tailwind avec darkMode: 'class'
```

## 📖 Utilisation

### 1. Utilisation basique du hook

```tsx
import { useTheme } from '../hooks/useTheme';

function MonComposant() {
  const { theme, isDark, isLight, toggleTheme, setTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <p>Thème actuel: {theme}</p>
      <button onClick={toggleTheme}>
        Basculer le thème
      </button>
    </div>
  );
}
```

### 2. Utilisation du bouton de basculement

```tsx
import ThemeToggle from '../components/ThemeToggle';

function MonComposant() {
  return (
    <div>
      <ThemeToggle size="md" className="ml-4" />
    </div>
  );
}
```

### 3. Classes Tailwind CSS

Utilisez les classes `dark:` pour définir les styles du mode sombre :

```tsx
<div className="
  bg-white dark:bg-gray-800 
  text-gray-900 dark:text-white 
  border-gray-200 dark:border-gray-700
">
  Contenu avec thème
</div>
```

## 🎯 Classes CSS recommandées

### Couleurs de fond
- `bg-white dark:bg-gray-800` - Conteneurs principaux
- `bg-gray-50 dark:bg-gray-900` - Arrière-plans secondaires
- `bg-gray-100 dark:bg-gray-700` - Cartes et sections

### Couleurs de texte
- `text-gray-900 dark:text-white` - Texte principal
- `text-gray-700 dark:text-gray-300` - Texte secondaire
- `text-gray-500 dark:text-gray-400` - Texte tertiaire

### Bordures
- `border-gray-200 dark:border-gray-700` - Bordures principales
- `border-gray-100 dark:border-gray-600` - Bordures secondaires

### États de survol
- `hover:bg-gray-50 dark:hover:bg-gray-700` - Survol des éléments
- `hover:text-gray-900 dark:hover:text-white` - Survol du texte

## 🔧 Configuration

### Tailwind CSS

Le fichier `tailwind.config.js` est configuré avec :

```js
module.exports = {
  darkMode: 'class', // Active le mode sombre avec la classe 'dark'
  // ... autres configurations
}
```

### CSS Global

Le fichier `globals.css` contient des styles spécifiques pour le mode sombre :

```css
/* Mode sombre */
.dark .main-content {
  background-color: #111827;
  color: #f9fafb;
}

.dark .sidebar {
  background: #1f2937;
  border-right-color: #374151;
}
```

## 🚨 Gestion de l'hydratation

Le système gère automatiquement les problèmes d'hydratation Next.js :

```tsx
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Éviter les problèmes d'hydratation
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }
  
  return (
    <ThemeContext.Provider value={themeHook}>
      <div className={`min-h-screen transition-colors duration-300 ${themeHook.isDark ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

## 🧪 Test et débogage

### Composant de démonstration

Utilisez `ThemeDemo` pour tester le système :

```tsx
import ThemeDemo from '../components/ThemeDemo';

function PageTest() {
  return (
    <div className="p-8">
      <ThemeDemo />
    </div>
  );
}
```

### Vérification dans le navigateur

1. **Ouvrir les DevTools** (F12)
2. **Inspecter l'élément `<html>`**
3. **Vérifier la classe `dark`** qui est ajoutée/supprimée
4. **Consulter le localStorage** pour voir la valeur `theme`

## 🔄 Mise à jour et maintenance

### Ajouter un nouveau composant avec thème

1. Utilisez le hook `useTheme` si vous avez besoin de l'état du thème
2. Ajoutez les classes `dark:` appropriées
3. Testez dans les deux modes

### Modifier les couleurs du thème

1. Mettez à jour les classes Tailwind dans les composants
2. Ajustez les styles CSS globaux si nécessaire
3. Testez la cohérence visuelle

## 📱 Responsive et accessibilité

- Le bouton de thème est accessible avec `aria-label`
- Les transitions sont fluides et non-intrusives
- Le système fonctionne sur tous les appareils
- Support des préférences système (prefers-color-scheme)

## 🎨 Personnalisation

### Couleurs personnalisées

Vous pouvez créer vos propres classes de thème :

```css
/* Dans globals.css */
.dark .bg-custom-primary {
  background-color: #1e40af;
}

.dark .text-custom-primary {
  color: #60a5fa;
}
```

### Animations personnalisées

Modifiez les transitions dans `ThemeToggle.tsx` :

```tsx
className="transition-all duration-500 ease-in-out"
```

## 🐛 Dépannage

### Le thème ne change pas

1. Vérifiez que `ThemeProvider` entoure votre application
2. Assurez-vous que Tailwind CSS est configuré avec `darkMode: 'class'`
3. Vérifiez la console pour les erreurs JavaScript

### Clignotement lors du chargement

1. Vérifiez que `mounted` est géré correctement
2. Assurez-vous que les styles CSS sont chargés avant le JavaScript

### Problèmes de persistance

1. Vérifiez que localStorage est disponible
2. Consultez les permissions du navigateur
3. Testez en mode navigation privée

## 📚 Ressources

- [Documentation Tailwind CSS - Mode sombre](https://tailwindcss.com/docs/dark-mode)
- [Next.js - Gestion de l'hydratation](https://nextjs.org/docs/migrating/from-react)
- [React - Context API](https://react.dev/learn/passing-data-deeply-with-context)

---

**Note :** Ce système de thèmes est conçu pour être simple, performant et facile à maintenir. Il suit les meilleures pratiques React et Next.js pour la gestion d'état et l'hydratation.
