import React from 'react';

interface StatistiquesCommercialesProps {
  data: {
    stats: {
      totalOffres: number;
      offresApprouvees: number;
      offresRejetees: number;
      offresEnAttente: number;
    };
    commerciaux: {
      totalCommerciaux: number;
    };
  };
  loading: boolean;
  period: string;
}

export default function StatistiquesCommerciales({ data, loading, period }: StatistiquesCommercialesProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Chargement des statistiques commerciales...</p>
      </div>
    );
  }

  const offresParPersonne = data.commerciaux.totalCommerciaux > 0 
    ? Math.round(data.stats.totalOffres / data.commerciaux.totalCommerciaux)
    : 0;

  const approuveesRejeteesParPersonne = data.commerciaux.totalCommerciaux > 0 
    ? Math.round((data.stats.offresApprouvees + data.stats.offresRejetees) / data.commerciaux.totalCommerciaux)
    : 0;

  const typesParPersonne = data.commerciaux.totalCommerciaux > 0 
    ? Math.round(data.stats.totalOffres / data.commerciaux.totalCommerciaux)
    : 0;

  return (
    <div className="space-y-6">
      {/* Grille des statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nombre d'offres trouvées par personne */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Offres Trouvées par Personne</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {offresParPersonne}
              </p>
            </div>
            <div className="p-2 bg-blue-200 dark:bg-blue-700 rounded-full">
              <span className="text-blue-600 dark:text-blue-300">🔍</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Moyenne par commercial
          </p>
        </div>

        {/* Nombre d'offres approuvées et rejetées par personne */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-300">Approuvées/Rejetées par Personne</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {approuveesRejeteesParPersonne}
              </p>
            </div>
            <div className="p-2 bg-green-200 dark:bg-green-700 rounded-full">
              <span className="text-green-600 dark:text-green-300">⚖️</span>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-green-600 dark:text-green-400">
              ✅ {data.stats.offresApprouvees}
            </span>
            <span className="text-red-600 dark:text-red-400">
              ❌ {data.stats.offresRejetees}
            </span>
          </div>
        </div>

        {/* Nombre par type d'offre */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Types d'Offres</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {data.stats.totalOffres > 0 ? 'Multiples' : 'Aucun'}
              </p>
            </div>
            <div className="p-2 bg-purple-200 dark:bg-purple-700 rounded-full">
              <span className="text-purple-600 dark:text-purple-300">🏷️</span>
            </div>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
            Diversité des offres
          </p>
        </div>

        {/* Nombre d'offres en attente */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-300">Offres en Attente</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {data.stats.offresEnAttente}
              </p>
            </div>
            <div className="p-2 bg-orange-200 dark:bg-orange-700 rounded-full">
              <span className="text-orange-600 dark:text-orange-300">⏳</span>
            </div>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
            En cours de traitement
          </p>
        </div>

        {/* Nombre de types d'offres par site */}
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600 dark:text-teal-300">Types par Site</p>
              <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                {data.stats.totalOffres > 0 ? 'Multi-sites' : '0'}
              </p>
            </div>
            <div className="p-2 bg-teal-200 dark:bg-teal-700 rounded-full">
              <span className="text-teal-600 dark:text-teal-300">🌍</span>
            </div>
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-2">
            Répartition géographique
          </p>
        </div>

        {/* Nombre de types d'offres par personne */}
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Types par Personne</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                {typesParPersonne}
              </p>
            </div>
            <div className="p-2 bg-indigo-200 dark:bg-indigo-700 rounded-full">
              <span className="text-indigo-600 dark:text-indigo-300">👤</span>
            </div>
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
            Spécialisation par commercial
          </p>
        </div>
      </div>

      {/* Résumé détaillé des performances */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
          📊 Résumé des Performances Commerciales - {period}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.commerciaux.totalCommerciaux}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Commerciaux Actifs</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.stats.offresApprouvees}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Offres Approuvées</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.stats.offresRejetees}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Offres Rejetées</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.stats.offresEnAttente}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">En Attente</p>
          </div>
        </div>

        {/* Métriques supplémentaires */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Taux de Validation
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.stats.totalOffres > 0 
                  ? Math.round((data.stats.offresApprouvees / data.stats.totalOffres) * 100)
                  : 0}%
              </p>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Taux de Rejet
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.stats.totalOffres > 0 
                  ? Math.round((data.stats.offresRejetees / data.stats.totalOffres) * 100)
                  : 0}%
              </p>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Taux d'Attente
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.stats.totalOffres > 0 
                  ? Math.round((data.stats.offresEnAttente / data.stats.totalOffres) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
