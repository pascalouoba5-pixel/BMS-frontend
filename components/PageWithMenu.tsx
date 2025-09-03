'use client';

import React from 'react';
import SidebarNavigation from './SidebarNavigation';
import { useAuth } from '../hooks/useAuth';
import { canAccessPage } from '../utils/permissions';

interface PageWithMenuProps {
  children: React.ReactNode;
  className?: string;
  requiredRole?: string;
  pageName?: string;
}

export default function PageWithMenu({ 
  children, 
  className = '', 
  requiredRole,
  pageName 
}: PageWithMenuProps) {
  const { userRole } = useAuth();

  // Vérifier si l'utilisateur peut accéder à cette page
  const canAccess = pageName ? canAccessPage(userRole || '', pageName) : true;
  
  // Si un rôle spécifique est requis, vérifier les permissions
  const hasRequiredRole = requiredRole ? userRole === requiredRole : true;

  // Si l'utilisateur n'a pas les permissions, ne pas afficher le menu
  if (!canAccess || !hasRequiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès Refusé
          </h1>
          <p className="text-gray-600 mb-6">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-700">
              <strong>Votre rôle :</strong> {userRole || 'Non défini'}
            </p>
            {requiredRole && (
              <p className="text-sm text-gray-700">
                <strong>Rôle requis :</strong> {requiredRole}
              </p>
            )}
            {pageName && (
              <p className="text-sm text-gray-700">
                <strong>Page :</strong> {pageName}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Afficher le layout avec menu si l'utilisateur a les permissions
  return (
    <div className="main-layout">
      <SidebarNavigation />
      <main className={`main-content ${className}`}>
        {children}
      </main>
    </div>
  );
}

// Composants spécialisés pour différents niveaux d'accès
export function AdminPage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <PageWithMenu requiredRole="admin" className={className}>
      {children}
    </PageWithMenu>
  );
}

export function SuperAdminPage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <PageWithMenu requiredRole="s_admin" className={className}>
      {children}
    </PageWithMenu>
  );
}

export function AuthenticatedPage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <PageWithMenu className={className}>
      {children}
    </PageWithMenu>
  );
}
