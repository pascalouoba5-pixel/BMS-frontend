import { useState, useEffect, useCallback } from 'react';
// import { dashboardAPI } from '../services/api';

export interface CommerciauxDetailleData {
  offresParAgent: Array<{
    nom: string;
    nombreOffres: number;
  }>;
  typesOffresParAgent: Array<{
    nom: string;
    nombreTypes: number;
  }>;
  offresStatutParAgent: Array<{
    nom: string;
    offresApprouvees: number;
    offresRejetees: number;
  }>;
  offresParSite: Array<{
    nom: string;
    nombreOffres: number;
  }>;
  offresParBailleur: Array<{
    nom: string;
    nombreOffres: number;
  }>;
  typesOffresStatutParAgent: Array<{
    nom: string;
    typeOffre: string;
    offresApprouvees: number;
    offresRejetees: number;
  }>;
  tauxValidationParAgent: Array<{
    nom: string;
    totalOffres: number;
    offresApprouvees: number;
    tauxValidation: number;
  }>;
}

export interface CommerciauxDetailleFilters {
  period: string;
  startDate?: string;
  endDate?: string;
}

export interface UseCommerciauxDetailleReturn {
  data: CommerciauxDetailleData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateFilters: (filters: CommerciauxDetailleFilters) => void;
  lastUpdate: Date | null;
}

export const useCommerciauxDetaille = (
  initialFilters: CommerciauxDetailleFilters = { period: 'month' }
): UseCommerciauxDetailleReturn => {
  const [data, setData] = useState<CommerciauxDetailleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CommerciauxDetailleFilters>(initialFilters);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fonction pour récupérer les données
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implémenter l'API dashboard
      // const response = await dashboardAPI.getCommerciauxDetaille(
      //   filters.period,
      //   filters.startDate,
      //   filters.endDate
      // );
      
      // Utiliser des données statiques temporairement
      const staticData: CommerciauxDetailleData = {
        offresParAgent: [],
        typesOffresParAgent: [],
        offresStatutParAgent: [],
        offresParSite: [],
        offresParBailleur: [],
        typesOffresStatutParAgent: [],
        tauxValidationParAgent: []
      };
      
      setData(staticData);
      setLastUpdate(new Date());
      console.log('✅ Statistiques détaillées des commerciaux synchronisées (données statiques):', staticData);
    } catch (error: any) {
      console.error('❌ Erreur lors de la synchronisation des statistiques détaillées:', error);
      setError(error.message || 'Erreur lors de la synchronisation');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fonction pour rafraîchir manuellement
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback((newFilters: CommerciauxDetailleFilters) => {
    setFilters(newFilters);
  }, []);

  // Chargement initial et lors du changement de filtres
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    updateFilters,
    lastUpdate
  };
};
