import { useState, useCallback } from 'react';
import { apiCall } from '../services/api';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>() => {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const callApi = useCallback(async (endpoint: string, options?: RequestInit) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('🌐 [useApi] Appel vers:', endpoint);
      
      const data = await apiCall(endpoint, options);
      
      setState({ data, loading: false, error: null });
      return data;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur API';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, callApi, reset };
};

// Hook spécialisé pour l'authentification
export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 [useAuthApi] Tentative de connexion pour:', email);
      
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('✅ [useAuthApi] Connexion réussie:', response);
      return response;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setError(errorMessage);
      console.error('❌ [useAuthApi] Erreur de connexion:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('👤 [useAuthApi] Tentative d\'inscription pour:', userData.email);
      
      const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      console.log('✅ [useAuthApi] Inscription réussie:', response);
      return response;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      setError(errorMessage);
      console.error('❌ [useAuthApi] Erreur d\'inscription:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('👤 [useAuthApi] Récupération du profil...');
      
      const response = await apiCall('/api/auth/profile');
      
      console.log('✅ [useAuthApi] Profil récupéré:', response);
      return response;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de récupération du profil';
      setError(errorMessage);
      console.error('❌ [useAuthApi] Erreur de récupération du profil:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔓 [useAuthApi] Déconnexion...');
      
      const response = await apiCall('/api/auth/logout', {
        method: 'POST',
      });
      
      console.log('✅ [useAuthApi] Déconnexion réussie:', response);
      return response;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de déconnexion';
      setError(errorMessage);
      console.error('❌ [useAuthApi] Erreur de déconnexion:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    login,
    register,
    getProfile,
    logout,
    clearError,
  };
};
