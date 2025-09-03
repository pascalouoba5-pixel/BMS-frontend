'use client';

import React, { useState, useEffect } from 'react';
import { useAlerts, Alert } from '../hooks/useAlerts';

interface AlertBannerProps {
  className?: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ className = '' }) => {
  const { alerts, isVisible, toggleAlerts, closeAlert } = useAlerts();
  const [isClient, setIsClient] = useState(false);

  // Marquer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Afficher un loader pendant l'hydratation
  if (!isClient) {
    return null;
  }

  if (!isVisible || alerts.length === 0) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {/* Bouton pour masquer/afficher les alertes */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleAlerts}
          className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-700 transition-colors"
          title="Masquer les alertes"
        >
          ✕
        </button>
      </div>

      {/* Bannière d'alertes */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <h3 className="font-semibold text-lg">
                Alertes d'échéances ({alerts.length})
              </h3>
            </div>
            <div className="text-sm opacity-90">
              Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>

          <div className="space-y-2">
            {alerts.map((alert) => {
              return (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                    alert.isExpired
                      ? 'bg-red-800 border-red-400 animate-pulse'
                      : alert.isUrgent
                      ? 'bg-red-600 border-red-300 animate-pulse'
                      : 'bg-orange-600 border-orange-300'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold">{alert.title}</span>
                      {alert.isUrgent && (
                        <span className="bg-red-400 text-red-900 px-2 py-1 rounded-full text-xs font-bold">
                          URGENT
                        </span>
                      )}
                      {alert.isExpired && (
                        <span className="bg-red-400 text-red-900 px-2 py-1 rounded-full text-xs font-bold">
                          EXPIRÉ
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-90 mb-1">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="font-mono bg-black/20 px-2 py-1 rounded">
                        {alert.timeRemaining}
                      </span>
                      {alert.offreTitle && (
                        <span className="opacity-75">
                          Offre: {alert.offreTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => closeAlert(alert.id)}
                    className="ml-4 text-white/80 hover:text-white transition-colors"
                    title="Fermer cette alerte"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
