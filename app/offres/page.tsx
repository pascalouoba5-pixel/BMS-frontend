'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { offresAPI, Offre } from '../../services/api';
import HomeButton from '../../components/HomeButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import OffresTable from '../../components/OffresTable';
import OffresStatsTables from '../../components/OffresStatsTables';
import StatusFilters from '../../components/StatusFilters';
import OffresCards from '../../components/OffresCards';
import OffreCard from '../../components/OffreCard';

interface OffreStats {
  total: number;
  enAttente: number;
  approuvees: number;
  rejetees: number;
  brouillons: number;
}

export default function Offres() {
  return (
    <ProtectedRoute pageName="offres">
      <Layout>
        <OffresContent />
      </Layout>
    </ProtectedRoute>
  );
}

function OffresContent() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffres, setSelectedOffres] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState('dateCreation');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<OffreStats>({
    total: 0,
    enAttente: 0,
    approuvees: 0,
    rejetees: 0,
    brouillons: 0
  });
  const [filters, setFilters] = useState({
    statut: '',
    priority: '',
    search: '',
    dateRange: ''
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('tous');
  
  // États pour les modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  const [editFormData, setEditFormData] = useState({
    intituleOffre: '',
    bailleur: '',
    objectifs: '',
    montant: '',
    devise: '',
    pays: [] as string[],
    autrePays: '',
    typeOffre: '',
    offreTrouveePar: '',
    commentaire: '',
    profilExpert: '',
    dureeMission: '',
    lienTDR: '',
    nomSite: ''
  });

  useEffect(() => {
    fetchOffres();
    // Mise à jour automatique toutes les 30 secondes
    const interval = setInterval(fetchOffres, 30 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [filters, sortBy, sortOrder]);

  // Filtrer les offres selon le statut sélectionné
  const filteredOffres = React.useMemo(() => {
    let filtered = offres;
    
    // Filtre par statut
    if (selectedStatus !== 'tous') {
      filtered = filtered.filter(offre => offre.statut === selectedStatus);
    }
    
    // Autres filtres existants
    if (filters.search) {
      filtered = filtered.filter(offre => 
        offre.intituleOffre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        offre.bailleur?.toLowerCase().includes(filters.search.toLowerCase()) ||
        offre.objectifs?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.priority) {
      filtered = filtered.filter(offre => offre.priorite === filters.priority);
    }
    
    return filtered;
  }, [offres, selectedStatus, filters]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  // Fonction pour calculer les statistiques
  const calculateStats = (offresData: Offre[]): OffreStats => {
    const total = offresData.length;
    const enAttente = offresData.filter(o => o.statut === 'en_attente' || !o.statut).length;
    const approuvees = offresData.filter(o => o.statut === 'approuvée').length;
    const rejetees = offresData.filter(o => o.statut === 'rejetée').length;
    const brouillons = offresData.filter(o => o.statut === 'brouillon').length;
    
    return {
      total,
      enAttente,
      approuvees,
      rejetees,
      brouillons
    };
  };

  const fetchOffres = async () => {
    setLoading(true);
    try {
      // Récupérer les offres depuis l'API backend
              const response = await offresAPI.getAll();
      
      if (response.success && response.data) {
        let filteredOffres = response.data;
        
        // Filtrer les offres selon les filtres appliqués
        if (filters.statut) {
          filteredOffres = filteredOffres.filter((offre: any) => offre.statut === filters.statut);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredOffres = filteredOffres.filter((offre: any) => 
            offre.intitule_offre?.toLowerCase().includes(searchLower) ||
            offre.bailleur?.toLowerCase().includes(searchLower) ||
            offre.commentaire?.toLowerCase().includes(searchLower)
          );
        }
        
        // Trier les offres
        filteredOffres.sort((a: any, b: any) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          if (sortBy === 'montant') {
            aValue = parseFloat(aValue?.toString().replace(/[^\d]/g, '') || '0');
            bValue = parseFloat(bValue?.toString().replace(/[^\d]/g, '') || '0');
          }
          
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        setOffres(filteredOffres);
        
        // Calculer et mettre à jour les statistiques
        const newStats = calculateStats(filteredOffres);
        setStats(newStats);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des offres');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectOffre = (id: number) => {
    setSelectedOffres(prev => 
      prev.includes(id) 
        ? prev.filter(offreId => offreId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffres.length === offres.length) {
      setSelectedOffres([]);
    } else {
      setSelectedOffres(offres.map(offre => offre.id));
    }
  };

  const handleViewOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setShowViewModal(true);
  };

  const handleEditOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setEditFormData({
      intituleOffre: offre.intituleOffre || offre.titre || '',
      bailleur: offre.bailleur || offre.client || '',
      objectifs: offre.objectifs || offre.description || '',
      montant: offre.montant || offre.budget || '',
      devise: offre.devise || '',
      pays: offre.pays || [],
      autrePays: offre.autrePays || '',
      typeOffre: offre.typeOffre || '',
      offreTrouveePar: offre.offreTrouveePar || '',
      commentaire: offre.commentaire || '',
      profilExpert: offre.profilExpert || '',
      dureeMission: offre.dureeMission || '',
      lienTDR: offre.lienTDR || '',
      nomSite: offre.nomSite || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteOffre = async (offre: Offre) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        const response = await offresAPI.delete(offre.id);
        if (response.success) {
          const updatedOffres = offres.filter(o => o.id !== offre.id);
          setOffres(updatedOffres);
          const newStats = calculateStats(updatedOffres);
          setStats(newStats);
        } else {
          throw new Error(response.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'offre:', error);
        alert('Erreur lors de la suppression de l\'offre');
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedOffre) return;

    try {
      const response = await offresAPI.update(selectedOffre.id, editFormData);
      if (response.success) {
        const updatedOffre = {
          ...selectedOffre,
          ...editFormData
        };

        const updatedOffres = offres.map(offre => 
          offre.id === selectedOffre.id ? updatedOffre : offre
        );
        
        setOffres(updatedOffres);
        setShowEditModal(false);
        setSelectedOffre(null);
        
        const newStats = calculateStats(updatedOffres);
        setStats(newStats);
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'offre:', error);
      alert('Erreur lors de la mise à jour de l\'offre');
    }
  };

  const handleEditChange = (field: string, value: any) => {
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

  const exportToExcel = () => {
    const offresToExport = selectedOffres.length > 0 
      ? offres.filter(offre => selectedOffres.includes(offre.id))
      : offres;

    // Préparer les données pour Excel
    const data = offresToExport.map(offre => ({
      'Intitulé Offre': offre.intituleOffre || offre.titre || 'Sans titre',
      'Bailleur/Client': offre.bailleur || offre.client || 'Non spécifié',
      'Type d\'offre': offre.typeOffre || 'Non spécifié',
      'Montant/Budget': offre.montant || offre.budget || '0',
      'Devise': offre.devise || 'EUR',
      'Pays': offre.pays ? offre.pays.join(', ') : (offre.autrePays || 'Non spécifié'),
      'Objectifs': offre.objectifs || offre.description || 'Aucune description',
      'Statut': offre.statut ? offre.statut.replace('_', ' ') : 'En attente',
      'Priorité': offre.priorite || offre.priority || 'Non définie',
      'Date de dépôt': offre.dateDepot || offre.dateCreation || 'Non spécifiée',
      'Date limite': offre.dateLimit || 'Non spécifiée',
      'Offre trouvée par': offre.offreTrouveePar || 'Non spécifié',
      'Commentaire': offre.commentaire || '',
      'Commentaire validation': offre.commentaireValidation || '',
      'Date validation': offre.dateValidation || '',
      'Durée mission': offre.dureeMission || '',
      'Lien TDR': offre.lienTDR || '',
      'Nom du site': offre.nomSite || '',
      'Profil expert': offre.profilExpert || ''
    }));

    // Créer le contenu CSV (format compatible Excel)
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = (row as any)[header] || '';
          // Échapper les virgules et guillemets pour CSV
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `offres_bms_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <HomeButton />
              <div className="ml-6">
                <div className="w-16 h-16 bg-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <i className="ri-briefcase-line text-2xl text-white"></i>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Gestion des Offres</h1>
                <p className="text-xl opacity-90">Gestion complète des offres et opportunités</p>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-lg">{offres.length} offres</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Bouton Gestion de Répartition en haut */}
        <div className="mb-8">
          <Link
            href="/repartition/gestion-repartition"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 inline-flex"
          >
            <i className="ri-settings-3-line"></i>
            Gestion de Répartition
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <i className="ri-briefcase-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Offres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 text-white p-3 rounded-lg">
                <i className="ri-time-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 text-white p-3 rounded-lg">
                <i className="ri-check-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approuvees}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-red-500 text-white p-3 rounded-lg">
                <i className="ri-close-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejetees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-gray-500 text-white p-3 rounded-lg">
                <i className="ri-file-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.brouillons}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres par statut - Style Offre du Jour */}
        <StatusFilters
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          statusCounts={{
            total: stats.total,
            approuvée: stats.approuvees,
            en_attente: stats.enAttente,
            rejetée: stats.rejetees,
            brouillon: stats.brouillons
          }}
          title="Filtrer les offres par statut"
        />

        {/* Résultats */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredOffres.length} offre{filteredOffres.length !== 1 ? 's' : ''} affichée{filteredOffres.length !== 1 ? 's' : ''}
            {selectedStatus !== 'tous' && ` (${selectedStatus})`}
          </p>
        </div>

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
                  placeholder="Rechercher par titre, bailleur, objectifs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtre Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="en_attente">En attente</option>
                <option value="approuvée">Approuvée</option>
                <option value="rejetée">Rejetée</option>
              </select>
            </div>

            {/* Filtre Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les priorités</option>
                <option value="haute">Haute</option>
                <option value="normale">Normale</option>
                <option value="basse">Basse</option>
              </select>
            </div>
          </div>

          {/* Actions et Statistiques */}
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {offres.length} offres trouvées
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/ajouter-offre"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <i className="ri-add-line"></i>
                Nouvelle offre
              </Link>
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
        </div>

        {/* Affichage des offres */}
        {viewMode === 'table' ? (
          <OffresTable
            offres={filteredOffres}
            onViewOffre={handleViewOffre}
            onEditOffre={handleEditOffre}
            onDeleteOffre={handleDeleteOffre}
            onDownloadTDR={downloadTDR}
            selectedOffres={selectedOffres}
            onSelectOffre={handleSelectOffre}
            onSelectAll={handleSelectAll}
            viewMode={viewMode}
            loading={loading}
            showActions={true}
            showCheckboxes={true}
            showStatus={true}
            showPriority={true}
          />
        ) : (
          <div className="grid gap-8">
            {filteredOffres.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-inbox-line text-2xl text-blue-600"></i>
                </div>
                <p className="text-lg font-medium text-gray-900">Aucune offre trouvée</p>
                <p className="text-sm text-gray-600 mt-2">
                  {filters.search ? 'Aucune offre ne correspond à votre recherche.' : 'Aucune offre disponible.'}
                </p>
              </div>
            ) : (
              filteredOffres.map((offre) => (
                <OffreCard
                  key={offre.id}
                  offre={offre}
                  showActions={true}
                  onViewOffre={handleViewOffre}
                  onEditOffre={handleEditOffre}
                  onDeleteOffre={handleDeleteOffre}
                  onDownloadTDR={downloadTDR}
                  showPoleInfo={true}
                  showModalite={false}
                  showPriority={true}
                  showBudget={true}
                  showDate={true}
                  showStatus={true}
                  showTDR={true}
                  showDescription={true}
                  showDetails={true}
                  showCommentaire={false}
                />
              ))
            )}
          </div>
        )}

        {/* Statistiques Détaillées */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
              <i className="ri-bar-chart-line text-blue-600 mr-2"></i>
              Statistiques Détaillées par Personne
            </h3>
            <OffresStatsTables />
          </div>
        </div>
      </div>

      {/* Modal de visualisation */}
      {showViewModal && selectedOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Détails de l'offre</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedOffre(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations principales */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Informations principales</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Intitulé de l'offre</label>
                      <p className="text-gray-900 font-medium">
                        {selectedOffre.intituleOffre || selectedOffre.titre || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Bailleur</label>
                      <p className="text-gray-900">
                        {selectedOffre.bailleur || selectedOffre.client || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type d'offre</label>
                      <p className="text-gray-900">
                        {selectedOffre.typeOffre || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Offre trouvée par</label>
                      <p className="text-gray-900">
                        {selectedOffre.offreTrouveePar || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pays</label>
                      <p className="text-gray-900">
                        {Array.isArray(selectedOffre.pays) && selectedOffre.pays.length > 0 
                          ? selectedOffre.pays.join(', ') 
                          : (selectedOffre.autrePays || 'Non spécifié')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Objectifs/Description</label>
                      <p className="text-gray-900">
                        {selectedOffre.objectifs || selectedOffre.description || 'Aucune description disponible'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations financières */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Informations financières</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Montant</label>
                      <p className="text-gray-900">
                        {selectedOffre.montant || selectedOffre.budget || 'Non spécifié'} {selectedOffre.devise || ''}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Durée de mission</label>
                      <p className="text-gray-900">
                        {selectedOffre.dureeMission || 'Non spécifiée'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de dépôt</label>
                      <p className="text-gray-900">
                        {selectedOffre.dateDepot || selectedOffre.dateCreation 
                          ? new Date(selectedOffre.dateDepot || selectedOffre.dateCreation || '').toLocaleDateString('fr-FR')
                          : 'Non spécifiée'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de soumission pour validation</label>
                      <p className="text-gray-900">
                        {selectedOffre.dateSoumissionValidation 
                          ? new Date(selectedOffre.dateSoumissionValidation).toLocaleDateString('fr-FR')
                          : 'Non spécifiée'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date d'identification</label>
                      <p className="text-gray-900">
                        {selectedOffre.dateIdentificationOffre 
                          ? new Date(selectedOffre.dateIdentificationOffre).toLocaleDateString('fr-FR')
                          : 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Statut et validation */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Statut et validation</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Statut</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        selectedOffre.statut === 'approuvée' ? 'bg-green-100 text-green-800 border-green-200' :
                        selectedOffre.statut === 'rejetée' ? 'bg-red-100 text-red-800 border-red-200' :
                        selectedOffre.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {selectedOffre.statut === 'approuvée' ? 'Approuvée' :
                         selectedOffre.statut === 'rejetée' ? 'Rejetée' :
                         selectedOffre.statut === 'en_attente' ? 'En attente' :
                         selectedOffre.statut === 'brouillon' ? 'Brouillon' : 'En attente'}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priorité</label>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedOffre.priorite === 'Priorité haute' ? 'bg-orange-500' :
                          selectedOffre.priorite === 'Opportunité intermédiaire' ? 'bg-blue-500' :
                          selectedOffre.priorite === 'Stratégique' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {selectedOffre.priorite || selectedOffre.priority || 'Non définie'}
                        </span>
                      </div>
                    </div>
                    {selectedOffre.dateValidation && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date de validation</label>
                        <p className="text-gray-900">{new Date(selectedOffre.dateValidation).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}
                    {selectedOffre.commentaireValidation && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Commentaire de validation</label>
                        <p className="text-gray-900">{selectedOffre.commentaireValidation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Détails supplémentaires */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Détails supplémentaires</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Profil expert</label>
                      <p className="text-gray-900">
                        {selectedOffre.profilExpert || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nom du site</label>
                      <p className="text-gray-900">
                        {selectedOffre.nomSite || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lien TDR</label>
                      <p className="text-gray-900">
                        {selectedOffre.lienTDR ? (
                          <a href={selectedOffre.lienTDR} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            Voir le TDR
                          </a>
                        ) : 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Commentaire</label>
                      <p className="text-gray-900">
                        {selectedOffre.commentaire || 'Aucun commentaire'}
                      </p>
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
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Modifier l'offre</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intitulé de l'offre</label>
                  <input
                    type="text"
                    value={editFormData.intituleOffre}
                    onChange={(e) => handleEditChange('intituleOffre', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bailleur</label>
                  <input
                    type="text"
                    value={editFormData.bailleur}
                    onChange={(e) => handleEditChange('bailleur', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                  <input
                    type="text"
                    value={editFormData.montant}
                    onChange={(e) => handleEditChange('montant', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                  <input
                    type="text"
                    value={editFormData.devise}
                    onChange={(e) => handleEditChange('devise', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs</label>
                  <textarea
                    value={editFormData.objectifs}
                    onChange={(e) => handleEditChange('objectifs', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
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