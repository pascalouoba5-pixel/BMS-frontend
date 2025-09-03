import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseApiDataOptions<T> {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onError?: (error: string) => void;
  onSuccess?: (data: T) => void;
}

export function useApiData<T>(
  apiCall: () => Promise<T>,
  options: UseApiDataOptions<T> = {}
): [ApiState<T>, () => Promise<void>, () => void] {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 secondes par défaut
    onError,
    onSuccess
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await apiCall();
      
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [apiCall, onError, onSuccess]);

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return [state, refresh, clearError];
}

// Hook spécialisé pour les listes avec gestion des états vides
export function useApiList<T>(
  apiCall: () => Promise<T[]>,
  options: UseApiDataOptions<T[]> & {
    emptyMessage?: string;
    showEmptyState?: boolean;
  } = {}
): [ApiState<T[]>, () => Promise<void>, () => void, boolean] {
  const [state, refresh, clearError] = useApiData(apiCall, options);
  
  const isEmpty = !state.loading && !state.error && (!state.data || state.data.length === 0);
  
  return [state, refresh, clearError, isEmpty];
}

// Hook pour les données avec valeur par défaut
export function useApiDataWithDefault<T>(
  apiCall: () => Promise<T>,
  defaultValue: T,
  options: UseApiDataOptions<T> = {}
): [ApiState<T>, () => Promise<void>, () => void] {
  const [state, refresh, clearError] = useApiData(apiCall, options);
  
  const dataWithDefault = state.data !== null ? state.data : defaultValue;
  
  return [
    { ...state, data: dataWithDefault },
    refresh,
    clearError
  ];
}
