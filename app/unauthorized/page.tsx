'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import HomeButton from '../../components/HomeButton';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, userRole, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      {/* Bouton Accueil */}
      <div className="absolute top-4 left-4">
        <HomeButton variant="outline" size="sm" />
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icône d'erreur */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Titre et message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accès Refusé
        </h1>
        
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        {/* Informations sur l'utilisateur */}
        {user && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">Informations de votre compte :</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Nom :</span> {user.prenom} {user.nom}</p>
              <p><span className="font-medium">Email :</span> {user.email}</p>
              <p><span className="font-medium">Rôle :</span> {userRole}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Retour à l'accueil
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
          >
            Se déconnecter
          </button>
          
          <Link
            href="/login"
            className="block w-full bg-transparent border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Se connecter avec un autre compte
          </Link>
        </div>

        {/* Message d'aide */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur système.
          </p>
        </div>
      </div>
    </div>
  );
}
