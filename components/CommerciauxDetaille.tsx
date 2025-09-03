import React from 'react';
import { useCommerciauxDetaille } from '../hooks/useCommerciauxDetaille';

interface CommerciauxDetailleProps {
  period: string;
  startDate?: string;
  endDate?: string;
}

export default function CommerciauxDetaille({ period, startDate, endDate }: CommerciauxDetailleProps) {
  const {
    data,
    loading,
    error,
    refresh,
    lastUpdate
  } = useCommerciauxDetaille({ period, startDate, endDate });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Chargement des statistiques détaillées...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-red-600 dark:text-red-400">❌</span>
          <span className="text-red-800 dark:text-red-200 text-sm">
            Erreur: {error}
          </span>
          <button
            onClick={refresh}
            className="ml-auto px-3 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Nombre d'offres par agent */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="text-xl mr-2">👤</span>
            Nombre d'offres par agent
          </h4>
          {lastUpdate && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Mise à jour: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.offresParAgent.map((agent, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-300">{agent.nom}</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {agent.nombreOffres}
                  </p>
                </div>
                <div className="p-2 bg-blue-200 dark:bg-blue-700 rounded-full">
                  <span className="text-blue-600 dark:text-blue-300">📊</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Nombre de types d'offres par agent */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <span className="text-xl mr-2">🏷️</span>
          Nombre de types d'offres par agent
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.typesOffresParAgent.map((agent, index) => (
            <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-300">{agent.nom}</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {agent.nombreTypes}
                  </p>
                </div>
                <div className="p-2 bg-green-200 dark:bg-green-700 rounded-full">
                  <span className="text-green-600 dark:text-green-300">🏷️</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Nombre d'offres approuvées et rejetées par agent */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <span className="text-xl mr-2">✅❌</span>
          Offres approuvées et rejetées par agent
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.offresStatutParAgent.map((agent, index) => (
            <div key={index} className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-300">{agent.nom}</p>
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-xs text-purple-500 dark:text-purple-400">Approuvées</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {agent.offresApprouvees}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-purple-500 dark:text-purple-400">Rejetées</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {agent.offresRejetees}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Nombre d'offres par site */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <span className="text-xl mr-2">🏢</span>
          Nombre d'offres par site
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.offresParSite.map((site, index) => (
            <div key={index} className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-300">{site.nom}</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {site.nombreOffres}
                  </p>
                </div>
                <div className="p-2 bg-orange-200 dark:bg-orange-700 rounded-full">
                  <span className="text-orange-600 dark:text-orange-300">🏢</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Nombre d'offres par bailleur */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <span className="text-xl mr-2">💰</span>
          Nombre d'offres par bailleur
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.offresParBailleur.map((bailleur, index) => (
            <div key={index} className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600 dark:text-teal-300">{bailleur.nom}</p>
                  <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                    {bailleur.nombreOffres}
                  </p>
                </div>
                <div className="p-2 bg-teal-200 dark:bg-teal-700 rounded-full">
                  <span className="text-teal-600 dark:text-teal-300">💰</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Types d'offres approuvées et rejetées par agent */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <span className="text-xl mr-2">📋</span>
          Types d'offres par statut et par agent
        </h4>
        
        <div className="space-y-4">
          {data.typesOffresStatutParAgent.map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">{item.nom}</h5>
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.typeOffre}</span>
              </div>
              <div className="flex justify-between">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Approuvées</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {item.offresApprouvees}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rejetées</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {item.offresRejetees}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Taux de validation des offres par agent */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <span className="text-xl mr-2">📈</span>
          Taux de validation des offres par agent
        </h4>
        
        <div className="space-y-4">
          {data.tauxValidationParAgent.map((agent, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900 dark:text-white">{agent.nom}</h5>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {agent.offresApprouvees} / {agent.totalOffres}
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {agent.tauxValidation}%
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${agent.tauxValidation}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
