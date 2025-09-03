'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function Logout() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const performLogout = async () => {
      try {
        if (isMounted) {
          await logout();
          // Rediriger vers la page d'accueil après la déconnexion
          router.push('/');
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // Rediriger quand même vers la page d'accueil
        if (isMounted) {
          router.push('/');
        }
      }
    };

    performLogout();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [router]); // Removed logout from dependencies since it's now stable

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  );
}
