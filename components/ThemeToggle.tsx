'use client';

import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme, isClient } = useTheme();

  if (!isClient) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full ${getSizeClasses(size)} ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        bg-gray-100 dark:bg-gray-800 
        text-gray-600 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700
        border border-gray-300 dark:border-gray-600
        rounded-full transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        ${getSizeClasses(size)}
        ${className}
      `}
      aria-label={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      title={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      {/* Icône Soleil (mode clair) */}
      <div className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${theme === 'light' 
          ? 'opacity-100 rotate-0 scale-100' 
          : 'opacity-0 rotate-90 scale-75'
        }
      `}>
        <i className="ri-sun-line text-yellow-500" />
      </div>

      {/* Icône Lune (mode sombre) */}
      <div className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${theme === 'dark' 
          ? 'opacity-100 rotate-0 scale-100' 
          : 'opacity-0 -rotate-90 scale-75'
        }
      `}>
        <i className="ri-moon-line text-blue-400" />
      </div>

      {/* Indicateur de transition */}
      <div className={`
        absolute inset-0 rounded-full
        transition-all duration-300 ease-in-out
        ${theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-400 to-purple-500 opacity-20' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20'
        }
      `} />
    </button>
  );
}

function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-8 text-sm';
    case 'lg':
      return 'w-12 h-12 text-xl';
    default: // md
      return 'w-10 h-10 text-base';
  }
}
