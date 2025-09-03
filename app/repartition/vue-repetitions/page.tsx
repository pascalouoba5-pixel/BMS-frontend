'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGlobalFilters, PoleType } from '../../../hooks/useGlobalFilters';
import HomeButton from '../../../components/HomeButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Layout from '../../../components/Layout';
import OffreCard from '../../../components/OffreCard';
import { Offre } from '../../../services/api';
import { offresAPI } from '@/services/api';

export default function VueRepetitions() {
  return (
    <ProtectedRoute pageName="vue-repetitions">
      <Layout>
        <VueRepetitionsContent />
      </Layout>
    </ProtectedRoute>
  );
}

function VueRepetitionsContent() {
  const { selectedPoleLead, selectedPoleAssocies, updateGlobalFilters, POLE_OPTIONS } = useGlobalFilters();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPays, setSelectedPays] = useState<string>('');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('');
  const [selectedStatut, setSelectedStatut] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dateDepot');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    filterAndSortOffres();
  }, [offres, searchTerm, selectedPays, selectedPriorite, selectedStatut, selectedPoleLead, selectedPoleAssocies, sortBy, sortOrder]);

  const fetchOffres = async () => {
    setLoading(true);
    try {
      // Récupérer les offres depuis l'API backend
      const response = await offresAPI.getAll();
      
      if (response.success && response.data) {
        setOffres(response.data);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des offres');
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
      filtered = filtered.filter(offre => 
        offre.intituleOffre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.bailleur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.objectifs?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.offreTrouveePar?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par pays
    if (selectedPays) {
      filtered = filtered.filter(offre => 
        offre.pays?.includes(selectedPays)
      );
    }

    // Filtre par priorité
    if (selectedPriorite) {
      filtered = filtered.filter(offre => offre.priorite === selectedPriorite);
    }

    // Filtre par statut
    if (selectedStatut) {
      filtered = filtered.filter(offre => offre.statut === selectedStatut);
    }

    // Filtre par pôle LEAD
    if (selectedPoleLead) {
      filtered = filtered.filter(offre => offre.poleLead === selectedPoleLead);
    }

    // Filtre par pôle ASSOCIÉS
    if (selectedPoleAssocies) {
      filtered = filtered.filter(offre => offre.poleAssocies === selectedPoleAssocies);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Offre];
      let bValue: any = b[sortBy as keyof Offre];

      if (sortBy === 'montant' || sortBy === 'budget') {
        aValue = parseFloat(String(aValue || '0').replace(/[^\d]/g, ''));
        bValue = parseFloat(String(bValue || '0').replace(/[^\d]/g, ''));
      }

      if (sortOrder === 'asc') {
        return (aValue || 0) > (bValue || 0) ? 1 : -1;
      } else {
        return (aValue || 0) < (bValue || 0) ? 1 : -1;
      }
    });

    setFilteredOffres(filtered);
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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getOffresNonAttribuees = () => {
    return offres.filter(offre => !offre.poleLead).length;
  };

  const getOffresParPole = () => {
    const stats: { [key: string]: number } = {};
    POLE_OPTIONS.forEach(pole => {
      stats[pole] = offres.filter(offre => offre.poleLead === pole).length;
    });
    return stats;
  };

  // Handler functions for OffreCard actions
  const handleViewOffre = (offre: Offre) => {
    console.log('View Offre:', offre);
    // Placeholder for viewing offer details
  };

  const handleEditOffre = (offre: Offre) => {
    console.log('Edit Offre:', offre);
    // Placeholder for editing offer
  };

  const handleDeleteOffre = (offre: Offre) => {
    console.log('Delete Offre:', offre);
    // Placeholder for deleting offer
  };

  const downloadTDR = (offre: Offre) => {
    console.log('Download TDR for Offre:', offre);
    if (offre.lienTDR) {
      window.open(offre.lienTDR, '_blank');
    } else if (offre.tdrFile) {
      alert('Téléchargement du TDR non implémenté pour les fichiers locaux.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des répartitions...</p>
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
              <i className="ri-table-line text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Vue des Répartitions</h1>
            <p className="text-xl opacity-90 mb-6">Tableau complet des répartitions d'offres par pôle</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">Attribuées</p>
                <p className="text-2xl font-bold text-gray-900">{offres.length - getOffresNonAttribuees()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 text-white p-3 rounded-lg">
                <i className="ri-filter-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Affichées</p>
                <p className="text-2xl font-bold text-gray-900">{filteredOffres.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Répartition par pôle */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Pôle LEAD</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {POLE_OPTIONS.map((pole) => {
              const count = getOffresParPole()[pole] || 0;
              return (
                <div key={pole} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">{pole}</div>
                  <div className="text-xl font-bold text-blue-600">{count}</div>
                </div>
              );
            })}
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

          {/* Autres filtres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
              <select
                value={selectedPays}
                onChange={(e) => setSelectedPays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les pays</option>
                {Array.from(new Set(offres.flatMap(offre => offre.pays || []))).sort().map((pays, index) => (
                  <option key={index} value={pays}>{pays}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <select
                value={selectedPriorite}
                onChange={(e) => setSelectedPriorite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les priorités</option>
                <option value="Opportunité intermédiaire">Opportunité intermédiaire</option>
                <option value="Priorité haute">Priorité haute</option>
                <option value="Stratégique">Stratégique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="en_attente">En attente</option>
                <option value="approuvée">Approuvée</option>
                <option value="rejetée">Rejetée</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des répartitions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intitulé Offre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bailleur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pays
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pôle LEAD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pôle ASSOCIÉS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trouvé par
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Dépôt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOffres.map((offre) => (
                  <tr key={offre.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {offre.intituleOffre || offre.titre || 'Sans titre'}
                      </div>
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        offre.priorite === 'Priorité haute' ? 'bg-red-100 text-red-800' :
                        offre.priorite === 'Stratégique' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {offre.priorite || 'Non définie'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(offre.statut || 'en_attente')}`}>
                        {getStatusDisplay(offre.statut || 'en_attente')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {offre.poleLead || (
                          <span className="text-red-600 font-medium">Non attribué</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {offre.poleAssocies || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {offre.offreTrouveePar || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(offre.dateDepot || offre.dateSoumissionValidation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/repartition/pole-lead/${offre.poleLead || 'non-attribue'}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <i className="ri-eye-line"></i>
                        </Link>
                        <Link
                          href={`/valider-offre?id=${offre.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <i className="ri-edit-line"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Affichage des répartitions avec le style "offre du jour" */}
        <div className="mt-8">
          <div className="grid gap-8">
            {filteredOffres.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-inbox-line text-2xl text-blue-600"></i>
                </div>
                <p className="text-lg font-medium text-gray-900">Aucune offre trouvée</p>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedPoleLead || selectedPoleAssocies || selectedPriorite || selectedStatut ? 'Aucune offre ne correspond aux filtres sélectionnés.' : 'Aucune offre disponible.'}
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
        </div>

        {/* Résumé */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Pôle LEAD sélectionné:</span>
              <span className="ml-2 text-gray-900">{selectedPoleLead || 'Tous'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Pôle ASSOCIÉS sélectionné:</span>
              <span className="ml-2 text-gray-900">{selectedPoleAssocies || 'Tous'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Offres affichées:</span>
              <span className="ml-2 text-gray-900">{filteredOffres.length} sur {offres.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
