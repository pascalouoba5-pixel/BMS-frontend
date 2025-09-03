'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseTokenReturn {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  isTokenValid: boolean;
  tokenExpiry: Date | null;
  refreshToken: () => Promise<boolean>;
}

export function useToken(): UseTokenReturn {
  const [token, setTokenState] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Initialiser le token depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log('🔑 [useToken] Token trouvé dans localStorage');
        setTokenState(storedToken);
        validateToken(storedToken);
      }
    }
  }, []);

  // Valider un token
  const validateToken = useCallback((tokenToValidate: string) => {
    try {
      // Décoder le token JWT (partie payload)
      const payload = JSON.parse(atob(tokenToValidate.split('.')[1]));
      const expiryDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      console.log('🔍 [useToken] Validation du token...');
      console.log(`⏰ [useToken] Expiration: ${expiryDate.toISOString()}`);
      console.log(`⏰ [useToken] Maintenant: ${now.toISOString()}`);
      console.log(`⏰ [useToken] Valide: ${expiryDate > now}`);
      
      setTokenExpiry(expiryDate);
      setIsTokenValid(expiryDate > now);
      
      // Si le token expire dans moins de 5 minutes, le marquer comme invalide
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      if (expiryDate <= fiveMinutesFromNow) {
        console.log('⚠️ [useToken] Token expire bientôt, marqué comme invalide');
        setIsTokenValid(false);
      }
      
    } catch (error) {
      console.error('❌ [useToken] Erreur lors de la validation du token:', error);
      setIsTokenValid(false);
      setTokenExpiry(null);
    }
  }, []);

  // Définir un nouveau token
  const setToken = useCallback((newToken: string) => {
    console.log('🔑 [useToken] Définition d\'un nouveau token');
    setTokenState(newToken);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken);
      console.log('💾 [useToken] Token sauvegardé dans localStorage');
    }
    
    validateToken(newToken);
  }, [validateToken]);

  // Supprimer le token
  const removeToken = useCallback(() => {
    console.log('🗑️ [useToken] Suppression du token');
    setTokenState(null);
    setTokenExpiry(null);
    setIsTokenValid(false);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      console.log('🧹 [useToken] Token supprimé du localStorage');
    }
  }, []);

  // Rafraîchir le token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    console.log('🔄 [useToken] Tentative de rafraîchissement du token');
    
    try {
      // Ici vous pourriez appeler une API pour rafraîchir le token
      // Pour l'instant, on retourne false car on n'a pas d'endpoint de refresh
      console.log('⚠️ [useToken] Rafraîchissement du token non implémenté');
      return false;
    } catch (error) {
      console.error('❌ [useToken] Erreur lors du rafraîchissement:', error);
      return false;
    }
  }, []);

  // Vérifier la validité du token toutes les minutes
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (token) {
        validateToken(token);
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, [token, validateToken]);

  return {
    token,
    setToken,
    removeToken,
    isTokenValid,
    tokenExpiry,
    refreshToken
  };
}
