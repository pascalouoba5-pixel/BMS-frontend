'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HomeButton from '../../components/HomeButton';
import Layout from '../../components/Layout';
import { PoleType } from '../../hooks/useGlobalFilters';
import AlertBanner from '../../components/AlertBanner';
import { offresAPI } from '@/services/api';

// Interface étendue pour les offres avec les champs de suivi
interface OffreSuivi {
  id: number;
  intituleOffre?: string;
  titre?: string;
  bailleur?: string;
  pays?: string[];
  typeOffre?: string;
  dateDepot?: string;
  statut?: 'brouillon' | 'en_attente' | 'approuvée' | 'rejetée';
  montant?: string;
  devise?: string;
  poleLead?: PoleType;
  poleAssocies?: PoleType;
  statutOffre?: 'Gagnée' | 'Perdue' | 'En cours';
  offreDeposee?: boolean;
  // Nouveaux champs pour le suivi des résultats
  dateDepotPrevu?: string;
  dateDepotEffective?: string;
  resultatOffre?: 'Gagnée' | 'Perdue' | 'En cours';
  commentaireResultat?: string;
  note?: string;
  // Nouveaux champs pour le suivi administratif
  dateReceptionMontageAdministratif?: string;
  heureReception?: string;
  heureDepotPrevu?: string;
  heureDepotEffective?: string;
}

// Interface pour les statistiques par pôle
interface StatsPole {
  pole: PoleType;
  montagees: number;
  deposees: number;
  gagnees: number;
  perdues: number;
  enCours: number;
  tauxReussite: number;
}

export default function SuiviResultats() {
  return (
    <Layout>
      <SuiviResultatsContent />
    </Layout>
  );
}

function SuiviResultatsContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [offres, setOffres] = useState<OffreSuivi[]>([]);
  const [statsPoles, setStatsPoles] = useState<StatsPole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPole, setSelectedPole] = useState<string>('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOffre, setEditingOffre] = useState<OffreSuivi | null>(null);
  const [editFormData, setEditFormData] = useState({
    dateDepotPrevu: '',
    dateDepotEffective: '',
    resultatOffre: 'En cours' as 'Gagnée' | 'Perdue' | 'En cours',
    commentaireResultat: '',
    note: '',
    // Nouveaux champs pour le suivi administratif
    dateReceptionMontageAdministratif: '',
    heureReception: '',
    heureDepotPrevu: '',
    heureDepotEffective: ''
  });
  
  // États pour le filtre périodique
  const [periodFilter, setPeriodFilter] = useState<string>('tous');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCustomDateInputs, setShowCustomDateInputs] = useState<boolean>(false);
  
  // État pour les permissions
  const [userRole, setUserRole] = useState<string>('');
  const [canEdit, setCanEdit] = useState<boolean>(false);
  
  const router = useRouter();

  // Options pour les pôles
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
  ] as const;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      // Initialiser les données de test si nécessaire
      fetchOffres();
      
      // Récupérer le rôle utilisateur et vérifier les permissions
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role || '';
      setUserRole(role);
      
      // Seuls les S.Admin et CMA peuvent modifier
      setCanEdit(role === 's_admin' || role === 'cma');
    }
  }, [router]);

  const fetchOffres = async () => {
    setLoading(true);
    try {
      // Récupérer les offres depuis l'API backend
      const response = await offresAPI.getAll();
      
      if (response.success && response.data) {
        setOffres(response.data);
        calculateStatsPoles(response.data);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des offres');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsPoles = (offresData: OffreSuivi[]) => {
    const stats: StatsPole[] = POLE_OPTIONS.map(pole => {
      const offresPole = offresData.filter(offre => offre.poleLead === pole);
      const montagees = offresPole.length;
      const deposees = offresPole.filter(offre => offre.offreDeposee).length;
      const gagnees = offresPole.filter(offre => offre.resultatOffre === 'Gagnée').length;
      const perdues = offresPole.filter(offre => offre.resultatOffre === 'Perdue').length;
      const enCours = offresPole.filter(offre => offre.resultatOffre === 'En cours' || !offre.resultatOffre).length;
      const tauxReussite = deposees > 0 ? Math.round((gagnees / deposees) * 100) : 0;

      return {
        pole,
        montagees,
        deposees,
        gagnees,
        perdues,
        enCours,
        tauxReussite
      };
    });

    setStatsPoles(stats);
  };

  // Trier les offres par date (plus récentes en premier) puis filtrer
  const sortedOffres = [...offres].sort((a, b) => {
    const dateA = a.dateDepot ? new Date(a.dateDepot).getTime() : 
                 a.dateDepotEffective ? new Date(a.dateDepotEffective).getTime() : 
                 a.dateDepotPrevu ? new Date(a.dateDepotPrevu).getTime() : 0;
    const dateB = b.dateDepot ? new Date(b.dateDepot).getTime() : 
                 b.dateDepotEffective ? new Date(b.dateDepotEffective).getTime() : 
                 b.dateDepotPrevu ? new Date(b.dateDepotPrevu).getTime() : 0;
    return dateB - dateA; // Tri décroissant (plus récentes en premier)
  });

  const filteredOffres = sortedOffres.filter(offre => {
    const matchesPole = selectedPole === 'tous' || offre.poleLead === selectedPole;
    const matchesSearch = !searchTerm || 
      offre.intituleOffre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.bailleur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.poleLead?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre périodique
    let matchesPeriod = true;
    if (periodFilter !== 'tous') {
      const offreDate = offre.dateDepot || offre.dateDepotEffective || offre.dateDepotPrevu;
      if (offreDate) {
        const offreDateObj = new Date(offreDate);
        const today = new Date();
        
        switch (periodFilter) {
          case '7j':
            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesPeriod = offreDateObj >= sevenDaysAgo;
            break;
          case '30j':
            const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesPeriod = offreDateObj >= thirtyDaysAgo;
            break;
          case '90j':
            const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            matchesPeriod = offreDateObj >= ninetyDaysAgo;
            break;
          case 'personnalise':
            if (customStartDate && customEndDate) {
              const startDate = new Date(customStartDate);
              const endDate = new Date(customEndDate);
              matchesPeriod = offreDateObj >= startDate && offreDateObj <= endDate;
            }
            break;
        }
      }
    }
    
    return matchesPole && matchesSearch && matchesPeriod;
  });

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifiée';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Gagnée':
        return 'bg-green-100 text-green-800';
      case 'Perdue':
        return 'bg-red-100 text-red-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditOffre = (offre: OffreSuivi) => {
    setEditingOffre(offre);
    setEditFormData({
      dateDepotPrevu: offre.dateDepotPrevu || '',
      dateDepotEffective: offre.dateDepotEffective || '',
      resultatOffre: offre.resultatOffre || 'En cours',
      commentaireResultat: offre.commentaireResultat || '',
      note: offre.note || '',
      // Nouveaux champs pour le suivi administratif
      dateReceptionMontageAdministratif: offre.dateReceptionMontageAdministratif || '',
      heureReception: offre.heureReception || '',
      heureDepotPrevu: offre.heureDepotPrevu || '',
      heureDepotEffective: offre.heureDepotEffective || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingOffre || !canEdit) return;

    try {
      const response = await offresAPI.update(editingOffre.id, editFormData);
      if (response.success) {
        const updatedOffres = offres.map(offre => 
          offre.id === editingOffre.id 
            ? { 
                ...offre, 
                ...editFormData,
                offreDeposee: editFormData.dateDepotEffective ? true : offre.offreDeposee
              }
            : offre
        );
        setOffres(updatedOffres);
        calculateStatsPoles(updatedOffres);
        setShowEditModal(false);
        setEditingOffre(null);
      } else {
        console.error('Erreur lors de la sauvegarde de l\'offre:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'offre:', error);
    }
  };

  const handlePeriodFilterChange = (value: string) => {
    setPeriodFilter(value);
    setShowCustomDateInputs(value === 'personnalise');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertBanner />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-bar-chart-line text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Suivi des Résultats</h1>
            <p className="text-xl opacity-90">Analyse des performances et des résultats obtenus par pôle</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques par pôle */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiques par Pôle</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {statsPoles.map((stats) => (
              <div key={stats.pole} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 text-center">{stats.pole}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Montées:</span>
                    <span className="font-semibold text-blue-600">{stats.montagees}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Déposées:</span>
                    <span className="font-semibold text-green-600">{stats.deposees}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gagnées:</span>
                    <span className="font-semibold text-green-700">{stats.gagnees}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Perdues:</span>
                    <span className="font-semibold text-red-600">{stats.perdues}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En cours:</span>
                    <span className="font-semibold text-yellow-600">{stats.enCours}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Taux de réussite:</span>
                      <span className={`font-bold text-lg ${
                        stats.tauxReussite >= 70 ? 'text-green-600' : 
                        stats.tauxReussite >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {stats.tauxReussite}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
            </div>

                {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par pôle</label>
                <select
                  value={selectedPole}
                  onChange={(e) => setSelectedPole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tous">Tous les pôles</option>
                  {POLE_OPTIONS.map(pole => (
                    <option key={pole} value={pole}>{pole}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                <select
                  value={periodFilter}
                  onChange={(e) => handlePeriodFilterChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tous">Toutes les périodes</option>
                  <option value="7j">7 derniers jours</option>
                  <option value="30j">30 derniers jours</option>
                  <option value="90j">90 derniers jours</option>
                  <option value="personnalise">Période personnalisée</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                <input
                  type="text"
                  placeholder="Rechercher une offre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Vue :</span>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="ri-table-line mr-2"></i>
                Tableau
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="ri-grid-line mr-2"></i>
                Cartes
              </button>
            </div>
          </div>
          
          {/* Filtre de période personnalisée */}
          {showCustomDateInputs && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {customStartDate && customEndDate && (
                    <span>
                      Période sélectionnée : {formatDate(customStartDate)} - {formatDate(customEndDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
          
        {/* Tableau résumé des offres */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tableau Résumé des Offres</h2>
                <p className="text-gray-600 mt-1">Détails des offres avec leurs résultats et commentaires</p>
              </div>
              <div className="flex items-center gap-2">
                {canEdit ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="ri-edit-line mr-1"></i>
                    Mode édition activé
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <i className="ri-eye-line mr-1"></i>
                    Mode consultation
                  </span>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des données...</p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pôle Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réception MA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dépôt Prévu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dépôt Effectif
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Résultat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commentaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    {canEdit && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOffres.map((offre) => (
                    <tr key={offre.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {offre.intituleOffre || offre.titre || 'Sans titre'}
                          </div>
                          <div className="text-sm text-gray-500">{offre.bailleur}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{offre.poleLead || 'Non assigné'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{formatDate(offre.dateReceptionMontageAdministratif)}</div>
                          {offre.heureReception && (
                            <div className="text-xs text-gray-500">{offre.heureReception}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{formatDate(offre.dateDepotPrevu)}</div>
                          {offre.heureDepotPrevu && (
                            <div className="text-xs text-gray-500">{offre.heureDepotPrevu}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{formatDate(offre.dateDepotEffective)}</div>
                          {offre.heureDepotEffective && (
                            <div className="text-xs text-gray-500">{offre.heureDepotEffective}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offre.resultatOffre || 'En cours')}`}>
                          {offre.resultatOffre || 'En cours'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {offre.commentaireResultat || '-'}
                        </div>
                      </td>
                                             <td className="px-6 py-4">
                         <div className="text-sm text-gray-900 max-w-xs truncate">
                           {offre.note || '-'}
                         </div>
                       </td>
                       {canEdit && (
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <button
                             onClick={() => handleEditOffre(offre)}
                             className="text-blue-600 hover:text-blue-900 mr-3"
                           >
                             <i className="ri-edit-line mr-1"></i>
                             Modifier
                           </button>
                         </td>
                       )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffres.map((offre) => (
                  <div key={offre.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {offre.intituleOffre || offre.titre || 'Sans titre'}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offre.resultatOffre || 'En cours')}`}>
                        {offre.resultatOffre || 'En cours'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Bailleur:</span>
                        <span className="text-gray-900 ml-2">{offre.bailleur || 'Non spécifié'}</span>
            </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Pôle Lead:</span>
                        <span className="text-gray-900 ml-2">{offre.poleLead || 'Non assigné'}</span>
            </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Réception MA:</span>
                        <div className="text-gray-900 ml-2">
                          <div>{formatDate(offre.dateReceptionMontageAdministratif)}</div>
                          {offre.heureReception && (
                            <div className="text-xs text-gray-500">{offre.heureReception}</div>
                          )}
            </div>
          </div>
          
                      <div>
                        <span className="font-medium text-gray-700">Dépôt prévu:</span>
                        <div className="text-gray-900 ml-2">
                          <div>{formatDate(offre.dateDepotPrevu)}</div>
                          {offre.heureDepotPrevu && (
                            <div className="text-xs text-gray-500">{offre.heureDepotPrevu}</div>
                          )}
                        </div>
            </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Dépôt effectif:</span>
                        <div className="text-gray-900 ml-2">
                          <div>{formatDate(offre.dateDepotEffective)}</div>
                          {offre.heureDepotEffective && (
                            <div className="text-xs text-gray-500">{offre.heureDepotEffective}</div>
                          )}
            </div>
          </div>
          
                      {offre.commentaireResultat && (
                        <div>
                          <span className="font-medium text-gray-700">Commentaire:</span>
                          <p className="text-gray-900 mt-1 text-xs">{offre.commentaireResultat}</p>
                        </div>
                      )}
                      
                      {offre.note && (
                        <div>
                          <span className="font-medium text-gray-700">Note:</span>
                          <p className="text-gray-900 mt-1 text-xs">{offre.note}</p>
                        </div>
                      )}
                    </div>
                    
                                         {canEdit && (
                       <div className="mt-4 pt-4 border-t border-gray-200">
                         <button
                           onClick={() => handleEditOffre(offre)}
                           className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                         >
                           <i className="ri-edit-line mr-2"></i>
                           Modifier
                         </button>
                       </div>
                     )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
            <HomeButton />
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Retour au Dashboard
            </Link>
          </div>
      </div>

      {/* Modal d'édition */}
      {showEditModal && editingOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Modifier le suivi de l'offre</h3>
              <p className="text-gray-600 mt-1">{editingOffre.intituleOffre || editingOffre.titre}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Section: Suivi administratif */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Suivi Administratif</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de réception pour montage administratif
                    </label>
                    <input
                      type="date"
                      value={editFormData.dateReceptionMontageAdministratif}
                      onChange={(e) => setEditFormData({...editFormData, dateReceptionMontageAdministratif: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de réception
                    </label>
                    <input
                      type="time"
                      value={editFormData.heureReception}
                      onChange={(e) => setEditFormData({...editFormData, heureReception: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Dépôt */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Dépôt</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de dépôt prévu
                    </label>
                    <input
                      type="date"
                      value={editFormData.dateDepotPrevu}
                      onChange={(e) => setEditFormData({...editFormData, dateDepotPrevu: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de dépôt effectif
                    </label>
                    <input
                      type="date"
                      value={editFormData.dateDepotEffective}
                      onChange={(e) => setEditFormData({...editFormData, dateDepotEffective: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de dépôt prévu
                    </label>
                    <input
                      type="time"
                      value={editFormData.heureDepotPrevu}
                      onChange={(e) => setEditFormData({...editFormData, heureDepotPrevu: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de dépôt effective
                    </label>
                    <input
                      type="time"
                      value={editFormData.heureDepotEffective}
                      onChange={(e) => setEditFormData({...editFormData, heureDepotEffective: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Section: Résultats */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Résultats</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Résultat de l'offre
                    </label>
                    <select
                      value={editFormData.resultatOffre}
                      onChange={(e) => setEditFormData({...editFormData, resultatOffre: e.target.value as 'Gagnée' | 'Perdue' | 'En cours'})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="En cours">En cours</option>
                      <option value="Gagnée">Gagnée</option>
                      <option value="Perdue">Perdue</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaire sur le résultat
                    </label>
                    <textarea
                      value={editFormData.commentaireResultat}
                      onChange={(e) => setEditFormData({...editFormData, commentaireResultat: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Commentaire sur le résultat de l'offre..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note générale
                    </label>
                    <textarea
                      value={editFormData.note}
                      onChange={(e) => setEditFormData({...editFormData, note: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Note générale sur l'offre..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-4 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
