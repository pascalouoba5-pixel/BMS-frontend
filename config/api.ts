// Configuration de l'API pour le frontend BMS
// Ce fichier configure l'API pour fonctionner avec le backend Render

export const API_CONFIG = {
  // URL de base de l'API backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bms-backend-9k8n.onrender.com',
  
  // Configuration de l'environnement
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Nom de l'application
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'BMS',
  
  // Version de l'application
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Timeout des requêtes API (en millisecondes)
  REQUEST_TIMEOUT: 15000, // Augmenté pour Render
  
  // Nombre de tentatives de reconnexion
  MAX_RETRIES: 3,
  
  // Délai entre les tentatives (en millisecondes)
  RETRY_DELAY: 1000,
  
  // Configuration CORS
  CORS_MODE: 'cors' as RequestMode,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Fonction pour obtenir l'URL complète d'un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour vérifier si l'API est accessible
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    console.log('🔍 [API] Vérification de la santé de l\'API...');
    console.log('🌐 [API] URL testée:', `${API_CONFIG.BASE_URL}/api/health`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: API_CONFIG.CORS_MODE,
    });
    
    console.log('📊 [API] Status de santé:', response.status, response.statusText);
    
    if (response.ok) {
      const healthData = await response.json();
      console.log('✅ [API] API en bonne santé:', healthData);
      return true;
    } else {
      console.log('❌ [API] API en mauvaise santé:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ [API] Erreur lors de la vérification de la santé de l\'API:', error);
    return false;
  }
};

// Fonction pour obtenir la configuration actuelle
export const getCurrentConfig = () => {
  return {
    baseUrl: API_CONFIG.BASE_URL,
    environment: API_CONFIG.NODE_ENV,
    appName: API_CONFIG.APP_NAME,
    appVersion: API_CONFIG.APP_VERSION,
    timeout: API_CONFIG.REQUEST_TIMEOUT,
  };
};
