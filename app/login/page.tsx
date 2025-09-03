'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../services/api';
import HomeButton from '../../components/HomeButton';
import { useAuth } from '../../hooks/useAuth';
import './login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

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

    try {
      // Appel à l'API de connexion
      console.log('📡 [Login] Appel API de connexion...');
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ [Login] Réponse API reçue:', {
        user: response.user?.email,
        role: response.user?.role,
        hasToken: !!response.token
      });

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
        } else if (err.message.includes('401')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.message.includes('NetworkError')) {
          errorMessage = 'Erreur de connexion au serveur';
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
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
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
            disabled={isLoading}
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
              <p><strong>Admin:</strong> test@bms.com / test123</p>
              <p><strong>Integration:</strong> integration@bms.com / integration123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 