'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { getRoleMenu, canAccessPage } from '../utils/permissions';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  href: string;
  name: string;
  icon: string;
  description?: string;
}

export default function SidebarNavigation() {
  const pathname = usePathname();
  const { isOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marquer que nous sommes côté client
    setIsClient(true);
    
    // Ajouter la classe au body pour gérer l'état de la sidebar
    if (typeof window !== 'undefined') {
      if (isOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Vérifier l'authentification seulement côté client
    if (isClient) {
      checkAuth();
    }
  }, [isClient]);

  const checkAuth = () => {
    // Récupérer le rôle utilisateur depuis localStorage
    const role = localStorage.getItem('userRole') || 
                 (localStorage.getItem('isSuperAdmin') === 'true' ? 's_admin' : '');
    setUserRole(role);

    // Obtenir le menu selon le rôle
    if (role) {
      const roleMenu = getRoleMenu(role);
      // Ajouter des descriptions par défaut
      const menuWithDescriptions = roleMenu.map(item => ({
        ...item,
        description: getDefaultDescription(item.name)
      }));
      setNavItems(menuWithDescriptions);
    } else {
      // Menu par défaut si pas de rôle
      setNavItems([
        { 
          href: '/', 
          name: 'Accueil', 
          icon: 'ri-home-line',
          description: 'Page d\'accueil'
        },
        { 
          href: '/performance', 
          name: 'Suivi de Performance', 
          icon: 'ri-bar-chart-line',
          description: 'Analyse des performances'
        }
      ]);
    }
  };

  const getDefaultDescription = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      'Suivi de Performance': 'Analyse des performances',
      'Offres': 'Gestion des offres',
      'Ajouter une offre': 'Créer une nouvelle offre',
      'Valider offre': 'Validation des offres',
      'Offre du jour': 'Offre du jour',
      'Répartition': 'Répartition des offres',
      'Gestion des comptes': 'Gestion des utilisateurs',
      'Offres validées': 'Offres approuvées',
      'Montage administratif': 'Gestion administrative',
      'Pôle Lead': 'Gestion des pôles',
      'Accès Réservé': 'Fonctions d\'administration avancées',
      'Partenariat': 'Gestion des partenaires'
    };
    return descriptions[name] || 'Page de navigation';
  };

  // Fermer le menu sur mobile quand on clique sur un lien
  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.sidebar') && !target.closest('.sidebar-toggle')) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  return (
    <>
      {/* Bouton toggle pour mobile */}
      <button
        className="sidebar-toggle fixed top-4 left-4 z-50 md:hidden bg-white rounded-lg shadow-lg p-3 border border-gray-200 hover:shadow-xl transition-shadow"
        onClick={toggleSidebar}
      >
        <i className={`ri-${isOpen ? 'close' : 'menu'}-line text-xl text-gray-700`}></i>
      </button>

      {/* Overlay pour mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        sidebar
        ${isOpen ? 'open' : ''} 
        ${isMobile ? 'mobile' : ''}
      `}>
        {/* Header du sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" onClick={handleLinkClick}>
            <div className="flex items-center space-x-3">
              <img 
                src="https://static.readdy.ai/image/36ce116ccdb0d05752a287dd792317ce/3a2cd734c9129790560cc32a9975e166.jfif" 
                alt="AMD Logo" 
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-gray-900 dark:text-white hidden md:block">AMD</span>
            </div>
          </Link>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            onClick={closeSidebar}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'
                    }
                  `}
                >
                  <div className={`
                    flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }
                  `}>
                    <i className={`${item.icon} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer du sidebar */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-blue-600 dark:text-blue-400"></i>
            </div>
            <div className="flex-1 min-w-0 hidden md:block">
              {isClient ? (() => {
                try {
                  const userData = localStorage.getItem('user');
                  if (userData) {
                    const user = JSON.parse(userData);
                    const sexe = user.sexe;
                    const prenom = user.prenom || user.name || '';
                    const nom = user.nom || '';
                    const modalite = sexe === 'Mr' ? 'M.' : sexe === 'Mme' ? 'Mme' : '';
                    const nomComplet = `${modalite} ${prenom} ${nom}`.trim();
                    
                    return (
                      <>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{nomComplet || 'Utilisateur'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Connecté</div>
                      </>
                    );
                  }
                } catch (error) {
                  console.warn('Erreur lors de la lecture des données utilisateur:', error);
                }
                return (
                  <>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Utilisateur</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Connecté</div>
                  </>
                );
              })() : (
                <>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Utilisateur</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Chargement...</div>
                </>
              )}
            </div>
          </div>
          
          {/* Bouton de basculement de thème */}
          <div className="flex justify-center">
            <ThemeToggle size="sm" />
          </div>
        </div>
      </div>
    </>
  );
}
