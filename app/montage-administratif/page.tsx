'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import HomeButton from '../../components/HomeButton';
import AlertSettings from '../../components/AlertSettings';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import AlertBanner from '../../components/AlertBanner';

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

interface Offre {
  id: number;
  intituleOffre?: string;
  titre?: string;
  bailleur?: string;
  client?: string;
  pays?: string[];
  typeOffre?: string;
  dateDepot?: string;
  dateSoumissionValidation?: string;
  offreTrouveePar?: string;
  priorite?: 'Opportunité intermédiaire' | 'Priorité haute' | 'Stratégique' | '';
  statut?: 'brouillon' | 'en_attente' | 'approuvée' | 'rejetée';
  montant?: string;
  budget?: string;
  devise?: string;
  dureeMission?: string;
  objectifs?: string;
  profilExpert?: string;
  lienTDR?: string;
  nomSite?: string;
  commentaire?: string;
  commentaireValidation?: string;
  dateValidation?: string;
  adresseDemandeClarifications?: string;
  delaiDemandeClarification?: string;
  delaiAccuseReception?: string;
  delaiIntentionSoumission?: string;
  adresseDepotOffre?: string;
  poleLead?: string;
  poleAssocies?: string;
  dateImputation?: string;
  chargeAssuranceQualite?: string;
  delaiTransmissionMontageAdministratif?: string;
  delaiDepot?: string;
  statutOffre?: 'Gagnée' | 'Perdue' | 'En cours';
  offreDeposee?: boolean;
  chargeMontageAdministratif?: string;
  dateTransmissionAssuranceQualite?: string;
  diligencesMenees?: string;
  dateIdentificationOffre?: string;
  tdrFile?: string;
  montageAdministratif?: string;
}

export default function MontageAdministratif() {
  return (
    <ProtectedRoute pageName="montage-administratif">
      <Layout>
        <MontageAdministratifContent />
      </Layout>
    </ProtectedRoute>
  );
}

function MontageAdministratifContent() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPays, setSelectedPays] = useState<string>('');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('');
  const [selectedPoleLead, setSelectedPoleLead] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dateDepot');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // États pour les modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  const [editFormData, setEditFormData] = useState({
    montageAdministratif: '',
    chargeMontageAdministratif: '',
    delaiTransmissionMontageAdministratif: '',
    dateTransmissionAssuranceQualite: '',
    chargeAssuranceQualite: '',
    diligencesMenees: ''
  });

  useEffect(() => {
    fetchOffresApprouvees();
  }, []);

  useEffect(() => {
    filterAndSortOffres();
  }, [offres, searchTerm, selectedPays, selectedPriorite, selectedPoleLead, sortBy, sortOrder]);

  const fetchOffresApprouvees = () => {
    setLoading(true);
    try {
      const storedOffres = localStorage.getItem('offres');
      if (storedOffres) {
        const allOffres: Offre[] = JSON.parse(storedOffres);
        // Filtrer uniquement les offres approuvées
        const offresApprouvees = allOffres.filter(offre => offre.statut === 'approuvée');
        setOffres(offresApprouvees);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOffres = () => {
    let filtered = [...offres];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(offre => {
        const searchLower = searchTerm.toLowerCase();
        const titre = (offre.intituleOffre || offre.titre || '').toLowerCase();
        const bailleur = (offre.bailleur || offre.client || '').toLowerCase();
        const poleLead = (offre.poleLead || '').toLowerCase();
        return titre.includes(searchLower) || bailleur.includes(searchLower) || poleLead.includes(searchLower);
      });
    }

    // Filtre par pays
    if (selectedPays) {
      filtered = filtered.filter(offre => 
        offre.pays && Array.isArray(offre.pays) && offre.pays.includes(selectedPays)
      );
    }

    // Filtre par priorité
    if (selectedPriorite) {
      filtered = filtered.filter(offre => offre.priorite === selectedPriorite);
    }

    // Filtre par Pôle LEAD
    if (selectedPoleLead) {
      filtered = filtered.filter(offre => offre.poleLead === selectedPoleLead);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';

      switch (sortBy) {
        case 'intituleOffre':
          aValue = (a.intituleOffre || a.titre || '').toLowerCase();
          bValue = (b.intituleOffre || b.titre || '').toLowerCase();
          break;
        case 'bailleur':
          aValue = (a.bailleur || a.client || '').toLowerCase();
          bValue = (b.bailleur || b.client || '').toLowerCase();
          break;
        case 'priorite':
          aValue = a.priorite || '';
          bValue = b.priorite || '';
          break;
        case 'poleLead':
          aValue = a.poleLead || '';
          bValue = b.poleLead || '';
          break;
        default:
          aValue = a.dateDepot || '';
          bValue = b.dateDepot || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOffres(filtered);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleViewOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setShowViewModal(true);
  };

  const handleEditOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setEditFormData({
      montageAdministratif: offre.montageAdministratif || '',
      chargeMontageAdministratif: offre.chargeMontageAdministratif || '',
      delaiTransmissionMontageAdministratif: formatDateForInput(offre.delaiTransmissionMontageAdministratif),
      dateTransmissionAssuranceQualite: formatDateForInput(offre.dateTransmissionAssuranceQualite),
      chargeAssuranceQualite: offre.chargeAssuranceQualite || '',
      diligencesMenees: offre.diligencesMenees || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedOffre) return;

    const updatedOffre = {
      ...selectedOffre,
      ...editFormData
    };

    // Mettre à jour dans localStorage
    const storedOffres = localStorage.getItem('offres');
    if (storedOffres) {
      const allOffres: Offre[] = JSON.parse(storedOffres);
      const updatedOffres = allOffres.map(offre => 
        offre.id === selectedOffre.id ? updatedOffre : offre
      );
      localStorage.setItem('offres', JSON.stringify(updatedOffres));
      
      // Mettre à jour l'état local
      setOffres(prevOffres => prevOffres.map(offre => 
        offre.id === selectedOffre.id ? updatedOffre : offre
      ));
      
      // Actualiser les données pour les tableaux de répartition
      fetchOffresApprouvees();
      
      // Déclencher un événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('offresUpdated', {
        detail: { updatedOffre }
      }));
      
      // Notification de succès
      alert('Montage administratif mis à jour avec succès ! Les données ont été actualisées sur les tableaux de répartition.');
      
      setShowEditModal(false);
      setSelectedOffre(null);
    }
  };

  const handleEditChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const downloadTDR = (offre: Offre) => {
    if (!offre.tdrFile && !offre.lienTDR) {
      alert('Aucun fichier TDR disponible pour cette offre.');
      return;
    }

    const tdrUrl = offre.tdrFile || offre.lienTDR;
    if (tdrUrl) {
      const link = document.createElement('a');
      link.href = tdrUrl;
      link.download = `TDR_${offre.intituleOffre || offre.titre || offre.id}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifiée';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'Priorité haute':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Stratégique':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Opportunité intermédiaire':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaysDisplay = (pays: string[] | undefined) => {
    if (!pays || pays.length === 0) return 'Non spécifié';
    if (pays.length === 1) return pays[0];
    if (pays.length <= 2) return pays.join(', ');
    return `${pays[0]}, ${pays[1]} +${pays.length - 2}`;
  };

  const getUniqueValues = (field: keyof Offre) => {
    const values = new Set<string>();
    offres.forEach(offre => {
      const value = offre[field];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => values.add(v));
        } else {
          values.add(String(value));
        }
      }
    });
    return Array.from(values).sort();
  };

  const getPoleColor = (pole: string | undefined) => {
    const colors = {
      'Pôle santé': 'bg-green-100 text-green-800 border-green-200',
      'Pôle Wash': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pôle Education': 'bg-purple-100 text-purple-800 border-purple-200',
      'Pôle Climat': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Pôle Enquêtes': 'bg-orange-100 text-orange-800 border-orange-200',
      'Pôle Modélisation': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Pôle Finances Publiques': 'bg-pink-100 text-pink-800 border-pink-200',
      'Pôle Décentralisation': 'bg-teal-100 text-teal-800 border-teal-200',
      'Pôle Cohésion sociale': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Pôle Anglophone': 'bg-amber-100 text-amber-800 border-amber-200',
      'Pôle SIDIA': 'bg-violet-100 text-violet-800 border-violet-200'
    };
    return colors[pole as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const exportToExcel = () => {
    // Logique d'export Excel
    alert('Fonctionnalité d\'export Excel à implémenter');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres approuvées...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <AlertBanner />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <HomeButton />
              <div className="ml-6">
                <div className="w-16 h-16 bg-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <i className="ri-settings-3-line text-2xl text-white"></i>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Montage Administratif</h1>
                <p className="text-xl opacity-90">Gestion administrative des offres approuvées</p>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 mb-4">
                <span className="text-lg">{filteredOffres.length} offres approuvées</span>
              </div>
              <AlertSettings />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filtres et Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Recherche */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Rechercher par titre, bailleur, pôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtre Pays */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
              <select
                value={selectedPays}
                onChange={(e) => setSelectedPays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les pays</option>
                {getUniqueValues('pays').map((pays) => (
                  <option key={pays} value={pays}>{pays}</option>
                ))}
              </select>
            </div>

            {/* Filtre Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <select
                value={selectedPriorite}
                onChange={(e) => setSelectedPriorite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les priorités</option>
                <option value="Priorité haute">Priorité haute</option>
                <option value="Stratégique">Stratégique</option>
                <option value="Opportunité intermédiaire">Opportunité intermédiaire</option>
              </select>
            </div>
          </div>

          {/* Actions et Statistiques */}
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredOffres.length} offres approuvées trouvées
              </span>
            </div>
            <div className="flex items-center gap-2">
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
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-download-line"></i>
                Exporter Excel
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des offres */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleSort('intituleOffre')}
                    >
                      <div className="flex items-center gap-2">
                        <i className="ri-file-text-line"></i>
                        Intitulé
                        {sortBy === 'intituleOffre' && (
                          <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleSort('bailleur')}
                    >
                      <div className="flex items-center gap-2">
                        <i className="ri-building-line"></i>
                        Bailleur
                        {sortBy === 'bailleur' && (
                          <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      <i className="ri-map-pin-line mr-2"></i>
                      Pays
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleSort('priorite')}
                    >
                      <div className="flex items-center gap-2">
                        <i className="ri-flag-line"></i>
                        Priorité
                        {sortBy === 'priorite' && (
                          <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleSort('poleLead')}
                    >
                      <div className="flex items-center gap-2">
                        <i className="ri-team-line"></i>
                        Pôle LEAD
                        {sortBy === 'poleLead' && (
                          <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      <i className="ri-settings-3-line mr-2"></i>
                      Montage Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      <i className="ri-settings-3-line mr-2"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOffres.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <i className="ri-inbox-line text-4xl mb-4 text-gray-300"></i>
                          <p className="text-lg font-medium">Aucune offre approuvée trouvée</p>
                          <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOffres.map((offre) => (
                      <tr key={offre.id} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {offre.intituleOffre || offre.titre || 'Sans titre'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {offre.bailleur || offre.client || 'Non spécifié'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {getPaysDisplay(offre.pays)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {offre.priorite ? (
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(offre.priorite)}`}>
                              {offre.priorite}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">Aucune</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {offre.poleLead ? (
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPoleColor(offre.poleLead)}`}>
                              {offre.poleLead}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">Non spécifié</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {offre.montageAdministratif ? (
                              <div>
                                <span className="text-green-600 font-medium">✓ Configuré</span>
                                {offre.delaiTransmissionMontageAdministratif && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Délai: {formatDate(offre.delaiTransmissionMontageAdministratif)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">Non configuré</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadTDR(offre)}
                              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                              title="Télécharger TDR"
                            >
                              <i className="ri-download-line"></i>
                            </button>
                            <button
                              onClick={() => handleViewOffre(offre)}
                              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                              title="Voir les détails"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                            <button
                              onClick={() => handleEditOffre(offre)}
                              className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
                              title="Modifier le montage administratif"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vue Cartes */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffres.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <i className="ri-inbox-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-lg font-medium text-gray-500">Aucune offre approuvée trouvée</p>
                <p className="text-sm text-gray-400">Essayez de modifier vos filtres de recherche</p>
              </div>
            ) : (
              filteredOffres.map((offre) => (
                <div key={offre.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    {/* Header de la carte */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                          {offre.intituleOffre || offre.titre || 'Sans titre'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {offre.bailleur || offre.client || 'Non spécifié'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadTDR(offre)}
                          className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Télécharger TDR"
                        >
                          <i className="ri-download-line"></i>
                        </button>
                        <button
                          onClick={() => handleViewOffre(offre)}
                          className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors"
                          title="Voir les détails"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button
                          onClick={() => handleEditOffre(offre)}
                          className="bg-orange-100 text-orange-600 p-2 rounded-lg hover:bg-orange-200 transition-colors"
                          title="Modifier le montage administratif"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {offre.priorite && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(offre.priorite)}`}>
                          {offre.priorite}
                        </span>
                      )}
                      {offre.poleLead && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPoleColor(offre.poleLead)}`}>
                          {offre.poleLead}
                        </span>
                      )}
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <i className="ri-map-pin-line text-gray-400"></i>
                        <span>{getPaysDisplay(offre.pays)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-settings-3-line text-gray-400"></i>
                        <span>{offre.montageAdministratif ? '✓ Configuré' : 'Non configuré'}</span>
                      </div>
                      {offre.delaiTransmissionMontageAdministratif && (
                        <div className="flex items-center gap-2">
                          <i className="ri-calendar-line text-gray-400"></i>
                          <span className="text-xs">Délai: {formatDate(offre.delaiTransmissionMontageAdministratif)}</span>
                        </div>
                      )}
                      {offre.dateDepot && (
                        <div className="flex items-center gap-2">
                          <i className="ri-calendar-line text-gray-400"></i>
                          <span>{formatDate(offre.dateDepot)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal de visualisation */}
      {showViewModal && selectedOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Détails de l'offre : {selectedOffre.intituleOffre || selectedOffre.titre || 'Sans titre'}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations générales */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Intitulé</label>
                      <p className="text-sm text-gray-900">{selectedOffre.intituleOffre || selectedOffre.titre || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bailleur/Client</label>
                      <p className="text-sm text-gray-900">{selectedOffre.bailleur || selectedOffre.client || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pays</label>
                      <p className="text-sm text-gray-900">{getPaysDisplay(selectedOffre.pays)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type d'offre</label>
                      <p className="text-sm text-gray-900">{selectedOffre.typeOffre || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priorité</label>
                      <p className="text-sm text-gray-900">{selectedOffre.priorite || 'Non spécifiée'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <p className="text-sm text-gray-900">{selectedOffre.statut ? selectedOffre.statut.replace('_', ' ') : 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>

                {/* Informations de répartition */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de répartition</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pôle LEAD</label>
                      <p className="text-sm text-gray-900">{selectedOffre.poleLead || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pôle ASSOCIÉS</label>
                      <p className="text-sm text-gray-900">{selectedOffre.poleAssocies || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date d'imputation</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedOffre.dateImputation)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Charge Assurance Qualité</label>
                      <p className="text-sm text-gray-900">{selectedOffre.chargeAssuranceQualite || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Charge Montage Administratif</label>
                      <p className="text-sm text-gray-900">{selectedOffre.chargeMontageAdministratif || 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>

                {/* Montage administratif */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Montage administratif</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Montage administratif</label>
                      <p className="text-sm text-gray-900">{selectedOffre.montageAdministratif || 'Non configuré'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Délai transmission montage administratif</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedOffre.delaiTransmissionMontageAdministratif)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date transmission assurance qualité</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedOffre.dateTransmissionAssuranceQualite)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Diligences menées</label>
                      <p className="text-sm text-gray-900">{selectedOffre.diligencesMenees || 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>

                {/* Dates importantes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates importantes</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de dépôt</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedOffre.dateDepot)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de soumission/validation</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedOffre.dateSoumissionValidation)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de validation</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedOffre.dateValidation)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Modifier le montage administratif
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montage administratif</label>
                  <textarea
                    value={editFormData.montageAdministratif}
                    onChange={(e) => handleEditChange('montageAdministratif', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Détails du montage administratif..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chargé montage administratif</label>
                  <input
                    type="text"
                    value={editFormData.chargeMontageAdministratif}
                    onChange={(e) => handleEditChange('chargeMontageAdministratif', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du chargé montage administratif"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Délai transmission montage administratif</label>
                  <input
                    type="date"
                    value={editFormData.delaiTransmissionMontageAdministratif}
                    onChange={(e) => handleEditChange('delaiTransmissionMontageAdministratif', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chargé assurance qualité</label>
                  <input
                    type="text"
                    value={editFormData.chargeAssuranceQualite}
                    onChange={(e) => handleEditChange('chargeAssuranceQualite', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du chargé assurance qualité"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date transmission assurance qualité</label>
                  <input
                    type="date"
                    value={editFormData.dateTransmissionAssuranceQualite}
                    onChange={(e) => handleEditChange('dateTransmissionAssuranceQualite', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diligences menées</label>
                  <textarea
                    value={editFormData.diligencesMenees}
                    onChange={(e) => handleEditChange('diligencesMenees', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Détails des diligences menées..."
                  />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
