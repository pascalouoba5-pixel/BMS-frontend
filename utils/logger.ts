// Service de logging centralisé pour l'application BMS

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Limite le nombre de logs en mémoire
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const context = entry.context ? `[${entry.context}]` : '';
    const level = `[${entry.level}]`;
    
    let message = `${timestamp} ${level} ${context} ${entry.message}`;
    
    if (entry.data) {
      message += ` | Data: ${JSON.stringify(entry.data)}`;
    }
    
    if (entry.error) {
      message += ` | Error: ${entry.error.message}`;
      if (entry.error.stack) {
        message += ` | Stack: ${entry.error.stack}`;
      }
    }
    
    return message;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // En développement, afficher dans la console
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(entry);
      
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          console.error(formattedMessage);
          break;
      }
    }

    // En production, envoyer au service de monitoring si configuré
    if (!this.isDevelopment && entry.level >= LogLevel.ERROR) {
      this.sendToMonitoring(entry);
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // Ici vous pouvez intégrer avec des services comme Sentry, LogRocket, etc.
      // Pour l'instant, on enregistre dans localStorage pour debug
      if (typeof window !== 'undefined') {
        const monitoringLogs = JSON.parse(localStorage.getItem('bms_monitoring_logs') || '[]');
        monitoringLogs.push(entry);
        localStorage.setItem('bms_monitoring_logs', JSON.stringify(monitoringLogs.slice(-100)));
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi au monitoring:', error);
    }
  }

  debug(message: string, context?: string, data?: any) {
    this.addLog({
      level: LogLevel.DEBUG,
      message,
      context,
      data,
      timestamp: new Date().toISOString()
    });
  }

  info(message: string, context?: string, data?: any) {
    this.addLog({
      level: LogLevel.INFO,
      message,
      context,
      data,
      timestamp: new Date().toISOString()
    });
  }

  warn(message: string, context?: string, data?: any) {
    this.addLog({
      level: LogLevel.WARN,
      message,
      context,
      data,
      timestamp: new Date().toISOString()
    });
  }

  error(message: string, error?: Error, context?: string, data?: any) {
    this.addLog({
      level: LogLevel.ERROR,
      message,
      error,
      context,
      data,
      timestamp: new Date().toISOString()
    });
  }

  critical(message: string, error?: Error, context?: string, data?: any) {
    this.addLog({
      level: LogLevel.CRITICAL,
      message,
      error,
      context,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Log spécifique pour les erreurs API
  apiError(endpoint: string, error: Error, response?: Response, data?: any) {
    this.error(`Erreur API sur ${endpoint}`, error, 'API', {
      endpoint,
      status: response?.status,
      statusText: response?.statusText,
      url: response?.url,
      data
    });
  }

  // Log spécifique pour les erreurs de dashboard
  dashboardError(operation: string, error: Error, filters?: any, data?: any) {
    this.error(`Erreur Dashboard: ${operation}`, error, 'Dashboard', {
      operation,
      filters,
      data
    });
  }

  // Log spécifique pour les erreurs d'authentification
  authError(operation: string, error: Error, data?: any) {
    this.error(`Erreur Auth: ${operation}`, error, 'Auth', data);
  }

  // Récupérer les logs récents
  getRecentLogs(level?: LogLevel, limit: number = 50): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-limit);
  }

  // Exporter les logs (utile pour le debug)
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Nettoyer les logs
  clearLogs() {
    this.logs = [];
  }

  // Obtenir des statistiques sur les logs
  getLogStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<LogLevel, number>,
      recentErrors: this.logs.filter(log => log.level >= LogLevel.ERROR).slice(-10)
    };

    Object.values(LogLevel).forEach(level => {
      stats.byLevel[level] = this.logs.filter(log => log.level === level).length;
    });

    return stats;
  }
}

// Instance singleton du logger
export const logger = new Logger();

// Fonctions utilitaires pour un usage plus simple
export const logDebug = (message: string, context?: string, data?: any) => logger.debug(message, context, data);
export const logInfo = (message: string, context?: string, data?: any) => logger.info(message, context, data);
export const logWarn = (message: string, context?: string, data?: any) => logger.warn(message, context, data);
export const logError = (message: string, error?: Error, context?: string, data?: any) => logger.error(message, error, context, data);
export const logCritical = (message: string, error?: Error, context?: string, data?: any) => logger.critical(message, error, context, data);

export default logger;
