'use client';

export default function TestSections() {
  return (
    <div className="space-y-8">
      {/* Test Section 1 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Test Section 1 - Veille et présélection
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cette section teste l'affichage basique avec le système de thèmes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Nouvelles opportunités</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">Créer et ajouter de nouvelles opportunités</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100">Validation offre</h3>
            <p className="text-green-700 dark:text-green-300 text-sm">Valider et approuver les opportunités</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Offre du jour</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">Consulter les offres soumises</p>
          </div>
        </div>
      </div>

      {/* Test Section 2 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Test Section 2 - Gestion des répartitions
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cette section teste l'affichage des répartitions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Répartition</h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm">Gérer la répartition des offres</p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Montage administratif</h3>
            <p className="text-indigo-700 dark:text-indigo-300 text-sm">Suivi du montage et dépôt</p>
          </div>
        </div>
      </div>

      {/* Test Section 3 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Test Section 3 - Suivi
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cette section teste l'affichage du suivi.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-lg">
            <h3 className="font-semibold text-pink-900 dark:text-pink-100">Pôles</h3>
            <p className="text-pink-700 dark:text-pink-300 text-sm">Gestion des pôles spécialisés</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100">Suivi des résultats</h3>
            <p className="text-orange-700 dark:text-orange-300 text-sm">Analyse des performances</p>
          </div>
          <div className="bg-teal-100 dark:bg-teal-900 p-4 rounded-lg">
            <h3 className="font-semibold text-teal-900 dark:text-teal-100">Dashboard</h3>
            <p className="text-teal-700 dark:text-teal-300 text-sm">Tableau de bord complet</p>
          </div>
        </div>
      </div>

      {/* Test Section 4 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Test Section 4 - Fonctionnalités avancées
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cette section teste l'affichage des fonctionnalités avancées.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900 p-4 rounded-lg">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Recherche automatique</h3>
            <p className="text-emerald-700 dark:text-emerald-300 text-sm">Recherche intelligente d'opportunités</p>
          </div>
          <div className="bg-cyan-100 dark:bg-cyan-900 p-4 rounded-lg">
            <h3 className="font-semibold text-cyan-900 dark:text-cyan-100">Partenariat</h3>
            <p className="text-cyan-700 dark:text-cyan-300 text-sm">Gestion des partenaires</p>
          </div>
        </div>
      </div>
    </div>
  );
}
