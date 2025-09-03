'use client';

import React from 'react';

interface StatusFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  statusCounts: {
    total: number;
    approuvée?: number;
    en_attente?: number;
    rejetée?: number;
    brouillon?: number;
  };
  title?: string;
}

export default function StatusFilters({ 
  selectedStatus, 
  onStatusChange, 
  statusCounts, 
  title = "Filtrer par statut" 
}: StatusFiltersProps) {
  const getStatusCount = (statut: string) => {
    switch (statut) {
      case 'approuvée': return statusCounts.approuvée || 0;
      case 'en_attente': return statusCounts.en_attente || 0;
      case 'rejetée': return statusCounts.rejetée || 0;
      case 'brouillon': return statusCounts.brouillon || 0;
      default: return statusCounts.total;
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onStatusChange('tous')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'tous'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({statusCounts.total})
          </button>
          <button
            onClick={() => onStatusChange('approuvée')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'approuvée'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approuvées ({getStatusCount('approuvée')})
          </button>
          <button
            onClick={() => onStatusChange('en_attente')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'en_attente'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente ({getStatusCount('en_attente')})
          </button>
          <button
            onClick={() => onStatusChange('rejetée')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'rejetée'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejetées ({getStatusCount('rejetée')})
          </button>
          <button
            onClick={() => onStatusChange('brouillon')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'brouillon'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Brouillons ({getStatusCount('brouillon')})
          </button>
        </div>
      </div>
    </div>
  );
}
