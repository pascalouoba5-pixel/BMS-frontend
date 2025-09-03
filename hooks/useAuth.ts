'use client';

import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  userRole: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    userRole: null
  });

  useEffect(() => {
    // Récupérer le token depuis localStorage au chargement
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setAuthState({
        token,
        user: userData,
        isAuthenticated: true,
        userRole: userData.role || null
      });
    }
  }, []);

  const login = useCallback((token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setAuthState({
      token,
      user,
      isAuthenticated: true,
      userRole: user.role || null
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      userRole: null
    });
  }, []);

  const updateToken = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    
    setAuthState(prev => ({
      ...prev,
      token: newToken
    }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    updateToken
  };
};
