'use client';

import { useState, useEffect, useCallback } from 'react';
// import { rechercheAutomatiqueService } from '../services/rechercheAutomatique';

interface SearchStats {
  totalSearches: number;
  averageResults: number;
  topSources: string[];
  recentSearches: Array<{
    date: string;
    offreId: string;
    resultsCount: number;
  }>;
}

export default function RechercheStats() {
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      // TODO: Implémenter le service de recherche automatique
      const searchStats = {
        totalSearches: 0,
        averageResults: 0,
        topSources: [],
        recentSearches: []
      };
      setStats(searchStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Statistiques de Recherche Automatique
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total des recherches */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <i className="ri-search-line text-xl text-blue-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalSearches.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Recherches totales</div>
        </div>

        {/* Résultats moyens */}
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <i className="ri-bar-chart-line text-xl text-green-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.averageResults}</div>
          <div className="text-sm text-gray-600">Résultats moyens</div>
        </div>

        {/* Sources principales */}
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <i className="ri-database-2-line text-xl text-purple-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.topSources.length}</div>
          <div className="text-sm text-gray-600">Sources principales</div>
        </div>
      </div>

      {/* Sources principales */}
      {stats.topSources.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Sources principales</h4>
          <div className="flex flex-wrap gap-2">
            {stats.topSources.map((source, index) => (
              <span
                key={index}
                className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recherches récentes */}
      {stats.recentSearches.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recherches récentes</h4>
          <div className="space-y-2">
            {stats.recentSearches.slice(0, 5).map((search, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {new Date(search.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="text-gray-900 font-medium">
                  {search.resultsCount} résultats
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
