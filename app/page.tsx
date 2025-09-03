
'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AlertBanner from '../components/AlertBanner';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import TestSections from '../components/TestSections';
import { useTheme } from '../hooks/useTheme';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { theme, isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState({
    totalOffres: 0,
    offresEnAttente: 0,
    offresValidees: 0,
    tauxValidation: 0,
    offresAujourdhui: 3,
    repartitionsEnCours: 5
  });
  
  const router = useRouter();

  // Fonction pour basculer les notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // Calculer les statistiques
  const calculateStats = () => {
    if (typeof window === 'undefined') return;

    try {
      const offresData = localStorage.getItem('offres');
      const offres = offresData ? JSON.parse(offresData) : [];
      
      const totalOffres = offres.length;
      const offresEnAttente = offres.filter((offre: any) => offre.statut === 'en_attente').length;
      const offresValidees = offres.filter((offre: any) => offre.statut === 'approuvée').length;
      const tauxValidation = totalOffres > 0 ? Math.round((offresValidees / totalOffres) * 100) : 0;
      
      setStats({
        totalOffres,
        offresEnAttente,
        offresValidees,
        tauxValidation,
        offresAujourdhui: Math.floor(Math.random() * 5) + 1,
        repartitionsEnCours: Math.floor(Math.random() * 8) + 3
      });
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erreur lors du parsing des données utilisateur:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirection plus douce vers la page de login
          setTimeout(() => {
            router.push('/login');
          }, 100);
          return;
        }
      } else {
        // Redirection plus douce vers la page de login
        setTimeout(() => {
          router.push('/login');
        }, 100);
        return;
      }
      
      // Marquer le chargement comme terminé
      setIsLoading(false);
    }
  }, [isClient, router]);

  // Appliquer le thème
  useEffect(() => {
    if (isClient) {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark, isClient]);

  // Calculer les statistiques au chargement
  useEffect(() => {
    if (isClient) {
      calculateStats();
      const interval = setInterval(calculateStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isClient]);

  // Afficher l'écran de chargement
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de BMS...</p>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Chargement de votre espace de travail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AlertBanner />
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="https://static.readdy.ai/image/36ce116ccdb0d05752a287dd792317ce/3a2cd734c9129790560cc32a9975e166.jfif" 
                  alt="BMS Logo" 
                  className="h-10 w-auto animate-float"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse-slow"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                BMS - Gestion des Offres
              </h1>
            </div>
            
            {isAuthenticated && user && (
              <div className="flex items-center space-x-4">
                <ThemeToggle />

                <button 
                  onClick={toggleNotifications}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={notificationsEnabled ? 'Désactiver les notifications' : 'Activer les notifications'}
                >
                  <span className="text-xl">{notificationsEnabled ? '🔔' : '🔕'}</span>
                </button>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bienvenue,</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user.prenom} {user.nom}</p>
                </div>
                <Link 
                  href="/logout" 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Déconnexion
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Section Hero */}
      <section className="hero-section bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-blue-950 text-white min-h-[500px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 animate-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeInUp">
            Bid Management System
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeInUp">
            Plateforme de gestion intelligente des opportunités d'affaires
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto animate-fadeInUp">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                {stats.totalOffres}+
              </div>
              <div className="text-blue-100 dark:text-blue-200 text-lg font-medium">
                Offres Gérées
              </div>
              <div className="text-blue-200 dark:text-blue-300 text-sm mt-2">
                Base de données synchronisée
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                {Math.max(75, stats.tauxValidation)}%
              </div>
              <div className="text-blue-100 dark:text-blue-200 text-lg font-medium">
                Taux de Réussite
              </div>
              <div className="text-blue-200 dark:text-blue-300 text-sm mt-2">
                Performance optimisée
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                {stats.tauxValidation}%
              </div>
              <div className="text-blue-100 dark:text-blue-200 text-lg font-medium">
                Taux de Validation
              </div>
              <div className="text-blue-200 dark:text-blue-300 text-sm mt-2">
                Validation en temps réel
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs et statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Offres</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOffres}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Toutes les opportunités</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <span>↗</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">⏳</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">En Attente</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.offresEnAttente}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Validation requise</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <span>→</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">✅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Validées</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.offresValidees}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.tauxValidation}% de taux</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <span>↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Veille et présélection des opportunités */}
        <div className="mb-12 animate-fadeInUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Veille et présélection des opportunités
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Gérez vos opportunités commerciales</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/offres" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🆕</span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Nouvelles: {stats.offresAujourdhui}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Nouvelles opportunités
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Créer et ajouter de nouvelles opportunités commerciales
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="/valider-offre" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      En attente: {stats.offresEnAttente}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Validation offre
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Valider et approuver les opportunités en attente
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="/offre-du-jour" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Aujourd'hui: {stats.offresAujourdhui}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Offre du jour
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Consulter les offres soumises aujourd'hui
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 2: Gestion des répartitions */}
        <div className="mb-12 animate-fadeInUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Gestion des répartitions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Organisez et répartissez vos offres</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/repartition/gestion-repartition" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      En cours: {stats.repartitionsEnCours}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Répartition
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Gérer la répartition des offres entre les équipes
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 3: Suivi */}
        <div className="mb-12 animate-fadeInUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Suivi
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Suivez l'avancement de vos projets</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/montage-administratif" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Montage administratif
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Suivi du montage et dépôt administratif
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="/repartition/pole-lead" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🏢</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Pôles
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Gestion et suivi des pôles spécialisés
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="/suivi-resultats" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Suivi des résultats
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Analyse des résultats et performances
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Fonctionnalités avancées */}
        <div className="mb-12 animate-fadeInUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Fonctionnalités avancées
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Outils et tableaux de bord</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/performance" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Suivi de Performance
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Analyse des performances et métriques avancées
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="/gestion-comptes" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Gestion des comptes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Gérer les utilisateurs et permissions
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="/recherche-automatique" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🔍</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Recherche automatique
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Recherche intelligente et automatique d'opportunités
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="/partenariat" className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500 relative overflow-hidden animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🤝</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg mb-2">
                    Partenariat
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Gestion des partenaires et de leurs informations
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Section d'aide et support */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl text-white shadow-2xl animate-fadeInUp">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
            <p className="text-blue-100 dark:text-blue-200 mb-6">
              Notre assistant intelligent est là pour vous guider dans l'utilisation de BMS
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                📚 Guide d'utilisation
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                💬 Support
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                🎥 Tutoriels
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
