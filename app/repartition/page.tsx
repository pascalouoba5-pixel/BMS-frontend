
'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useGlobalFilters, PoleType } from '../../hooks/useGlobalFilters';
import HomeButton from '../../components/HomeButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import AlertBanner from '../../components/AlertBanner';
import { offresAPI } from '@/services/api';

// Options pour les pôles
const POLE_OPTIONS = [
  'Pôle santé',
  'Pôle Wash',
  'Pôle Education',
  'Pôle Climat',
  'Pôle Enquêtes',
  'Pôle Modélisation',
  'Pôle Finances Publiques',
  'Pôle Décentralisation',
  'Pôle Cohésion sociale',
  'Pôle Anglophone',
  'Pôle SIDIA'
] as const;

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
}

export default function Repartition() {
  return (
    <ProtectedRoute pageName="repartition">
      <Layout>
        <RepartitionContent />
      </Layout>
    </ProtectedRoute>
  );
}

function RepartitionContent() {
  const { selectedPoleLead, selectedPoleAssocies, updateGlobalFilters, POLE_OPTIONS } = useGlobalFilters();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPays, setSelectedPays] = useState<string>('');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dateDepot');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'approuvée':
        return 'bg-green-100 text-green-800';
      case 'rejetée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'brouillon':
        return 'Brouillon';
      case 'en_attente':
        return 'En attente';
      case 'approuvée':
        return 'Approuvée';
      case 'rejetée':
        return 'Rejetée';
      default:
        return 'Non spécifié';
    }
  };

  const getPaysDisplay = (pays: string[] | undefined) => {
    if (!pays || pays.length === 0) return 'Non spécifié';
    if (pays.length === 1) return pays[0];
    if (pays.length <= 3) return pays.join(', ');
    return `${pays.slice(0, 3).join(', ')} +${pays.length - 3}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifiée';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const formatBudget = (montant: string | undefined, devise: string | undefined) => {
    if (!montant) return 'Non spécifié';
    return devise ? `${montant} ${devise}` : montant;
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    filterAndSortOffres();
  }, [offres, searchTerm, selectedPays, selectedPriorite, selectedPoleLead, selectedPoleAssocies, sortBy, sortOrder]);

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
      filtered = filtered.filter(offre => {
        const searchLower = searchTerm.toLowerCase();
        const titre = (offre.intituleOffre || offre.titre || '').toLowerCase();
        const bailleur = (offre.bailleur || offre.client || '').toLowerCase();
        return titre.includes(searchLower) || bailleur.includes(searchLower);
      });
    }

    // Filtre par pays
    if (selectedPays) {
      filtered = filtered.filter(offre => 
        offre.pays && Array.isArray(offre.pays) && offre.pays.includes(selectedPays)
      );
    }

    // Filtre par priorité
    if (selectedPriorite) {
      filtered = filtered.filter(offre => offre.priorite === selectedPriorite);
    }

    // Filtre par pôle LEAD (filtre principal)
    if (selectedPoleLead) {
      filtered = filtered.filter(offre => offre.poleLead === selectedPoleLead);
    }

    // Filtre par pôle ASSOCIÉS (filtre secondaire)
    if (selectedPoleAssocies) {
      filtered = filtered.filter(offre => offre.poleAssocies === selectedPoleAssocies);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';

      switch (sortBy) {
        case 'intituleOffre':
          aValue = (a.intituleOffre || a.titre || '').toLowerCase();
          bValue = (b.intituleOffre || b.titre || '').toLowerCase();
          break;
        case 'bailleur':
          aValue = (a.bailleur || a.client || '').toLowerCase();
          bValue = (b.bailleur || b.client || '').toLowerCase();
          break;
        case 'priorite':
          aValue = a.priorite || '';
          bValue = b.priorite || '';
          break;
        case 'poleLead':
          aValue = a.poleLead || '';
          bValue = b.poleLead || '';
          break;
        case 'poleAssocies':
          aValue = a.poleAssocies || '';
          bValue = b.poleAssocies || '';
          break;
        default:
          aValue = a.dateDepot || '';
          bValue = b.dateDepot || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOffres(filtered);
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'Stratégique': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Priorité haute': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Opportunité intermédiaire': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPoleColor = (pole: PoleType | undefined) => {
    if (!pole) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    const colors: Record<PoleType, string> = {
      'Pôle santé': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pôle Wash': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Pôle Education': 'bg-green-100 text-green-800 border-green-200',
      'Pôle Climat': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Pôle Enquêtes': 'bg-purple-100 text-purple-800 border-purple-200',
      'Pôle Modélisation': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Pôle Finances Publiques': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Pôle Décentralisation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Pôle Cohésion sociale': 'bg-pink-100 text-pink-800 border-pink-200',
      'Pôle Anglophone': 'bg-red-100 text-red-800 border-red-200',
      'Pôle SIDIA': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    
    return colors[pole] || 'bg-gray-100 text-gray-800 border-gray-200';
  };



  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const downloadTDR = (offre: Offre) => {
    if (!offre.tdrFile && !offre.lienTDR) {
      alert('Aucun fichier TDR disponible pour cette offre.');
      return;
    }

    const tdrUrl = offre.tdrFile || offre.lienTDR;
    if (tdrUrl) {
      const link = document.createElement('a');
      link.href = tdrUrl;
      link.download = `TDR_${offre.intituleOffre || offre.titre || offre.id}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Fonction pour compter les offres non attribuées à un pôle lead
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intitulé Offre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bailleur/Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Offre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secteurs/Objectifs</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pôle Lead</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pôle Associés</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée Mission</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profil Expert</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Dépôt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Soumission</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offre Trouvée Par</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOffres.map((offre) => (
              <tr key={offre.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{offre.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {offre.intituleOffre || offre.titre || 'Non spécifié'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {offre.bailleur || offre.client || 'Non spécifié'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {getPaysDisplay(offre.pays)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {offre.typeOffre || 'Non spécifié'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={offre.objectifs || 'Non spécifié'}>
                    {offre.objectifs || 'Non spécifié'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    offre.priorite === 'Priorité haute' ? 'bg-red-100 text-red-800' :
                    offre.priorite === 'Stratégique' ? 'bg-purple-100 text-purple-800' :
                    offre.priorite === 'Opportunité intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {offre.priorite || 'Non spécifiée'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offre.statut || '')}`}>
                    {getStatusDisplay(offre.statut || '')}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {offre.poleLead || 'Non attribué'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {offre.poleAssocies || 'Non attribué'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatBudget(offre.montant, offre.devise)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {offre.dureeMission || 'Non spécifiée'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={offre.profilExpert || 'Non spécifié'}>
                    {offre.profilExpert || 'Non spécifié'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(offre.dateDepot)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(offre.dateSoumissionValidation)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {offre.offreTrouveePar || 'Non spécifié'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={offre.commentaire || 'Non spécifié'}>
                    {offre.commentaire || 'Non spécifié'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadTDR(offre)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Télécharger TDR"
                    >
                      <i className="ri-download-line"></i>
                    </button>
                    <Link
                      href={`/repartition/pole-lead/${offre.poleLead || 'Non attribué'}`}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Voir pôle"
                    >
                      <i className="ri-eye-line"></i>
                    </Link>
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
          {/* Header avec titre, organisation et badges de statut */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {offre.intituleOffre || offre.titre || 'Non spécifié'}
              </h4>
              <p className="text-sm text-gray-600">{offre.bailleur || offre.client || 'Non spécifié'}</p>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(offre.statut || '')}`}>
                {getStatusDisplay(offre.statut || '')}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                offre.priorite === 'Priorité haute' ? 'bg-red-100 text-red-800' :
                offre.priorite === 'Stratégique' ? 'bg-purple-100 text-purple-800' :
                offre.priorite === 'Opportunité intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {offre.priorite || 'Non spécifiée'}
              </span>
            </div>
          </div>
          
          {/* Contenu principal en 3 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne 1: Informations de base */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Informations de base</h5>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Pays:</span> {getPaysDisplay(offre.pays)}</div>
                <div><span className="font-medium">Secteurs:</span> {offre.objectifs || 'Non spécifié'}</div>
                <div><span className="font-medium">Budget:</span> {formatBudget(offre.montant, offre.devise)}</div>
              </div>
            </div>
            
            {/* Colonne 2: Pôles et attribution */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Pôles et attribution</h5>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Pôle Lead:</span> {offre.poleLead || 'Non attribué'}</div>
                <div><span className="font-medium">Pôle Associés:</span> {offre.poleAssocies || 'Non attribué'}</div>
                <div><span className="font-medium">Date dépôt:</span> {formatDate(offre.dateDepot)}</div>
              </div>
            </div>
            
            {/* Colonne 3: Actions */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Actions</h5>
              <div className="space-y-3">
                <button
                  onClick={() => downloadTDR(offre)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i className="ri-download-line mr-2"></i>Télécharger TDR
                </button>
                <Link
                  href={`/repartition/pole-lead/${offre.poleLead || 'Non attribué'}`}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center flex items-center justify-center"
                >
                  <i className="ri-eye-line mr-2"></i>Voir pôle
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const menuItems = [
    {
      id: 'pole-sante',
      title: 'Pôle Santé',
      description: 'Gestion des offres liées au secteur de la santé',
      icon: '🏥',
      color: 'from-red-500 to-pink-500',
      href: '/repartition/pole-lead/Pôle santé',
      pole: 'Pôle santé' as PoleType
    },
    {
      id: 'pole-wash',
      title: 'Pôle Wash',
      description: 'Gestion des offres liées à l\'eau, assainissement et hygiène',
      icon: '💧',
      color: 'from-blue-500 to-cyan-500',
      href: '/repartition/pole-lead/Pôle Wash',
      pole: 'Pôle Wash' as PoleType
    },
    {
      id: 'pole-education',
      title: 'Pôle Education',
      description: 'Gestion des offres liées au secteur éducatif',
      icon: '📚',
      color: 'from-green-500 to-emerald-500',
      href: '/repartition/pole-lead/Pôle Education',
      pole: 'Pôle Education' as PoleType
    },
    {
      id: 'pole-climat',
      title: 'Pôle Climat',
      description: 'Gestion des offres liées au changement climatique',
      icon: '🌍',
      color: 'from-emerald-500 to-teal-500',
      href: '/repartition/pole-lead/Pôle Climat',
      pole: 'Pôle Climat' as PoleType
    },
    {
      id: 'pole-enquetes',
      title: 'Pôle Enquêtes',
      description: 'Gestion des offres liées aux études et enquêtes',
      icon: '📊',
      color: 'from-purple-500 to-violet-500',
      href: '/repartition/pole-lead/Pôle Enquêtes',
      pole: 'Pôle Enquêtes' as PoleType
    },
    {
      id: 'pole-modelisation',
      title: 'Pôle Modélisation',
      description: 'Gestion des offres liées à la modélisation et simulation',
      icon: '🔬',
      color: 'from-indigo-500 to-blue-500',
      href: '/repartition/pole-lead/Pôle Modélisation',
      pole: 'Pôle Modélisation' as PoleType
    },
    {
      id: 'pole-finances-publiques',
      title: 'Pôle Finances Publiques',
      description: 'Gestion des offres liées aux finances publiques',
      icon: '💰',
      color: 'from-yellow-500 to-amber-500',
      href: '/repartition/pole-lead/Pôle Finances Publiques',
      pole: 'Pôle Finances Publiques' as PoleType
    },
    {
      id: 'pole-decentralisation',
      title: 'Pôle Décentralisation',
      description: 'Gestion des offres liées à la décentralisation',
      icon: '🏛️',
      color: 'from-gray-500 to-slate-500',
      href: '/repartition/pole-lead/Pôle Décentralisation',
      pole: 'Pôle Décentralisation' as PoleType
    },
    {
      id: 'pole-cohesion-sociale',
      title: 'Pôle Cohésion Sociale',
      description: 'Gestion des offres liées à la cohésion sociale et au développement communautaire',
      icon: '🤝',
      color: 'from-pink-500 to-rose-500',
      href: '/repartition/pole-lead/Pôle Cohésion sociale',
      pole: 'Pôle Cohésion sociale' as PoleType
    },
    {
      id: 'pole-anglophone',
      title: 'Pôle Anglophone',
      description: 'Gestion des offres pour les pays anglophones',
      icon: '🇬🇧',
      color: 'from-red-600 to-red-700',
      href: '/repartition/pole-lead/Pôle Anglophone',
      pole: 'Pôle Anglophone' as PoleType
    },
    {
      id: 'pole-sidia',
      title: 'Pôle SIDIA',
      description: 'Gestion des offres liées au SIDIA',
      icon: '⚙️',
      color: 'from-slate-500 to-gray-500',
      href: '/repartition/pole-lead/Pôle SIDIA',
      pole: 'Pôle SIDIA' as PoleType
    },

    {
      id: 'gestion-repartition',
      title: 'Gestion de Répartition',
      description: 'Interface de gestion des répartitions',
      icon: '🎯',
      color: 'from-violet-500 to-purple-500',
      href: '/repartition/gestion-repartition'
    },
    {
      id: 'vu-repartitions',
      title: 'Vue des Répartitions',
      description: 'Vue d\'ensemble des répartitions',
      icon: '👁️',
      color: 'from-emerald-500 to-teal-500',
      href: '/repartition/vue-repetitions'
    }
  ];

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
              <Link href="/offre-du-jour" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Offre du Jour
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
              <i className="ri-apps-line text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Répartition des Offres</h1>
            <p className="text-xl opacity-90 mb-6">Sélectionnez un pôle pour accéder à ses fonctionnalités</p>
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
          </div>
        </div>

        {/* Nombre d'offres non attribuées */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-alert-line text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Offres non attribuées</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {getOffresNonAttribuees()}
            </div>
            <p className="text-sm text-gray-600">
              Nombre d'offres qui n'ont pas encore été attribuées à un pôle LEAD
            </p>
          </div>
        </div>

        {/* Affichage des modalités de répartition */}
        {filteredOffres.length > 0 && (
          <div className="mb-8">
            {viewMode === 'table' ? (
              <RepartitionModalitesTable />
            ) : (
              <RepartitionModalitesCards />
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                hoveredButton === item.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              onMouseEnter={() => setHoveredButton(item.id)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative p-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{item.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Arrow Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i className="ri-arrow-right-line text-blue-600 text-lg"></i>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <i className="ri-information-line text-blue-600 text-xl"></i>
              <h3 className="text-lg font-semibold text-gray-900">Information</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Utilisez les filtres ci-dessus pour afficher les offres par pôle LEAD et pôle ASSOCIÉS. 
              Sélectionnez un pôle dans la grille pour accéder aux fonctionnalités spécifiques de répartition des offres.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
