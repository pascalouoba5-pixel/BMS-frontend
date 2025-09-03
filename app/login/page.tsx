'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../services/api';
import HomeButton from '../../components/HomeButton';
import { useAuth } from '../../hooks/useAuth';
import { checkApiHealth } from '../../config/api';
import './login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const router = useRouter();
  const { login } = useAuth();

  // Vérifier le statut de l'API au chargement
  useEffect(() => {
    const checkApi = async () => {
      try {
        console.log('🔍 [Login] Vérification du statut de l\'API...');
        const isHealthy = await checkApiHealth();
        setApiStatus(isHealthy ? 'online' : 'offline');
        console.log('📊 [Login] Statut API:', isHealthy ? 'ONLINE' : 'OFFLINE');
      } catch (error) {
        console.error('❌ [Login] Erreur lors de la vérification de l\'API:', error);
        setApiStatus('offline');
      }
    };

    checkApi();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(''); // Clear error when user types
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔐 [Login] Tentative de connexion...');
    console.log(`📧 [Login] Email: ${formData.email}`);
    console.log(`🌐 [Login] API URL: ${process.env.NEXT_PUBLIC_API_URL || 'Configuration par défaut'}`);

    try {
      // Vérifier le statut de l'API avant la connexion
      if (apiStatus === 'offline') {
        throw new Error('L\'API backend n\'est pas accessible. Vérifiez votre connexion internet.');
      }

      // Appel à l'API de connexion
      console.log('📡 [Login] Appel API de connexion...');
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ [Login] Réponse API reçue:', {
        success: response.success,
        message: response.message,
        user: response.user?.email,
        role: response.user?.role,
        hasToken: !!response.token
      });

      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la connexion');
      }

      if (!response.token) {
        throw new Error('Aucun token reçu de l\'API');
      }

      // Utiliser le hook useAuth pour la connexion
      console.log('🔐 [Login] Appel du hook useAuth.login...');
      login(response.user, response.token);
      
      console.log('✅ [Login] Connexion réussie, redirection...');
      
      // Redirection vers la page d'accueil
      router.push('/');
      
    } catch (err: any) {
      console.error('❌ [Login] Erreur lors de la connexion:', err);
      
      let errorMessage = 'Erreur lors de la connexion';
      
      if (err.message) {
        if (err.message.includes('Token invalide')) {
          errorMessage = 'Erreur d\'authentification - Veuillez vous reconnecter';
        } else if (err.message.includes('401') || err.message.includes('Email ou mot de passe incorrect')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Erreur de connexion au serveur - Vérifiez votre connexion internet';
        } else if (err.message.includes('Timeout')) {
          errorMessage = 'Délai d\'attente dépassé - Le serveur met trop de temps à répondre';
        } else if (err.message.includes('API backend n\'est pas accessible')) {
          errorMessage = 'Serveur temporairement indisponible - Réessayez dans quelques minutes';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      {/* Bouton Accueil */}
      <div className="absolute top-4 left-4">
        <HomeButton variant="outline" size="sm" />
      </div>
      
      <div className="container">
        <form className="login-box" onSubmit={handleSubmit}>
          <div className="text-center mb-8">
            <img 
              src="https://static.readdy.ai/image/36ce116ccdb0d05752a287dd792317ce/3a2cd734c9129790560cc32a9975e166.jfif" 
              alt="BMS Logo" 
              className="h-12 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">Connexion BMS</h2>
            <p className="text-gray-600 mt-2">Accédez à votre espace de gestion</p>
            
            {/* Indicateur de statut de l'API */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus === 'checking' ? 'bg-yellow-400' :
                apiStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className={`text-sm ${
                apiStatus === 'checking' ? 'text-yellow-600' :
                apiStatus === 'online' ? 'text-green-600' : 'text-red-600'
              }`}>
                {apiStatus === 'checking' ? 'Vérification de l\'API...' :
                 apiStatus === 'online' ? 'API connectée' : 'API déconnectée'}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="input-box">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              className="w-full"
              placeholder="votre@email.com"
            />
            <label>Email</label>
          </div>

          <div className="input-box password-input">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
              className="w-full pr-12"
              placeholder="••••••••"
            />
            <label>Mot de passe</label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle-btn"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="forgot-pass">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>

          <button 
            type="submit" 
            className={`btn w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isLoading || apiStatus === 'offline'}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>

          <div className="signup-link">
            <span className="text-gray-600">Pas encore de compte ? </span>
            <Link href="/gestion-comptes" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Gérer les comptes
            </Link>
          </div>

          {/* Comptes de test pour le développement */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Comptes de test :</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Admin:</strong> test@bms.com / password123</p>
              <p><strong>Note:</strong> Utilisez le compte de test pour vous connecter</p>
            </div>
          </div>

          {/* Informations de débogage */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">
                <strong>Debug:</strong> API URL = {process.env.NEXT_PUBLIC_API_URL || 'Non définie'}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 
} 