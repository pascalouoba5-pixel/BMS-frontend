// Service API pour communiquer avec le backend Render
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://amd-back-parc.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Méthode générique pour les appels API
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      console.log(`🌐 [API] Appel vers: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ [API] Réponse reçue:`, data);
      return data;

    } catch (error) {
      console.error(`❌ [API] Erreur lors de l'appel vers ${url}:`, error);
      throw error;
    }
  }

  // Méthodes d'authentification
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(token) {
    return this.request('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Méthodes pour le dashboard
  async getDashboardData(token) {
    return this.request('/api/dashboard/complete', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Méthode de test de connectivité
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ [Health Check] Erreur:', error);
      return false;
    }
  }

  // Méthode pour obtenir la configuration actuelle
  getConfig() {
    return {
      baseURL: this.baseURL,
      environment: process.env.NODE_ENV,
      apiUrl: process.env.REACT_APP_API_URL,
    };
  }
}

// Instance singleton du service API
const apiService = new ApiService();

export default apiService;
