export interface ApiErrorConfig {
  code: string;
  userMessage: string;
  technicalMessage?: string;
  action?: string;
  severity: 'error' | 'warning' | 'info';
}

export const API_ERROR_CONFIGS: Record<string, ApiErrorConfig> = {
  // Erreurs d'authentification
  'AUTH_TOKEN_MISSING': {
    code: 'AUTH_TOKEN_MISSING',
    userMessage: 'Session expirée. Veuillez vous reconnecter.',
    technicalMessage: 'Token d\'authentification manquant',
    action: 'redirect_to_login',
    severity: 'warning'
  },
  'AUTH_TOKEN_INVALID': {
    code: 'AUTH_TOKEN_INVALID',
    userMessage: 'Session expirée. Veuillez vous reconnecter.',
    technicalMessage: 'Token d\'authentification invalide',
    action: 'redirect_to_login',
    severity: 'warning'
  },
  'AUTH_TOKEN_EXPIRED': {
    code: 'AUTH_TOKEN_EXPIRED',
    userMessage: 'Session expirée. Veuillez vous reconnecter.',
    technicalMessage: 'Token d\'authentification expiré',
    action: 'redirect_to_login',
    severity: 'warning'
  },

  // Erreurs de validation
  'VALIDATION_ERROR': {
    code: 'VALIDATION_ERROR',
    userMessage: 'Les données saisies ne sont pas valides. Veuillez vérifier et réessayer.',
    technicalMessage: 'Erreur de validation des données',
    action: 'show_validation_errors',
    severity: 'warning'
  },
  'REQUIRED_FIELD_MISSING': {
    code: 'REQUIRED_FIELD_MISSING',
    userMessage: 'Certains champs obligatoires sont manquants. Veuillez les remplir.',
    technicalMessage: 'Champs obligatoires manquants',
    action: 'highlight_missing_fields',
    severity: 'warning'
  },

  // Erreurs de base de données
  'DATABASE_CONNECTION_ERROR': {
    code: 'DATABASE_CONNECTION_ERROR',
    userMessage: 'Impossible de se connecter à la base de données. Veuillez réessayer plus tard.',
    technicalMessage: 'Erreur de connexion à la base de données',
    action: 'retry_after_delay',
    severity: 'error'
  },
  'DATABASE_QUERY_ERROR': {
    code: 'DATABASE_QUERY_ERROR',
    userMessage: 'Erreur lors de la récupération des données. Veuillez réessayer.',
    technicalMessage: 'Erreur de requête base de données',
    action: 'retry_operation',
    severity: 'error'
  },
  'RECORD_NOT_FOUND': {
    code: 'RECORD_NOT_FOUND',
    userMessage: 'L\'élément demandé n\'a pas été trouvé.',
    technicalMessage: 'Enregistrement non trouvé dans la base de données',
    action: 'show_empty_state',
    severity: 'info'
  },

  // Erreurs de permissions
  'PERMISSION_DENIED': {
    code: 'PERMISSION_DENIED',
    userMessage: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.',
    technicalMessage: 'Accès refusé - permissions insuffisantes',
    action: 'show_permission_error',
    severity: 'error'
  },
  'INSUFFICIENT_PRIVILEGES': {
    code: 'INSUFFICIENT_PRIVILEGES',
    userMessage: 'Privilèges insuffisants pour cette opération.',
    technicalMessage: 'Privilèges insuffisants',
    action: 'show_permission_error',
    severity: 'error'
  },

  // Erreurs de réseau
  'NETWORK_ERROR': {
    code: 'NETWORK_ERROR',
    userMessage: 'Erreur de connexion réseau. Vérifiez votre connexion internet.',
    technicalMessage: 'Erreur de connexion réseau',
    action: 'retry_after_delay',
    severity: 'error'
  },
  'TIMEOUT_ERROR': {
    code: 'TIMEOUT_ERROR',
    userMessage: 'La requête a pris trop de temps. Veuillez réessayer.',
    technicalMessage: 'Délai d\'attente dépassé',
    action: 'retry_operation',
    severity: 'warning'
  },
  'SERVER_UNAVAILABLE': {
    code: 'SERVER_UNAVAILABLE',
    userMessage: 'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.',
    technicalMessage: 'Serveur indisponible',
    action: 'retry_after_delay',
    severity: 'error'
  },

  // Erreurs spécifiques aux offres
  'OFFRE_NOT_FOUND': {
    code: 'OFFRE_NOT_FOUND',
    userMessage: 'L\'offre demandée n\'existe pas ou a été supprimée.',
    technicalMessage: 'Offre non trouvée dans la base de données',
    action: 'show_empty_state',
    severity: 'info'
  },
  'OFFRE_ALREADY_EXISTS': {
    code: 'OFFRE_ALREADY_EXISTS',
    userMessage: 'Une offre similaire existe déjà.',
    technicalMessage: 'Conflit - offre déjà existante',
    action: 'show_duplicate_error',
    severity: 'warning'
  },

  // Erreurs de répartition
  'REPARTITION_NOT_FOUND': {
    code: 'REPARTITION_NOT_FOUND',
    userMessage: 'Aucune répartition trouvée pour cette offre.',
    technicalMessage: 'Répartition non trouvée',
    action: 'show_empty_state',
    severity: 'info'
  },

  // Erreurs de suivi des résultats
  'SUIVI_RESULTAT_NOT_FOUND': {
    code: 'SUIVI_RESULTAT_NOT_FOUND',
    userMessage: 'Aucun suivi de résultat trouvé.',
    technicalMessage: 'Suivi de résultat non trouvé',
    action: 'show_empty_state',
    severity: 'info'
  },

  // Erreurs de modalités des pôles
  'MODALITE_POLE_NOT_FOUND': {
    code: 'MODALITE_POLE_NOT_FOUND',
    userMessage: 'Aucune modalité de pôle trouvée.',
    technicalMessage: 'Modalité de pôle non trouvée',
    action: 'show_empty_state',
    severity: 'info'
  },

  // Erreurs d'alertes
  'ALERTE_NOT_FOUND': {
    code: 'ALERTE_NOT_FOUND',
    userMessage: 'Aucune alerte trouvée.',
    technicalMessage: 'Alerte non trouvée',
    action: 'show_empty_state',
    severity: 'info'
  },

  // Erreurs de recherche
  'SEARCH_NO_RESULTS': {
    code: 'SEARCH_NO_RESULTS',
    userMessage: 'Aucun résultat trouvé pour votre recherche.',
    technicalMessage: 'Recherche sans résultat',
    action: 'show_empty_search_results',
    severity: 'info'
  },

  // Erreurs génériques
  'INTERNAL_SERVER_ERROR': {
    code: 'INTERNAL_SERVER_ERROR',
    userMessage: 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.',
    technicalMessage: 'Erreur interne du serveur',
    action: 'retry_after_delay',
    severity: 'error'
  },
  'UNKNOWN_ERROR': {
    code: 'UNKNOWN_ERROR',
    userMessage: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    technicalMessage: 'Erreur inconnue',
    action: 'retry_operation',
    severity: 'error'
  }
};

// Fonction pour obtenir la configuration d'erreur par code
export function getApiErrorConfig(errorCode: string): ApiErrorConfig {
  return API_ERROR_CONFIGS[errorCode] || API_ERROR_CONFIGS['UNKNOWN_ERROR'];
}

// Fonction pour mapper les codes d'erreur HTTP vers nos codes d'erreur
export function mapHttpErrorToApiError(httpStatus: number, errorMessage?: string): ApiErrorConfig {
  switch (httpStatus) {
    case 400:
      return {
        code: 'VALIDATION_ERROR',
        userMessage: 'Données invalides. Veuillez vérifier et réessayer.',
        technicalMessage: errorMessage || 'Bad Request',
        action: 'show_validation_errors',
        severity: 'warning'
      };
    case 401:
      return {
        code: 'AUTH_TOKEN_MISSING',
        userMessage: 'Session expirée. Veuillez vous reconnecter.',
        technicalMessage: errorMessage || 'Unauthorized',
        action: 'redirect_to_login',
        severity: 'warning'
      };
    case 403:
      return {
        code: 'PERMISSION_DENIED',
        userMessage: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
        technicalMessage: errorMessage || 'Forbidden',
        action: 'show_permission_error',
        severity: 'error'
      };
    case 404:
      return {
        code: 'RECORD_NOT_FOUND',
        userMessage: 'L\'élément demandé n\'a pas été trouvé.',
        technicalMessage: errorMessage || 'Not Found',
        action: 'show_empty_state',
        severity: 'info'
      };
    case 408:
      return {
        code: 'TIMEOUT_ERROR',
        userMessage: 'La requête a pris trop de temps. Veuillez réessayer.',
        technicalMessage: errorMessage || 'Request Timeout',
        action: 'retry_operation',
        severity: 'warning'
      };
    case 500:
      return {
        code: 'INTERNAL_SERVER_ERROR',
        userMessage: 'Erreur interne du serveur. Veuillez réessayer plus tard.',
        technicalMessage: errorMessage || 'Internal Server Error',
        action: 'retry_after_delay',
        severity: 'error'
      };
    case 502:
    case 503:
    case 504:
      return {
        code: 'SERVER_UNAVAILABLE',
        userMessage: 'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.',
        technicalMessage: errorMessage || 'Server Unavailable',
        action: 'retry_after_delay',
        severity: 'error'
      };
    default:
      return {
        code: 'UNKNOWN_ERROR',
        userMessage: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
        technicalMessage: errorMessage || `HTTP ${httpStatus}`,
        action: 'retry_operation',
        severity: 'error'
      };
  }
}

// Fonction pour formater le message d'erreur pour l'utilisateur
export function formatUserErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.code && API_ERROR_CONFIGS[error.code]) {
    return API_ERROR_CONFIGS[error.code].userMessage;
  }
  
  if (error?.status) {
    return mapHttpErrorToApiError(error.status, error.message).userMessage;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
}

// Fonction pour obtenir l'action recommandée pour une erreur
export function getRecommendedAction(error: any): string | undefined {
  if (error?.code && API_ERROR_CONFIGS[error.code]) {
    return API_ERROR_CONFIGS[error.code].action;
  }
  
  if (error?.status) {
    return mapHttpErrorToApiError(error.status).action;
  }
  
  return undefined;
}
