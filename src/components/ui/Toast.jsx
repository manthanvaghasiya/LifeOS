import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const toastStyles = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    style: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    style: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    style: "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    style: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
  }
};

const Toast = ({ message, type, onClose }) => {
  const { icon, style } = toastStyles[type] || toastStyles.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-lg shadow-black/5 min-w-[300px] max-w-md ${style} bg-white/80 dark:bg-gray-900/80`}
    >
      <div className="shrink-0">{icon}</div>
      <p className="text-sm font-semibold grow">{message}</p>
      <button 
        onClick={onClose} 
        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </motion.div>
  );
};

export default Toast;