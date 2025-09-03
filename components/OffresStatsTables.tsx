'use client';

import { useState, useEffect } from 'react';

interface Offre {
  id: number;
  intituleOffre?: string;
  titre?: string;
  typeOffre?: string;
  statut?: 'brouillon' | 'en_attente' | 'approuvée' | 'rejetée';
  offreTrouveePar?: string;
  dateCreation?: string;
  dateSoumissionValidation?: string;
  dateDepot?: string;
  poleLead?: string;
  priorite?: 'Opportunité intermédiaire' | 'Priorité haute' | 'Stratégique' | '' | 'normale' | 'haute' | 'critique';
}

interface PersonStats {
  personne: string;
  total: number;
  AO: number;
  AMI: number;
  'Avis Général': number;
  approuvees: number;
  rejetees: number;
  enAttente: number;
}

interface OffresStatsTablesProps {
  className?: string;
  selectedPeriod?: string;
  selectedPoleLead?: string;
  customStartDate?: string;
  customEndDate?: string;
}

export default function OffresStatsTables({ 
  className = '', 
  selectedPeriod = 'all',
  selectedPoleLead = 'all',
  customStartDate = '',
  customEndDate = ''
}: OffresStatsTablesProps) {
  const [personStats, setPersonStats] = useState<PersonStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    calculateStats();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'offres') {
        calculateStats();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier les changements toutes les 30 secondes
    const interval = setInterval(calculateStats, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedPeriod, selectedPoleLead, customStartDate, customEndDate]);

  const calculateStats = () => {
    try {
      setError('');
      const offresData = localStorage.getItem('offres');
      let offres: Offre[] = offresData ? JSON.parse(offresData) : [];
      
      // Appliquer le filtre de période
      if (selectedPeriod !== 'all') {
        const now = new Date();
        const periodStart = new Date();
        
        switch (selectedPeriod) {
          case 'week':
            periodStart.setDate(now.getDate() - 7);
            break;
          case 'month':
            periodStart.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            periodStart.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            periodStart.setFullYear(now.getFullYear() - 1);
            break;
          case 'custom':
            if (customStartDate && customEndDate) {
              const startDate = new Date(customStartDate);
              const endDate = new Date(customEndDate);
              endDate.setHours(23, 59, 59, 999); // Fin de la journée
              offres = offres.filter(offre => {
                const offreDate = offre.dateDepot ? new Date(offre.dateDepot) : new Date();
                return offreDate >= startDate && offreDate <= endDate;
              });
            }
            break;
          default:
            break;
        }
        
        if (selectedPeriod !== 'custom') {
          offres = offres.filter(offre => {
            const offreDate = offre.dateDepot ? new Date(offre.dateDepot) : new Date();
            return offreDate >= periodStart;
          });
        }
      }

      // Appliquer le filtre par Pôle Lead
      if (selectedPoleLead !== 'all') {
        offres = offres.filter(offre => offre.poleLead === selectedPoleLead);
      }
      
      // Grouper les offres par personne
      const statsMap = new Map<string, PersonStats>();
      
      offres.forEach((offre) => {
        const personne = offre.offreTrouveePar || 'Non spécifié';
        const typeOffre = offre.typeOffre || 'Non spécifié';
        const statut = offre.statut || 'en_attente';
        
        if (!statsMap.has(personne)) {
          statsMap.set(personne, {
            personne,
            total: 0,
            AO: 0,
            AMI: 0,
            'Avis Général': 0,
            approuvees: 0,
            rejetees: 0,
            enAttente: 0
          });
        }
        
        const stats = statsMap.get(personne)!;
        stats.total++;
        
        // Compter par type d'offre (gérer les variations possibles)
        const typeOffreNormalized = typeOffre.toLowerCase().trim();
        if (typeOffreNormalized === 'ao' || typeOffreNormalized === 'appel d\'offres') {
          stats.AO++;
        } else if (typeOffreNormalized === 'ami' || typeOffreNormalized === 'appel à manifestation d\'intérêt') {
          stats.AMI++;
        } else if (typeOffreNormalized === 'avis général' || typeOffreNormalized === 'avis general') {
          stats['Avis Général']++;
        } else if (typeOffre === 'AO') {
          stats.AO++;
        } else if (typeOffre === 'AMI') {
          stats.AMI++;
        } else if (typeOffre === 'Avis Général') {
          stats['Avis Général']++;
        }
        // Si le type n'est pas reconnu, on l'ajoute au total seulement
        
        // Compter par statut
        switch (statut) {
          case 'approuvée':
            stats.approuvees++;
            break;
          case 'rejetée':
            stats.rejetees++;
            break;
          case 'en_attente':
          case 'brouillon':
            stats.enAttente++;
            break;
        }
      });
      
      // Convertir en tableau et trier par nombre total d'offres
      const statsArray = Array.from(statsMap.values()).sort((a, b) => b.total - a.total);
      setPersonStats(statsArray);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      setError('Erreur lors du calcul des statistiques');
      setLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'approuvée': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejetée': return 'bg-red-100 text-red-800 border-red-200';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-blue-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-red-100 p-6 ${className}`}>
        <div className="flex items-center">
          <i className="ri-error-warning-line text-red-600 mr-3 text-2xl"></i>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (personStats.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-blue-100 p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-bar-chart-line text-2xl text-blue-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-600">Il n'y a pas encore d'offres enregistrées pour afficher les statistiques.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Statistiques par type d'offre */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <i className="ri-bar-chart-line text-blue-600 mr-2"></i>
                Statistiques par Type d'Offre
              </h3>
              <p className="text-gray-600 mt-1">Répartition des offres par type et par personne</p>
            </div>
            <button
              onClick={calculateStats}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
              Rafraîchir
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Personne
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  AO
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  AMI
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Avis Général
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personStats.map((stat) => (
                <tr key={stat.personne} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <i className="ri-user-line text-blue-600"></i>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {stat.personne}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {stat.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {stat.AO}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      {stat.AMI}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {stat['Avis Général']}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr className="font-semibold">
                <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Total
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-900">
                    {personStats.reduce((sum, stat) => sum + stat.total, 0)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-900">
                    {personStats.reduce((sum, stat) => sum + stat.AO, 0)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-200 text-orange-900">
                    {personStats.reduce((sum, stat) => sum + stat.AMI, 0)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-200 text-purple-900">
                    {personStats.reduce((sum, stat) => sum + stat['Avis Général'], 0)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Statistiques par statut */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <i className="ri-pie-chart-line text-blue-600 mr-2"></i>
                Statistiques par Statut
              </h3>
              <p className="text-gray-600 mt-1">Répartition des offres par statut et par personne</p>
            </div>
            <button
              onClick={calculateStats}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
              Rafraîchir
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Personne
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Approuvées
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Rejetées
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  En Attente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personStats.map((stat) => (
                <tr key={stat.personne} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <i className="ri-user-line text-blue-600"></i>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {stat.personne}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {stat.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {stat.approuvees}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {stat.rejetees}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {stat.enAttente}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr className="font-semibold">
                <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Total
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-900">
                    {personStats.reduce((sum, stat) => sum + stat.total, 0)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-900">
                    {personStats.reduce((sum, stat) => sum + stat.approuvees, 0)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-900">
                    {personStats.reduce((sum, stat) => sum + stat.rejetees, 0)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-900">
                    {personStats.reduce((sum, stat) => sum + stat.enAttente, 0)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Résumé global */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <i className="ri-dashboard-line text-blue-600 mr-2"></i>
          Résumé Global
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-file-list-line text-blue-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Offres</p>
                <p className="text-2xl font-bold text-gray-900">
                  {personStats.reduce((sum, stat) => sum + stat.total, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-check-line text-green-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {personStats.reduce((sum, stat) => sum + stat.approuvees, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-close-line text-red-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {personStats.reduce((sum, stat) => sum + stat.rejetees, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-time-line text-yellow-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {personStats.reduce((sum, stat) => sum + stat.enAttente, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
