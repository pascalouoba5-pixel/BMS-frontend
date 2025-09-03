'use client';

import React from 'react';
import Link from 'next/link';

interface Offre {
  id: number;
  intituleOffre?: string;
  titre?: string;
  commentaire?: string;
  pays?: string[];
  autrePays?: string;
  bailleur?: string;
  client?: string;
  objectifs?: string;
  description?: string;
  profilExpert?: string;
  montant?: string;
  budget?: string;
  devise?: string;
  dureeMission?: string;
  dateDepot?: string;
  dateCreation?: string;
  heureDepot?: string;
  lienTDR?: string;
  nomSite?: string;
  typeOffre?: string;
  secteur?: string;
  dateSoumissionValidation?: string;
  offreTrouveePar?: string;
  priorite?: 'Opportunité intermédiaire' | 'Priorité haute' | 'Stratégique' | '';
  priority?: 'normale' | 'haute' | 'critique';
  statut?: 'brouillon' | 'en_attente' | 'approuvée' | 'rejetée';
  commentaireValidation?: string;
  dateValidation?: string;
}

interface OffresCardsProps {
  offres: Offre[];
  onViewOffre?: (offre: Offre) => void;
  onEditOffre?: (offre: Offre) => void;
  onDeleteOffre?: (offre: Offre) => void;
  showActions?: boolean;
}

export default function OffresCards({ 
  offres, 
  onViewOffre, 
  onEditOffre, 
  onDeleteOffre,
  showActions = true 
}: OffresCardsProps) {
  // Trier les offres par date (plus récentes en premier)
  const sortedOffres = [...offres].sort((a, b) => {
    const dateA = a.dateDepot ? new Date(a.dateDepot).getTime() : 
                 a.dateCreation ? new Date(a.dateCreation).getTime() : 
                 a.dateSoumissionValidation ? new Date(a.dateSoumissionValidation).getTime() : 0;
    const dateB = b.dateDepot ? new Date(b.dateDepot).getTime() : 
                 b.dateCreation ? new Date(b.dateCreation).getTime() : 
                 b.dateSoumissionValidation ? new Date(b.dateSoumissionValidation).getTime() : 0;
    return dateB - dateA; // Tri décroissant (plus récentes en premier)
  });
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatBudget = (budget: string) => {
    return budget ? budget.replace('€', ' €') : 'Non spécifié';
  };

  return (
    <div className="grid gap-8">
      {sortedOffres.map((offre) => (
        <div key={offre.id} className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offre.statut || 'en_attente')}`}>
                    <i className={`${offre.statut === 'approuvée' ? 'ri-check-line' : offre.statut === 'rejetée' ? 'ri-close-line' : 'ri-time-line'} mr-1`}></i>
                    {getStatusDisplay(offre.statut || 'en_attente')}
                  </span>
                  {offre.priorite && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {offre.priorite}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {offre.intituleOffre || offre.titre || 'Sans titre'}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <i className="ri-building-line"></i>
                    <span>{offre.bailleur || offre.client || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-price-tag-3-line"></i>
                    <span>{offre.typeOffre || offre.secteur || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-calendar-line"></i>
                    <span>Date de création: {formatDate(offre.dateCreation || offre.dateSoumissionValidation || '')}</span>
                  </div>
                  {offre.dateValidation && (
                    <div className="flex items-center gap-1">
                      <i className="ri-check-double-line"></i>
                      <span>Validée le: {formatDate(offre.dateValidation)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formatBudget(offre.montant || offre.budget || '')}
                </div>
                <div className="text-sm text-gray-500">Budget estimé</div>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description du Projet</h3>
              <p className="text-gray-600 leading-relaxed">
                {offre.objectifs || offre.description || 'Aucune description disponible'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Complémentaires</h3>
                <div className="space-y-3">
                  {offre.pays && offre.pays.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Pays: </span>
                      <span className="text-sm text-gray-900">{offre.pays.join(', ')}</span>
                    </div>
                  )}
                  {offre.autrePays && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Autre pays: </span>
                      <span className="text-sm text-gray-900">{offre.autrePays}</span>
                    </div>
                  )}
                  {offre.dureeMission && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Durée de mission: </span>
                      <span className="text-sm text-gray-900">{offre.dureeMission}</span>
                    </div>
                  )}
                  {offre.offreTrouveePar && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Offre trouvée par: </span>
                      <span className="text-sm text-gray-900">{offre.offreTrouveePar}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails Techniques</h3>
                <div className="space-y-3">
                  {offre.profilExpert && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Profil expert: </span>
                      <span className="text-sm text-gray-900">{offre.profilExpert}</span>
                    </div>
                  )}
                  {offre.nomSite && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nom du site: </span>
                      <span className="text-sm text-gray-900">{offre.nomSite}</span>
                    </div>
                  )}
                  {offre.lienTDR && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Lien TDR: </span>
                      <a 
                        href={offre.lienTDR} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Voir les TDR
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {offre.commentaireValidation && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commentaire de Validation</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-700">{offre.commentaireValidation}</p>
                </div>
              </div>
            )}

            {showActions && (
              <div className="flex flex-col sm:flex-row gap-4">
                {onViewOffre && (
                  <button
                    onClick={() => onViewOffre(offre)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-eye-line"></i>
                    Voir les détails
                  </button>
                )}
                {onEditOffre && (
                  <button
                    onClick={() => onEditOffre(offre)}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-edit-line"></i>
                    Modifier
                  </button>
                )}
                {onDeleteOffre && (
                  <button
                    onClick={() => onDeleteOffre(offre)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-delete-bin-line"></i>
                    Supprimer
                  </button>
                )}
                <Link 
                  href="/valider-offre" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <i className="ri-check-line"></i>
                  Valider cette offre
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
