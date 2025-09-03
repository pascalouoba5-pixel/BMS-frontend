'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🛡️ [AuthGuard] Vérification de l\'authentification...');
    console.log(`🔐 [AuthGuard] Authentifié: ${isAuthenticated}`);
    console.log(`👤 [AuthGuard] Rôle: ${userRole}`);
    console.log(`📋 [AuthGuard] Rôle requis: ${requiredRole || 'Aucun'}`);

    if (!isAuthenticated) {
      console.log('❌ [AuthGuard] Utilisateur non authentifié, redirection vers login');
      router.push(redirectTo);
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      console.log(`❌ [AuthGuard] Rôle insuffisant: ${userRole} < ${requiredRole}`);
      router.push('/unauthorized');
      return;
    }

    console.log('✅ [AuthGuard] Accès autorisé');
  }, [isAuthenticated, userRole, requiredRole, router, redirectTo]);



  // Si non authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Si un rôle est requis et que l'utilisateur ne l'a pas, ne rien afficher
  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  // Afficher le contenu protégé
  return <>{children}</>;
}

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

export function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const { userRole } = useAuth();
  
  if (userRole !== 's_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-cross-line text-2xl text-red-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
            <p className="text-gray-600 mb-6">
              Cette page est réservée aux super administrateurs uniquement.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { userRole } = useAuth();
  
  if (userRole !== 'admin' && userRole !== 's_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-cross-line text-2xl text-red-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
            <p className="text-gray-600 mb-6">
              Cette page est réservée aux administrateurs uniquement.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 