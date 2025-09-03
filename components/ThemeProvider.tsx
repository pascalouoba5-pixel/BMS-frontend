'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const themeHook = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Éviter les problèmes d'hydratation en ne rendant rien jusqu'à ce que le composant soit monté
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={themeHook}>
      <div className={`min-h-screen transition-colors duration-300 ${themeHook.isDark ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
