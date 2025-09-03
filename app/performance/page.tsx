'use client';

import { useState, useEffect } from 'react';
// Types pour les performances
interface PerformanceOverview {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
}

interface PerformancePoles {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  growth: number;
}

interface PerformanceCommerciaux {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  conversionRate: number;
}

// API simulée pour les performances
const performanceAPI = {
  async getOverview(startDate: string, endDate: string) {
    // Simulation d'appel API
    return {
      data: {
        totalRevenue: 125000,
        totalOrders: 450,
        averageOrderValue: 278,
        growthRate: 15.5
      }
    };
  },
  
  async getPoles(startDate: string, endDate: string) {
    return {
      data: [
        { id: '1', name: 'Pôle Informatique', revenue: 45000, orders: 180, growth: 12.5 },
        { id: '2', name: 'Pôle Commercial', revenue: 35000, orders: 120, growth: 18.2 },
        { id: '3', name: 'Pôle Marketing', revenue: 45000, orders: 150, growth: 22.1 }
      ]
    };
  },
  
  async getCommerciaux(startDate: string, endDate: string) {
    return {
      data: [
        { id: '1', name: 'Jean Dupont', revenue: 25000, orders: 85, conversionRate: 68 },
        { id: '2', name: 'Marie Martin', revenue: 22000, orders: 72, conversionRate: 71 },
        { id: '3', name: 'Pierre Durand', revenue: 18000, orders: 65, conversionRate: 62 }
      ]
    };
  }
};
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import HomeButton from '../../components/HomeButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function PerformancePage() {
  return (
    <ProtectedRoute pageName="performance">
      <Layout>
        <PerformanceContent />
      </Layout>
    </ProtectedRoute>
  );
}

function PerformanceContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour les données
  const [overview, setOverview] = useState<PerformanceOverview | null>(null);
  const [poles, setPoles] = useState<PerformancePoles[]>([]);
  const [commerciaux, setCommerciaux] = useState<PerformanceCommerciaux[]>([]);
  
  // Filtre de période
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // 1er janvier de l'année en cours
    endDate: new Date().toISOString().split('T')[0] // Aujourd'hui
  });

  // Charger les données selon l'onglet actif
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab, dateRange]);

  const loadTabData = async (tab: string) => {
    setLoading(true);
    setError(null);
    
    try {
      switch (tab) {
        case 'overview':
          const overviewData = await performanceAPI.getOverview(dateRange.startDate, dateRange.endDate);
          setOverview(overviewData.data);
          break;
        case 'poles':
          const polesData = await performanceAPI.getPoles(dateRange.startDate, dateRange.endDate);
          setPoles(polesData.data);
          break;
        case 'commerciaux':
          const commerciauxData = await performanceAPI.getCommerciaux(dateRange.startDate, dateRange.endDate);
          setCommerciaux(commerciauxData.data);
          break;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'poles', label: 'Analyse par pôle', icon: '🏢' },
    { id: 'commerciaux', label: 'Commerciaux', icon: '👥' }
  ];

  return (
    <div className="p-6">
      {/* Bouton Accueil */}
      <div className="mb-6">
        <HomeButton />
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Suivi de Performance
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Analysez les performances de votre équipe et identifiez les opportunités d'amélioration
          </p>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <nav className="-mb-px flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => loadTabData(activeTab)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="p-4">
              {activeTab === 'overview' && <OverviewTab data={overview} dateRange={dateRange} setDateRange={setDateRange} />}
              {activeTab === 'poles' && <PolesTab data={poles} />}
              {activeTab === 'commerciaux' && <CommerciauxTab data={commerciaux} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant Vue d'ensemble
function OverviewTab({ 
  data, 
  dateRange, 
  setDateRange 
}: { 
  data: PerformanceOverview | null;
  dateRange: { startDate: string; endDate: string };
  setDateRange: React.Dispatch<React.SetStateAction<{ startDate: string; endDate: string }>>;
}) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Filtre de période */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📅 Filtre de période</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            onClick={() => {
              setDateRange({
                startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              });
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Année en cours
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📊 Statistiques globales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Offres"
            value={data.stats.totalOffres}
            icon="📋"
            color="blue"
          />
          <StatCard
            title="Offres Approuvées"
            value={data.stats.offresApprouvees}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Offres Rejetées"
            value={data.stats.offresRejetees || 0}
            icon="❌"
            color="red"
          />
          <StatCard
            title="Taux Gagnées"
            value={`${data.stats.tauxGagnees || 0}%`}
            icon="🏆"
            color="green"
          />
          <StatCard
            title="Taux Perdues"
            value={`${data.stats.tauxPerdues || 0}%`}
            icon="📉"
            color="red"
          />
          <StatCard
            title="En cours"
            value={`${data.stats.tauxEnCours || 0}%`}
            icon="⏳"
            color="blue"
          />
        </div>
      </div>

      {/* Statistiques par type d'offre */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🏷️ Statistiques par type d'offre</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tableau des types d'offre */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gagnées</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Perdues</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taux G.</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taux P.</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.typesOffre?.map((type) => (
                  <tr key={type.nom}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {type.nom}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                      {type.total}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-green-600">
                      {type.gagnees}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-red-600">
                      {type.perdues}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-green-600">
                      {type.tauxGagnees}%
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-red-600">
                      {type.tauxPerdues}%
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={6} className="px-3 py-2 text-sm text-center text-gray-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Graphique en barres empilées */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.typesOffre || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gagnees" stackId="a" fill="#10B981" name="Gagnées" />
                <Bar dataKey="perdues" stackId="a" fill="#EF4444" name="Perdues" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graphiques circulaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition Approuvées/Rejetées */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📊 Répartition Approuvées/Rejetées</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Approuvées', value: data.stats.offresApprouvees, color: '#10B981' },
                    { name: 'Rejetées', value: data.stats.offresRejetees || 0, color: '#EF4444' },
                    { name: 'En cours', value: (data.stats.totalOffres - (data.stats.offresApprouvees + (data.stats.offresRejetees || 0))), color: '#3B82F6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {[
                    { name: 'Approuvées', value: data.stats.offresApprouvees, color: '#10B981' },
                    { name: 'Rejetées', value: data.stats.offresRejetees || 0, color: '#EF4444' },
                    { name: 'En cours', value: (data.stats.totalOffres - (data.stats.offresApprouvees + (data.stats.offresRejetees || 0))), color: '#3B82F6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taux Gagnées/Perdues */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🎯 Taux Gagnées/Perdues</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Gagnées', value: data.stats.tauxGagnees || 0, color: '#10B981' },
                    { name: 'Perdues', value: data.stats.tauxPerdues || 0, color: '#EF4444' },
                    { name: 'En cours', value: data.stats.tauxEnCours || 0, color: '#3B82F6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {[
                    { name: 'Gagnées', value: data.stats.tauxGagnees || 0, color: '#10B981' },
                    { name: 'Perdues', value: data.stats.tauxPerdues || 0, color: '#EF4444' },
                    { name: 'En cours', value: data.stats.tauxEnCours || 0, color: '#3B82F6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Analyse par pôle
function PolesTab({ data }: { data: PerformancePoles[] }) {
  const [polesDetailed, setPolesDetailed] = useState<PerformancePolesDetailed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Charger les données détaillées des pôles
  useEffect(() => {
    loadPolesDetailed();
  }, [dateRange]);

  const loadPolesDetailed = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await performanceAPI.getPolesDetailed(dateRange.startDate, dateRange.endDate);
      if (response.success) {
        setPolesDetailed(response.data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={loadPolesDetailed}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!polesDetailed.length) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 text-xl mb-4">📊</div>
        <p className="text-gray-500">Aucune donnée disponible pour la période sélectionnée</p>
      </div>
    );
  }

  // Trier les pôles par performance (taux de succès)
  const sortedPoles = [...polesDetailed].sort((a, b) => b.tauxSucces - a.tauxSucces);

  return (
    <div className="space-y-6">
      {/* Filtre de période */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📅 Filtre de période</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            onClick={() => {
              setDateRange({
                startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              });
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Année en cours
          </button>
        </div>
      </div>

      {/* KPI Cards pour chaque pôle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedPoles.map((pole, index) => (
          <div key={pole.nom} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pole.nom}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                #{index + 1}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pole.offresLeadAttribuees}</div>
                <div className="text-sm text-gray-500">Lead attribuées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{pole.offresAssocieAttribuees}</div>
                <div className="text-sm text-gray-500">Associé attribuées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{pole.offresLeadMontees}</div>
                <div className="text-sm text-gray-500">Lead montées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{pole.offresAssocieMontees}</div>
                <div className="text-sm text-gray-500">Associé montées</div>
              </div>
            </div>

            {/* Barres de taux empilées */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Succès</span>
                <span className="font-medium">{pole.tauxSucces}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${pole.tauxSucces}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Perte</span>
                <span className="font-medium">{pole.tauxPerte}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${pole.tauxPerte}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>En cours</span>
                <span className="font-medium">{pole.tauxAttente}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${pole.tauxAttente}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau comparatif par pôle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📊 Tableau comparatif par pôle</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pôle</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Classement</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Offres</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Attribuées</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Associé Attribuées</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Montées</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Associé Montées</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taux Succès</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taux Perte</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taux Attente</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedPoles.map((pole, index) => (
                <tr key={pole.nom} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {pole.nom}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                    {pole.totalOffres}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-blue-600">
                    {pole.offresLeadAttribuees}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-green-600">
                    {pole.offresAssocieAttribuees}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-purple-600">
                    {pole.offresLeadMontees}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-indigo-600">
                    {pole.offresAssocieMontees}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-green-600 font-medium">
                    {pole.tauxSucces}%
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-red-600 font-medium">
                    {pole.tauxPerte}%
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-blue-600 font-medium">
                    {pole.tauxAttente}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres empilées pour les offres attribuées */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📊 Offres attribuées par pôle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedPoles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="offresLeadAttribuees" stackId="a" fill="#3B82F6" name="Lead" />
                <Bar dataKey="offresAssocieAttribuees" stackId="a" fill="#10B981" name="Associé" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique en barres empilées pour les offres montées */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📊 Offres montées par pôle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedPoles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="offresLeadMontees" stackId="a" fill="#8B5CF6" name="Lead" />
                <Bar dataKey="offresAssocieMontees" stackId="a" fill="#6366F1" name="Associé" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graphiques circulaires pour les taux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Taux de succès */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🎯 Taux de succès par pôle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedPoles.map(pole => ({
                    name: pole.nom,
                    value: pole.tauxSucces,
                    color: pole.tauxSucces >= 70 ? '#10B981' : pole.tauxSucces >= 50 ? '#F59E0B' : '#EF4444'
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sortedPoles.map((pole, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={pole.tauxSucces >= 70 ? '#10B981' : pole.tauxSucces >= 50 ? '#F59E0B' : '#EF4444'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taux de perte */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📉 Taux de perte par pôle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedPoles.map(pole => ({
                    name: pole.nom,
                    value: pole.tauxPerte,
                    color: pole.tauxPerte <= 20 ? '#10B981' : pole.tauxPerte <= 40 ? '#F59E0B' : '#EF4444'
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sortedPoles.map((pole, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={pole.tauxPerte <= 20 ? '#10B981' : pole.tauxPerte <= 40 ? '#F59E0B' : '#EF4444'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taux d'attente */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">⏳ Taux d'attente par pôle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedPoles.map(pole => ({
                    name: pole.nom,
                    value: pole.tauxAttente,
                    color: pole.tauxAttente <= 30 ? '#10B981' : pole.tauxAttente <= 60 ? '#F59E0B' : '#EF4444'
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sortedPoles.map((pole, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={pole.tauxAttente <= 30 ? '#10B981' : pole.tauxAttente <= 60 ? '#F59E0B' : '#EF4444'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}



// Composant Commerciaux
function CommerciauxTab({ data }: { data: PerformanceCommerciaux[] }) {
  if (!data.length) return <p className="text-gray-500">Aucune donnée disponible</p>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commercial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approuvées
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taux
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((commercial) => (
              <tr key={commercial.nom}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {commercial.nom}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {commercial.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {commercial.totalOffres}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {commercial.offresApprouvees}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    commercial.tauxReussite >= 70 ? 'bg-green-100 text-green-800' :
                    commercial.tauxReussite >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {commercial.tauxReussite}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



// Composants utilitaires
function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-3">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}


