'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PoleNavigationButtons from '../../../components/PoleNavigationButtons';
import HomeButton from '../../../components/HomeButton';
import Layout from '../../../components/Layout';
import AlertBanner from '../../../components/AlertBanner';

interface PoleInfo {
  name: string;
  icon: string;
  description: string;
  color: string;
  href: string;
}

export default function PoleLeadHomePage() {
  return (
    <Layout>
      <PoleLeadHomePageContent />
    </Layout>
  );
}

function PoleLeadHomePageContent() {
  const [offresCount, setOffresCount] = useState<Record<string, number>>({});

  const poles: PoleInfo[] = [
    {
      name: 'Pôle santé',
      icon: 'ri-heart-pulse-line',
      description: 'Gestion des offres liées au secteur de la santé',
      color: 'bg-red-100 text-red-600 border-red-200',
      href: '/repartition/pole-lead/Pôle santé'
    },
    {
      name: 'Pôle Wash',
      icon: 'ri-drop-line',
      description: 'Gestion des offres liées à l\'eau, assainissement et hygiène',
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      href: '/repartition/pole-lead/Pôle Wash'
    },
    {
      name: 'Pôle Education',
      icon: 'ri-book-open-line',
      description: 'Gestion des offres liées au secteur éducatif',
      color: 'bg-green-100 text-green-600 border-green-200',
      href: '/repartition/pole-lead/Pôle Education'
    },
    {
      name: 'Pôle Climat',
      icon: 'ri-global-line',
      description: 'Gestion des offres liées au changement climatique',
      color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      href: '/repartition/pole-lead/Pôle Climat'
    },
    {
      name: 'Pôle Enquêtes',
      icon: 'ri-bar-chart-line',
      description: 'Gestion des offres liées aux études et enquêtes',
      color: 'bg-purple-100 text-purple-600 border-purple-200',
      href: '/repartition/pole-lead/Pôle Enquêtes'
    },
    {
      name: 'Pôle Modélisation',
      icon: 'ri-microscope-line',
      description: 'Gestion des offres liées à la modélisation et simulation',
      color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      href: '/repartition/pole-lead/Pôle Modélisation'
    },
    {
      name: 'Pôle Finances Publiques',
      icon: 'ri-money-dollar-circle-line',
      description: 'Gestion des offres liées aux finances publiques',
      color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      href: '/repartition/pole-lead/Pôle Finances Publiques'
    },
    {
      name: 'Pôle Décentralisation',
      icon: 'ri-building-line',
      description: 'Gestion des offres liées à la décentralisation',
      color: 'bg-orange-100 text-orange-600 border-orange-200',
      href: '/repartition/pole-lead/Pôle Décentralisation'
    },
    {
      name: 'Pôle Cohésion sociale',
      icon: 'ri-team-line',
      description: 'Gestion des offres liées à la cohésion sociale et au développement communautaire',
      color: 'bg-pink-100 text-pink-600 border-pink-200',
      href: '/repartition/pole-lead/Pôle Cohésion sociale'
    },
    {
      name: 'Pôle Anglophone',
      icon: 'ri-translate-2',
      description: 'Gestion des offres pour les pays anglophones',
      color: 'bg-gray-100 text-gray-600 border-gray-200',
      href: '/repartition/pole-lead/Pôle Anglophone'
    },
    {
      name: 'Pôle SIDIA',
      icon: 'ri-settings-3-line',
      description: 'Gestion des offres liées au SIDIA',
      color: 'bg-teal-100 text-teal-600 border-teal-200',
      href: '/repartition/pole-lead/Pôle SIDIA'
    },
    {
      name: 'Montage Administrative',
      icon: 'ri-clipboard-line',
      description: 'Gestion administrative des montages de projets',
      color: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      href: '/repartition/pole-lead/Montage Administrative'
    }
  ];

  useEffect(() => {
    // Compter les offres par pôle
    const countOffresByPole = () => {
      try {
        const storedOffres = localStorage.getItem('offres');
        if (storedOffres) {
          const allOffres = JSON.parse(storedOffres);
          const counts: Record<string, number> = {};
          
          poles.forEach(pole => {
            counts[pole.name] = allOffres.filter((offre: any) => 
              offre.poleLead === pole.name && offre.statut === 'approuvée'
            ).length;
          });
          
          setOffresCount(counts);
        }
      } catch (error) {
        console.error('Erreur lors du comptage des offres:', error);
      }
    };

    countOffresByPole();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <AlertBanner />
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <img 
                  src="https://static.readdy.ai/image/36ce116ccdb0d05752a287dd792317ce/3a2cd734c9129790560cc32a9975e166.jfif" 
                  alt="BMS Logo" 
                  className="h-8 mr-3"
                />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Gestion des Pôles</h1>
            </div>
            <div className="flex items-center space-x-4">
              <HomeButton variant="outline" size="sm" />
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/repartition" className="text-gray-600 hover:text-gray-900 transition-colors">
                Répartition
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-building-line text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Gestion des Pôles</h1>
            <p className="text-xl opacity-90 mb-6">Sélectionnez un pôle pour voir les offres associées</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <span className="text-lg">{poles.length} pôles disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation retour */}
        <div className="mb-8">
          <PoleNavigationButtons />
        </div>

        {/* Grille des pôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {poles.map((pole) => (
            <Link
              key={pole.name}
              href={pole.href}
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center">
                {/* Icône */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-2 ${pole.color}`}>
                  <i className={`${pole.icon} text-2xl`}></i>
                </div>
                
                {/* Titre */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {pole.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {pole.description}
                </p>
                
                {/* Nombre d'offres */}
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  <i className="ri-file-list-line"></i>
                  <span>{offresCount[pole.name] || 0} offre{offresCount[pole.name] !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Statistiques */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques des pôles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Object.values(offresCount).reduce((sum, count) => sum + count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total des offres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Object.values(offresCount).filter(count => count > 0).length}
              </div>
              <div className="text-sm text-gray-600">Pôles actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.max(...Object.values(offresCount), 0)}
              </div>
              <div className="text-sm text-gray-600">Plus grand pôle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
