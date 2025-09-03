'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface PoleOffresTableProps {
  offres: Offre[];
  loading: boolean;
  poleName: string;
  onViewOffre?: (offre: Offre) => void;
  onDeleteOffre?: (offre: Offre) => void;
  onDownloadTDR?: (offre: Offre) => void;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  selectedModalite?: string;
  className?: string;
}

export default function PoleOffresTable({
  offres,
  loading,
  poleName,
  onViewOffre,
  onDeleteOffre,
  onDownloadTDR,
  searchTerm = '',
  sortBy = 'dateDepot',
  sortOrder = 'desc',
  onSort,
  selectedModalite = 'all',
  className = ''
}: PoleOffresTableProps) {
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);

  useEffect(() => {
    filterOffres();
  }, [offres, searchTerm, selectedModalite]);

  const filterOffres = () => {
    let filtered = [...offres];

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(offre => {
        const titre = (offre.intituleOffre || offre.titre || '').toLowerCase();
        const bailleur = (offre.bailleur || offre.client || '').toLowerCase();
        const pays = (offre.pays || []).join(' ').toLowerCase();
        return titre.includes(searchLower) || bailleur.includes(searchLower) || pays.includes(searchLower);
      });
    }

    // Filtre par modalité
    if (selectedModalite && selectedModalite !== 'all') {
      filtered = filtered.filter(offre => offre.modalite === selectedModalite);
    }

    setFilteredOffres(filtered);
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'Stratégique': return 'bg-purple-100 text-purple-800';
      case 'Priorité haute': return 'bg-red-100 text-red-800';
      case 'Opportunité intermédiaire': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModaliteColor = (modalite: string | undefined) => {
    switch (modalite) {
      case 'gagné': return 'bg-green-100 text-green-800';
      case 'déposée': return 'bg-blue-100 text-blue-800';
      case 'montée': return 'bg-yellow-100 text-yellow-800';
      case 'nouveau': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getPaysDisplay = (pays: string[] | undefined) => {
    if (!pays || pays.length === 0) return 'Non spécifié';
    return pays.join(', ');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatBudget = (budget: string | undefined) => {
    return budget ? budget.replace('€', ' €') : 'Non spécifié';
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <i className="ri-building-line text-blue-600 mr-2"></i>
              Offres du {poleName}
            </h3>
            <p className="text-gray-600 mt-1">
              {filteredOffres.length} offre{filteredOffres.length > 1 ? 's' : ''} trouvée{filteredOffres.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i className="ri-refresh-line"></i>
              Rafraîchir
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('intituleOffre')}
              >
                <div className="flex items-center gap-2">
                  <i className="ri-file-text-line"></i>
                  Intitulé Offre
                  {sortBy === 'intituleOffre' && (
                    <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <i className="ri-map-pin-line"></i>
                  Pays
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <i className="ri-money-dollar-circle-line"></i>
                  Montant
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('modalite')}
              >
                <div className="flex items-center gap-2">
                  <i className="ri-settings-3-line"></i>
                  Modalité
                  {sortBy === 'modalite' && (
                    <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('dateDepot')}
              >
                <div className="flex items-center gap-2">
                  <i className="ri-calendar-line"></i>
                  Date Dépôt
                  {sortBy === 'dateDepot' && (
                    <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <i className="ri-file-download-line"></i>
                  TDR
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <i className="ri-settings-3-line"></i>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOffres.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-inbox-line text-2xl text-blue-600"></i>
                    </div>
                    <p className="text-lg font-medium">Aucune offre trouvée</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {searchTerm ? 'Aucune offre ne correspond à votre recherche.' : `Aucune offre attribuée au ${poleName}.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOffres.map((offre) => (
                <tr key={offre.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {offre.intituleOffre || offre.titre || 'Sans titre'}
                    </div>
                    {offre.statut && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border mt-1 ${getStatusColor(offre.statut)}`}>
                        {offre.statut === 'approuvée' ? 'Approuvée' : offre.statut === 'rejetée' ? 'Rejetée' : offre.statut === 'en_attente' ? 'En attente' : 'Brouillon'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {offre.bailleur || offre.client || 'Non spécifié'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {getPaysDisplay(offre.pays)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatBudget(offre.montant || offre.budget)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {offre.priorite ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(offre.priorite)}`}>
                        {offre.priorite}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Non définie</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {offre.modalite ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getModaliteColor(offre.modalite)}`}>
                        {offre.modalite}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Non spécifiée</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(offre.dateDepot)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(offre.tdrFile || offre.lienTDR) ? (
                      <button
                        onClick={() => onDownloadTDR && onDownloadTDR(offre)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                      >
                        <i className="ri-download-line"></i>
                        Télécharger
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">Non disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {onViewOffre && (
                        <button
                          onClick={() => onViewOffre(offre)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <i className="ri-eye-line"></i>
                          Voir
                        </button>
                      )}
                      {onDeleteOffre && (
                        <button
                          onClick={() => onDeleteOffre(offre)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <i className="ri-close-line"></i>
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
