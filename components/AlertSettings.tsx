'use client';

import React, { useState } from 'react';
import { useAlerts, type AlertSettings as AlertSettingsType } from '../hooks/useAlerts';

interface AlertSettingsProps {
  className?: string;
}

const AlertSettings: React.FC<AlertSettingsProps> = ({ className = '' }) => {
  const { settings, saveSettings } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<AlertSettingsType>(settings);

  // Mettre à jour tempSettings quand settings change
  React.useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSave = () => {
    saveSettings(tempSettings);
    // Forcer la régénération des alertes avec les nouveaux paramètres
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('alertSettingsChanged'));
    }, 100);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultSettings: AlertSettingsType = {
      montageAlertHours: 72,
      depotAlertHours: 24,
      timezone: 'UTC'
    };
    setTempSettings(defaultSettings);
  };

  return (
    <div className={className}>
      {/* Bouton pour ouvrir les paramètres */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <i className="ri-settings-3-line"></i>
        <span>Paramètres d&apos;alertes</span>
      </button>

      {/* Modal des paramètres */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Paramètres des Alertes
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Alerte montage administratif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alerte montage administratif
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={tempSettings.montageAlertHours}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      montageAlertHours: parseInt(e.target.value) || 72
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">heures avant</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Actuellement : {settings.montageAlertHours}h avant l&apos;échéance
                </p>
              </div>

              {/* Alerte dépôt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alerte dépôt
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={tempSettings.depotAlertHours}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      depotAlertHours: parseInt(e.target.value) || 24
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">heures avant</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Actuellement : {settings.depotAlertHours}h avant l&apos;échéance
                </p>
              </div>

              {/* Fuseau horaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuseau horaire
                </label>
                <select
                  value={tempSettings.timezone}
                  onChange={(e) => setTempSettings(prev => ({
                    ...prev,
                    timezone: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC">UTC (UTC+0)</option>
                  <option value="Europe/Paris">Europe/Paris (UTC+1/+2)</option>
                  <option value="America/New_York">America/New_York (UTC-5/-4)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Actuellement : {settings.timezone}
                </p>
              </div>

              {/* Informations */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <i className="ri-information-line text-blue-500 mt-0.5"></i>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Informations :</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Les alertes se mettent à jour automatiquement chaque minute</li>
                      <li>• Les alertes urgentes (≤1h) clignotent en rouge</li>
                      <li>• Les échéances dépassées s'affichent en rouge clignotant</li>
                      <li>• Les paramètres sont sauvegardés localement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Réinitialiser
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSettings;
