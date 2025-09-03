import React, { useState, useCallback, useRef } from 'react';
import NotificationToast, { Notification } from './NotificationToast';

interface NotificationManagerProps {
  children: React.ReactNode;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  clearNotifications: () => void;
}

export const NotificationContext = React.createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextId = useRef(1);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${nextId.current++}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000 // 5 secondes par défaut
    };

    setNotifications(prev => [...prev, newNotification]);

    // Supprimer automatiquement après la durée spécifiée
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: duration || 8000 // Erreurs restent plus longtemps
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }, [addNotification]);

  const contextValue: NotificationContextType = {
    showNotification: addNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Conteneur des notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationManager;
