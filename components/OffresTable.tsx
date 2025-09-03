'use client';

import { useState } from 'react';
import { Offre } from '../services/api';

interface OffresTableProps {
  offres: Offre[];
  onViewOffre?: (offre: Offre) => void;
  onEditOffre?: (offre: Offre) => void;
  onDeleteOffre?: (offre: Offre) => void;
  onDownloadTDR?: (offre: Offre) => void;
  selectedOffres?: number[];
  onSelectOffre?: (id: number) => void;
  onSelectAll?: () => void;
  viewMode?: 'table' | 'cards';
  loading?: boolean;
  showActions?: boolean;
  showCheckboxes?: boolean;
  showStatus?: boolean;
  showPriority?: boolean;
  showPoleLead?: boolean;
  showMontageAdministratif?: boolean;
  customColumns?: string[];
}

export default function OffresTable({
  offres,
  onViewOffre,
  onEditOffre,
  onDeleteOffre,
  onDownloadTDR,
  selectedOffres = [],
  onSelectOffre,
  onSelectAll,
  viewMode = 'table',
  loading = false,
  showActions = true,
  showCheckboxes = false,
  showStatus = true,
  showPriority = true,
  showPoleLead = false,
  showMontageAdministratif = false,
  customColumns = []
}: OffresTableProps) {
  const [sortBy, setSortBy] = useState<string>('dateDepot');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
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

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'Priorité haute':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Stratégique':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Opportunité intermédiaire':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'haute':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normale':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'basse':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (statut: string | undefined) => {
    switch (statut) {
      case 'approuvée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejetée':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'brouillon':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDisplay = (statut: string | undefined) => {
    switch (statut) {
      case 'approuvée':
        return 'Approuvée';
      case 'rejetée':
        return 'Rejetée';
      case 'en_attente':
        return 'En attente';
      case 'brouillon':
        return 'Brouillon';
      default:
        return 'En attente';
    }
  };

  const getPaysDisplay = (pays: string[] | undefined) => {
    if (!pays || pays.length === 0) return 'Non spécifié';
    if (pays.length === 1) return pays[0];
    if (pays.length <= 2) return pays.join(', ');
    return `${pays[0]}, ${pays[1]} +${pays.length - 2}`;
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  if (offres.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12">
        <div className="text-center">
          <i className="ri-inbox-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-lg font-medium text-gray-500">Aucune offre trouvée</p>
          <p className="text-sm text-gray-400">Essayez de modifier vos filtres de recherche</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                <tr>
                  {showCheckboxes && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedOffres.length === offres.length && offres.length > 0}
                        onChange={onSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
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
                  {showPriority && (
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
                  )}
                  {showPoleLead && (
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
                  )}
                  {showMontageAdministratif && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      <i className="ri-settings-3-line mr-2"></i>
                      Montage Admin
                    </th>
                  )}
                  {showStatus && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      <i className="ri-checkbox-circle-line mr-2"></i>
                      Statut
                    </th>
                  )}
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleSort('dateDepot')}
                  >
                    <div className="flex items-center gap-2">
                      <i className="ri-calendar-line"></i>
                      Date de dépôt
                      {sortBy === 'dateDepot' && (
                        <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-line`}></i>
                      )}
                    </div>
                  </th>
                  {showActions && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      <i className="ri-settings-line mr-2"></i>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {offres.map((offre) => (
                  <tr key={offre.id} className="hover:bg-blue-50 transition-colors duration-200">
                    {showCheckboxes && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOffres.includes(offre.id)}
                          onChange={() => onSelectOffre?.(offre.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
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
                    {showPriority && (
                      <td className="px-6 py-4">
                        {offre.priorite ? (
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(offre.priorite)}`}>
                            {offre.priorite}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Aucune</span>
                        )}
                      </td>
                    )}
                    {showPoleLead && (
                      <td className="px-6 py-4">
                        {offre.poleLead ? (
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPoleColor(offre.poleLead)}`}>
                            {offre.poleLead}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Non spécifié</span>
                        )}
                      </td>
                    )}
                    {showMontageAdministratif && (
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {offre.montageAdministratif ? (
                            <span className="text-green-600 font-medium">✓ Configuré</span>
                          ) : (
                            <span className="text-gray-500">Non configuré</span>
                          )}
                        </div>
                      </td>
                    )}
                    {showStatus && (
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(offre.statut)}`}>
                          {getStatusDisplay(offre.statut)}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(offre.dateDepot || offre.dateCreation)}
                      </div>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {onDownloadTDR && (
                            <button
                              onClick={() => onDownloadTDR(offre)}
                              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                              title="Télécharger TDR"
                            >
                              <i className="ri-download-line"></i>
                            </button>
                          )}
                          {onViewOffre && (
                            <button
                              onClick={() => onViewOffre(offre)}
                              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                              title="Voir les détails"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                          )}
                          {onEditOffre && (
                            <button
                              onClick={() => onEditOffre(offre)}
                              className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
                              title="Modifier"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                          )}
                          {onDeleteOffre && (
                            <button
                              onClick={() => onDeleteOffre(offre)}
                              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                              title="Supprimer"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offres.map((offre) => (
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
                    {onDownloadTDR && (
                      <button
                        onClick={() => onDownloadTDR(offre)}
                        className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Télécharger TDR"
                      >
                        <i className="ri-download-line"></i>
                      </button>
                    )}
                    {onViewOffre && (
                      <button
                        onClick={() => onViewOffre(offre)}
                        className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors"
                        title="Voir les détails"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    )}
                    {onEditOffre && (
                      <button
                        onClick={() => onEditOffre(offre)}
                        className="bg-orange-100 text-orange-600 p-2 rounded-lg hover:bg-orange-200 transition-colors"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                    )}
                    {onDeleteOffre && (
                      <button
                        onClick={() => onDeleteOffre(offre)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {showPriority && offre.priorite && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(offre.priorite)}`}>
                      {offre.priorite}
                    </span>
                  )}
                  {showPoleLead && offre.poleLead && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPoleColor(offre.poleLead)}`}>
                      {offre.poleLead}
                    </span>
                  )}
                  {showStatus && offre.statut && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(offre.statut)}`}>
                      {getStatusDisplay(offre.statut)}
                    </span>
                  )}
                </div>

                {/* Informations */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="ri-map-pin-line text-gray-400"></i>
                    <span>{getPaysDisplay(offre.pays)}</span>
                  </div>
                  {showMontageAdministratif && (
                    <div className="flex items-center gap-2">
                      <i className="ri-settings-3-line text-gray-400"></i>
                      <span>{offre.montageAdministratif ? '✓ Configuré' : 'Non configuré'}</span>
                    </div>
                  )}
                  {offre.dateDepot && (
                    <div className="flex items-center gap-2">
                      <i className="ri-calendar-line text-gray-400"></i>
                      <span>{formatDate(offre.dateDepot || offre.dateCreation)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
