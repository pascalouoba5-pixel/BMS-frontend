'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import HomeButton from '../../components/HomeButton';
import Layout from '../../components/Layout';

export default function AccesReserve() {
  const { userRole } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | ''>('');
  const [period, setPeriod] = useState('30'); // Période prédéfinie
  const [useCustomDates, setUseCustomDates] = useState(false); // Utiliser des dates personnalisées
  const [startDate, setStartDate] = useState(''); // Date de début
  const [endDate, setEndDate] = useState(''); // Date de fin
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'tdr' | 'offres' | ''>('');

  // Vérifier les permissions
  if (userRole !== 's_admin' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-shield-cross-line text-2xl text-red-600"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux Super Administrateurs et Administrateurs uniquement.
          </p>
          <HomeButton />
        </div>
      </div>
    );
  }

  const handleCleanTDR = () => {
    // Validation des dates personnalisées
    if (useCustomDates && (!startDate || !endDate)) {
      setMessage('Veuillez sélectionner une date de début et une date de fin.');
      setMessageType('error');
      return;
    }
    
    if (useCustomDates && startDate > endDate) {
      setMessage('La date de début ne peut pas être postérieure à la date de fin.');
      setMessageType('error');
      return;
    }
    
    setActionType('tdr');
    setShowConfirmDialog(true);
  };

  const handleResetOffres = () => {
    setActionType('offres');
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      if (actionType === 'tdr') {
        // Simulation du nettoyage des TDR
        await new Promise(resolve => setTimeout(resolve, 2000));
        const messageText = useCustomDates 
          ? `Base TDR nettoyée avec succès pour les documents entre le ${startDate} et le ${endDate}.`
          : `Base TDR nettoyée avec succès pour les documents de plus de ${period} jours.`;
        setMessage(messageText);
        setMessageType('success');
      } else if (actionType === 'offres') {
        // Simulation de la réinitialisation des offres
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMessage('Données des offres réinitialisées avec succès.');
        setMessageType('success');
      }
    } catch (error) {
      setMessage('Une erreur est survenue lors de l\'opération.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
      setActionType('');
    }
  };

  const cancelAction = () => {
    setShowConfirmDialog(false);
    setActionType('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Accès Réservé</h1>
              <p className="text-gray-600">Fonctions d'administration avancées</p>
            </div>
            <HomeButton />
          </div>

          {/* Message d'alerte */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-alert-line text-yellow-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Attention - Opérations Irréversibles</h3>
                <p className="text-yellow-700 mb-3">
                  Les actions disponibles sur cette page sont <strong>irréversibles</strong> et peuvent affecter 
                  significativement les données du système. Assurez-vous d'avoir effectué une sauvegarde 
                  avant de procéder à ces opérations.
                </p>
                <div className="text-sm text-yellow-600">
                  <p><strong>Accès limité :</strong> Super Administrateurs et Administrateurs uniquement</p>
                  <p><strong>Recommandation :</strong> Effectuez ces opérations en dehors des heures de pointe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message de statut */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center space-x-2">
                <i className={`${
                  messageType === 'success' ? 'ri-check-line' :
                  messageType === 'error' ? 'ri-error-warning-line' :
                  'ri-information-line'
                }`}></i>
                <span>{message}</span>
              </div>
            </div>
          )}

          {/* Section Nettoyage TDR */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ri-file-clean-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Nettoyage Base TDR</h2>
                <p className="text-gray-600">
                  Supprime les documents TDR (Termes de Référence) anciens de la base de données 
                  pour optimiser les performances et libérer de l'espace de stockage.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période de conservation
                </label>
                <div className="space-y-4">
                  {/* Options prédéfinies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Période prédéfinie (jours)
                    </label>
                    <select
                      value={period}
                      onChange={(e) => {
                        setPeriod(e.target.value);
                        setUseCustomDates(false);
                      }}
                      disabled={useCustomDates}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="7">7 jours</option>
                      <option value="15">15 jours</option>
                      <option value="30">30 jours</option>
                      <option value="60">60 jours</option>
                      <option value="90">90 jours</option>
                      <option value="180">180 jours</option>
                    </select>
                  </div>
                  
                  {/* Option dates personnalisées */}
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        id="useCustomDates"
                        checked={useCustomDates}
                        onChange={(e) => setUseCustomDates(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="useCustomDates" className="text-sm font-medium text-gray-700">
                        Utiliser des dates personnalisées
                      </label>
                    </div>
                    
                    {useCustomDates && (
                      <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de début
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate || undefined}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de fin
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || undefined}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCleanTDR}
                  disabled={isLoading || (useCustomDates && (!startDate || !endDate))}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {isLoading && actionType === 'tdr' ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Nettoyage en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className="ri-delete-bin-line mr-2"></i>
                      Nettoyer Base TDR
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Ce que fait cette opération :</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {useCustomDates 
                  ? `Supprime tous les fichiers TDR entre le ${startDate} et le ${endDate}`
                  : `Supprime tous les fichiers TDR de plus de ${period} jours`
                }</li>
                <li>• Met à jour les références dans la base de données</li>
                <li>• Libère l'espace de stockage correspondant</li>
                <li>• Génère un rapport de nettoyage</li>
              </ul>
            </div>
          </div>

          {/* Section Réinitialisation Offres */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ri-refresh-line text-2xl text-orange-600"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Réinitialisation Données Offres</h2>
                <p className="text-gray-600">
                  Réinitialise complètement les données des offres. Cette opération supprime 
                  toutes les offres et leurs données associées de la base de données.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={handleResetOffres}
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {isLoading && actionType === 'offres' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Réinitialisation en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <i className="ri-delete-bin-6-line mr-2"></i>
                    Réinitialiser Toutes les Offres
                  </div>
                )}
              </button>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h4 className="font-semibold text-orange-800 mb-2">⚠️ ATTENTION - Opération Critique :</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Supprime <strong>TOUTES</strong> les offres de la base de données</li>
                <li>• Supprime toutes les répartitions et assignations</li>
                <li>• Supprime tous les commentaires et validations</li>
                <li>• Cette action est <strong>IRRÉVERSIBLE</strong></li>
                <li>• Assurez-vous d'avoir effectué une sauvegarde complète</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal de confirmation */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-error-warning-line text-xl text-red-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Confirmation Requise</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {actionType === 'tdr' 
                  ? useCustomDates
                    ? `Êtes-vous sûr de vouloir nettoyer la base TDR pour les documents entre le ${startDate} et le ${endDate} ?`
                    : `Êtes-vous sûr de vouloir nettoyer la base TDR pour les documents de plus de ${period} jours ?`
                  : 'Êtes-vous ABSOLUMENT sûr de vouloir réinitialiser toutes les données des offres ?'
                }
              </p>
              
              {actionType === 'offres' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-700 text-sm font-semibold">
                    ⚠️ Cette action supprimera définitivement toutes les offres et ne peut pas être annulée !
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={cancelAction}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-2 text-white rounded-xl transition-colors ${
                    actionType === 'offres' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
