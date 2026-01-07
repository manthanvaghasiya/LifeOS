import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/ui/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

// Custom Event Name
export const TOAST_EVENT = 'lifeos-toast-event';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // 1. Core Logic to Add Toast
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Prevent duplicate messages (Production Polish)
    setToasts((prev) => {
        const isDuplicate = prev.some(t => t.message === message);
        if (isDuplicate) return prev;
        // Limit to 3 toasts at a time to prevent screen flooding
        if (prev.length >= 3) return [...prev.slice(1), { id, message, type, duration }];
        return [...prev, { id, message, type, duration }];
    });

    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 2. ✨ GLOBAL EVENT LISTENER (The Bridge for api.js)
  useEffect(() => {
    const handleGlobalToast = (e) => {
        const { message, type, duration } = e.detail;
        addToast(message, type, duration);
    };

    window.addEventListener(TOAST_EVENT, handleGlobalToast);
    return () => window.removeEventListener(TOAST_EVENT, handleGlobalToast);
  }, [addToast]);

  // Public API for React Components
  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container - Responsive Positioning */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] flex flex-col gap-3 pointer-events-none items-center sm:items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};