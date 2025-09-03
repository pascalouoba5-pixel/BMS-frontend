
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SuperAdminGuard } from '../../components/AuthGuard';
import HomeButton from '../../components/HomeButton';
import AlertBanner from '../../components/AlertBanner';
import Layout from '../../components/Layout';

interface Offre {
  id: number;
  intituleOffre: string;
  commentaire?: string;
  pays: string[];
  autrePays?: string;
  bailleur: string;
  objectifs: string;
  profilExpert?: string;
  montant: string;
  devise: string;
  dureeMission?: string;
  dateDepot: string;
  heureDepot: string;
  lienTDR?: string;
  nomSite?: string;
  typeOffre: string;
  dateSoumissionValidation: string;
  offreTrouveePar: string;
  statut?: 'en_attente' | 'approuvée' | 'rejetée';
  commentaireValidation?: string;
  dateValidation?: string;
  priorite?: 'Offre stratégique' | 'Offre classique' | '';
}

export default function ValiderOffre() {
  return (
    <SuperAdminGuard>
      <Layout>
        <ValiderOffreContent />
      </Layout>
    </SuperAdminGuard>
  );
}

function ValiderOffreContent() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [validationAction, setValidationAction] = useState<'approve' | 'reject' | null>(null);
  const [commentaire, setCommentaire] = useState('');
  const [filterStatut, setFilterStatut] = useState<'all' | 'en_attente' | 'approuvée' | 'rejetée'>('all');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour la modification des avis
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOffre, setEditingOffre] = useState<Offre | null>(null);
  const [editCommentaire, setEditCommentaire] = useState('');
  const [editStatut, setEditStatut] = useState<'approuvée' | 'rejetée' | 'en_attente'>('en_attente');
  const [editPriorite, setEditPriorite] = useState<'Offre stratégique' | 'Offre classique' | ''>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadOffres();
      // Mise à jour automatique toutes les 30 secondes
      const interval = setInterval(loadOffres, 30 * 1000);
      
      // Écouteur d'événements pour détecter les changements dans localStorage
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'offres') {
          loadOffres();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isClient]);

  const loadOffres = () => {
    if (!isClient) return;
    
    setIsLoading(true);
    try {
      const allOffres = JSON.parse(localStorage.getItem('offres') || '[]');
      // Charger uniquement les offres soumises pour validation aujourd'hui
      const today = new Date().toISOString().slice(0, 10);
      const offresDuJour = allOffres.filter((offre: Offre) => {
        return isOffreDuJour(offre, today);
      });
      setOffres(offresDuJour);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction utilitaire pour déterminer si une offre a été soumise pour validation aujourd'hui
  const isOffreDuJour = (offre: Offre, today: string): boolean => {
    // Vérifier uniquement la dateSoumissionValidation (date de soumission pour validation)
    if (offre.dateSoumissionValidation) {
      try {
        const submissionDate = new Date(offre.dateSoumissionValidation);
        const submissionDateString = submissionDate.toISOString().slice(0, 10);
        return submissionDateString === today;
      } catch (error) {
        console.error('Erreur lors du parsing de la date:', error);
        return false;
      }
    }
    return false;
  };

  const handleValidation = () => {
    if (!selectedOffre || !validationAction) return;

    const updatedOffres = offres.map(offre => {
      if (offre.id === selectedOffre.id) {
        return {
          ...offre,
          statut: (validationAction === 'approve' ? 'approuvée' : 'rejetée') as 'en_attente' | 'approuvée' | 'rejetée',
          commentaireValidation: commentaire,
          dateValidation: new Date().toISOString()
        };
      }
      return offre;
    });

    // Mettre à jour le localStorage
    const allOffres = JSON.parse(localStorage.getItem('offres') || '[]');
    const updatedAllOffres = allOffres.map((offre: Offre) => {
      if (offre.id === selectedOffre.id) {
        return {
          ...offre,
          statut: (validationAction === 'approve' ? 'approuvée' : 'rejetée') as 'en_attente' | 'approuvée' | 'rejetée',
          commentaireValidation: commentaire,
          dateValidation: new Date().toISOString()
        };
      }
      return offre;
    });

    localStorage.setItem('offres', JSON.stringify(updatedAllOffres));
    setOffres(updatedOffres);
    setShowModal(false);
    setSelectedOffre(null);
    setCommentaire('');
    setValidationAction(null);
  };

  const handleEditAvis = (offre: Offre) => {
    setEditingOffre(offre);
    setEditCommentaire(offre.commentaireValidation || '');
    setEditStatut(offre.statut || 'en_attente');
    setEditPriorite(offre.priorite || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingOffre) return;

    const updatedOffres = offres.map(offre => {
      if (offre.id === editingOffre.id) {
        return {
          ...offre,
          statut: editStatut,
          commentaireValidation: editCommentaire,
          priorite: editPriorite,
          dateValidation: new Date().toISOString()
        };
      }
      return offre;
    });

    // Mettre à jour le localStorage
    const allOffres = JSON.parse(localStorage.getItem('offres') || '[]');
    const updatedAllOffres = allOffres.map((offre: Offre) => {
      if (offre.id === editingOffre.id) {
        return {
          ...offre,
          statut: editStatut,
          commentaireValidation: editCommentaire,
          priorite: editPriorite,
          dateValidation: new Date().toISOString()
        };
      }
      return offre;
    });

    localStorage.setItem('offres', JSON.stringify(updatedAllOffres));
    setOffres(updatedOffres);
    setShowEditModal(false);
    setEditingOffre(null);
    setEditCommentaire('');
    setEditStatut('en_attente');
    setEditPriorite('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Offre stratégique': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Offre classique': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'approuvée': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejetée': return 'bg-red-100 text-red-800 border-red-200';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'approuvée': return 'ri-check-line';
      case 'rejetée': return 'ri-close-line';
      case 'en_attente': return 'ri-time-line';
      default: return 'ri-time-line';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  // Trier les offres par date de soumission (plus récentes en premier)
  const sortedOffres = [...offres].sort((a, b) => {
    const dateA = a.dateSoumissionValidation ? new Date(a.dateSoumissionValidation).getTime() : 0;
    const dateB = b.dateSoumissionValidation ? new Date(b.dateSoumissionValidation).getTime() : 0;
    return dateB - dateA; // Tri décroissant (plus récentes en premier)
  });

  const filteredOffres = sortedOffres.filter(offre => {
    if (filterStatut === 'all') return true;
    return offre.statut === filterStatut;
  });

  // Composant pour la vue cartes
  const CardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredOffres.length === 0 ? (
        <div className="col-span-full bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-inbox-line text-2xl text-blue-600"></i>
          </div>
          <p className="text-lg font-medium text-gray-900">Aucune offre à valider</p>
          <p className="text-sm text-gray-600 mt-2">
            Il n'y a actuellement aucune offre soumise pour validation aujourd'hui.
          </p>
        </div>
      ) : (
        filteredOffres.map((offre) => (
          <div key={offre.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* En-tête de la carte */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {offre.intituleOffre}
                </h3>
                {offre.statut && (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatutColor(offre.statut)}`}>
                    <i className={`${getStatutIcon(offre.statut)} mr-1`}></i>
                    {offre.statut === 'approuvée' ? 'Approuvée' : offre.statut === 'rejetée' ? 'Rejetée' : 'En attente'}
                  </span>
                )}
              </div>
            </div>

            {/* Informations principales */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bailleur</label>
                <p className="text-sm text-gray-900 font-medium">
                  {offre.bailleur}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</label>
                <p className="text-sm text-gray-900">
                  {offre.pays?.join(', ') || 'Pays non spécifiés'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date de soumission</label>
                <p className="text-sm text-gray-900">
                  {formatDate(offre.dateSoumissionValidation)}
                </p>
              </div>
              {offre.priorite && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(offre.priorite)}`}>
                    {offre.priorite}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedOffre(offre);
                  setValidationAction('approve');
                  setShowModal(true);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                disabled={offre.statut === 'approuvée'}
              >
                <i className="ri-check-line"></i>
                Approuver
              </button>
              <button
                onClick={() => {
                  setSelectedOffre(offre);
                  setValidationAction('reject');
                  setShowModal(true);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                disabled={offre.statut === 'rejetée'}
              >
                <i className="ri-close-line"></i>
                Rejeter
              </button>
              <button
                onClick={() => handleEditAvis(offre)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <i className="ri-edit-line"></i>
                Modifier
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <AlertBanner />
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <HomeButton />
              <h1 className="text-2xl font-bold text-gray-900">Validation des Offres</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres et Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value as 'all' | 'en_attente' | 'approuvée' | 'rejetée')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="approuvée">Approuvées</option>
                  <option value="rejetée">Rejetées</option>
                </select>
              </div>
            </div>
            
            {/* Sélecteur de vue */}
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
        </div>

        {/* Affichage conditionnel Tableau/Cartes */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des offres...</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            {filteredOffres.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-inbox-line text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune offre à valider</h3>
                <p className="text-gray-600">Il n'y a actuellement aucune offre soumise pour validation aujourd'hui.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Offre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Bailleur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Date de soumission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOffres.map((offre) => (
                      <tr key={offre.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {offre.intituleOffre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {offre.pays?.join(', ') || 'Pays non spécifiés'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{offre.bailleur}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(offre.dateSoumissionValidation)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatutColor(offre.statut || 'en_attente')}`}>
                            <i className={`${getStatutIcon(offre.statut || 'en_attente')} mr-1`}></i>
                            {offre.statut === 'approuvée' ? 'Approuvée' : offre.statut === 'rejetée' ? 'Rejetée' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedOffre(offre);
                                setValidationAction('approve');
                                setShowModal(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              disabled={offre.statut === 'approuvée'}
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOffre(offre);
                                setValidationAction('reject');
                                setShowModal(true);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              disabled={offre.statut === 'rejetée'}
                            >
                              Rejeter
                            </button>
                            <button
                              onClick={() => handleEditAvis(offre)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              Modifier
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            {/* Header pour la vue cartes */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <i className="ri-check-line text-blue-600 mr-2"></i>
                    Validation des Offres
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {filteredOffres.length} offre{filteredOffres.length > 1 ? 's' : ''} à valider
                  </p>
                </div>
              </div>
            </div>
            {/* Contenu des cartes */}
            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-2xl p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <CardsView />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de validation */}
      {showModal && selectedOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {validationAction === 'approve' ? 'Approuver' : 'Rejeter'} l'offre
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {selectedOffre.intituleOffre}
              </p>
              <p className="text-gray-600 text-sm">
                {validationAction === 'approve' 
                  ? 'Cette offre sera marquée comme approuvée et pourra être traitée.'
                  : 'Cette offre sera marquée comme rejetée.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Ajoutez un commentaire..."
                />
                <p className="text-xs text-gray-500 mt-1">{commentaire.length}/500 caractères</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleValidation}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  validationAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {validationAction === 'approve' ? 'Approuver' : 'Rejeter'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOffre(null);
                  setCommentaire('');
                  setValidationAction(null);
                }}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Modification des Avis */}
      {showEditModal && editingOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-edit-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Modifier l'avis
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {editingOffre.intituleOffre}
              </p>
              <p className="text-gray-600 text-sm">
                Modifiez le statut, le commentaire et la priorité de cette offre
              </p>
            </div>

            <div className="space-y-6">
              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={editStatut}
                  onChange={(e) => setEditStatut(e.target.value as 'approuvée' | 'rejetée' | 'en_attente')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="en_attente">En attente</option>
                  <option value="approuvée">Approuvée</option>
                  <option value="rejetée">Rejetée</option>
                </select>
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={editCommentaire}
                  onChange={(e) => setEditCommentaire(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Ajoutez un commentaire..."
                />
                <p className="text-xs text-gray-500 mt-1">{editCommentaire.length}/500 caractères</p>
              </div>

              {/* Priorité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité (optionnel)
                </label>
                <select
                  value={editPriorite}
                  onChange={(e) => setEditPriorite(e.target.value as 'Offre stratégique' | 'Offre classique' | '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Aucune priorité</option>
                  <option value="Offre stratégique">Offre stratégique</option>
                  <option value="Offre classique">Offre classique</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingOffre(null);
                  setEditCommentaire('');
                  setEditStatut('en_attente');
                  setEditPriorite('');
                }}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
