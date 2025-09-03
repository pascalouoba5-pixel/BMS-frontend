'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PoleNavigationButtons from '../../../../components/PoleNavigationButtons';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import PoleOffresTable from '../../../../components/PoleOffresTable';
import OffreCard from '../../../../components/OffreCard';
import AlertBanner from '../../../../components/AlertBanner';
import TDRManager from '../../../../components/TDRManager';
import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { offresAPI } from '@/services/api';

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
  modalite?: 'nouveau' | 'montée' | 'déposée' | 'gagné' | 'annulée';
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
  statut?: 'brouillon' | 'en_attente' | 'approuvée' | 'rejetée';
}

interface PoleOffresClientProps {
  poleName: string;
}

export default function PoleOffresClient({ poleName }: PoleOffresClientProps) {
  return (
    <ProtectedRoute pageName="pole-lead">
      <PoleOffresClientContent poleName={poleName} />
    </ProtectedRoute>
  );
}

function PoleOffresClientContent({ poleName }: PoleOffresClientProps) {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [offresLead, setOffresLead] = useState<Offre[]>([]);
  const [offresAssocie, setOffresAssocie] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [tdrCounts, setTdrCounts] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('dateDepot');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedModalite, setSelectedModalite] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showRepartitionModalites, setShowRepartitionModalites] = useState(false);
  
  // États pour la modal de visualisation
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);

  useEffect(() => {
    fetchOffresByPole();
  }, [poleName]);

  useEffect(() => {
    // Écouter les mises à jour d'offres depuis d'autres composants
    const handleOffresUpdated = () => {
      fetchOffresByPole();
    };

    window.addEventListener('offresUpdated', handleOffresUpdated);
    
    return () => {
      window.removeEventListener('offresUpdated', handleOffresUpdated);
    };
  }, []);

  const fetchOffresByPole = () => {
    setLoading(true);
    try {
      const storedOffres = localStorage.getItem('offres');
      if (storedOffres) {
        const allOffres: Offre[] = JSON.parse(storedOffres);
        
        // Filtrer les offres où le pôle est le pôle lead (statut approuvée)
        const offresLeadByPole = allOffres.filter(offre => 
          offre.poleLead === poleName && offre.statut === 'approuvée'
        );
        
        // Filtrer les offres où le pôle est choisi comme pôle associé (statut approuvée)
        const offresAssocieByPole = allOffres.filter(offre => 
          offre.statut === 'approuvée' && 
          offre.poleAssocies && 
          offre.poleAssocies.includes(poleName)
        );
        
        // Trier les offres par date (les plus récentes en premier)
        const sortedOffresLead = offresLeadByPole.sort((a, b) => {
          const dateA = a.dateDepot ? new Date(a.dateDepot).getTime() : 0;
          const dateB = b.dateDepot ? new Date(b.dateDepot).getTime() : 0;
          return dateB - dateA;
        });
        
        const sortedOffresAssocie = offresAssocieByPole.sort((a, b) => {
          const dateA = a.dateDepot ? new Date(a.dateDepot).getTime() : 0;
          const dateB = b.dateDepot ? new Date(b.dateDepot).getTime() : 0;
          return dateB - dateA;
        });
        
        setOffresLead(sortedOffresLead);
        setOffresAssocie(sortedOffresAssocie);
        setOffres([...sortedOffresLead, ...sortedOffresAssocie]); // Pour la compatibilité avec l'existant
        
        // Récupérer le nombre de fichiers TDR pour toutes les offres
        fetchTDRCounts([...sortedOffresLead, ...sortedOffresAssocie]);
        
        // Mettre à jour les compteurs TDR pour chaque offre
        [...sortedOffresLead, ...sortedOffresAssocie].forEach(offre => {
          updateTDRCount(offre.id, 0); // Initialiser à 0, sera mis à jour par fetchTDRCounts
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTDRCounts = async (offres: Offre[]) => {
    if (!offres.length) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const counts: {[key: string]: number} = {};
      
      for (const offre of offres) {
        try {
          const response = await fetch(`/api/fichiers-tdr/offre/${offre.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            counts[offre.id] = data.fichiers?.length || 0;
          } else {
            counts[offre.id] = 0;
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des fichiers TDR pour l'offre ${offre.id}:`, error);
          counts[offre.id] = 0;
        }
      }
      
      setTdrCounts(counts);
    } catch (error) {
      console.error('Erreur lors de la récupération des compteurs TDR:', error);
    }
  };

  const updateTDRCount = (offreId: number, count: number) => {
    setTdrCounts(prev => ({
      ...prev,
      [offreId]: count
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

  const downloadTDR = async (offre: Offre) => {
    // Cette fonction est maintenant gérée par le composant TDRManager
    // qui télécharge directement depuis la base de données
    console.log('Téléchargement TDR géré par TDRManager pour l\'offre:', offre.id);
  };

  const handleViewOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setShowViewModal(true);
  };



  const handleDeleteOffre = (offre: Offre) => {
    if (confirm(`Êtes-vous sûr de vouloir annuler l'offre "${offre.intituleOffre || offre.titre}" ?`)) {
      try {
        const storedOffres = localStorage.getItem('offres');
        if (storedOffres) {
          const allOffres: Offre[] = JSON.parse(storedOffres);
          const updatedOffres = allOffres.map(o => 
            o.id === offre.id ? { ...o, statut: 'rejetée' as const, modalite: 'annulée' as const } : o
          );
          localStorage.setItem('offres', JSON.stringify(updatedOffres));
          setOffres(updatedOffres.filter(o => o.poleLead === poleName));
          alert('Offre annulée avec succès');
        }
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
        alert('Erreur lors de l\'annulation de l\'offre');
      }
    }
  };

  const handleMarkAsMontee = (offre: Offre) => {
    if (confirm(`Marquer l'offre "${offre.intituleOffre || offre.titre}" comme montée ?`)) {
      try {
        const storedOffres = localStorage.getItem('offres');
        if (storedOffres) {
          const allOffres: Offre[] = JSON.parse(storedOffres);
          const updatedOffres = allOffres.map(o => 
            o.id === offre.id ? { ...o, modalite: 'montée' as const } : o
          );
          localStorage.setItem('offres', JSON.stringify(updatedOffres));
          setOffres(updatedOffres.filter(o => o.poleLead === poleName));
          alert('Offre marquée comme montée avec succès');
        }
      } catch (error) {
        console.error('Erreur lors du marquage:', error);
        alert('Erreur lors du marquage de l\'offre');
      }
    }
  };

  const handleMarkAsDeposee = async (offre: Offre) => {
    if (confirm(`Marquer l'offre "${offre.intituleOffre || offre.titre}" comme déposée ?`)) {
      try {
        const response = await offresAPI.update(offre.id, {
          modalite: 'déposée',
          offreDeposee: true
        });
        
        if (response.success) {
          const updatedOffres = offres.map(o => 
            o.id === offre.id ? { ...o, modalite: 'déposée' as const, offreDeposee: true } : o
          );
          setOffres(updatedOffres.filter(o => o.poleLead === poleName));
          alert('Offre marquée comme déposée avec succès');
        } else {
          throw new Error(response.error || 'Erreur lors de la mise à jour');
        }
      } catch (error) {
        console.error('Erreur lors du marquage:', error);
        alert('Erreur lors du marquage de l\'offre');
      }
    }
  };

  const handleMarkAsGagnee = async (offre: Offre) => {
    if (confirm(`Marquer l'offre "${offre.intituleOffre || offre.titre}" comme gagnée ?`)) {
      try {
        const response = await offresAPI.update(offre.id, {
          modalite: 'gagné',
          statutOffre: 'Gagnée'
        });
        
        if (response.success) {
          const updatedOffres = offres.map(o => 
            o.id === offre.id ? { ...o, modalite: 'gagné' as const, statutOffre: 'Gagnée' as const } : o
          );
          setOffres(updatedOffres.filter(o => o.poleLead === poleName));
          alert('Offre marquée comme gagnée avec succès');
        } else {
          throw new Error(response.error || 'Erreur lors de la mise à jour');
        }
      } catch (error) {
        console.error('Erreur lors du marquage:', error);
        alert('Erreur lors du marquage de l\'offre');
      }
    }
  };

  // Fonctions utilitaires pour l'affichage
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'Priorité haute': return 'bg-red-100 text-red-800 border-red-200';
      case 'Stratégique': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Opportunité intermédiaire': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModaliteColor = (modalite: string | undefined) => {
    switch (modalite) {
      case 'nouveau': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'montée': return 'bg-green-100 text-green-800 border-green-200';
      case 'déposée': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'gagné': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'annulée': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getPaysDisplay = (pays: string[] | undefined) => {
    if (!pays || pays.length === 0) return 'Non spécifié';
    return pays.join(', ');
  };

  // Filtrer les offres par section
  const filteredOffresLead = offresLead.filter(offre => {
    const matchesSearch = !searchTerm || 
      (offre.intituleOffre || offre.titre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offre.bailleur || offre.client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offre.pays || []).join(' ').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModalite = selectedModalite === 'all' || offre.modalite === selectedModalite;
    
    return matchesSearch && matchesModalite;
  });

  const filteredOffresAssocie = offresAssocie.filter(offre => {
    const matchesSearch = !searchTerm || 
      (offre.intituleOffre || offre.titre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offre.bailleur || offre.client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offre.pays || []).join(' ').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModalite = selectedModalite === 'all' || offre.modalite === selectedModalite;
    
    return matchesSearch && matchesModalite;
  });

  // Pour la compatibilité avec l'existant
  const filteredOffres = [...filteredOffresLead, ...filteredOffresAssocie];

  // Composant pour les actions de modalité
  const ModaliteActions = ({ offre }: { offre: Offre }) => (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={() => handleMarkAsMontee(offre)}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          offre.modalite === 'montée' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-gray-100 text-gray-700 hover:bg-green-50 border border-gray-300'
        }`}
        title="Marquer comme montée"
      >
        <i className="ri-check-line mr-1"></i>
        Montée
      </button>
      
      <button
        onClick={() => handleMarkAsDeposee(offre)}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          offre.modalite === 'déposée' 
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
            : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 border border-gray-300'
        }`}
        title="Marquer comme déposée"
      >
        <i className="ri-send-plane-line mr-1"></i>
        Déposée
      </button>
      
      <button
        onClick={() => handleMarkAsGagnee(offre)}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          offre.modalite === 'gagné' 
            ? 'bg-purple-100 text-purple-800 border border-purple-300' 
            : 'bg-gray-100 text-gray-700 hover:bg-purple-50 border border-gray-300'
        }`}
        title="Marquer comme gagnée"
      >
        <i className="ri-trophy-line mr-1"></i>
        Gagnée
      </button>
      
      <button
        onClick={() => handleDeleteOffre(offre)}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          offre.modalite === 'annulée' 
            ? 'bg-red-100 text-red-800 border border-red-300' 
            : 'bg-gray-100 text-gray-700 hover:bg-red-50 border border-gray-300'
        }`}
        title="Annuler l'offre"
      >
        <i className="ri-close-line mr-1"></i>
        Annuler
      </button>
    </div>
  );

  // Composant pour la section "Lead en montage"
  const LeadEnMontageSection = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-blue-900 flex items-center">
              <i className="ri-star-line text-blue-600 mr-2"></i>
              Lead en montage
            </h3>
            <p className="text-blue-700 mt-1">
              {filteredOffresLead.length} offre{filteredOffresLead.length > 1 ? 's' : ''} où {poleName} est le pôle lead
            </p>
          </div>
          <div className="flex bg-white rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-table-line"></i>
              Tableau
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-grid-line"></i>
              Cartes
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {filteredOffresLead.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-inbox-line text-2xl text-blue-600"></i>
            </div>
            <p className="text-lg font-medium text-gray-900">Aucune offre en tant que pôle lead</p>
            <p className="text-sm text-gray-600 mt-2">
              {poleName} n'a actuellement aucune offre approuvée où il est le pôle lead.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <PoleOffresTable
            offres={filteredOffresLead}
            loading={loading}
            poleName={poleName}
            onViewOffre={handleViewOffre}
            onDeleteOffre={handleDeleteOffre}
            onDownloadTDR={downloadTDR}
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedModalite={selectedModalite}
          />
        ) : (
          <div className="grid gap-6">
            {filteredOffresLead.map((offre) => (
              <div key={offre.id} className="bg-gray-50 rounded-xl p-4 border border-blue-200">
                <OffreCard
                  offre={offre}
                  showActions={true}
                  onViewOffre={handleViewOffre}
                  onDeleteOffre={handleDeleteOffre}
                  onDownloadTDR={downloadTDR}
                  showPoleInfo={false}
                  showModalite={true}
                  showPriority={true}
                  showBudget={true}
                  showDate={true}
                  showStatus={true}
                  showTDR={true}
                  showDescription={true}
                  showDetails={true}
                  showCommentaire={false}
                />
                <ModaliteActions offre={offre} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Composant pour la section "Associé en montage"
  const AssocieEnMontageSection = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-green-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-green-900 flex items-center">
              <i className="ri-team-line text-green-600 mr-2"></i>
              Associé en montage
            </h3>
            <p className="text-green-700 mt-1">
              {filteredOffresAssocie.length} offre{filteredOffresAssocie.length > 1 ? 's' : ''} où {poleName} est choisi comme pôle associé
            </p>
          </div>
          <div className="flex bg-white rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'table' 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-table-line"></i>
              Tableau
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'cards' 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-grid-line"></i>
              Cartes
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {filteredOffresAssocie.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-inbox-line text-2xl text-green-600"></i>
            </div>
            <p className="text-lg font-medium text-gray-900">Aucune offre en tant que pôle associé</p>
            <p className="text-sm text-gray-600 mt-2">
              {poleName} n'a actuellement aucune offre approuvée où il est choisi comme pôle associé.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <PoleOffresTable
            offres={filteredOffresAssocie}
            loading={loading}
            poleName={poleName}
            onViewOffre={handleViewOffre}
            onDeleteOffre={handleDeleteOffre}
            onDownloadTDR={downloadTDR}
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedModalite={selectedModalite}
          />
        ) : (
          <div className="grid gap-6">
            {filteredOffresAssocie.map((offre) => (
              <div key={offre.id} className="bg-gray-50 rounded-xl p-4 border border-green-200">
                <OffreCard
                  offre={offre}
                  showActions={true}
                  onViewOffre={handleViewOffre}
                  onDeleteOffre={handleDeleteOffre}
                  onDownloadTDR={downloadTDR}
                  showPoleInfo={false}
                  showModalite={true}
                  showPriority={true}
                  showBudget={true}
                  showDate={true}
                  showStatus={true}
                  showTDR={true}
                  showDescription={true}
                  showDetails={true}
                  showCommentaire={false}
                />
                <ModaliteActions offre={offre} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Composant pour la vue cartes avec le style "offre du jour" (pour la compatibilité)
  const CardsView = () => (
    <div className="grid gap-8">
      {filteredOffres.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-inbox-line text-2xl text-blue-600"></i>
          </div>
          <p className="text-lg font-medium text-gray-900">Aucune offre trouvée</p>
          <p className="text-sm text-gray-600 mt-2">
            {searchTerm ? 'Aucune offre approuvée ne correspond à votre recherche.' : `Aucune offre approuvée attribuée au ${poleName}.`}
          </p>
        </div>
      ) : (
        filteredOffres.map((offre) => (
          <div key={offre.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <OffreCard
              offre={offre}
              showActions={true}
              onViewOffre={handleViewOffre}
              onDeleteOffre={handleDeleteOffre}
              onDownloadTDR={downloadTDR}
              showPoleInfo={false}
              showModalite={true}
              showPriority={true}
              showBudget={true}
              showDate={true}
              showStatus={true}
              showTDR={true}
              showDescription={true}
              showDetails={true}
              showCommentaire={false}
            />
            <ModaliteActions offre={offre} />
          </div>
        ))
      )}
    </div>
  );

  // Composant pour afficher les modalités de répartition
  const RepartitionModalitesTable = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <i className="ri-file-list-3-line text-blue-600 mr-2"></i>
          Modalités de Répartition - {poleName}
        </h3>
        <p className="text-gray-600 mt-1">
          Tableau complet des modalités renseignées dans le formulaire de gestion de répartition
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bailleur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secteurs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diligences</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clarifications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Délais</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pôles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administratif</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOffres.map((offre) => (
              <tr key={offre.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {offre.intituleOffre || offre.titre || 'Non spécifié'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {offre.commentaire && offre.commentaire.length > 50 
                      ? `${offre.commentaire.substring(0, 50)}...` 
                      : offre.commentaire}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offre.bailleur || offre.client || 'Non spécifié'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getPaysDisplay(offre.pays)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offre.objectifs || 'Non spécifié'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offre.diligencesMenees || 'Non spécifié'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offre.adresseDemandeClarifications || 'Non spécifié'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Clarification: {formatDate(offre.delaiDemandeClarification)}</div>
                    <div>Réception: {formatDate(offre.delaiAccuseReception)}</div>
                    <div>Intention: {formatDate(offre.delaiIntentionSoumission)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offre.chargeMontageAdministratif || 'Non spécifié'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="font-medium">Lead: {offre.poleLead || 'Non attribué'}</div>
                    <div>Associés: {offre.poleAssocies || 'Non attribué'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Transmission: {formatDate(offre.delaiTransmissionMontageAdministratif)}</div>
                    <div>Dépôt: {formatDate(offre.delaiDepot)}</div>
                    <div>Déposée: {offre.offreDeposee ? 'Oui' : 'Non'}</div>
                    {offre.chargeMontageAdministratif && (
                      <div className="text-xs text-gray-600 mt-1">
                        Chargé: {offre.chargeMontageAdministratif}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offre.statut || '')}`}>
                    {offre.statutOffre || offre.statut || 'Non spécifié'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offre.montant && offre.devise ? `${offre.montant} ${offre.devise}` : 'Non spécifié'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewOffre(offre)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Voir les détails"
                    >
                      <i className="ri-eye-line"></i>
                    </button>
                    <button
                      onClick={() => downloadTDR(offre)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Télécharger TDR"
                    >
                      <i className="ri-download-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  const RepartitionModalitesCards = () => (
    <div className="grid gap-6">
      {filteredOffres.map((offre) => (
        <div key={offre.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {offre.intituleOffre || offre.titre || 'Non spécifié'}
              </h4>
              <p className="text-sm text-gray-600">{offre.bailleur || offre.client || 'Non spécifié'}</p>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(offre.statut || '')}`}>
              {offre.statutOffre || offre.statut || 'Non spécifié'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Informations de base</h5>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Pays:</span> {getPaysDisplay(offre.pays)}</div>
                <div><span className="font-medium">Secteurs:</span> {offre.objectifs || 'Non spécifié'}</div>
                <div><span className="font-medium">Budget:</span> {offre.montant && offre.devise ? `${offre.montant} ${offre.devise}` : 'Non spécifié'}</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Diligences et clarifications</h5>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Diligences:</span> {offre.diligencesMenees || 'Non spécifié'}</div>
                <div><span className="font-medium">Clarifications:</span> {offre.adresseDemandeClarifications || 'Non spécifié'}</div>
                <div><span className="font-medium">Délai clarif.:</span> {formatDate(offre.delaiDemandeClarification)}</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Pôles et montage</h5>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Pôle Lead:</span> {offre.poleLead || 'Non attribué'}</div>
                <div><span className="font-medium">Pôle Associés:</span> {offre.poleAssocies || 'Non attribué'}</div>
                <div><span className="font-medium">Charge montage:</span> {offre.chargeMontageAdministratif || 'Non spécifié'}</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span>Dépôt: {formatDate(offre.delaiDepot)}</span>
                <span className="mx-2">•</span>
                <span>Déposée: {offre.offreDeposee ? 'Oui' : 'Non'}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewOffre(offre)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  <i className="ri-eye-line mr-1"></i>Voir
                </button>
                <button
                  onClick={() => downloadTDR(offre)}
                  className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                >
                  <i className="ri-download-line mr-1"></i>TDR
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <AlertBanner />
      {/* Filtres et recherche */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        {/* Indicateur des offres approuvées */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <i className="ri-check-line mr-2 text-green-600"></i>
            <span className="text-sm font-medium">
              Affichage des offres approuvées uniquement - {offresLead.length} en tant que pôle lead, {offresAssocie.length} en tant que pôle associé
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="ri-search-line mr-2"></i>
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, bailleur, pays..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filtre par modalité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="ri-settings-3-line mr-2"></i>
              Modalité
            </label>
            <select
              value={selectedModalite}
              onChange={(e) => setSelectedModalite(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Toutes les modalités</option>
              <option value="nouveau">Nouveau</option>
              <option value="montée">Montée</option>
              <option value="déposée">Déposée</option>
              <option value="gagné">Gagné</option>
            </select>
          </div>

          {/* Sélecteur de vue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="ri-layout-line mr-2"></i>
              Vue
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-table-line"></i>
                Tableau
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'cards' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-grid-line"></i>
                Cartes
              </button>
            </div>
          </div>

          {/* Bouton modalités de répartition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="ri-file-list-3-line mr-2"></i>
              Modalités Répartition
            </label>
            <button
              onClick={() => setShowRepartitionModalites(!showRepartitionModalites)}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                showRepartitionModalites 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <i className="ri-file-list-3-line"></i>
              {showRepartitionModalites ? 'Masquer' : 'Afficher'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-end">
            <button
              onClick={fetchOffresByPole}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <i className="ri-refresh-line"></i>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Affichage des modalités de répartition */}
      {showRepartitionModalites && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-900">
                <i className="ri-file-list-3-line mr-2"></i>
                Modalités de Répartition - {poleName}
              </h3>
              <div className="flex bg-white rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <i className="ri-table-line"></i>
                  Tableau
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'cards' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <i className="ri-grid-line"></i>
                  Cartes
                </button>
              </div>
            </div>
            <p className="text-blue-700 text-sm">
              Affichage de toutes les modalités renseignées dans le formulaire de gestion de répartition pour le {poleName}.
            </p>
          </div>
          
          {viewMode === 'table' ? (
            <RepartitionModalitesTable />
          ) : (
            <RepartitionModalitesCards />
          )}
        </div>
      )}

      {/* Affichage des sections Lead et Associé en montage */}
      {!showRepartitionModalites && (
        <div className="space-y-6">
          {/* Section Lead en montage */}
          <LeadEnMontageSection />
          
          {/* Section Associé en montage */}
          <AssocieEnMontageSection />
                        </div>
      )}

      {/* Affichage des modalités de répartition */}
      {showRepartitionModalites && (
        viewMode === 'table' ? (
          <RepartitionModalitesTable />
        ) : (
          <RepartitionModalitesCards />
        )
      )}

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
                      <label className="text-sm font-medium text-gray-600">Pays</label>
                      <p className="text-gray-900">
                        {selectedOffre.pays && selectedOffre.pays.length > 0 ? selectedOffre.pays.join(', ') : 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priorité</label>
                      <p className="text-gray-900">
                        {selectedOffre.priorite || 'Non spécifiée'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Modalité</label>
                      <p className="text-gray-900">
                        {selectedOffre.modalite || 'Non spécifiée'}
                      </p>
                    </div>
                    
                    {/* Actions de modalité */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-3 block">Actions de modalité</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            handleMarkAsMontee(selectedOffre);
                            setShowViewModal(false);
                            setSelectedOffre(null);
                          }}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            selectedOffre.modalite === 'montée' 
                              ? 'bg-green-100 text-green-800 border border-green-300' 
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50 border border-gray-300'
                          }`}
                        >
                          <i className="ri-check-line mr-1"></i>
                          Marquer comme montée
                        </button>
                        
                        <button
                          onClick={() => {
                            handleMarkAsDeposee(selectedOffre);
                            setShowViewModal(false);
                            setSelectedOffre(null);
                          }}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            selectedOffre.modalite === 'déposée' 
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                              : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 border border-gray-300'
                          }`}
                        >
                          <i className="ri-send-plane-line mr-1"></i>
                          Marquer comme déposée
                        </button>
                        
                        <button
                          onClick={() => {
                            handleMarkAsGagnee(selectedOffre);
                            setShowViewModal(false);
                            setSelectedOffre(null);
                          }}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            selectedOffre.modalite === 'gagné' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                              : 'bg-gray-100 text-gray-700 hover:bg-purple-50 border border-gray-300'
                          }`}
                        >
                          <i className="ri-trophy-line mr-1"></i>
                          Marquer comme gagnée
                        </button>
                        
                        <button
                          onClick={() => {
                            handleDeleteOffre(selectedOffre);
                            setShowViewModal(false);
                            setSelectedOffre(null);
                          }}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            selectedOffre.modalite === 'annulée' 
                              ? 'bg-red-100 text-red-800 border border-red-300' 
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50 border border-gray-300'
                          }`}
                        >
                          <i className="ri-close-line mr-1"></i>
                          Annuler l'offre
                        </button>
                      </div>
                    </div>

                    {/* Gestion des fichiers TDR */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <TDRManager 
                        offreId={selectedOffre.id} 
                        onFichiersUpdate={() => {
                          // Actualiser les données de l'offre si nécessaire
                          fetchOffresByPole();
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Informations supplémentaires</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de dépôt</label>
                      <p className="text-gray-900">
                        {selectedOffre.dateDepot ? new Date(selectedOffre.dateDepot).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Montant</label>
                      <p className="text-gray-900">
                        {selectedOffre.montant && selectedOffre.devise ? `${selectedOffre.montant} ${selectedOffre.devise}` : 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Durée de mission</label>
                      <p className="text-gray-900">
                        {selectedOffre.dureeMission || 'Non spécifiée'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Objectifs</label>
                      <p className="text-gray-900">
                        {selectedOffre.objectifs || 'Non spécifiés'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commentaires */}
              {selectedOffre.commentaire && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Commentaires</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedOffre.commentaire}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
