'use client';

import { useState, useEffect } from 'react';
import { checkApiHealth } from '../config/api';

interface ApiStatusCheckerProps {
  showDetails?: boolean;
  className?: string;
}

export default function ApiStatusChecker({ showDetails = false, className = '' }: ApiStatusCheckerProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const checkStatus = async () => {
    try {
      setStatus('checking');
      const startTime = Date.now();
      
      const isHealthy = await checkApiHealth();
      const endTime = Date.now();
      
      setStatus(isHealthy ? 'online' : 'offline');
      setLastCheck(new Date());
      setResponseTime(endTime - startTime);
      
    } catch (error) {
      console.error('❌ [ApiStatusChecker] Erreur lors de la vérification:', error);
      setStatus('offline');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, [checkStatus]);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'checking': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      case 'offline': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
      case 'checking': return (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
      default: return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'API connectée';
      case 'offline': return 'API déconnectée';
      case 'checking': return 'Vérification...';
      default: return 'Statut inconnu';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      
      {showDetails && (
        <>
          {responseTime && (
            <span className="text-xs opacity-75">
              ({responseTime}ms)
            </span>
          )}
          
          {lastCheck && (
            <span className="text-xs opacity-75">
              {lastCheck.toLocaleTimeString()}
            </span>
          )}
        </>
      )}
      
      <button
        onClick={checkStatus}
        className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
        title="Vérifier à nouveau"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
