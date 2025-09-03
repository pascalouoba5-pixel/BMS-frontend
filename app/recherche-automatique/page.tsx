'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import ScheduledSearchConfig from '../../components/ScheduledSearchConfig';
import { apiCall, scheduledSearchesAPI } from '../../services/api';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  date: string;
  similarity_score?: number;
  validation_count?: number;
}

interface ScheduledSearch {
  id: string;
  keywords: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  period?: string;
  custom_schedule?: string;
  last_run: string | null;
  next_run: string | null;
  is_active: boolean;
}

interface CustomSchedule {
  weekDays?: number[];
  hours?: number[];
  intervalHours?: number;
  monthDays?: number[];
}

export default function RechercheAutomatique() {
  const [keywords, setKeywords] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scheduledSearches, setScheduledSearches] = useState<ScheduledSearch[]>([]);
  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'scheduled' | 'recommendations' | 'history'>('search');
  const [user, setUser] = useState<any>(null);
  const [newScheduledSearch, setNewScheduledSearch] = useState({
    keywords: '',
    frequency: 'daily' as 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom',
    period: 'all' as 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom',
    customSchedule: null as CustomSchedule | null
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingSearch, setEditingSearch] = useState<ScheduledSearch | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Effectuer une recherche
  const handleSearch = async () => {
    if (!keywords.trim()) return;

    setIsSearching(true);
    try {
      const response = await apiCall('/api/auto-search', {
        method: 'POST',
        body: JSON.stringify({ 
          keywords: keywords.trim(),
          maxResults: 100
        })
      });

      if (response.success) {
        setSearchResults(response.results);
        console.log(`🔍 Recherche terminée: ${response.results.length} résultats trouvés sur ${response.sites_searched.length} sites`);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Valider une offre
  const handleValidateOffer = async (offerId: string, status: string = 'en_cours') => {
    if (!user?.id) return;

    try {
      await apiCall(`/api/validate/${offerId}`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, status })
      });

      // Mettre à jour la liste des résultats
      setSearchResults(prev => 
        prev.map(result => 
          result.id === offerId 
            ? { ...result, validation_count: (result.validation_count || 0) + 1 }
            : result
        )
      );

      // Mettre à jour les recommandations
      loadRecommendations();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  // Charger les recommandations
  const loadRecommendations = async () => {
    if (!user?.id) return;

    try {
      const response = await apiCall(`/api/recommend?userId=${user.id}&limit=10`);
      if (response.success) {
        setRecommendations(response.recommendations);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
    }
  };

  // Charger les recherches programmées
  const loadScheduledSearches = async () => {
    if (!user?.id) return;

    try {
      const response = await scheduledSearchesAPI.getAll(user.id);
      if (response.success) {
        setScheduledSearches(response.searches);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recherches programmées:', error);
    }
  };

  // Ajouter une recherche programmée
  const handleAddScheduledSearch = async () => {
    if (!user?.id) return;

    try {
      await scheduledSearchesAPI.create({
        userId: user.id,
        keywords: newScheduledSearch.keywords.trim(),
        frequency: newScheduledSearch.frequency,
        customSchedule: newScheduledSearch.customSchedule
      });

      setNewScheduledSearch({ keywords: '', frequency: 'daily', period: 'all', customSchedule: null });
      loadScheduledSearches();
      setShowConfigModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la recherche programmée:', error);
    }
  };

  // Mettre à jour une recherche programmée
  const handleUpdateScheduledSearch = async () => {
    if (!user?.id || !editingSearch) return;

    try {
      await scheduledSearchesAPI.update({
        userId: user.id,
        keywords: editingSearch.keywords,
        frequency: editingSearch.frequency,
        customSchedule: editingSearch.custom_schedule ? JSON.parse(editingSearch.custom_schedule) : null,
        isActive: editingSearch.is_active
      });

      setEditingSearch(null);
      loadScheduledSearches();
      setShowConfigModal(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Supprimer une recherche programmée
  const handleRemoveScheduledSearch = async (keywords: string) => {
    if (!user?.id) return;

    try {
      await scheduledSearchesAPI.delete({ userId: user.id, keywords });

      loadScheduledSearches();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Activer/Désactiver une recherche programmée
  const handleToggleScheduledSearch = async (search: ScheduledSearch) => {
    if (!user?.id) return;

    try {
      await scheduledSearchesAPI.update({
        userId: user.id,
        keywords: search.keywords,
        frequency: search.frequency,
        customSchedule: search.custom_schedule ? JSON.parse(search.custom_schedule) : null,
        isActive: !search.is_active
      });

      loadScheduledSearches();
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
    }
  };

  // Ouvrir le modal de configuration pour édition
  const handleEditSearch = (search: ScheduledSearch) => {
    setEditingSearch(search);
    setNewScheduledSearch({
      keywords: search.keywords,
      frequency: search.frequency,
      period: (search.period as 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom') || 'all',
      customSchedule: search.custom_schedule ? JSON.parse(search.custom_schedule) : null
    });
    setShowConfigModal(true);
  };

  // Ouvrir le modal de configuration pour nouvelle recherche
  const handleNewScheduledSearch = () => {
    setEditingSearch(null);
    setNewScheduledSearch({ keywords: '', frequency: 'daily', period: 'all', customSchedule: null });
    setShowConfigModal(true);
  };

  // Fermer le modal de configuration
  const handleCloseConfigModal = () => {
    setShowConfigModal(false);
    setEditingSearch(null);
    setNewScheduledSearch({ keywords: '', frequency: 'daily', period: 'all', customSchedule: null });
  };

  // Sauvegarder la configuration
  const handleSaveConfig = () => {
    // Validation côté client
    if (!newScheduledSearch.keywords.trim()) {
      alert('Veuillez saisir des mots-clés pour la recherche programmée.');
      return;
    }

    if (editingSearch) {
      handleUpdateScheduledSearch();
    } else {
      handleAddScheduledSearch();
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadRecommendations();
      loadScheduledSearches();
    }
  }, [user]);

  return (
    <ProtectedRoute pageName="recherche-automatique">
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Recherche Automatique d'Opportunités
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Recherchez automatiquement des appels d'offres, avis généraux et accords-cadres
            </p>
          </div>

          {/* Onglets */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'search', label: 'Recherche', icon: '🔍' },
                { id: 'scheduled', label: 'Recherches Programmées', icon: '⏰' },
                { id: 'recommendations', label: 'Recommandations', icon: '💡' },
                { id: 'history', label: 'Historique', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-8">
            {/* Onglet Recherche */}
            {activeTab === 'search' && (
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Nouvelle Recherche</h2>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Entrez vos mots-clés (ex: développement informatique, formation, consultation...)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isSearching || !keywords.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSearching ? 'Recherche...' : 'Rechercher'}
                    </button>
                  </div>
                </div>

                                 {/* Informations sur les sites de publication */}
                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                   <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                     🌐 Sites de Publication des Offres
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                       <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🏛️ BOAMP</h4>
                       <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                         Bulletin Officiel des Annonces de Marchés Publics
                       </p>
                       <a 
                         href="https://www.boamp.fr" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                       >
                         Visiter le site →
                       </a>
                     </div>
                     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                       <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">⚖️ Legifrance</h4>
                       <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                         Journal Officiel et consultations publiques
                       </p>
                       <a 
                         href="https://www.legifrance.gouv.fr" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-xs text-green-600 dark:text-green-400 hover:underline"
                       >
                         Visiter le site →
                       </a>
                     </div>
                     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                       <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🇪🇺 European Tenders</h4>
                       <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                         Appels d'offres européens
                       </p>
                       <a 
                         href="https://www.european-tenders.com" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                       >
                         Visiter le site →
                       </a>
                     </div>
                                           <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                        <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">🌍 J360</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                          Plateforme d'opportunités internationales
                        </p>
                        <a 
                          href="https://www.j360.info" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          Visiter le site →
                        </a>
                      </div>
                     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                       <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">🌍 DevelopmentAid</h4>
                       <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                         Opportunités de développement international et projets
                       </p>
                       <a 
                         href="https://www.developmentaid.org/tenders/search" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                       >
                         Visiter le site →
                       </a>
                     </div>
                     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-teal-200 dark:border-teal-700">
                       <h4 className="font-medium text-teal-900 dark:text-teal-100 mb-2">📊 BM</h4>
                       <p className="text-sm text-teal-700 dark:text-teal-300 mb-2">
                         Banque Mondiale - Appels d'offres
                       </p>
                       <a 
                         href="https://www.worldbank.org" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                       >
                         Visiter le site →
                       </a>
                     </div>
                     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                       <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">🆘 ReliefWeb</h4>
                       <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                         Opportunités humanitaires et d'urgence
                       </p>
                       <a 
                         href="https://reliefweb.int" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-xs text-red-600 dark:text-red-400 hover:underline"
                       >
                         Visiter le site →
                       </a>
                     </div>
                     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                       <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">🤝 Coordination Sud</h4>
                       <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                         Réseau des ONG françaises
                       </p>
                       <a 
                         href="https://www.coordinationsud.org" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
                       >
                         Visiter le site →
                       </a>
                     </div>
                   </div>
                 </div>

                {/* Résultats de recherche */}
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Résultats ({searchResults.length})
                    </h3>
                    <div className="grid gap-4">
                      {searchResults.map((result) => (
                        <SearchResultCard
                          key={result.id}
                          result={result}
                          onValidate={handleValidateOffer}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  keywords.trim() && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                      <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Aucun résultat trouvé
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Aucune offre ne correspond à vos critères de recherche.
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>💡 Conseils de recherche :</p>
                        <ul className="mt-2 space-y-1">
                          <li>• Essayez des mots-clés plus généraux</li>
                          <li>• Vérifiez l'orthographe</li>
                          <li>• Utilisez des synonymes</li>
                        </ul>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Onglet Recherches Programmées */}
            {activeTab === 'scheduled' && (
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recherches Programmées</h2>
                    <button
                      onClick={handleNewScheduledSearch}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <span className="mr-2">➕</span>
                      Nouvelle Recherche
                    </button>
                  </div>
                  
                                     {/* Formulaire rapide */}
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                     <input
                       type="text"
                       value={newScheduledSearch.keywords}
                       onChange={(e) => setNewScheduledSearch(prev => ({ ...prev, keywords: e.target.value }))}
                       placeholder="Mots-clés"
                       className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     />
                     <select
                       value={newScheduledSearch.frequency}
                       onChange={(e) => setNewScheduledSearch(prev => ({ ...prev, frequency: e.target.value as any }))}
                       className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     >
                       <option value="hourly">Toutes les heures</option>
                       <option value="daily">Quotidienne</option>
                       <option value="weekly">Hebdomadaire</option>
                       <option value="monthly">Mensuelle</option>
                       <option value="custom">Personnalisée</option>
                     </select>
                     <select
                       value={newScheduledSearch.period}
                       onChange={(e) => setNewScheduledSearch(prev => ({ ...prev, period: e.target.value as any }))}
                       className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     >
                       <option value="all">Toutes les périodes</option>
                       <option value="today">Aujourd'hui</option>
                       <option value="week">Cette semaine</option>
                       <option value="month">Ce mois</option>
                       <option value="quarter">Ce trimestre</option>
                       <option value="year">Cette année</option>
                       <option value="custom">Période personnalisée</option>
                     </select>
                     <button
                       onClick={handleAddScheduledSearch}
                       disabled={!newScheduledSearch.keywords.trim()}
                       className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     >
                       Ajouter
                     </button>
                   </div>
                </div>

                {/* Liste des recherches programmées */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recherches Programmées Actives</h3>
                  <div className="grid gap-4">
                    {scheduledSearches.length > 0 ? (
                      scheduledSearches.map((search) => (
                        <div key={search.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-lg">{search.keywords}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  search.is_active 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                }`}>
                                  {search.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                 <div>
                                   <p className="text-gray-600 dark:text-gray-400">
                                     <span className="font-medium">Fréquence:</span> {
                                       search.frequency === 'hourly' ? 'Toutes les heures' :
                                       search.frequency === 'daily' ? 'Quotidienne' :
                                       search.frequency === 'weekly' ? 'Hebdomadaire' :
                                       search.frequency === 'monthly' ? 'Mensuelle' :
                                       'Personnalisée'
                                     }
                                   </p>
                                   <p className="text-gray-600 dark:text-gray-400">
                                     <span className="font-medium">Période:</span> {
                                       search.period === 'all' ? 'Toutes les périodes' :
                                       search.period === 'today' ? 'Aujourd\'hui' :
                                       search.period === 'week' ? 'Cette semaine' :
                                       search.period === 'month' ? 'Ce mois' :
                                       search.period === 'quarter' ? 'Ce trimestre' :
                                       search.period === 'year' ? 'Cette année' :
                                       search.period === 'custom' ? 'Période personnalisée' :
                                       'Toutes les périodes'
                                     }
                                   </p>
                                   {search.custom_schedule && (
                                     <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                                       Planning personnalisé configuré
                                     </p>
                                   )}
                                 </div>
                                
                                <div>
                                  {search.last_run && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">Dernière exécution:</span><br/>
                                      {new Date(search.last_run).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  )}
                                  {search.next_run && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">Prochaine exécution:</span><br/>
                                      {new Date(search.next_run).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <button
                                onClick={() => handleEditSearch(search)}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                ✏️ Modifier
                              </button>
                              <button
                                onClick={() => handleToggleScheduledSearch(search)}
                                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                                  search.is_active
                                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {search.is_active ? '⏸️ Pause' : '▶️ Activer'}
                              </button>
                              <button
                                onClick={() => handleRemoveScheduledSearch(search.keywords)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                🗑️ Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                        <div className="text-gray-400 dark:text-gray-500 mb-4">
                          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Aucune recherche programmée
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Créez votre première recherche programmée pour automatiser la veille d'opportunités.
                        </p>
                        <button
                          onClick={handleNewScheduledSearch}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Créer une recherche programmée
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Recommandations */}
            {activeTab === 'recommendations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Recommandations Personnalisées</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Offres recommandées basées sur vos validations précédentes
                    </p>
                  </div>
                  <button
                    onClick={loadRecommendations}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔄 Actualiser
                  </button>
                </div>
                
                {recommendations.length > 0 ? (
                  <div className="grid gap-4">
                    {recommendations.map((result) => (
                      <SearchResultCard
                        key={result.id}
                        result={result}
                        onValidate={handleValidateOffer}
                        showSimilarity={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucune recommandation disponible
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Commencez par valider quelques offres pour recevoir des recommandations personnalisées.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Historique */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Historique des Recherches</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    L'historique détaillé de vos recherches sera bientôt disponible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de configuration des recherches programmées */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingSearch ? 'Modifier la Recherche Programmée' : 'Nouvelle Recherche Programmée'}
                  </h2>
                  <button
                    onClick={handleCloseConfigModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Formulaire de mots-clés */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mots-clés de recherche
                  </label>
                  <input
                    type="text"
                    value={newScheduledSearch.keywords}
                    onChange={(e) => setNewScheduledSearch(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="Ex: construction, informatique, services..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Décrivez précisément les opportunités que vous recherchez
                  </p>
                </div>

                                 {/* Configuration de la planification */}
                 <ScheduledSearchConfig
                   keywords={newScheduledSearch.keywords}
                   frequency={newScheduledSearch.frequency}
                   customSchedule={newScheduledSearch.customSchedule}
                   period={newScheduledSearch.period}
                   onFrequencyChange={(frequency) => setNewScheduledSearch(prev => ({ ...prev, frequency: frequency as any }))}
                   onCustomScheduleChange={(schedule) => setNewScheduledSearch(prev => ({ ...prev, customSchedule: schedule }))}
                   onPeriodChange={(period) => setNewScheduledSearch(prev => ({ ...prev, period: period as any }))}
                   onSave={handleSaveConfig}
                   onCancel={handleCloseConfigModal}
                 />
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

// Composant pour afficher un résultat de recherche
function SearchResultCard({ 
  result, 
  onValidate, 
  showSimilarity = false 
}: { 
  result: SearchResult; 
  onValidate: (id: string, status?: string) => void;
  showSimilarity?: boolean;
}) {
  const [showActions, setShowActions] = useState(false);

     // Fonction pour obtenir l'icône et la couleur selon la source
   const getSourceInfo = (source: string) => {
     const sourceMap: { [key: string]: { icon: string; color: string; name: string } } = {
       'BOAMP': { icon: '🏛️', color: 'bg-blue-100 text-blue-800', name: 'BOAMP - Bulletin Officiel des Annonces de Marchés Publics' },
       'Legifrance': { icon: '⚖️', color: 'bg-green-100 text-green-800', name: 'Legifrance - Journal Officiel' },
       'European Tenders': { icon: '🇪🇺', color: 'bg-purple-100 text-purple-800', name: 'European Tenders' },
       'J360': { icon: '🌍', color: 'bg-orange-100 text-orange-800', name: 'J360 - Plateforme d\'opportunités internationales' },
       'DevelopmentAid': { icon: '🌍', color: 'bg-indigo-100 text-indigo-800', name: 'DevelopmentAid - Opportunités de développement international' },
       'BM': { icon: '📊', color: 'bg-teal-100 text-teal-800', name: 'Banque Mondiale - Appels d\'offres' },
       'ReliefWeb': { icon: '🆘', color: 'bg-red-100 text-red-800', name: 'ReliefWeb - Opportunités humanitaires' },
       'Coordination Sud': { icon: '🤝', color: 'bg-yellow-100 text-yellow-800', name: 'Coordination Sud - Réseau des ONG françaises' },
       'Innovation France': { icon: '🚀', color: 'bg-orange-100 text-orange-800', name: 'Innovation France' },
       'Consultations Publiques': { icon: '📋', color: 'bg-indigo-100 text-indigo-800', name: 'Consultations Publiques' },
       'Google': { icon: '🔍', color: 'bg-gray-100 text-gray-800', name: 'Google Search' },
       'Bing': { icon: '🔍', color: 'bg-gray-100 text-gray-800', name: 'Bing Search' }
     };
     
     // Utiliser l'icône et la couleur du résultat si disponibles
     if ((result as any).sourceIcon) {
       return { 
         icon: (result as any).sourceIcon, 
         color: 'bg-blue-100 text-blue-800', 
         name: result.source || source 
       };
     }
     
     return sourceMap[source] || { icon: '📄', color: 'bg-gray-100 text-gray-800', name: source };
   };

  const sourceInfo = getSourceInfo(result.source);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {result.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {result.description}
          </p>
          
          {/* Informations de source et date */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceInfo.color}`}>
              {sourceInfo.icon} {result.source}
            </span>
            <span>📅 {new Date(result.date).toLocaleDateString('fr-FR')}</span>
            {(result as any).relevance && (
              <span>🎯 Pertinence: {((result as any).relevance * 100).toFixed(1)}%</span>
            )}
            {(result as any).estimated_value && (
              <span>💰 Valeur estimée: {(result as any).estimated_value.toLocaleString('fr-FR')} €</span>
            )}
            {(result as any).deadline && (
              <span>⏰ Échéance: {new Date((result as any).deadline).toLocaleDateString('fr-FR')}</span>
            )}
            {(result as any).location && (
              <span>📍 Localisation: {(result as any).location}</span>
            )}
            {(result as any).category && (
              <span>🏷️ Catégorie: {(result as any).category}</span>
            )}
            {(result as any).validation_count && (
              <span>✅ Validations: {(result as any).validation_count}</span>
            )}
            {showSimilarity && (result as any).similarity_score && (
              <span>🎯 Similarité: {((result as any).similarity_score * 100).toFixed(1)}%</span>
            )}
          </div>

          {/* Bouton principal pour consulter l'offre */}
          <div className="mb-3">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔗 Consulter l'offre sur {result.source}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Informations sur le site de publication */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📋 Site de publication: {sourceInfo.name}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Cette offre a été publiée sur {result.source}. Cliquez sur le bouton ci-dessus pour la consulter directement sur le site officiel.
            </p>
          </div>
        </div>

        {/* Menu d'actions */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ⋮
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onValidate(result.id, 'en_cours');
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ✅ Valider (En cours)
                </button>
                <button
                  onClick={() => {
                    onValidate(result.id, 'depose');
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  📤 Valider (Déposé)
                </button>
                <button
                  onClick={() => {
                    onValidate(result.id, 'gagne');
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  🏆 Valider (Gagné)
                </button>
                <button
                  onClick={() => {
                    onValidate(result.id, 'perdu');
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ❌ Valider (Perdu)
                </button>
                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  🔗 Ouvrir le lien
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.url);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  📋 Copier le lien
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
