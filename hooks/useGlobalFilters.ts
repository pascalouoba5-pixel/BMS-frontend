import { useState, useEffect, useCallback } from 'react';

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

export type PoleType = typeof POLE_OPTIONS[number];

// Interface pour les filtres globaux
interface GlobalFilters {
  selectedPoleLead: PoleType | '';
  selectedPoleAssocies: PoleType | '';
}

// Clé pour le localStorage des filtres globaux
const GLOBAL_FILTERS_KEY = 'globalPoleFilters';

export const useGlobalFilters = () => {
  const [selectedPoleLead, setSelectedPoleLead] = useState<PoleType | ''>('');
  const [selectedPoleAssocies, setSelectedPoleAssocies] = useState<PoleType | ''>('');

  // Charger les filtres globaux au démarrage
  useEffect(() => {
    loadGlobalFilters();
  }, []);

  // Fonction pour charger les filtres globaux
  const loadGlobalFilters = () => {
    try {
      const storedFilters = localStorage.getItem(GLOBAL_FILTERS_KEY);
      if (storedFilters) {
        const filters: GlobalFilters = JSON.parse(storedFilters);
        setSelectedPoleLead(filters.selectedPoleLead);
        setSelectedPoleAssocies(filters.selectedPoleAssocies);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des filtres globaux:', error);
    }
  };

  // Fonction pour sauvegarder les filtres globaux
  const saveGlobalFilters = useCallback((poleLead: PoleType | '', poleAssocies: PoleType | '') => {
    try {
      const filters: GlobalFilters = {
        selectedPoleLead: poleLead,
        selectedPoleAssocies: poleAssocies
      };
      localStorage.setItem(GLOBAL_FILTERS_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des filtres globaux:', error);
    }
  }, []);

  // Fonction pour mettre à jour les filtres globaux
  const updateGlobalFilters = useCallback((poleLead: PoleType | '', poleAssocies: PoleType | '') => {
    setSelectedPoleLead(poleLead);
    setSelectedPoleAssocies(poleAssocies);
    saveGlobalFilters(poleLead, poleAssocies);
  }, [saveGlobalFilters]);

  // Fonction pour réinitialiser les filtres
  const resetFilters = useCallback(() => {
    updateGlobalFilters('', '');
  }, [updateGlobalFilters]);

  return {
    selectedPoleLead,
    selectedPoleAssocies,
    updateGlobalFilters,
    resetFilters,
    POLE_OPTIONS
  };
};
