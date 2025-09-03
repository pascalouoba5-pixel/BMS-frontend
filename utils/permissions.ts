/**
 * Système de Permissions BMS
 * 
 * Ce fichier définit le système de permissions pour l'application BMS.
 * Chaque rôle a des permissions spécifiques sur différentes ressources.
 * 
 * Rôles disponibles :
 * - s_admin : Super Administrateur (accès complet)
 * - admin : Administrateur (gestion utilisateurs et validation)
 * - charge_ajout_offre : Chargé d'ajout d'offre (ajout et gestion des offres)
 * - cma : Chargé de Montage Administratif (gestion administrative)
 * - cmt : Chargé de Montage Technique (gestion technique)
 * - charge_partenariat : Chargé de Partenariat (gestion des partenaires)
 * 
 * Actions disponibles :
 * - read : Lecture seule
 * - write : Lecture et écriture
 * - delete : Suppression
 * - approve : Approbation
 * - reject : Rejet
 * - manage : Gestion complète
 * 
 * ACCÈS PUBLIC :
 * - Dashboard : Accès public pour tous les utilisateurs
 * - Nouvelle offre : Accès public pour tous les utilisateurs
 * - Répartition : Accès public pour tous les utilisateurs
 * - Offre du jour : Accès public pour tous les utilisateurs
 * - Vue des répartitions : Accès public pour tous les utilisateurs
 * - Recherche automatique : Accès public pour tous les utilisateurs
 * 
 * PAGES À RESTRICTION :
 * - Valider offre : Réservé aux S.Admin uniquement
 * - Gestion de répartition : Réservé aux Admin uniquement
 * - Gestion des comptes : Réservé aux Admin et S.Admin
 * - Inscription : Réservé aux Admin et S.Admin
 * - Pôles : Accès en lecture/écriture pour CMT et CMA uniquement
 * - Accès réservé : Réservé aux Admin et S.Admin uniquement
 */

// Types pour les permissions
export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  [role: string]: Permission[];
}

// Configuration des permissions par rôle
export const ROLE_PERMISSIONS: RolePermissions = {
  s_admin: [
    // Accès complet à toutes les fonctionnalités
    { resource: 'performance', actions: ['read', 'write'] },
    { resource: 'offres', actions: ['read', 'write', 'delete', 'approve'] },
    { resource: 'ajouter-offre', actions: ['read', 'write'] },
    { resource: 'valider-offre', actions: ['read', 'write', 'approve', 'reject'] },
    { resource: 'offre-du-jour', actions: ['read', 'write'] },
    { resource: 'repartition', actions: ['read', 'write', 'manage'] },
    { resource: 'gestion-repartition', actions: ['read', 'write', 'manage'] },
    { resource: 'gestion-comptes', actions: ['read', 'write', 'delete', 'manage'] },
    { resource: 'offres-validees', actions: ['read', 'write'] },
    { resource: 'montage-administratif', actions: ['read', 'write', 'manage'] },
    { resource: 'pole-lead', actions: ['read', 'write', 'manage'] },
    { resource: 'vue-repetitions', actions: ['read', 'write'] },
    { resource: 'inscription', actions: ['read', 'write'] },
    { resource: 'recherche-automatique', actions: ['read', 'write'] },
    { resource: 'acces-reserve', actions: ['read', 'write', 'manage'] },
    { resource: 'suivi-resultats', actions: ['read', 'write', 'manage'] }
  ],
  admin: [
    // Accès à la gestion des utilisateurs et validation
    { resource: 'performance', actions: ['read'] },
    { resource: 'offres', actions: ['read', 'write', 'approve'] },
    { resource: 'ajouter-offre', actions: ['read', 'write'] },
    { resource: 'offre-du-jour', actions: ['read', 'write'] },
    { resource: 'repartition', actions: ['read', 'write'] },
    { resource: 'gestion-repartition', actions: ['read', 'write', 'manage'] },
    { resource: 'gestion-comptes', actions: ['read', 'write'] },
    { resource: 'offres-validees', actions: ['read', 'write'] },
    { resource: 'vue-repetitions', actions: ['read', 'write'] },
    { resource: 'inscription', actions: ['read', 'write'] },
    { resource: 'recherche-automatique', actions: ['read', 'write'] },
    { resource: 'acces-reserve', actions: ['read', 'write', 'manage'] },
    { resource: 'suivi-resultats', actions: ['read'] }
  ],
  charge_ajout_offre: [
    // Chargé de l'ajout et de la gestion des nouvelles offres
    { resource: 'performance', actions: ['read'] },
    { resource: 'offres', actions: ['read', 'write'] },
    { resource: 'ajouter-offre', actions: ['read', 'write'] },
    { resource: 'offre-du-jour', actions: ['read'] },
    { resource: 'repartition', actions: ['read'] },
    { resource: 'vue-repetitions', actions: ['read'] },
    { resource: 'recherche-automatique', actions: ['read', 'write'] },
    { resource: 'suivi-resultats', actions: ['read'] }
  ],
  cma: [
    // Chargé de Montage Administratif
    { resource: 'performance', actions: ['read'] },
    { resource: 'offres', actions: ['read'] },
    { resource: 'offre-du-jour', actions: ['read'] },
    { resource: 'repartition', actions: ['read'] },
    { resource: 'pole-lead', actions: ['read', 'write'] },
    { resource: 'vue-repetitions', actions: ['read'] },
    { resource: 'recherche-automatique', actions: ['read', 'write'] },
    { resource: 'suivi-resultats', actions: ['read', 'write'] }
  ],
  cmt: [
    // Chargé de Montage Technique
    { resource: 'performance', actions: ['read'] },
    { resource: 'offres', actions: ['read'] },
    { resource: 'offre-du-jour', actions: ['read'] },
    { resource: 'repartition', actions: ['read'] },
    { resource: 'pole-lead', actions: ['read', 'write'] },
    { resource: 'vue-repetitions', actions: ['read'] },
    { resource: 'recherche-automatique', actions: ['read', 'write'] },
    { resource: 'suivi-resultats', actions: ['read'] }
  ],
  charge_partenariat: [
    // Chargé de Partenariat
    { resource: 'performance', actions: ['read'] },
    { resource: 'partenariat', actions: ['read', 'write', 'delete', 'manage'] },
    { resource: 'recherche-automatique', actions: ['read'] }
  ]
};

// Fonction pour vérifier si un utilisateur a une permission spécifique
export function hasPermission(userRole: string, resource: string, action: string): boolean {
  // L'administrateur système (s_admin) a un accès complet à tout
  if (userRole === 's_admin') {
    return true;
  }

  const permissions = ROLE_PERMISSIONS[userRole];
  
  if (!permissions) {
    // Accès public pour certaines ressources
    const publicResources = ['performance', 'offres', 'ajouter-offre', 'offre-du-jour', 'repartition', 'vue-repetitions'];
    if (publicResources.includes(resource) && action === 'read') {
      return true;
    }
    return false;
  }

  const resourcePermission = permissions.find(p => p.resource === resource);
  
  if (!resourcePermission) {
    // Accès public pour certaines ressources
    const publicResources = ['performance', 'offres', 'ajouter-offre', 'offre-du-jour', 'repartition', 'vue-repetitions'];
    if (publicResources.includes(resource) && action === 'read') {
      return true;
    }
    return false;
  }

  return resourcePermission.actions.includes(action) || resourcePermission.actions.includes('*');
}

// Fonction pour obtenir toutes les permissions d'un rôle
export function getRolePermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Fonction pour vérifier si un utilisateur peut accéder à une page
export function canAccessPage(userRole: string, page: string): boolean {
  // L'administrateur système (s_admin) a un accès complet à toutes les pages
  if (userRole === 's_admin') {
    return true;
  }

  // Pages avec accès public
  const publicPages = ['performance', 'offres', 'ajouter-offre', 'offre-du-jour', 'repartition', 'vue-repetitions', 'recherche-automatique', 'suivi-resultats'];
  if (publicPages.includes(page)) {
    return true;
  }

  // Pages avec restrictions spéciales
  const restrictedPages = {
    'valider-offre': ['s_admin'],
    'gestion-repartition': ['admin'],
    'gestion-comptes': ['admin', 's_admin'],
    'inscription': ['admin', 's_admin'],
    'pole-lead': ['cma', 'cmt'],
    'acces-reserve': ['admin', 's_admin'],
    'partenariat': ['s_admin', 'admin', 'charge_partenariat']
  };

  if (restrictedPages[page as keyof typeof restrictedPages]) {
    return restrictedPages[page as keyof typeof restrictedPages].includes(userRole);
  }

  return hasPermission(userRole, page, 'read');
}

// Fonction pour obtenir les pages accessibles pour un rôle
export function getAccessiblePages(role: string): string[] {
  // L'administrateur système (s_admin) a accès à toutes les pages
  if (role === 's_admin') {
    return [
      'performance', 'offres', 'ajouter-offre', 'valider-offre', 'offre-du-jour', 
      'repartition', 'gestion-repartition', 'gestion-comptes', 'offres-validees',
      'montage-administratif', 'pole-lead', 'vue-repetitions', 'inscription',
      'recherche-automatique', 'acces-reserve', 'suivi-resultats', 'partenariat'
    ];
  }

  const permissions = ROLE_PERMISSIONS[role] || [];
  const accessiblePages = permissions.map(p => p.resource);
  
      // Ajouter les pages publiques
    const publicPages = ['performance', 'offres', 'ajouter-offre', 'offre-du-jour', 'repartition', 'vue-repetitions', 'recherche-automatique', 'suivi-resultats'];
  publicPages.forEach(page => {
    if (!accessiblePages.includes(page)) {
      accessiblePages.push(page);
    }
  });

  return accessiblePages;
}

// Configuration des menus par rôle
export const ROLE_MENUS = {
  s_admin: [
    { name: 'Dashboard', href: '/performance', icon: 'ri-dashboard-line' },
    { name: 'Offres', href: '/offres', icon: 'ri-briefcase-line' },
    { name: 'Nouvelle offre', href: '/ajouter-offre', icon: 'ri-add-line' },
    { name: 'Valider offre', href: '/valider-offre', icon: 'ri-check-line' },
    { name: 'Offre du jour', href: '/offre-du-jour', icon: 'ri-calendar-line' },
    { name: 'Répartition', href: '/repartition', icon: 'ri-share-line' },
    { name: 'Gestion de répartition', href: '/repartition/gestion-repartition', icon: 'ri-settings-line' },
    { name: 'Gestion des comptes', href: '/gestion-comptes', icon: 'ri-user-settings-line' },
    { name: 'Offres validées', href: '/offres-validees', icon: 'ri-check-double-line' },
    { name: 'Montage administratif', href: '/montage-administratif', icon: 'ri-file-list-line' },
    { name: 'Pôle Lead', href: '/repartition/pole-lead', icon: 'ri-team-line' },
    { name: 'Vue des répartitions', href: '/repartition/vue-repetitions', icon: 'ri-eye-line' },
    { name: 'Recherche Automatique', href: '/recherche-automatique', icon: 'ri-search-eye-line' },
    { name: 'Suivi des résultats', href: '/suivi-resultats', icon: 'ri-bar-chart-line' },
    { name: 'Accès Réservé', href: '/acces-reserve', icon: 'ri-shield-keyhole-line' }
  ],
  admin: [
    { name: 'Dashboard', href: '/performance', icon: 'ri-dashboard-line' },
    { name: 'Offres', href: '/offres', icon: 'ri-briefcase-line' },
    { name: 'Nouvelle offre', href: '/ajouter-offre', icon: 'ri-add-line' },
    { name: 'Offre du jour', href: '/offre-du-jour', icon: 'ri-calendar-line' },
    { name: 'Répartition', href: '/repartition', icon: 'ri-share-line' },
    { name: 'Gestion de répartition', href: '/repartition/gestion-repartition', icon: 'ri-settings-line' },
    { name: 'Gestion des comptes', href: '/gestion-comptes', icon: 'ri-user-settings-line' },
    { name: 'Offres validées', href: '/offres-validees', icon: 'ri-check-double-line' },
    { name: 'Vue des répartitions', href: '/repartition/vue-repetitions', icon: 'ri-eye-line' },
    { name: 'Recherche Automatique', href: '/recherche-automatique', icon: 'ri-search-eye-line' },
    { name: 'Suivi des résultats', href: '/suivi-resultats', icon: 'ri-bar-chart-line' },
    { name: 'Accès Réservé', href: '/acces-reserve', icon: 'ri-shield-keyhole-line' },
    { name: 'Partenariat', href: '/partenariat', icon: 'ri-handshake-line' }
  ],
  charge_ajout_offre: [
    { name: 'Dashboard', href: '/performance', icon: 'ri-dashboard-line' },
    { name: 'Offres', href: '/offres', icon: 'ri-briefcase-line' },
    { name: 'Nouvelle offre', href: '/ajouter-offre', icon: 'ri-add-line' },
    { name: 'Offre du jour', href: '/offre-du-jour', icon: 'ri-calendar-line' },
    { name: 'Répartition', href: '/repartition', icon: 'ri-share-line' },
    { name: 'Vue des répartitions', href: '/repartition/vue-repetitions', icon: 'ri-eye-line' },
    { name: 'Recherche Automatique', href: '/recherche-automatique', icon: 'ri-search-eye-line' },
    { name: 'Suivi des résultats', href: '/suivi-resultats', icon: 'ri-bar-chart-line' }
  ],
  charge_partenariat: [
    { name: 'Dashboard', href: '/performance', icon: 'ri-dashboard-line' },
    { name: 'Partenariat', href: '/partenariat', icon: 'ri-handshake-line' },
    { name: 'Recherche Automatique', href: '/recherche-automatique', icon: 'ri-search-eye-line' }
  ],
  cma: [
    { name: 'Dashboard', href: '/performance', icon: 'ri-dashboard-line' },
    { name: 'Offres', href: '/offres', icon: 'ri-briefcase-line' },
    { name: 'Offre du jour', href: '/offre-du-jour', icon: 'ri-calendar-line' },
    { name: 'Répartition', href: '/repartition', icon: 'ri-share-line' },
    { name: 'Pôle Lead', href: '/repartition/pole-lead', icon: 'ri-team-line' },
    { name: 'Vue des répartitions', href: '/repartition/vue-repetitions', icon: 'ri-eye-line' },
    { name: 'Recherche Automatique', href: '/recherche-automatique', icon: 'ri-search-eye-line' },
    { name: 'Suivi des résultats', href: '/suivi-resultats', icon: 'ri-bar-chart-line' }
  ],
  cmt: [
    { name: 'Dashboard', href: '/performance', icon: 'ri-dashboard-line' },
    { name: 'Offres', href: '/offres', icon: 'ri-briefcase-line' },
    { name: 'Offre du jour', href: '/offre-du-jour', icon: 'ri-calendar-line' },
    { name: 'Répartition', href: '/repartition', icon: 'ri-share-line' },
    { name: 'Pôle Lead', href: '/repartition/pole-lead', icon: 'ri-team-line' },
    { name: 'Vue des répartitions', href: '/repartition/vue-repetitions', icon: 'ri-eye-line' },
    { name: 'Recherche Automatique', href: '/recherche-automatique', icon: 'ri-search-eye-line' },
    { name: 'Suivi des résultats', href: '/suivi-resultats', icon: 'ri-bar-chart-line' }
  ]
};

// Fonction pour obtenir le menu d'un rôle
export function getRoleMenu(role: string) {
  return ROLE_MENUS[role as keyof typeof ROLE_MENUS] || [];
}
