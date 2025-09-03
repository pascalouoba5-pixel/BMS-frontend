'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { canAccessPage } from '../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  pageName: string;
}

export default function ProtectedRoute({ children, requiredRole, pageName }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = () => {
      // Récupérer les informations utilisateur depuis localStorage
      const userRole = localStorage.getItem('userRole') || '';
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      // Vérifier d'abord si l'utilisateur est connecté
      if (!token || !user) {
        // Rediriger vers la page de connexion si pas connecté
        router.push('/login');
        return;
      }

      // Pages avec accès public (pas besoin d'authentification)
      const publicPages = ['offres', 'ajouter-offre', 'offre-du-jour', 'repartition', 'vue-repetitions'];
      if (publicPages.includes(pageName)) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Vérifier les permissions
      if (requiredRole) {
        // Si un rôle spécifique est requis
        if (userRole !== requiredRole && userRole !== 's_admin') {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
      } else {
        // Vérifier les permissions pour la page
        // L'administrateur système (s_admin) a accès à tout
        if (userRole !== 's_admin' && !canAccessPage(userRole, pageName)) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuthorization();
  }, [requiredRole, pageName, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Vérification des permissions...</h1>
            <p className="text-gray-600">Veuillez patienter pendant que nous vérifions vos accès.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-cross-line text-2xl text-red-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
              >
                Retour
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
              >
                Aller à l'Accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
