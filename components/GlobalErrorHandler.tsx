import React, { useState, useEffect } from 'react';

interface GlobalError {
  id: string;
  message: string;
  timestamp: Date;
  type: 'error' | 'warning' | 'info';
  source?: string;
  details?: string;
}

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({ children }) => {
  const [errors, setErrors] = useState<GlobalError[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    // Écouter les erreurs globales
    const handleGlobalError = (event: ErrorEvent) => {
      addError({
        message: event.message || 'Une erreur JavaScript est survenue',
        type: 'error',
        source: event.filename,
        details: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addError({
        message: event.reason?.message || 'Une promesse a été rejetée',
        type: 'error',
        details: event.reason?.stack
      });
    };

    // Écouter les erreurs de l'API
    const handleApiError = (event: CustomEvent) => {
      addError({
        message: event.detail?.message || 'Erreur API',
        type: 'error',
        source: event.detail?.source || 'API',
        details: event.detail?.details
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('api-error', handleApiError as EventListener);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('api-error', handleApiError as EventListener);
    };
  }, []);

  const addError = (error: Omit<GlobalError, 'id' | 'timestamp'>) => {
    const newError: GlobalError = {
      ...error,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setErrors(prev => [newError, ...prev.slice(0, 9)]); // Garder max 10 erreurs
    setShowErrors(true);

    // Masquer automatiquement après 10 secondes
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.id !== newError.id));
    }, 10000);
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  const clearAllErrors = () => {
    setErrors([]);
    setShowErrors(false);
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getErrorColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700';
    }
  };

  if (errors.length === 0) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Bouton pour afficher/masquer les erreurs */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowErrors(!showErrors)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
          title={`${errors.length} erreur${errors.length > 1 ? 's' : ''} détectée${errors.length > 1 ? 's' : ''}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {errors.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {errors.length > 9 ? '9+' : errors.length}
            </span>
          )}
        </button>
      </div>

      {/* Panneau des erreurs */}
      {showErrors && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-end p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gestionnaire d'erreurs
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearAllErrors}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Tout effacer
                </button>
                <button
                  onClick={() => setShowErrors(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className={`p-4 border-l-4 ${getErrorColor(error.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getErrorIcon(error.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {error.message}
                      </p>
                      {error.source && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Source: {error.source}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {error.timestamp.toLocaleTimeString()}
                      </p>
                      {error.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                            Détails techniques
                          </summary>
                          <pre className="text-xs text-gray-600 dark:text-gray-300 mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
                            {error.details}
                          </pre>
                        </details>
                      )}
                    </div>
                    <button
                      onClick={() => removeError(error.id)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalErrorHandler;
