import React from 'react';

interface SyncIndicatorProps {
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function SyncIndicator({ 
  loading, 
  error, 
  isInitialized, 
  size = 'sm', 
  showLabel = false,
  className = ''
}: SyncIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const getStatusColor = () => {
    if (loading) return 'bg-yellow-500 animate-pulse';
    if (error) return 'bg-red-500';
    if (isInitialized) return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (loading) return 'Synchronisation en cours...';
    if (error) return 'Erreur de synchronisation';
    if (isInitialized) return 'Données synchronisées';
    return 'Initialisation...';
  };

  const getStatusLabel = () => {
    if (loading) return 'Sync...';
    if (error) return 'Erreur';
    if (isInitialized) return 'OK';
    return 'Init...';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full ${getStatusColor()}`}
        title={getStatusText()}
      />
      {showLabel && (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {getStatusLabel()}
        </span>
      )}
    </div>
  );
}
