'use client';

import Link from 'next/link';

interface PoleNavigationButtonsProps {
  className?: string;
}

export default function PoleNavigationButtons({
  className = ''
}: PoleNavigationButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* Bouton "Retour à la page répartition des offres" */}
      <Link
        href="/repartition"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 font-medium"
      >
        <i className="ri-arrow-left-line"></i>
        Retour à la page répartition des offres
      </Link>

      {/* Bouton "Vue des répartitions" */}
      <Link
        href="/repartition/vue-repetitions"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 font-medium"
      >
        <i className="ri-eye-line"></i>
        Vue des répartitions
      </Link>
    </div>
  );
}
