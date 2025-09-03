import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyStateTable from './EmptyStateTable';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

interface SmartTableProps<T> {
  data: T[] | null;
  columns: Column<T>[];
  loading: boolean;
  error: string | null;
  title: string;
  emptyMessage: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
  onRefresh?: () => void;
  className?: string;
  rowKey?: keyof T | ((item: T) => string);
}

function SmartTable<T>({
  data,
  columns,
  loading,
  error,
  title,
  emptyMessage,
  showAddButton = false,
  onAddClick,
  addButtonText = "Ajouter",
  onRefresh,
  className = "",
  rowKey
}: SmartTableProps<T>) {
  // État de chargement
  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <LoadingSpinner message="Chargement des données..." />
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="px-6 py-12 text-center">
          <div className="mx-auto w-16 h-16 mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Erreur lors du chargement
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réessayer
            </button>
          )}
        </div>
      </div>
    );
  }

  // État vide
  if (!data || data.length === 0) {
    return (
      <EmptyStateTable
        title={title}
        message={emptyMessage}
        columns={columns.map(col => col.header)}
        showAddButton={showAddButton}
        onAddClick={onAddClick}
        addButtonText={addButtonText}
      />
    );
  }

  // Données disponibles - afficher le tableau
  const getRowKey = (item: T, index: number): string => {
    if (rowKey) {
      if (typeof rowKey === 'function') {
        return rowKey(item);
      }
      return String(item[rowKey]);
    }
    return `row-${index}`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* En-tête du tableau */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          )}
        </div>
      </div>

      {/* En-têtes des colonnes */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-12 gap-4">
          {columns.map((column, index) => (
            <div key={index} className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${column.className || ''}`}>
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Corps du tableau */}
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {data.map((item, index) => (
          <div key={getRowKey(item, index)} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <div className="grid grid-cols-12 gap-4">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className={`text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}>
                  {column.render 
                    ? column.render(item[column.key as keyof T], item)
                    : String(item[column.key as keyof T] || '')
                  }
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pied du tableau */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {data.length} élément{data.length > 1 ? 's' : ''} affiché{data.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

export default SmartTable;
