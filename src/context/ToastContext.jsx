import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/ui/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const TOAST_EVENT = 'lifeos-toast-event';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => {
        // Prevent duplicates
        if (prev.some(t => t.message === message)) return prev;
        // Limit to 3 (prevent screen clutter)
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

  useEffect(() => {
    const handleGlobalToast = (e) => {
        const { message, type, duration } = e.detail;
        addToast(message, type, duration);
    };
    window.addEventListener(TOAST_EVENT, handleGlobalToast);
    return () => window.removeEventListener(TOAST_EVENT, handleGlobalToast);
  }, [addToast]);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* ✨ NOTIFICATION CONTAINER POSITIONING 
         - Mobile/Tablet: Top Center (top-2 left-2 right-2)
         - Desktop: Top Right (md:top-6 md:right-6)
      */}
      <div className="fixed z-[9999] pointer-events-none flex flex-col gap-2 
                      top-2 left-2 right-2 items-center 
                      md:top-6 md:right-6 md:left-auto md:items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};