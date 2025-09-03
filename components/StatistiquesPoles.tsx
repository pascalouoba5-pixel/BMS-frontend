'use client';

import { useState, useEffect } from 'react';
// import { dashboardAPI } from '../services/api';
import { logger, logInfo, logError } from '../utils/logger';

interface PoleStats {
  pole: string;
  offresMontagees: number;
  offresDeposees: number;
  offresGagnees: number;
  offresPerdues: number;
  offresEnCours: number;
  tauxReussite: number;
  offresEnPoleAssocie: number; // Nouveau champ pour les offres en pôle associé
}

interface StatistiquesPolesProps {
  period: string;
  startDate?: string;
  endDate?: string;
}

export default function StatistiquesPoles({ period, startDate, endDate }: StatistiquesPolesProps) {
  const [poleStats, setPoleStats] = useState<PoleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Options pour les pôles (pôles lead)
  const POLE_OPTIONS = [
    'Pôle santé',
    'Pôle Wash',
    'Pôle Education',
    'Pôle Climat',
    'Pôle Enquêtes',
    'Pôle Modélisation',
    'Pôle Finances Publiques',
    'Pôle Décentralisation',
    'Pôle Cohésion sociale',
    'Pôle Anglophone',
    'Pôle SIDIA'
  ];

  useEffect(() => {
    fetchPoleStats();
  }, [period, startDate, endDate]);

  const fetchPoleStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      logInfo('Récupération des statistiques des pôles', 'StatistiquesPoles', { period, startDate, endDate });
      
      // TODO: Implémenter l'API dashboard
      // const response = await dashboardAPI.getAllDashboardData(period, startDate, endDate);
      
      // Utiliser des données statiques temporairement
      const offres: any[] = [];
      logInfo(`Données récupérées: ${offres.length} offres`, 'StatistiquesPoles');
        
        // Calculer les statistiques pour chaque pôle lead
        const stats = POLE_OPTIONS.map(pole => {
          const offresPoleLead = offres.filter(offre => offre.poleLead === pole);
          const offresPoleAssocie = offres.filter(offre => offre.poleAssocies === pole);
          
                     const montagees = offresPoleLead.filter(offre => 
             offre.modalite === 'montée' || offre.statutOffre === 'En cours' || offre.statut === 'en_attente'
           ).length;
           
           const deposees = offresPoleLead.filter(offre => 
             offre.offreDeposee === true || offre.statutOffre === 'déposée' || offre.statut === 'approuvée'
           ).length;
           
           const gagnees = offresPoleLead.filter(offre => 
             offre.statutOffre === 'Gagnée' || offre.statut === 'approuvée'
           ).length;
           
           const perdues = offresPoleLead.filter(offre => 
             offre.statutOffre === 'Perdue' || offre.statut === 'rejetée'
           ).length;
           
           const enCours = offresPoleLead.filter(offre => 
             offre.statutOffre === 'En cours' || offre.statut === 'en_attente'
           ).length;
          
          // Calculer le taux de réussite
          const totalTraitees = gagnees + perdues;
          const tauxReussite = totalTraitees > 0 ? Math.round((gagnees / totalTraitees) * 100) : 0;
          
          // Nombre d'offres où ce pôle est associé (pas lead)
          const offresEnPoleAssocie = offresPoleAssocie.length;
          
          return {
            pole,
            offresMontagees: montagees,
            offresDeposees: deposees,
            offresGagnees: gagnees,
            offresPerdues: perdues,
            offresEnCours: enCours,
            tauxReussite,
            offresEnPoleAssocie
          };
        });
        
        setPoleStats(stats);
        logInfo('Statistiques des pôles calculées avec succès', 'StatistiquesPoles', stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logError('Erreur lors de la récupération des statistiques des pôles', error as Error, 'StatistiquesPoles');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (taux: number) => {
    if (taux >= 80) return 'text-green-600 dark:text-green-400';
    if (taux >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (taux >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBgColor = (taux: number) => {
    if (taux >= 80) return 'bg-green-100 dark:bg-green-900';
    if (taux >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    if (taux >= 40) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Chargement des statistiques des pôles...</p>
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
            onClick={fetchPoleStats}
            className="ml-auto px-3 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé global des pôles */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4 text-center">
          📊 Vue d'ensemble des Pôles Lead
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {poleStats.reduce((sum, stat) => sum + stat.offresMontagees, 0)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Montées</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {poleStats.reduce((sum, stat) => sum + stat.offresGagnees, 0)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">Total Gagnées</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {poleStats.reduce((sum, stat) => sum + stat.offresEnCours, 0)}
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400">Total En Cours</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {poleStats.reduce((sum, stat) => sum + stat.offresEnPoleAssocie, 0)}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">Total Pôle Associé</p>
          </div>
        </div>
      </div>

      {/* Grille des statistiques par pôle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {poleStats.map((stat) => (
          <div key={stat.pole} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{stat.pole}</h3>
              
              {/* Indicateur de performance */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(stat.tauxReussite)} ${getStatusColor(stat.tauxReussite)}`}>
                <span className="mr-1">🎯</span>
                {stat.tauxReussite}% de réussite
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Offres montées (pôle lead) */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-2">📈</span>
                  Montées (Lead):
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {stat.offresMontagees}
                </span>
              </div>
              
              {/* Offres déposées */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-2">📤</span>
                  Déposées:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stat.offresDeposees}
                </span>
              </div>
              
              {/* Offres gagnées */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-2">✅</span>
                  Gagnées:
                </span>
                <span className="font-semibold text-green-700 dark:text-green-300">
                  {stat.offresGagnees}
                </span>
              </div>
              
              {/* Offres perdues */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-2">❌</span>
                  Perdues:
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {stat.offresPerdues}
                </span>
              </div>
              
              {/* Offres en cours */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-2">⏳</span>
                  En cours:
                </span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {stat.offresEnCours}
                </span>
              </div>
              
              {/* Séparateur */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                {/* Offres en pôle associé */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <span className="mr-2">🤝</span>
                    Pôle Associé:
                  </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {stat.offresEnPoleAssocie}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Barre de progression du taux de réussite */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Taux de réussite</span>
                <span>{stat.tauxReussite}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stat.tauxReussite >= 80 ? 'bg-green-500' :
                    stat.tauxReussite >= 60 ? 'bg-yellow-500' :
                    stat.tauxReussite >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stat.tauxReussite}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">📋 Légende des indicateurs</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="mr-2">📈</span>
              <span><strong>Montées (Lead):</strong> Offres où le pôle est responsable principal</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📤</span>
              <span><strong>Déposées:</strong> Offres effectivement soumises</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span><strong>Gagnées:</strong> Offres remportées</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              <span><strong>Perdues:</strong> Offres non remportées</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">⏳</span>
              <span><strong>En cours:</strong> Offres en cours de traitement</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🤝</span>
              <span><strong>Pôle Associé:</strong> Offres où le pôle participe en support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
