'use client';

import { useTheme } from '../hooks/useTheme';

export default function Diagnostic() {
  const { theme, isDark, isClient } = useTheme();

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
        🔍 Diagnostic des Sections Manquantes
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Client-side:</span>
          <span className={isClient ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {isClient ? '✅ Oui' : '❌ Non'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Thème actuel:</span>
          <span className="text-blue-600 dark:text-blue-400">{theme}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Mode sombre:</span>
          <span className={isDark ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
            {isDark ? '🌙 Oui' : '☀️ Non'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">localStorage theme:</span>
          <span className="text-gray-600 dark:text-gray-400">
            {typeof window !== 'undefined' ? localStorage.getItem('theme') || 'Non défini' : 'Non disponible'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Classe HTML dark:</span>
          <span className="text-gray-600 dark:text-gray-400">
            {typeof document !== 'undefined' ? 
              (document.documentElement.classList.contains('dark') ? '✅ Présente' : '❌ Absente') : 
              'Non disponible'
            }
          </span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>Instructions:</strong> Si ce composant s'affiche, le système de thèmes fonctionne. 
          Si les sections originales ne s'affichent pas, il y a un problème dans leur code.
        </p>
      </div>
    </div>
  );
}
