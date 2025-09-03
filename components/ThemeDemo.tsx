'use client';

import { useTheme } from '../hooks/useTheme';

export default function ThemeDemo() {
  const { theme, isDark, isLight, toggleTheme, setTheme } = useTheme();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Démonstration du Système de Thèmes
      </h2>
      
      <div className="space-y-4">
        {/* Informations sur le thème actuel */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Thème Actuel
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Thème:</span> {theme}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Mode sombre:</span> {isDark ? 'Oui' : 'Non'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Mode clair:</span> {isLight ? 'Oui' : 'Non'}
            </p>
          </div>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Basculer le thème
          </button>
          
          <button
            onClick={() => setTheme('light')}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            Forcer le mode clair
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Forcer le mode sombre
          </button>
        </div>

        {/* Exemples de composants avec thème */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Carte exemple</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Cette carte change automatiquement de couleur selon le thème sélectionné.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Carte bleue</h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Cette carte utilise des couleurs bleues qui s'adaptent au thème.
            </p>
          </div>
        </div>

        {/* Classes CSS utilisées */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Classes CSS utilisées</h4>
          <div className="text-xs font-mono text-gray-600 dark:text-gray-300 space-y-1">
            <div>bg-white dark:bg-gray-800</div>
            <div>text-gray-900 dark:text-white</div>
            <div>border-gray-200 dark:border-gray-700</div>
            <div>bg-gray-100 dark:bg-gray-700</div>
          </div>
        </div>
      </div>
    </div>
  );
}
