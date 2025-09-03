'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGlobalFilters, PoleType } from '../../../hooks/useGlobalFilters';
import HomeButton from '../../../components/HomeButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Layout from '../../../components/Layout';
import OffreCard from '../../../components/OffreCard';

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
  poleLead?: PoleType;
  poleAssocies?: PoleType;
  tdrFile?: string;
  // Champs pour la gestion de répartition
  adresseDemandeClarifications?: string;
  delaiDemandeClarification?: string;
  delaiAccuseReception?: string;
  delaiIntentionSoumission?: string;
  adresseDepotOffre?: string;
  chargeMontageAdministratif?: string;
  dateImputation?: string;
  chargeAssuranceQualite?: string;
  delaiTransmissionMontageAdministratif?: string;
  delaiDepot?: string;
  statutOffre?: 'Gagnée' | 'Perdue' | 'En cours';
  offreDeposee?: boolean;
  dateTransmissionAssuranceQualite?: string;
  diligencesMenees?: string;
  dateIdentificationOffre?: string;
}

export default function GestionRepartition() {
  return (
    <ProtectedRoute pageName="gestion-repartition">
      <Layout>
        <GestionRepartitionContent />
      </Layout>
    </ProtectedRoute>
  );
}

function GestionRepartitionContent() {
  const { selectedPoleLead, selectedPoleAssocies, updateGlobalFilters, POLE_OPTIONS } = useGlobalFilters();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffres, setSelectedOffres] = useState<number[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignPoleLead, setAssignPoleLead] = useState<PoleType | ''>('');
  const [assignPoleAssocies, setAssignPoleAssocies] = useState<PoleType | ''>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedRepartitionView, setSelectedRepartitionView] = useState<string>('');
  
  // États pour les nouvelles modales
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelComment, setCancelComment] = useState('');
  const [selectedOffreForAction, setSelectedOffreForAction] = useState<Offre | null>(null);
  const [showAttributionFormModal, setShowAttributionFormModal] = useState(false);
  const [attributionFormData, setAttributionFormData] = useState({
    intitule: '',
    bailleur: '',
    pays: '',
    secteursConcernes: '',
    tdr: '',
    depouillementTDR: '',
    diligencesOffre: '',
    adresseDemandeClarifications: '',
    delaiDemandeClarification: '',
    delaiAccuseReception: '',
    delaiIntentionSoumission: '',
    adresseDepotOffre: '',
    montageTechnique: '',
    chargeMontage: '',
    poleLead: '',
    poleAssocies: '',
    dateImputation: '',
    chargeAssuranceQualite: '',
    // Modalités réservées au montage administratif
    chargeMontageAdministratif: '',
    dateTransmissionMontageAdministratif: '',
    suiviOffre: '',
    dateDepot: '',
    statutOffre: '',
    offreGagneeOuPerdue: '',
    offreDeposee: false,
    dateEffectiveDepot: '',
    budgetEtDuree: '',
    consortium: '',
    dateTransmissionAssuranceQualite: '',
    diligencesMenees: '',
    dateIdentificationOffre: ''
  });

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    filterOffres();
  }, [offres, searchTerm, selectedPoleLead, selectedPoleAssocies, selectedRepartitionView]);

  const fetchOffres = () => {
    setLoading(true);
    try {
      const storedOffres = localStorage.getItem('offres');
      if (storedOffres) {
        const allOffres: Offre[] = JSON.parse(storedOffres);
        setOffres(allOffres);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOffres = () => {
    let filtered = [...offres];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(offre => 
        offre.intituleOffre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.bailleur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.objectifs?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par pôle LEAD
    if (selectedPoleLead) {
      filtered = filtered.filter(offre => offre.poleLead === selectedPoleLead);
    }

    // Filtre par pôle ASSOCIÉS
    if (selectedPoleAssocies) {
      filtered = filtered.filter(offre => offre.poleAssocies === selectedPoleAssocies);
    }

    // Filtre par vue et modalité des répartitions
    if (selectedRepartitionView) {
      switch (selectedRepartitionView) {
        case 'attribuees':
          filtered = filtered.filter(offre => offre.poleLead && offre.poleLead !== undefined);
          break;
        case 'non-attribuees':
          filtered = filtered.filter(offre => !offre.poleLead || offre.poleLead === undefined);
          break;
        case 'en-cours':
          filtered = filtered.filter(offre => offre.statutOffre === 'En cours');
          break;
        case 'gagnees':
          filtered = filtered.filter(offre => offre.statutOffre === 'Gagnée');
          break;
        case 'perdues':
          filtered = filtered.filter(offre => offre.statutOffre === 'Perdue');
          break;
        case 'deposees':
          filtered = filtered.filter(offre => offre.offreDeposee === true);
          break;
        case 'non-deposees':
          filtered = filtered.filter(offre => offre.offreDeposee === false || offre.offreDeposee === undefined);
          break;
      }
    }

    // Trier les offres par date (plus récentes en premier)
    filtered.sort((a, b) => {
      const dateA = a.dateDepot ? new Date(a.dateDepot).getTime() : 
                   a.dateSoumissionValidation ? new Date(a.dateSoumissionValidation).getTime() : 0;
      const dateB = b.dateDepot ? new Date(b.dateDepot).getTime() : 
                   b.dateSoumissionValidation ? new Date(b.dateSoumissionValidation).getTime() : 0;
      return dateB - dateA; // Tri décroissant (plus récentes en premier)
    });

    setFilteredOffres(filtered);
  };

  const handleSelectOffre = (id: number) => {
    setSelectedOffres(prev => 
      prev.includes(id) 
        ? prev.filter(offreId => offreId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffres.length === filteredOffres.length) {
      setSelectedOffres([]);
    } else {
      setSelectedOffres(filteredOffres.map(offre => offre.id));
    }
  };

  const handleAssignPoles = () => {
    if (!assignPoleLead && !assignPoleAssocies) {
      alert('Veuillez sélectionner au moins un pôle à attribuer.');
      return;
    }

    const updatedOffres = offres.map(offre => {
      if (selectedOffres.includes(offre.id)) {
        return {
          ...offre,
          poleLead: assignPoleLead || offre.poleLead,
          poleAssocies: assignPoleAssocies || offre.poleAssocies
        };
      }
      return offre;
    });

    localStorage.setItem('offres', JSON.stringify(updatedOffres));
    setOffres(updatedOffres);
    setSelectedOffres([]);
    setShowAssignModal(false);
    setAssignPoleLead('');
    setAssignPoleAssocies('');
    
    alert(`${selectedOffres.length} offre(s) mise(s) à jour avec succès.`);
  };

  // Nouvelles fonctions pour les actions
  const handleCancelOffre = (offre: Offre) => {
    setSelectedOffreForAction(offre);
    setShowCancelModal(true);
  };

  const handleAttribuerOffre = (offre: Offre) => {
    setSelectedOffreForAction(offre);
    setAttributionFormData({
      intitule: offre.intituleOffre || offre.titre || '',
      bailleur: offre.bailleur || offre.client || '',
      pays: offre.pays ? offre.pays.join(', ') : '',
      secteursConcernes: offre.objectifs || '',
      tdr: offre.tdrFile || offre.lienTDR || '',
      depouillementTDR: offre.commentaire || '',
      diligencesOffre: '',
      adresseDemandeClarifications: offre.adresseDemandeClarifications || '',
      delaiDemandeClarification: offre.delaiDemandeClarification || '',
      delaiAccuseReception: offre.delaiAccuseReception || '',
      delaiIntentionSoumission: offre.delaiIntentionSoumission || '',
      adresseDepotOffre: offre.adresseDepotOffre || '',
      montageTechnique: '',
      chargeMontage: offre.chargeMontageAdministratif || '',
      poleLead: offre.poleLead || '',
      poleAssocies: offre.poleAssocies || '',
      dateImputation: offre.dateImputation || '',
      chargeAssuranceQualite: offre.chargeAssuranceQualite || '',
      chargeMontageAdministratif: offre.chargeMontageAdministratif || '',
      dateTransmissionMontageAdministratif: offre.delaiTransmissionMontageAdministratif || '',
      suiviOffre: '',
      dateDepot: offre.delaiDepot || '',
      statutOffre: offre.statutOffre || '',
      offreGagneeOuPerdue: '',
      offreDeposee: offre.offreDeposee || false,
      dateEffectiveDepot: '',
      budgetEtDuree: offre.montant || offre.budget || '',
      consortium: '',
      dateTransmissionAssuranceQualite: offre.dateTransmissionAssuranceQualite || '',
      diligencesMenees: offre.diligencesMenees || '',
      dateIdentificationOffre: offre.dateIdentificationOffre || ''
    });
    setShowAttributionFormModal(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedOffreForAction || !cancelComment.trim()) {
      alert('Veuillez saisir un commentaire pour l\'annulation.');
      return;
    }

    const updatedOffres = offres.map(offre => {
      if (offre.id === selectedOffreForAction.id) {
        return {
          ...offre,
          statut: 'rejetée' as const,
          commentaireValidation: cancelComment
        };
      }
      return offre;
    });

    localStorage.setItem('offres', JSON.stringify(updatedOffres));
    setOffres(updatedOffres);
    setShowCancelModal(false);
    setCancelComment('');
    setSelectedOffreForAction(null);
    
    alert('Offre annulée avec succès.');
  };

  const handleSubmitAttributionForm = () => {
    if (!selectedOffreForAction) return;

    const updatedOffres = offres.map(offre => {
      if (offre.id === selectedOffreForAction.id) {
        return {
          ...offre,
          // Mise à jour des champs de gestion de répartition
          objectifs: attributionFormData.secteursConcernes,
          commentaire: attributionFormData.depouillementTDR,
          adresseDemandeClarifications: attributionFormData.adresseDemandeClarifications,
          delaiDemandeClarification: attributionFormData.delaiDemandeClarification,
          delaiAccuseReception: attributionFormData.delaiAccuseReception,
          delaiIntentionSoumission: attributionFormData.delaiIntentionSoumission,
          adresseDepotOffre: attributionFormData.adresseDepotOffre,
          chargeMontageAdministratif: attributionFormData.chargeMontage,
          poleLead: attributionFormData.poleLead as PoleType,
          poleAssocies: attributionFormData.poleAssocies as PoleType,
          dateImputation: attributionFormData.dateImputation,
          chargeAssuranceQualite: attributionFormData.chargeAssuranceQualite,
          // Champs réservés au montage administratif
          delaiTransmissionMontageAdministratif: attributionFormData.dateTransmissionMontageAdministratif,
          delaiDepot: attributionFormData.dateDepot,
          statutOffre: attributionFormData.statutOffre as 'Gagnée' | 'Perdue' | 'En cours',
          offreDeposee: attributionFormData.offreDeposee,
          montant: attributionFormData.budgetEtDuree,
          dateTransmissionAssuranceQualite: attributionFormData.dateTransmissionAssuranceQualite,
          diligencesMenees: attributionFormData.diligencesMenees,
          dateIdentificationOffre: attributionFormData.dateIdentificationOffre
        };
      }
      return offre;
    });

    localStorage.setItem('offres', JSON.stringify(updatedOffres));
    setOffres(updatedOffres);
    setShowAttributionFormModal(false);
    setSelectedOffreForAction(null);
    
    alert('Attribution mise à jour avec succès.');
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'approuvée': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejetée': return 'bg-red-100 text-red-800 border-red-200';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'brouillon': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDisplay = (statut: string) => {
    switch (statut) {
      case 'approuvée': return 'Approuvée';
      case 'rejetée': return 'Rejetée';
      case 'en_attente': return 'En attente';
      case 'brouillon': return 'Brouillon';
      default: return 'En attente';
    }
  };

  const getPaysDisplay = (pays: string[] | undefined) => {
    if (!pays || pays.length === 0) return 'Non spécifié';
    return Array.isArray(pays) ? pays.join(', ') : 'Non spécifié';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifiée';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  const formatBudget = (budget: string | undefined) => {
    return budget ? budget.replace('€', ' €') : 'Non spécifié';
  };

  const getOffresNonAttribuees = () => {
    return offres.filter(offre => !offre.poleLead).length;
  };

  // Composant pour afficher le tableau complet des modalités
  const RepartitionModalitesTable = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <i className="ri-file-list-3-line text-blue-600 mr-2"></i>
          Tableau Complet des Modalités de Répartition
        </h3>
        <p className="text-gray-600 mt-1">
          Toutes les informations du formulaire de gestion de répartition
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
                      onClick={() => handleAttribuerOffre(offre)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Attribuer"
                    >
                      <i className="ri-settings-3-line"></i>
                    </button>
                    <button
                      onClick={() => handleCancelOffre(offre)}
                      className="text-red-600 hover:text-red-900"
                      title="Annuler"
                    >
                      <i className="ri-close-line"></i>
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

  // Composant pour afficher les modalités en cartes
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
                  onClick={() => handleAttribuerOffre(offre)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  <i className="ri-settings-3-line mr-1"></i>Attribuer
                </button>
                <button
                  onClick={() => handleCancelOffre(offre)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  <i className="ri-close-line mr-1"></i>Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la gestion des répartitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <img 
                  src="https://static.readdy.ai/image/36ce116ccdb0d05752a287dd792317ce/3a2cd734c9129790560cc32a9975e166.jfif" 
                  alt="AMD Logo" 
                  className="h-10 cursor-pointer"
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <HomeButton variant="outline" size="sm" />
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Dashboard
              </Link>
              <Link href="/offres" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Offres
              </Link>
              <Link href="/repartition" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Répartition
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-settings-3-line text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Gestion des Répartitions</h1>
            <p className="text-xl opacity-90 mb-6">Attribution des offres aux pôles LEAD et ASSOCIÉS</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <i className="ri-briefcase-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Offres</p>
                <p className="text-2xl font-bold text-gray-900">{offres.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 text-white p-3 rounded-lg">
                <i className="ri-alert-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Non Attribuées</p>
                <p className="text-2xl font-bold text-gray-900">{getOffresNonAttribuees()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 text-white p-3 rounded-lg">
                <i className="ri-check-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sélectionnées</p>
                <p className="text-2xl font-bold text-gray-900">{selectedOffres.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtres de Répartition</h2>
          
          {/* Filtres de pôle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pôle LEAD</label>
              <select
                value={selectedPoleLead}
                onChange={(e) => {
                  const newPoleLead = e.target.value as PoleType | '';
                  updateGlobalFilters(newPoleLead, selectedPoleAssocies);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les pôles</option>
                {POLE_OPTIONS.map((pole, index) => (
                  <option key={index} value={pole}>{pole}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pôle ASSOCIÉS</label>
              <select
                value={selectedPoleAssocies}
                onChange={(e) => {
                  const newPoleAssocies = e.target.value as PoleType | '';
                  updateGlobalFilters(selectedPoleLead, newPoleAssocies);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les pôles</option>
                {POLE_OPTIONS.map((pole, index) => (
                  <option key={index} value={pole}>{pole}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recherche et Actions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Rechercher par titre, bailleur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vue et Modalité des Répartitions</label>
              <select
                value={selectedRepartitionView}
                onChange={(e) => setSelectedRepartitionView(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les offres</option>
                <option value="attribuees">Offres attribuées</option>
                <option value="non-attribuees">Offres non attribuées</option>
                <option value="en-cours">Offres en cours</option>
                <option value="gagnees">Offres gagnées</option>
                <option value="perdues">Offres perdues</option>
                <option value="deposees">Offres déposées</option>
                <option value="non-deposees">Offres non déposées</option>
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
            
            <div className="flex items-end">
              <button
                onClick={() => setShowAssignModal(true)}
                disabled={selectedOffres.length === 0}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Attribuer {selectedOffres.length} offre(s) sélectionnée(s)
              </button>
            </div>
            <div className="flex items-end">
              <Link
                href="/repartition/vue-repetitions"
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-table-line"></i>
                Vue des Répartitions
              </Link>
            </div>
          </div>
        </div>
      </div>

             {/* Affichage des modalités de répartition */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {filteredOffres.length === 0 ? (
           <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <i className="ri-inbox-line text-2xl text-blue-600"></i>
             </div>
             <p className="text-lg font-medium text-gray-900">Aucune offre trouvée</p>
             <p className="text-sm text-gray-600 mt-2">
               {searchTerm || selectedPoleLead || selectedPoleAssocies ? 'Aucune offre ne correspond aux filtres sélectionnés.' : 'Aucune offre disponible.'}
             </p>
           </div>
         ) : (
           <>
             {/* Affichage conditionnel selon le mode sélectionné */}
             {viewMode === 'table' ? (
               <RepartitionModalitesTable />
             ) : (
               <RepartitionModalitesCards />
             )}
           </>
         )}
       </div>

      {/* Modal d'attribution */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Attribuer {selectedOffres.length} offre(s)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pôle LEAD</label>
                  <select
                    value={assignPoleLead}
                    onChange={(e) => setAssignPoleLead(e.target.value as PoleType | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Conserver le pôle actuel</option>
                    {POLE_OPTIONS.map((pole, index) => (
                      <option key={index} value={pole}>{pole}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pôle ASSOCIÉS</label>
                  <select
                    value={assignPoleAssocies}
                    onChange={(e) => setAssignPoleAssocies(e.target.value as PoleType | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Conserver le pôle actuel</option>
                    {POLE_OPTIONS.map((pole, index) => (
                      <option key={index} value={pole}>{pole}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAssignPoles}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Attribuer
                </button>
              </div>
            </div>
          </div>
        </div>
             )}

       {/* Modal d'annulation */}
       {showCancelModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
             <div className="p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4">
                 Annuler l'offre
               </h3>
               <p className="text-sm text-gray-600 mb-4">
                 {selectedOffreForAction?.intituleOffre || selectedOffreForAction?.titre}
               </p>
               
               <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire d'annulation</label>
                 <textarea
                   value={cancelComment}
                   onChange={(e) => setCancelComment(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                   rows={4}
                   placeholder="Veuillez saisir un commentaire pour justifier l'annulation..."
                 />
               </div>
               
               <div className="flex justify-end gap-3">
                 <button
                   onClick={() => {
                     setShowCancelModal(false);
                     setCancelComment('');
                     setSelectedOffreForAction(null);
                   }}
                   className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                 >
                   Annuler
                 </button>
                 <button
                   onClick={handleConfirmCancel}
                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                 >
                   Confirmer l'annulation
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Modal de formulaire d'attribution */}
       {showAttributionFormModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6">
               <h3 className="text-xl font-bold text-gray-900 mb-6">
                 Formulaire de Gestion de Répartition
               </h3>
               
               <form onSubmit={(e) => { e.preventDefault(); handleSubmitAttributionForm(); }}>
                 {/* Section 1: Informations de base */}
                 <div className="mb-8">
                   <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                     Informations de base
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Intitulé</label>
                       <input
                         type="text"
                         value={attributionFormData.intitule}
                         onChange={(e) => setAttributionFormData({...attributionFormData, intitule: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         readOnly
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Bailleur</label>
                       <input
                         type="text"
                         value={attributionFormData.bailleur}
                         onChange={(e) => setAttributionFormData({...attributionFormData, bailleur: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         readOnly
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                       <input
                         type="text"
                         value={attributionFormData.pays}
                         onChange={(e) => setAttributionFormData({...attributionFormData, pays: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         readOnly
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Secteurs Concernés</label>
                       <input
                         type="text"
                         value={attributionFormData.secteursConcernes}
                         onChange={(e) => setAttributionFormData({...attributionFormData, secteursConcernes: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Section 2: TDR et Dépouillement */}
                 <div className="mb-8">
                   <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                     TDR et Dépouillement
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">TDR</label>
                       <input
                         type="text"
                         value={attributionFormData.tdr}
                         onChange={(e) => setAttributionFormData({...attributionFormData, tdr: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         readOnly
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Dépouillement TDR</label>
                       <textarea
                         value={attributionFormData.depouillementTDR}
                         onChange={(e) => setAttributionFormData({...attributionFormData, depouillementTDR: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         rows={3}
                       />
                     </div>
                   </div>
                 </div>

                 {/* Section 3: Diligences de l'offre */}
                 <div className="mb-8">
                   <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                     Diligences de l'offre
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Diligences de l'offre</label>
                       <textarea
                         value={attributionFormData.diligencesOffre}
                         onChange={(e) => setAttributionFormData({...attributionFormData, diligencesOffre: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         rows={3}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Adresse Demande de Clarifications</label>
                       <input
                         type="email"
                         value={attributionFormData.adresseDemandeClarifications}
                         onChange={(e) => setAttributionFormData({...attributionFormData, adresseDemandeClarifications: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Délai Demande de Clarification</label>
                       <input
                         type="date"
                         value={attributionFormData.delaiDemandeClarification}
                         onChange={(e) => setAttributionFormData({...attributionFormData, delaiDemandeClarification: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Délai Accusé de Réception</label>
                       <input
                         type="date"
                         value={attributionFormData.delaiAccuseReception}
                         onChange={(e) => setAttributionFormData({...attributionFormData, delaiAccuseReception: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Délai Intention Soumission</label>
                       <input
                         type="date"
                         value={attributionFormData.delaiIntentionSoumission}
                         onChange={(e) => setAttributionFormData({...attributionFormData, delaiIntentionSoumission: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de Dépôt de l'Offre</label>
                       <input
                         type="text"
                         value={attributionFormData.adresseDepotOffre}
                         onChange={(e) => setAttributionFormData({...attributionFormData, adresseDepotOffre: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Section 4: Montage Technique */}
                 <div className="mb-8">
                   <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                     Montage Technique de l'Offre
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Montage Technique</label>
                       <textarea
                         value={attributionFormData.montageTechnique}
                         onChange={(e) => setAttributionFormData({...attributionFormData, montageTechnique: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         rows={3}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Charge du Montage</label>
                       <input
                         type="text"
                         value={attributionFormData.chargeMontage}
                         onChange={(e) => setAttributionFormData({...attributionFormData, chargeMontage: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Pôle LEAD</label>
                       <select
                         value={attributionFormData.poleLead}
                         onChange={(e) => setAttributionFormData({...attributionFormData, poleLead: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       >
                         <option value="">Sélectionner un pôle</option>
                         {POLE_OPTIONS.map((pole, index) => (
                           <option key={index} value={pole}>{pole}</option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Pôle ASSOCIÉS</label>
                       <select
                         value={attributionFormData.poleAssocies}
                         onChange={(e) => setAttributionFormData({...attributionFormData, poleAssocies: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       >
                         <option value="">Sélectionner un pôle</option>
                         {POLE_OPTIONS.map((pole, index) => (
                           <option key={index} value={pole}>{pole}</option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Date d'Imputation</label>
                       <input
                         type="date"
                         value={attributionFormData.dateImputation}
                         onChange={(e) => setAttributionFormData({...attributionFormData, dateImputation: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Charge Assurance Qualité</label>
                       <input
                         type="text"
                         value={attributionFormData.chargeAssuranceQualite}
                         onChange={(e) => setAttributionFormData({...attributionFormData, chargeAssuranceQualite: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Section 5: Montage Administratif (réservé) */}
                 <div className="mb-8">
                   <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                     Montage Administratif (Réservé)
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Charge du Montage Administratif</label>
                       <input
                         type="text"
                         value={attributionFormData.chargeMontageAdministratif}
                         onChange={(e) => setAttributionFormData({...attributionFormData, chargeMontageAdministratif: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Date de Transmission pour Montage Administratif</label>
                       <input
                         type="date"
                         value={attributionFormData.dateTransmissionMontageAdministratif}
                         onChange={(e) => setAttributionFormData({...attributionFormData, dateTransmissionMontageAdministratif: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Suivi de l'Offre</label>
                       <textarea
                         value={attributionFormData.suiviOffre}
                         onChange={(e) => setAttributionFormData({...attributionFormData, suiviOffre: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         rows={3}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Date de Dépôt</label>
                       <input
                         type="date"
                         value={attributionFormData.dateDepot}
                         onChange={(e) => setAttributionFormData({...attributionFormData, dateDepot: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Statut de l'Offre</label>
                       <select
                         value={attributionFormData.statutOffre}
                         onChange={(e) => setAttributionFormData({...attributionFormData, statutOffre: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       >
                         <option value="">Sélectionner un statut</option>
                         <option value="Gagnée">Gagnée</option>
                         <option value="Perdue">Perdue</option>
                         <option value="En cours">En cours</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Offre Gagnée ou Perdue</label>
                       <input
                         type="text"
                         value={attributionFormData.offreGagneeOuPerdue}
                         onChange={(e) => setAttributionFormData({...attributionFormData, offreGagneeOuPerdue: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div className="flex items-center">
                       <input
                         type="checkbox"
                         checked={attributionFormData.offreDeposee}
                         onChange={(e) => setAttributionFormData({...attributionFormData, offreDeposee: e.target.checked})}
                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                       />
                       <label className="ml-2 block text-sm text-gray-900">Offre Déposée</label>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Date Effective de Dépôt</label>
                       <input
                         type="date"
                         value={attributionFormData.dateEffectiveDepot}
                         onChange={(e) => setAttributionFormData({...attributionFormData, dateEffectiveDepot: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Budget et Durée de la Mission</label>
                       <input
                         type="text"
                         value={attributionFormData.budgetEtDuree}
                         onChange={(e) => setAttributionFormData({...attributionFormData, budgetEtDuree: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="ex: 50000€, 6 mois"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Consortium</label>
                       <input
                         type="text"
                         value={attributionFormData.consortium}
                         onChange={(e) => setAttributionFormData({...attributionFormData, consortium: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Date de Transmission Assurance Qualité</label>
                       <input
                         type="date"
                         value={attributionFormData.dateTransmissionAssuranceQualite}
                         onChange={(e) => setAttributionFormData({...attributionFormData, dateTransmissionAssuranceQualite: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Diligences Menées par AMD</label>
                       <textarea
                         value={attributionFormData.diligencesMenees}
                         onChange={(e) => setAttributionFormData({...attributionFormData, diligencesMenees: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         rows={3}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Date d'Identification de l'Offre</label>
                       <input
                         type="date"
                         value={attributionFormData.dateIdentificationOffre}
                         onChange={(e) => setAttributionFormData({...attributionFormData, dateIdentificationOffre: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                   </div>
                 </div>

                 <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                   <button
                     type="button"
                     onClick={() => {
                       setShowAttributionFormModal(false);
                       setSelectedOffreForAction(null);
                     }}
                     className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                   >
                     Annuler
                   </button>
                   <button
                     type="submit"
                     className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                   >
                     Enregistrer l'Attribution
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }
