'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiService, { Offre } from '../../services/api';
import HomeButton from '../../components/HomeButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import OffresTable from '../../components/OffresTable';

interface OffreStats {
  total: number;
  approuvees: number;
}

export default function OffresValidees() {
  return (
    <ProtectedRoute pageName="offres-validees">
      <Layout>
        <OffresValideesContent />
      </Layout>
    </ProtectedRoute>
  );
}

function OffresValideesContent() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    montageAdministratif: ''
  });
  const [stats, setStats] = useState<OffreStats>({
    total: 0,
    approuvees: 0
  });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    fetchOffres();
    // Mise à jour automatique toutes les 30 secondes
    const interval = setInterval(fetchOffres, 30 * 1000);
    
    // Écouteur d'événements pour détecter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'offres') {
        fetchOffres();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fonction pour calculer les statistiques
  const calculateStats = (offresData: Offre[]): OffreStats => {
    const total = offresData.length;
    const approuvees = offresData.filter(o => o.statut === 'approuvée').length;
    
    return {
      total,
      approuvees
    };
  };

  const fetchOffres = async () => {
    setLoading(true);
    try {
      // Récupérer les offres depuis localStorage
      const offresFromStorage = JSON.parse(localStorage.getItem('offres') || '[]');
      
      // Filtrer uniquement les offres validées
      const offresValidees = offresFromStorage.filter((offre: Offre) => offre.statut === 'approuvée');
      
      setOffres(offresValidees);
      
      // Calculer et mettre à jour les statistiques
      const newStats = calculateStats(offresValidees);
      setStats(newStats);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setShowViewModal(true);
  };

  const handleEditOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setEditFormData({
      montageAdministratif: offre.montageAdministratif || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedOffre) return;

    try {
      const offres = JSON.parse(localStorage.getItem('offres') || '[]');
      const updatedOffres = offres.map((offre: Offre) => {
        if (offre.id === selectedOffre.id) {
          return {
            ...offre,
            montageAdministratif: editFormData.montageAdministratif
          };
        }
        return offre;
      });
      
      localStorage.setItem('offres', JSON.stringify(updatedOffres));
      
      // Mettre à jour l'état local
      setOffres(prevOffres => prevOffres.map(offre => 
        offre.id === selectedOffre.id 
          ? { ...offre, montageAdministratif: editFormData.montageAdministratif }
          : offre
      ));
      
      setShowEditModal(false);
      setSelectedOffre(null);
      setEditFormData({ montageAdministratif: '' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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

  const exportToExcel = () => {
    // Logique d'export Excel
    alert('Fonctionnalité d\'export Excel à implémenter');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres validées...</p>
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
                  <i className="ri-check-double-line text-2xl text-white"></i>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Offres Validées</h1>
                <p className="text-xl opacity-90">Gestion des offres approuvées</p>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-lg">{offres.length} offres validées</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 text-white p-3 rounded-lg">
                <i className="ri-check-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total des offres validées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <i className="ri-file-list-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offres approuvées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approuvees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {offres.length} offres validées trouvées
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
        <OffresTable
          offres={offres}
          onViewOffre={handleViewOffre}
          onEditOffre={handleEditOffre}
          onDownloadTDR={downloadTDR}
          viewMode={viewMode}
          loading={loading}
          showActions={true}
          showCheckboxes={false}
          showStatus={false}
          showPriority={true}
          showPoleLead={true}
          showMontageAdministratif={true}
        />
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
                      <label className="text-sm font-medium text-gray-600">Date de validation</label>
                      <p className="text-gray-900">
                        {selectedOffre.dateValidation 
                          ? new Date(selectedOffre.dateValidation).toLocaleDateString('fr-FR')
                          : 'Non spécifiée'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de dépôt</label>
                      <p className="text-gray-900">
                        {selectedOffre.dateDepot 
                          ? new Date(selectedOffre.dateDepot).toLocaleDateString('fr-FR')
                          : 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Montage administratif */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Montage administratif</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Montage administratif</label>
                      <p className="text-gray-900">
                        {selectedOffre.montageAdministratif || 'Non configuré'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Chargé montage administratif</label>
                      <p className="text-gray-900">
                        {selectedOffre.chargeMontageAdministratif || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Délai transmission montage administratif</label>
                      <p className="text-gray-900">
                        {selectedOffre.delaiTransmissionMontageAdministratif || 'Non spécifié'}
                      </p>
                    </div>
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
              <h2 className="text-xl font-bold text-gray-900">Modifier le montage administratif</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
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
