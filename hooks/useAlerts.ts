'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timeRemaining: string;
  offreId?: number;
  offreTitle?: string;
  isUrgent: boolean;
  isExpired: boolean;
}

export interface AlertSettings {
  montageAlertHours: number;
  depotAlertHours: number;
  timezone: string;
}

const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  montageAlertHours: 72,
  depotAlertHours: 24,
  timezone: 'UTC'
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<AlertSettings>(DEFAULT_ALERT_SETTINGS);
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Marquer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger les paramètres d'alerte depuis localStorage
  useEffect(() => {
    if (!isClient) return;

    const savedSettings = localStorage.getItem('alertSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres d\'alerte:', error);
        setSettings(DEFAULT_ALERT_SETTINGS);
        localStorage.setItem('alertSettings', JSON.stringify(DEFAULT_ALERT_SETTINGS));
      }
    } else {
      // Initialiser avec les paramètres par défaut si aucun paramètre n'est sauvegardé
      setSettings(DEFAULT_ALERT_SETTINGS);
      localStorage.setItem('alertSettings', JSON.stringify(DEFAULT_ALERT_SETTINGS));
    }
  }, [isClient]);

  // Sauvegarder les paramètres d'alerte
  const saveSettings = useCallback((newSettings: AlertSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alertSettings', JSON.stringify(newSettings));
    }
  }, []);

  // Calculer le temps restant
  const calculateTimeRemaining = useCallback((deadline: Date): string => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Échéance dépassée';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}j ${remainingHours}h ${minutes}m`;
    }
    
    return `${hours}h ${minutes}m`;
  }, []);

  // Vérifier si une date est dans la période d'alerte
  const isInAlertPeriod = useCallback((date: Date, alertHours: number): boolean => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hoursDiff = diff / (1000 * 60 * 60);
    
    return hoursDiff > 0 && hoursDiff <= alertHours;
  }, []);

  // Vérifier si une date est expirée
  const isExpired = useCallback((date: Date): boolean => {
    const now = new Date();
    return date.getTime() <= now.getTime();
  }, []);

  // Vérifier si une alerte est urgente (moins de 2 heures)
  const isUrgent = useCallback((date: Date): boolean => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hoursDiff = diff / (1000 * 60 * 60);
    
    return hoursDiff > 0 && hoursDiff <= 2;
  }, []);

  // Générer les alertes
  const generateAlerts = useCallback(() => {
    if (!isClient) return;

    try {
      const offresData = localStorage.getItem('offres');
      if (!offresData) {
        setAlerts([]);
        return;
      }

      const offres = JSON.parse(offresData);
      const newAlerts: Alert[] = [];

      offres.forEach((offre: any) => {
        // Alerte pour le montage administratif
        if (offre.delaiTransmissionMontageAdministratif) {
          const montageDate = new Date(offre.delaiTransmissionMontageAdministratif);
          
          if (isInAlertPeriod(montageDate, settings.montageAlertHours)) {
            newAlerts.push({
              id: `montage-${offre.id}`,
              type: isUrgent(montageDate) ? 'error' : 'warning',
              title: 'Montage Administratif',
              message: `Échéance pour le montage administratif de l'offre "${offre.intituleOffre}"`,
              timeRemaining: calculateTimeRemaining(montageDate),
              offreId: offre.id,
              offreTitle: offre.intituleOffre,
              isUrgent: isUrgent(montageDate),
              isExpired: isExpired(montageDate)
            });
          }
        }

        // Alerte pour le dépôt
        if (offre.dateDepotPrevu) {
          const depotDate = new Date(offre.dateDepotPrevu);
          
          if (isInAlertPeriod(depotDate, settings.depotAlertHours)) {
            newAlerts.push({
              id: `depot-${offre.id}`,
              type: isUrgent(depotDate) ? 'error' : 'warning',
              title: 'Dépôt d\'Offre',
              message: `Échéance pour le dépôt de l'offre "${offre.intituleOffre}"`,
              timeRemaining: calculateTimeRemaining(depotDate),
              offreId: offre.id,
              offreTitle: offre.intituleOffre,
              isUrgent: isUrgent(depotDate),
              isExpired: isExpired(depotDate)
            });
          }
        }
      });

      // Trier les alertes par urgence (urgentes en premier)
      newAlerts.sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return 0;
      });

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Erreur lors de la génération des alertes:', error);
      setAlerts([]);
    }
  }, [settings, calculateTimeRemaining, isInAlertPeriod, isExpired, isUrgent, isClient]);

  // Mettre à jour les alertes chaque minute et quand les paramètres changent
  useEffect(() => {
    if (!isClient) return;

    generateAlerts();
    
    const interval = setInterval(() => {
      generateAlerts();
    }, 60000); // Mise à jour chaque minute

    // Écouter les changements de paramètres
    const handleSettingsChange = () => {
      generateAlerts();
    };
    
    // Écouter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'offres' || e.key === 'alertSettings') {
        generateAlerts();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('alertSettingsChanged', handleSettingsChange);
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('alertSettingsChanged', handleSettingsChange);
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [generateAlerts, isClient]);

  // Masquer/Afficher les alertes
  const toggleAlerts = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  // Fermer une alerte spécifique
  const closeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  return {
    alerts,
    settings,
    isVisible,
    saveSettings,
    toggleAlerts,
    closeAlert,
    generateAlerts
  };
};
