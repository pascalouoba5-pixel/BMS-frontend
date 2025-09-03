# 🎯 Système de Menu avec Autorisations - BMS

## 📋 Vue d'ensemble

Ce document décrit le nouveau système de menu de l'application BMS qui permet de :
- **Page d'accueil** : Afficher le contenu en pleine largeur sans menu
- **Autres pages** : Afficher le menu latéral en fonction des autorisations d'accès
- **Contenu cadré** : Le contenu commence à partir de la limite du menu (250px)

## 🏗️ Architecture du Système

### **Composants Principaux**

1. **`PageWithMenu.tsx`** - Composant principal pour les pages avec menu
2. **`MainLayout.tsx`** - Layout avec menu (utilisé par PageWithMenu)
3. **`SidebarNavigation.tsx`** - Menu latéral avec navigation
4. **`layout.tsx`** - Layout racine sans menu automatique

### **Structure des Fichiers**

```
frontend/
├── app/
│   ├── layout.tsx          # Layout racine sans menu
│   ├── page.tsx            # Page d'accueil (pleine largeur)
│   ├── dashboard/
│   │   └── page.tsx        # Page avec menu (PageWithMenu)
│   └── partenariat/
│       └── page.tsx        # Page avec menu (PageWithMenu)
├── components/
│   ├── PageWithMenu.tsx    # Composant avec menu et autorisations
│   ├── MainLayout.tsx      # Layout avec sidebar
│   └── SidebarNavigation.tsx # Menu latéral
└── utils/
    └── permissions.ts      # Gestion des autorisations
```

## 🎨 **Utilisation des Composants**

### **1. Page d'Accueil (Sans Menu)**

```tsx
// frontend/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header en pleine largeur */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contenu du header */}
        </div>
      </header>

      {/* Contenu principal en pleine largeur */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenu de la page */}
      </main>
    </div>
  );
}
```

### **2. Page avec Menu (Avec Autorisations)**

```tsx
// frontend/app/dashboard/page.tsx
import PageWithMenu from '../../components/PageWithMenu';

export default function Dashboard() {
  return (
    <PageWithMenu pageName="dashboard">
      {/* Header de la page */}
      <header className="page-header bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1>Tableau de Bord</h1>
        </div>
      </header>

      {/* Contenu de la page */}
      <div className="page-content">
        {/* Contenu principal */}
      </div>
    </PageWithMenu>
  );
}
```

### **3. Page avec Rôle Spécifique**

```tsx
// Page réservée aux administrateurs
import { AdminPage } from '../../components/PageWithMenu';

export default function AdminPanel() {
  return (
    <AdminPage>
      {/* Contenu réservé aux admins */}
    </AdminPage>
  );
}
```

## 🔐 **Système d'Autorisations**

### **Vérification des Permissions**

```tsx
// PageWithMenu vérifie automatiquement :
const canAccess = pageName ? canAccessPage(userRole, pageName) : true;
const hasRequiredRole = requiredRole ? userRole === requiredRole : true;

// Si l'utilisateur n'a pas les permissions :
if (!canAccess || !hasRequiredRole) {
  return <AccessDeniedPage />;
}
```

### **Composants Spécialisés**

```tsx
// Composants avec vérification de rôle
export function AdminPage({ children, className = '' }) {
  return (
    <PageWithMenu requiredRole="admin" className={className}>
      {children}
    </PageWithMenu>
  );
}

export function SuperAdminPage({ children, className = '' }) {
  return (
    <PageWithMenu requiredRole="s_admin" className={className}>
      {children}
    </PageWithMenu>
  );
}

export function AuthenticatedPage({ children, className = '' }) {
  return (
    <PageWithMenu className={className}>
      {children}
    </PageWithMenu>
  );
}
```

## 📱 **Responsive Design**

### **Comportement par Taille d'Écran**

- **Desktop (> 1024px)** : Menu visible, contenu margin-left: 250px
- **Tablet (768px - 1024px)** : Menu visible, contenu adapté
- **Mobile (< 768px)** : Menu caché, contenu pleine largeur

### **Classes CSS Utilisées**

```css
/* Layout principal */
.main-layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
}

/* Sidebar */
.sidebar {
  position: fixed;
  width: var(--sidebar-width); /* 250px */
  height: 100vh;
}

/* Contenu principal */
.main-content {
  margin-left: var(--sidebar-width); /* 250px */
  width: calc(100vw - var(--sidebar-width));
}

/* Header des pages */
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  width: 100%;
}

/* Contenu des pages */
.page-content {
  padding: 2rem;
  width: 100%;
}
```

## 🎯 **Exemples d'Utilisation**

### **Page Partenariat**

```tsx
export default function Partenariat() {
  return (
    <PageWithMenu pageName="partenariat">
      {/* Header avec classe page-header */}
      <header className="page-header bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1>Gestion des Partenaires</h1>
        </div>
      </header>

      {/* Contenu avec classe page-content */}
      <div className="page-content">
        {/* Formulaire et liste des partenaires */}
      </div>
    </PageWithMenu>
  );
}
```

### **Page Dashboard**

```tsx
export default function Dashboard() {
  return (
    <PageWithMenu pageName="dashboard">
      {/* Header de la page */}
      <header className="page-header bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1>Tableau de Bord</h1>
        </div>
      </header>

      {/* Contenu de la page */}
      <div className="page-content">
        {/* KPIs et graphiques */}
      </div>
    </PageWithMenu>
  );
}
```

## 🔧 **Configuration et Personnalisation**

### **Variables CSS Personnalisables**

```css
:root {
  --sidebar-width: 250px;
  --sidebar-width-mobile: 60px;
  --sidebar-width-collapsed: 0px;
}
```

### **Classes CSS Disponibles**

- **`.page-header`** : Header des pages avec menu
- **`.page-content`** : Contenu principal des pages
- **`.main-content`** : Conteneur principal (appliqué automatiquement)
- **`.sidebar`** : Menu latéral

## 📊 **Avantages du Nouveau Système**

### **✅ Avantages**

1. **Flexibilité** : Chaque page décide si elle affiche le menu
2. **Autorisations** : Vérification automatique des accès
3. **Cadrage parfait** : Contenu aligné avec le menu
4. **Responsive** : Adaptation automatique sur mobile
5. **Maintenance** : Code plus clair et organisé

### **🔄 Migration**

- **Pages existantes** : Remplacer `Layout` par `PageWithMenu`
- **Nouvelles pages** : Utiliser directement `PageWithMenu`
- **Page d'accueil** : Aucun changement nécessaire

## 🚀 **Prochaines Étapes**

### **Pages à Migrer**

1. **Dashboard** ✅ (déjà migré)
2. **Partenariat** ✅ (déjà migré)
3. **Recherche automatique** (à migrer)
4. **Gestion des offres** (à migrer)
5. **Autres pages** (à migrer selon les besoins)

### **Améliorations Futures**

- **Thème sombre** : Support complet
- **Animations** : Transitions plus fluides
- **Navigation** : Breadcrumbs et navigation contextuelle
- **Performance** : Lazy loading des composants

## 📞 **Support et Dépannage**

### **Problèmes Courants**

1. **Menu ne s'affiche pas** : Vérifier les permissions dans `permissions.ts`
2. **Contenu mal aligné** : Utiliser les classes `page-header` et `page-content`
3. **Responsive cassé** : Vérifier les media queries dans `globals.css`

### **Debugging**

```tsx
// Ajouter des logs pour déboguer
<PageWithMenu pageName="dashboard" debug={true}>
  {/* Contenu */}
</PageWithMenu>
```

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Statut** : ✅ Implémenté et testé
