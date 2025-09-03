import { logger, logInfo, logError, logWarn } from '../utils/logger';
import { API_CONFIG, getApiUrl, checkApiHealth } from '../config/api';

// Configuration de l'API
const API_BASE_URL = API_CONFIG.BASE_URL;

// Log de la configuration de l'API
logInfo(`Configuration: NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL || 'NON_DEFINI'}`, 'API');
logInfo(`URL de base utilisée: ${API_BASE_URL}`, 'API');
logInfo(`Environnement: ${API_CONFIG.NODE_ENV}`, 'API');

// Fonction utilitaire pour les appels API
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Récupérer le token d'authentification
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Logs détaillés pour le débogage
  logInfo(`Appel vers: ${url}`, 'API');
  logInfo(`Token présent: ${token ? 'OUI' : 'NON'}`, 'API');
  if (token) {
    logInfo(`Token (premiers caractères): ${token.substring(0, 20)}...`, 'API');
    logInfo(`Longueur du token: ${token.length}`, 'API');
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    mode: API_CONFIG.CORS_MODE,
    ...options,
  };

  try {
    logInfo(`Envoi de la requête vers: ${url}`, 'API');
    
    // Timeout pour la requête
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
    
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Log de la réponse
    logInfo(`Réponse reçue: ${response.status} ${response.statusText}`, 'API');
    logInfo(`Headers de réponse: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`, 'API');
    
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        logWarn(`Impossible de parser le body d'erreur: ${parseError instanceof Error ? parseError.message : String(parseError)}`, 'API');
        errorData = { error: `Erreur HTTP ${response.status}: ${response.statusText}` };
      }
      
      // Log détaillé de l'erreur
      logger.apiError(endpoint, new Error(`HTTP ${response.status}: ${response.statusText}`), response, {
        status: response.status,
        statusText: response.statusText,
        url: url,
        errorData: errorData,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Gestion spécifique des erreurs d'authentification
      if (response.status === 401) {
        logger.authError('Token invalide', new Error((errorData as any).error || 'Token expiré ou invalide'), errorData);
        
        // Supprimer le token invalide
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          logInfo('Token invalide supprimé du localStorage', 'API');
        }
        
        // Rediriger vers la page de login
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          logInfo('Redirection vers /login', 'API');
          window.location.href = '/login';
        }
        
        throw new Error('Token invalide - Redirection vers la connexion');
      }
      
      // Créer un message d'erreur détaillé
      const errorMessage = (errorData as any).error || (errorData as any).message || `Erreur HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    let data;
    try {
      data = await response.json();
      logInfo(`Succès: ${endpoint}`, 'API', data);
    } catch (parseError) {
      logError(`Erreur lors du parsing de la réponse: ${parseError instanceof Error ? parseError.message : String(parseError)}`, parseError instanceof Error ? parseError : new Error(String(parseError)), 'API');
      throw new Error(`Erreur lors du parsing de la réponse: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
    
    return data;
    
  } catch (error) {
    // Log détaillé de l'erreur
    logger.apiError(endpoint, error instanceof Error ? error : new Error(String(error)), undefined, {
      url: url,
      options: defaultOptions,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Gestion des erreurs de timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timeout de la requête après ${API_CONFIG.REQUEST_TIMEOUT}ms`);
    }
    
    // Gestion des erreurs de réseau
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('Erreur de connexion au serveur - Vérifiez votre connexion internet');
    }
    
    throw error;
  }
};

// Fonctions d'authentification
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    // Supprimer le token du localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
    return { success: true, message: 'Déconnexion réussie' };
  },

  register: async (userData: { email: string; password: string; nom: string; prenom: string }) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  verifyToken: async () => {
    return apiCall('/api/auth/verify');
  },
};

// Fonctions pour les offres
export const offresAPI = {
  getAll: async () => {
    return apiCall('/api/offres');
  },

  create: async (offreData: any) => {
    return apiCall('/api/offres', {
      method: 'POST',
      body: JSON.stringify(offreData),
    });
  },

  update: async (id: number, offreData: any) => {
    return apiCall(`/api/offres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offreData),
    });
  },

  delete: async (id: number) => {
    return apiCall(`/api/offres/${id}`, {
      method: 'DELETE',
    });
  },

  validate: async (id: number, validationData: { action: 'approve' | 'reject'; commentaire?: string }) => {
    return apiCall(`/api/offres/${id}/validate`, {
      method: 'PATCH',
      body: JSON.stringify(validationData),
    });
  },
};

// Fonctions pour le suivi de performance
export const performanceAPI = {
  getOverview: async (startDate?: string, endDate?: string) => {
    const queryParams = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
    return apiCall(`/api/performance/overview${queryParams}`);
  },

  getPoles: async (startDate?: string, endDate?: string) => {
    const queryParams = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
    return apiCall(`/api/performance/poles${queryParams}`);
  },

  getPolesDetailed: async (startDate?: string, endDate?: string) => {
    const queryParams = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
    return apiCall(`/api/performance/poles-detailed${queryParams}`);
  },

  getTrends: async () => {
    return apiCall('/api/performance/trends');
  },

  getCommerciaux: async (startDate?: string, endDate?: string) => {
    const queryParams = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
    return apiCall(`/api/performance/commerciaux${queryParams}`);
  },

  getMetrics: async () => {
    return apiCall('/api/performance/metrics');
  }
};

// Fonctions pour les utilisateurs
export const usersAPI = {
  getAll: async () => {
    return apiCall('/api/users');
  },

  getById: async (id: string) => {
    return apiCall(`/api/users/${id}`);
  },

  update: async (id: string, userData: any) => {
    return apiCall(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Fonctions pour les recherches programmées
export const scheduledSearchesAPI = {
  getAll: async (userId: string) => {
    return apiCall(`/api/scheduled-searches?userId=${userId}`);
  },

  getOptions: async () => {
    return apiCall('/api/scheduled-searches/options');
  },

  create: async (searchData: { userId: string; keywords: string; frequency?: string; customSchedule?: any }) => {
    return apiCall('/api/scheduled-searches', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  },

  update: async (searchData: { userId: string; keywords: string; frequency?: string; customSchedule?: any; isActive?: boolean }) => {
    return apiCall('/api/scheduled-searches', {
      method: 'PUT',
      body: JSON.stringify(searchData),
    });
  },

  delete: async (searchData: { userId: string; keywords: string }) => {
    return apiCall('/api/scheduled-searches', {
      method: 'DELETE',
      body: JSON.stringify(searchData),
    });
  },

  getSavedKeywords: async (userId: string) => {
    return apiCall(`/api/scheduled-searches/saved-keywords?userId=${userId}`);
  },

  saveKeywords: async (keywordData: { userId: string; keywords: string }) => {
    return apiCall('/api/scheduled-searches/saved-keywords', {
      method: 'POST',
      body: JSON.stringify(keywordData),
    });
  },

  deleteSavedKeywords: async (id: string, userId: string) => {
    return apiCall(`/api/scheduled-searches/saved-keywords/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  getSearchStats: async (userId?: string) => {
    const queryParams = userId ? `?userId=${userId}` : '';
    return apiCall(`/api/scheduled-searches/search-stats${queryParams}`);
  },
};

export default {
  auth: authAPI,
  offres: offresAPI,
  performance: performanceAPI,
  users: usersAPI,
  scheduledSearches: scheduledSearchesAPI,
};

// Export types for better TypeScript support
export interface Offre {
  id: number;
  // Champs du formulaire d'ajout d'offre
  intituleOffre?: string;
  commentaire?: string;
  pays?: string[];
  autrePays?: string;
  bailleur?: string;
  objectifs?: string;
  profilExpert?: string;
  montant?: string;
  devise?: string;
  dureeMission?: string;
  dateDepot?: string;
  heureDepot?: string;
  lienTDR?: string;
  nomSite?: string;
  typeOffre?: string;
  dateSoumissionValidation?: string;
  offreTrouveePar?: string;
  priorite?: 'Opportunité intermédiaire' | 'Priorité haute' | 'Stratégique' | '';
  
  // Champs de validation
  statut?: 'brouillon' | 'en_attente' | 'approuvée' | 'rejetée';
  commentaireValidation?: string;
  dateValidation?: string;
  
  // Champs pour le montage administratif
  montageAdministratif?: string;
  
  // Champs pour compatibilité avec les données de test
  titre?: string;
  client?: string;
  secteur?: string;
  budget?: string;
  dateLimit?: string;
  priority?: 'normale' | 'haute' | 'critique';
  dateCreation?: string;
  createdBy?: string;
  description?: string;
  competencesRequises?: string;
  
  // Champs supplémentaires pour la répartition
  poleLead?: string;
  poleAssocies?: string;
  dateImputation?: string;
  chargeAssuranceQualite?: string;
  chargeMontageAdministratif?: string;
  delaiTransmissionMontageAdministratif?: string;
  dateTransmissionAssuranceQualite?: string;
  diligencesMenees?: string;
  dateIdentificationOffre?: string;
  tdrFile?: string;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'user' | 'manager';
  dateCreation: string;
  statut: 'actif' | 'inactif' | 'suspendu';
}

// Types pour le suivi de performance
export interface PerformanceOverview {
  stats: {
    totalOffres: number;
    offresApprouvees: number;
    offresEnAttente: number;
    offresRejetees: number;
    offresPrioritaires: number;
    tauxApprobation: number;
    tauxGagnees: number;
    tauxPerdues: number;
    tauxEnCours: number;
  };
  typesOffre: Array<{
    nom: string;
    total: number;
    gagnees: number;
    perdues: number;
    tauxGagnees: number;
    tauxPerdues: number;
  }>;
}

export interface PerformancePoles {
  nom: string;
  totalOffres: number;
  offresApprouvees: number;
  offresEnAttente: number;
  offresRejetees: number;
  offresPrioritaires: number;
  tauxReussite: number;
}

export interface PerformancePolesDetailed {
  nom: string;
  // Indicateurs principaux
  offresLeadAttribuees: number;
  offresAssocieAttribuees: number;
  offresLeadMontees: number;
  offresAssocieMontees: number;
  // Taux
  tauxSucces: number;
  tauxPerte: number;
  tauxAttente: number;
  // Totaux
  totalOffres: number;
  offresGagnees: number;
  offresPerdues: number;
  offresEnCours: number;
}

export interface PerformanceCommerciaux {
  nom: string;
  role: string;
  totalOffres: number;
  offresApprouvees: number;
  offresEnAttente: number;
  offresRejetees: number;
  offresPrioritaires: number;
  tauxReussite: number;
  premiereOffre: string;
  derniereOffre: string;
}

export interface PerformanceMetrics {
  qualite: {
    totalOffres: number;
    tauxApprobation: number;
    tauxRejet: number;
    offresPrioritaires: number;
    completudePays: number;
    completudeBailleur: number;
  };
  efficacite: {
    delaiMoyenJours: string;
    offresSoumises: number;
    offresNonSoumises: number;
    tauxSoumission: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
} 