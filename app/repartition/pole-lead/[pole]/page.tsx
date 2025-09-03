import Link from 'next/link';
import { Suspense } from 'react';
import PoleOffresClient from './PoleOffresClient';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import HomeButton from '../../../../components/HomeButton';
import Layout from '../../../../components/Layout';

// Fonction requise pour le mode export statique
export async function generateStaticParams() {
  const poles = [
    'Pôle santé',
    'Pôle Wash',
    'Pôle Education',
    'Pôle Climat',
    'Pôle Enquêtes',
    'Pôle Modélisation',
    'Pôle Finances Publiques',
    'Pôle Décentralisation',
    'Pôle Cohésion sociale',
    'Pôle Anglophone',
    'Pôle SIDIA',
    'Montage Administrative'
  ];

  return poles.map((pole) => ({
    pole: pole,
  }));
}

interface PageProps {
  params: Promise<{ pole: string }>;
}

export default async function PoleLeadPage({ params }: PageProps) {
  const { pole } = await params;
  const poleName = decodeURIComponent(pole);

  return (
    <ProtectedRoute pageName="pole-lead">
      <Layout>
        <PoleLeadContent poleName={poleName} />
      </Layout>
    </ProtectedRoute>
  );
}

function PoleLeadContent({ poleName }: { poleName: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-building-line text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{poleName}</h1>
            <p className="text-xl opacity-90 mb-6">Offres attribuées à ce pôle</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <span className="text-lg">Gestion des répartitions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation boutons */}
        <div className="mb-8 flex justify-end items-center">
          <HomeButton variant="outline" size="sm" />
        </div>

        {/* Composant avec tableau des offres */}
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des offres pour {poleName}...</p>
            <p className="text-sm text-gray-500 mt-2">
              Cette page affichera les offres attribuées à ce pôle une fois chargées.
            </p>
          </div>
        }>
          <PoleOffresClient poleName={poleName} />
        </Suspense>
      </div>
    </div>
  );
}
