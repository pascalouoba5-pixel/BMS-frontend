'use client';

import { Offre } from '../services/api';

// Utilise l'interface Offre de l'API

interface OffreCardProps {
  offre: Offre;
  showActions?: boolean;
  onViewOffre?: (offre: Offre) => void;
  onEditOffre?: (offre: Offre) => void;
  onDeleteOffre?: (offre: Offre) => void;
  onDownloadTDR?: (offre: Offre) => void;
  showPoleInfo?: boolean;
  showModalite?: boolean;
  showPriority?: boolean;
  showBudget?: boolean;
  showDate?: boolean;
  showStatus?: boolean;
  showTDR?: boolean;
  showDescription?: boolean;
  showDetails?: boolean;
  showCommentaire?: boolean;
  showTDRCount?: boolean;
  tdrCount?: number;
  className?: string;
}

export default function OffreCard({
  offre,
  showActions = false,
  onViewOffre,
  onEditOffre,
  onDeleteOffre,
  onDownloadTDR,
  showPoleInfo = false,
  showModalite = false,
  showPriority = true,
  showBudget = true,
  showDate = true,
  showStatus = true,
  showTDR = false,
  showDescription = true,
  showDetails = true,
  showCommentaire = false,
  showTDRCount = false,
  tdrCount = 0,
  className = ''
}: OffreCardProps) {
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

  const getModaliteColor = (modalite: string | undefined) => {
    switch (modalite) {
      case 'gagné': return 'bg-green-100 text-green-800';
      case 'déposée': return 'bg-blue-100 text-blue-800';
      case 'montée': return 'bg-yellow-100 text-yellow-800';
      case 'nouveau': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatBudget = (budget: string | number | undefined) => {
    if (!budget) return 'Non spécifié';
    if (typeof budget === 'string') {
      return budget.replace('€', ' €');
    }
    return `${budget} €`;
  };

  const formatPays = (pays: string[] | string | undefined) => {
    if (!pays) return 'Non spécifié';
    if (Array.isArray(pays)) {
      return pays.join(', ');
    }
    return pays;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden ${className}`}>
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {showStatus && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offre.statut || 'en_attente')}`}>
                  <i className={`${offre.statut === 'approuvée' ? 'ri-check-line' : offre.statut === 'rejetée' ? 'ri-close-line' : 'ri-time-line'} mr-1`}></i>
                  {getStatusDisplay(offre.statut || 'en_attente')}
                </span>
              )}
              {showPriority && offre.priorite && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {offre.priorite}
                </span>
              )}
              {showModalite && (offre as any).modalite && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getModaliteColor((offre as any).modalite)}`}>
                  {(offre as any).modalite}
                </span>
              )}
              {showPoleInfo && offre.poleLead && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  <i className="ri-building-line mr-1"></i>
                  {offre.poleLead}
                </span>
              )}
              {showTDRCount && tdrCount > 0 && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  <i className="ri-file-list-3-line mr-1"></i>
                  {tdrCount} fichier{tdrCount > 1 ? 's' : ''} TDR
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
              {showDate && (
                <div className="flex items-center gap-1">
                  <i className="ri-calendar-line"></i>
                  <span>Date: {formatDate(offre.dateSoumissionValidation || offre.dateCreation || offre.dateDepot || '')}</span>
                </div>
              )}
              {offre.dateValidation && (
                <div className="flex items-center gap-1">
                  <i className="ri-check-double-line"></i>
                  <span>Validée le: {formatDate(offre.dateValidation)}</span>
                </div>
              )}
              {showPoleInfo && offre.poleAssocies && (
                <div className="flex items-center gap-1">
                  <i className="ri-team-line"></i>
                  <span>Pôle associé: {offre.poleAssocies}</span>
                </div>
              )}
            </div>
          </div>
          {showBudget && (
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {formatBudget(offre.montant || offre.budget || '')}
              </div>
              <div className="text-sm text-gray-500">Budget estimé</div>
            </div>
          )}
        </div>

        {showDescription && (
          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Description du Projet</h3>
            <p className="text-gray-600 leading-relaxed">
              {offre.objectifs || offre.description || 'Aucune description disponible'}
            </p>
          </div>
        )}

        {showDetails && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Complémentaires</h3>
              <div className="space-y-3">
                {offre.pays && offre.pays.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Pays: </span>
                    <span className="text-sm text-gray-900">{formatPays(offre.pays)}</span>
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
                {showTDR && (offre.lienTDR || offre.tdrFile) && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">TDR: </span>
                    {onDownloadTDR ? (
                      <button
                        onClick={() => onDownloadTDR(offre)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Télécharger
                      </button>
                    ) : (
                      <a 
                        href={offre.lienTDR || offre.tdrFile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Voir les TDR
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showCommentaire && offre.commentaireValidation && (
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-eye-line"></i>
                Voir les Détails
              </button>
            )}
            {onEditOffre && (
              <button
                onClick={() => onEditOffre(offre)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Modifier
              </button>
            )}
            {onDeleteOffre && (
              <button
                onClick={() => onDeleteOffre(offre)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-delete-bin-line"></i>
                Supprimer
              </button>
            )}
            {onDownloadTDR && (offre.lienTDR || offre.tdrFile) && (
              <button
                onClick={() => onDownloadTDR(offre)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-download-line"></i>
                Télécharger TDR
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
