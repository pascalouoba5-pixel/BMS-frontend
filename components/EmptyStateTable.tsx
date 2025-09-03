import React from 'react';

interface EmptyStateTableProps {
  title: string;
  message: string;
  columns: string[];
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
  icon?: React.ReactNode;
}

const EmptyStateTable: React.FC<EmptyStateTableProps> = ({
  title,
  message,
  columns,
  showAddButton = false,
  onAddClick,
  addButtonText = "Ajouter",
  icon
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* En-tête du tableau */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      
      {/* En-têtes des colonnes */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-12 gap-4">
          {columns.map((column, index) => (
            <div key={index} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {column}
            </div>
          ))}
        </div>
      </div>
      
      {/* État vide */}
      <div className="px-6 py-12 text-center">
        {icon && (
          <div className="mx-auto w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucune donnée disponible
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          {message}
        </p>
        
        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {addButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyStateTable;
