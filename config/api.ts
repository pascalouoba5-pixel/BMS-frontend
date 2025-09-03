// Configuration de l'API pour le frontend BMS
// Ce fichier remplace la configuration .env.local

export const API_CONFIG = {
  // URL de base de l'API backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // Configuration de l'environnement
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Nom de l'application
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'BMS',
  
  // Version de l'application
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Timeout des requêtes API (en millisecondes)
  REQUEST_TIMEOUT: 10000,
  
  // Nombre de tentatives de reconnexion
  MAX_RETRIES: 3,
  
  // Délai entre les tentatives (en millisecondes)
  RETRY_DELAY: 1000,
};

// Fonction pour obtenir l'URL complète d'un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour vérifier si l'API est accessible
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification de la santé de l\'API:', error);
    return false;
  }
};
