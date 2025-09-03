'use client';

import { useState } from 'react';
import { checkApiHealth } from '../../config/api';
import { useAuthApi } from '../../hooks/useApi';
import ApiStatusChecker from '../../components/ApiStatusChecker';
import HomeButton from '../../components/HomeButton';

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { login, loading, error } = useAuthApi();

  const addResult = (test: string, status: 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const runApiTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Health check
      addResult('Health Check', 'success', 'Démarrage du test...');
      const healthResult = await checkApiHealth();
      addResult('Health Check', healthResult ? 'success' : 'error', 
        healthResult ? 'API accessible' : 'API inaccessible');

      // Test 2: Login avec compte de test
      addResult('Login Test', 'success', 'Test de connexion...');
      try {
        const loginResult = await login('test@bms.com', 'password123');
        addResult('Login Test', 'success', 'Connexion réussie', {
          user: loginResult.user?.email,
          hasToken: !!loginResult.token
        });
      } catch (error) {
        addResult('Login Test', 'error', `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

      // Test 3: Test avec mauvais credentials
      addResult('Invalid Login Test', 'success', 'Test avec mauvais credentials...');
      try {
        await login('wrong@email.com', 'wrongpassword');
        addResult('Invalid Login Test', 'error', 'La connexion aurait dû échouer');
      } catch (error) {
        addResult('Invalid Login Test', 'success', 'Connexion correctement rejetée', {
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }

    } catch (error) {
      addResult('Tests Généraux', 'error', `Erreur lors des tests: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Bouton Accueil */}
      <div className="mb-6">
        <HomeButton variant="outline" size="sm" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Test de l'API BMS
          </h1>
          
          <div className="mb-6">
            <ApiStatusChecker showDetails={true} className="mb-4" />
            
            <div className="text-sm text-gray-600">
              <p><strong>URL de l'API:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Non définie'}</p>
              <p><strong>Environnement:</strong> {process.env.NODE_ENV || 'development'}</p>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={runApiTests}
              disabled={isRunning}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Tests en cours...' : 'Lancer les tests'}
            </button>
            
            <button
              onClick={clearResults}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Effacer les résultats
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <strong>Erreur:</strong> {error}
            </div>
          )}
        </div>

        {/* Résultats des tests */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Résultats des tests
            </h2>
            
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-3 h-3 rounded-full ${
                        result.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                      <span className="font-medium text-gray-900">
                        {result.test}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className={`mt-2 text-sm ${
                    result.status === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                  
                  {result.data && (
                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations de débogage */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔧 Informations de débogage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Variables d'environnement</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Non définie'}</p>
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'development'}</p>
                <p><strong>NEXT_PUBLIC_APP_NAME:</strong> {process.env.NEXT_PUBLIC_APP_NAME || 'Non définie'}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Configuration API</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>URL de base:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://bms-backend-9k8n.onrender.com'}</p>
                <p><strong>Timeout:</strong> 15000ms</p>
                <p><strong>Mode CORS:</strong> cors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
