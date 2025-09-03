
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import HomeButton from '../../components/HomeButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import AlertBanner from '../../components/AlertBanner';

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

export default function OffreDuJour() {
  return (
    <ProtectedRoute pageName="offre-du-jour">
      <Layout>
        <OffreDuJourContent />
      </Layout>
    </ProtectedRoute>
  );
}

function OffreDuJourContent() {
  const [currentDate, setCurrentDate] = useState('');
  const [offresDuJour, setOffresDuJour] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentDate(new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  useEffect(() => {
    if (isClient) {
      loadOffresDuJour();
      // Mise à jour automatique toutes les 30 secondes
      const interval = setInterval(loadOffresDuJour, 30 * 1000);
      
      // Écouteur d'événements pour détecter les changements dans localStorage
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'offres') {
          loadOffresDuJour();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isClient]);

  useEffect(() => {
    // Trier les offres par date (plus récentes en premier) puis filtrer par statut
    const sortedOffres = [...offresDuJour].sort((a, b) => {
      const dateA = a.dateSoumissionValidation ? new Date(a.dateSoumissionValidation).getTime() : 
                   a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
      const dateB = b.dateSoumissionValidation ? new Date(b.dateSoumissionValidation).getTime() : 
                   b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
      return dateB - dateA; // Tri décroissant (plus récentes en premier)
    });

    if (selectedStatus === 'tous') {
      setFilteredOffres(sortedOffres);
    } else {
      setFilteredOffres(sortedOffres.filter(offre => offre.statut === selectedStatus));
    }
  }, [offresDuJour, selectedStatus]);

  const loadOffresDuJour = () => {
    if (!isClient) return;
    
    setLoading(true);
    try {
      const allOffres = JSON.parse(localStorage.getItem('offres') || '[]');
      const today = new Date().toISOString().slice(0, 10);
      
      // Filtrer les offres du jour (tous statuts)
      const offresDuJour = allOffres.filter((offre: Offre) => {
        return isOffreDuJour(offre, today);
      });
      
      setOffresDuJour(offresDuJour);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      setError('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour déterminer si une offre est du jour (tous statuts)
  const isOffreDuJour = (offre: Offre, today: string): boolean => {
    // Vérifier la dateSoumissionValidation (date de soumission pour validation)
    if (offre.dateSoumissionValidation) {
      try {
        const dateSoumission = new Date(offre.dateSoumissionValidation).toISOString().slice(0, 10);
        if (dateSoumission === today) return true;
      } catch (error) {
        console.warn('Date de soumission invalide:', offre.dateSoumissionValidation);
      }
    }
    
    // Vérifier aussi la dateCreation si dateSoumissionValidation n'est pas disponible
    if (offre.dateCreation) {
      try {
        const dateCreation = new Date(offre.dateCreation).toISOString().slice(0, 10);
        if (dateCreation === today) return true;
      } catch (error) {
        console.warn('Date de création invalide:', offre.dateCreation);
      }
    }
    
    return false;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'bg-red-500';
      case 'haute': return 'bg-orange-500';
      case 'normale': return 'bg-blue-500';
      case 'Stratégique': return 'bg-purple-500';
      case 'Priorité haute': return 'bg-orange-500';
      case 'Opportunité intermédiaire': return 'bg-blue-500';
      default: return 'bg-gray-500';
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

  const getStatusCount = (statut: string) => {
    return offresDuJour.filter(offre => offre.statut === statut).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres du jour...</p>
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
      <AlertBanner />
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <img 
                  src="/images/amd-international-logo.svg" 
                  alt="AMD INTERNATIONAL Logo" 
                  className="h-12 cursor-pointer"
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

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20technology%20workspace%20with%20AI%20algorithms%20visualization%20on%20multiple%20screens%2C%20futuristic%20blue%20lighting%2C%20data%20flowing%20graphics%2C%20professional%20tech%20environment%2C%20cutting-edge%20artificial%20intelligence%20interface%2C%20clean%20minimalist%20design%20with%20blue%20and%20white%20corporate%20colors&width=1920&height=600&seq=aioffre1&orientation=landscape')`
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center bg-blue-500/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <i className="ri-star-line text-yellow-300 text-xl mr-2"></i>
            <span className="font-medium">Offres du Jour</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Offres du Jour</h1>
          <p className="text-xl md:text-2xl mb-6" suppressHydrationWarning={true}>
            {currentDate}
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
            <span className="text-lg font-semibold">
              {offresDuJour.length} offre{offresDuJour.length > 1 ? 's' : ''} du jour
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {offresDuJour.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune offre aujourd'hui</h3>
              <p className="text-gray-600 mb-6">
                Il n'y a pas d'offres pour la date du jour ({currentDate}).
              </p>
              <Link 
                href="/offres" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <i className="ri-arrow-left-line"></i>
                Voir toutes les offres
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filtres par statut */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrer par statut</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedStatus('tous')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === 'tous'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tous ({offresDuJour.length})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('approuvée')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === 'approuvée'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Approuvées ({getStatusCount('approuvée')})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('en_attente')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === 'en_attente'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    En attente ({getStatusCount('en_attente')})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('rejetée')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === 'rejetée'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Rejetées ({getStatusCount('rejetée')})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('brouillon')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === 'brouillon'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Brouillons ({getStatusCount('brouillon')})
                  </button>
                </div>
              </div>
            </div>

            {/* Résultats */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredOffres.length} offre{filteredOffres.length !== 1 ? 's' : ''} affichée{filteredOffres.length !== 1 ? 's' : ''}
                {selectedStatus !== 'tous' && ` (${selectedStatus})`}
              </p>
            </div>

            <div className="grid gap-8">
              {filteredOffres.map((offre) => (
                <div key={offre.id} className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offre.statut || 'en_attente')}`}>
                            <i className={`${offre.statut === 'approuvée' ? 'ri-check-line' : offre.statut === 'rejetée' ? 'ri-close-line' : 'ri-time-line'} mr-1`}></i>
                            {getStatusDisplay(offre.statut || 'en_attente')}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            🔥 Offre du Jour
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
                            <span>Date de soumission: {formatDate(offre.dateSoumissionValidation || offre.dateCreation || '')}</span>
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

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href="/offres" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                      >
                        <i className="ri-arrow-left-line"></i>
                        Voir Toutes les Offres
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
