import { useState, useEffect, useCallback, useRef } from 'react';
// import { dashboardAPI } from '../services/api';
import { logger, logInfo, logError, logWarn } from '../utils/logger';

export interface DashboardData {
  stats: {
    totalOffres: number;
    offresEnAttente: number;
    offresApprouvees: number;
    offresRejetees: number;
    totalBudget: string;
  };
  commerciaux: {
    totalCommerciaux: number;
    objectifsAtteints: number;
    enCours: number;
    performanceMoyenne: number;
    topPerformers: Array<{
      nom: string;
      offresValidees: number;
      totalOffres: number;
      tauxReussite: number;
    }>;
  };
  poles: Array<{
    nom: string;
    offresTraitees: number;
    offresValidees: number;
    tauxSucces: number;
  }>;
  resultats: {
    caGenere: string;
    tauxConversion: number;
    roiMoyen: string;
    satisfaction: number;
    evolution: Array<{
      mois: string;
      tauxReussite: number;
    }>;
    objectifs: Array<{
      trimestre: string;
      tauxReussite: number;
    }>;
  };
}

export interface DashboardFilters {
  period: string;
  startDate?: string;
  endDate?: string;
}

export interface UseDashboardSyncReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateFilters: (filters: DashboardFilters) => void;
  lastUpdate: Date | null;
  autoRefresh: boolean;
  toggleAutoRefresh: () => void;
  clearCache: () => void;
  forceSync: () => Promise<void>;
  isInitialized: boolean;
}

export const useDashboardSync = (
  initialFilters: DashboardFilters = { period: 'month' },
  autoRefreshInterval: number = 30000 // 30 secondes par défaut
): UseDashboardSyncReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFiltersRef = useRef<string>('');
  const dataCacheRef = useRef<Map<string, { data: DashboardData; timestamp: number }>>(new Map());

  // Fonction pour récupérer les données
  const fetchData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      // Créer une clé de cache basée sur les filtres
      const cacheKey = JSON.stringify(filters);
      const now = Date.now();
      const cacheTimeout = 5 * 60 * 1000; // 5 minutes
      
      // Vérifier le cache si pas de refresh forcé
      if (!forceRefresh && dataCacheRef.current.has(cacheKey)) {
        const cached = dataCacheRef.current.get(cacheKey)!;
        if (now - cached.timestamp < cacheTimeout) {
          logInfo('Utilisation des données en cache', 'Dashboard');
          setData(cached.data);
          setLastUpdate(new Date(cached.timestamp));
          setLoading(false);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      
      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Créer un nouveau contrôleur d'annulation
      abortControllerRef.current = new AbortController();
      
      logInfo(`Synchronisation des données avec les filtres: ${JSON.stringify(filters)}`, 'Dashboard');
      logInfo(`URL de l'API: ${process.env.NEXT_PUBLIC_API_URL || 'NON_DEFINI'}`, 'Dashboard');
      
      // TODO: Implémenter l'API dashboard
      // const response = await dashboardAPI.getAllDashboardData(
      //   filters.period,
      //   filters.startDate,
      //   filters.endDate
      // );
      
      // Utiliser des données statiques temporairement
      const staticData: DashboardData = {
        stats: {
          totalOffres: 0,
          offresEnAttente: 0,
          offresApprouvees: 0,
          offresRejetees: 0,
          totalBudget: '0€'
        },
        commerciaux: {
          totalCommerciaux: 0,
          objectifsAtteints: 0,
          enCours: 0,
          performanceMoyenne: 0,
          topPerformers: []
        },
        poles: [],
        resultats: {
          caGenere: '0€',
          tauxConversion: 0,
          roiMoyen: '0€',
          satisfaction: 0,
          evolution: [],
          objectifs: []
        }
      };
      
      // Mettre en cache les nouvelles données
      dataCacheRef.current.set(cacheKey, {
        data: staticData,
        timestamp: now
      });
      
      setData(staticData);
      setLastUpdate(new Date());
      setIsInitialized(true);
      logInfo('Dashboard synchronisé avec succès (données statiques)', 'Dashboard', staticData);
    } catch (error: any) {
      // Ignorer les erreurs d'annulation
      if (error.name === 'AbortError') {
        logInfo('Requête annulée, ignorée', 'Dashboard');
        return;
      }
      
      // Log détaillé de l'erreur
      logger.dashboardError('Synchronisation des données', error, filters, {
        timestamp: new Date().toISOString(),
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'NON_DEFINI'
      });
      
      // Définir un message d'erreur utilisateur-friendly
      let userErrorMessage = 'Erreur lors de la synchronisation des données';
      
      if (error.message.includes('fetch')) {
        userErrorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet et que le serveur backend est démarré.';
      } else if (error.message.includes('401')) {
        userErrorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.message.includes('500')) {
        userErrorMessage = 'Erreur serveur interne. Veuillez réessayer plus tard.';
      } else if (error.message.includes('404')) {
        userErrorMessage = 'Service non trouvé. Vérifiez la configuration de l\'API.';
      } else if (error.message) {
        userErrorMessage = error.message;
      }
      
      setError(userErrorMessage);
      
      // Log du message d'erreur utilisateur
      logError(`Message d'erreur utilisateur: ${userErrorMessage}`, error, 'Dashboard');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fonction pour rafraîchir manuellement
  const refresh = useCallback(async () => {
    try {
      logInfo('Refresh manuel du dashboard...', 'Dashboard');
      setError(null); // Effacer les erreurs précédentes
      await fetchData(true); // Force refresh
    } catch (error) {
      logError('Erreur lors du refresh manuel', error as Error, 'Dashboard');
      // L'erreur sera gérée par fetchData, pas besoin de la relancer ici
    }
  }, [fetchData]);

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback((newFilters: DashboardFilters) => {
    const newFiltersKey = JSON.stringify(newFilters);
    
    // Vérifier si les filtres ont réellement changé
    if (newFiltersKey !== lastFiltersRef.current) {
      logInfo('Changement de filtres détecté, synchronisation...', 'Dashboard', newFilters);
      lastFiltersRef.current = newFiltersKey;
      setFilters(newFilters);
      
      // Déclencher une synchronisation immédiate avec les nouveaux filtres
      setTimeout(() => {
        fetchData(true); // Force refresh pour les nouveaux filtres
      }, 100);
    }
  }, [fetchData]);

  // Fonction pour basculer l'auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  // Configuration de l'auto-refresh intelligent
  useEffect(() => {
    if (autoRefresh && autoRefreshInterval > 0 && isInitialized) {
      intervalRef.current = setInterval(() => {
        logInfo('Auto-refresh intelligent du dashboard...', 'Dashboard');
        fetchData(false); // Utilise le cache si possible
      }, autoRefreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, autoRefreshInterval, fetchData, isInitialized]);

  // Chargement initial et lors du changement de filtres
  useEffect(() => {
    if (!isInitialized) {
      logInfo('Chargement initial du dashboard...', 'Dashboard');
      fetchData(false);
    }
  }, [fetchData, isInitialized]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Écouter les changements de focus de la page pour synchroniser
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && autoRefresh) {
        logInfo('Page redevenue visible, synchronisation...', 'Dashboard');
        fetchData();
      }
    };

    const handleFocus = () => {
      if (autoRefresh) {
        logInfo('Fenêtre regagnée le focus, synchronisation...', 'Dashboard');
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [autoRefresh, fetchData]);

  // Fonction pour nettoyer le cache
  const clearCache = useCallback(() => {
    dataCacheRef.current.clear();
    console.log('🗑️ Cache du dashboard nettoyé');
  }, []);

  // Fonction pour forcer la synchronisation
  const forceSync = useCallback(async () => {
    try {
      console.log('⚡ Synchronisation forcée du dashboard...');
      setError(null); // Effacer les erreurs précédentes
      setLoading(true); // Indiquer le chargement
      await fetchData(true);
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation forcée:', error);
      // L'erreur sera gérée par fetchData, pas besoin de la relancer ici
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    updateFilters,
    lastUpdate,
    autoRefresh,
    toggleAutoRefresh,
    clearCache,
    forceSync,
    isInitialized
  };
};

// Hook spécialisé pour les données des commerciaux
export const useCommerciauxSync = (filters?: DashboardFilters) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
              // const response = await dashboardAPI.getCommerciaux(filters);
        const response = { success: true, data: [], message: '' };
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des données des commerciaux');
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des données des commerciaux:', error);
      setError(error.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};

// Hook spécialisé pour les données des pôles
export const usePolesSync = (filters?: DashboardFilters) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
              // const response = await dashboardAPI.getPoles(filters);
        const response = { success: true, data: [], message: '' };
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des données des pôles');
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des données des pôles:', error);
      setError(error.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};

// Hook spécialisé pour les données des résultats
export const useResultatsSync = (filters?: DashboardFilters) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
              // const response = await dashboardAPI.getResultats(filters);
        const response = { success: true, data: [], message: '' };
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des données des résultats');
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des données des résultats:', error);
      setError(error.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
