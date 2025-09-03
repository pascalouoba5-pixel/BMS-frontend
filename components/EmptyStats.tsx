import React from 'react';

interface EmptyStatsProps {
  title: string;
  message: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

const EmptyStats: React.FC<EmptyStatsProps> = ({
  title,
  message,
  showAddButton = false,
  onAddClick,
  addButtonText = "Ajouter des données"
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center">
        {/* Icône d'état vide */}
        <div className="mx-auto w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
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

export default EmptyStats;
