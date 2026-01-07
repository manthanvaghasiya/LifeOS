import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const toastStyles = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    style: "bg-white dark:bg-slate-900 border-green-500/20 text-gray-800 dark:text-white",
    iconBg: "bg-green-500 text-white",
    progress: "bg-green-500"
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    style: "bg-white dark:bg-slate-900 border-red-500/20 text-gray-800 dark:text-white",
    iconBg: "bg-red-500 text-white",
    progress: "bg-red-500"
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    style: "bg-white dark:bg-slate-900 border-orange-500/20 text-gray-800 dark:text-white",
    iconBg: "bg-orange-500 text-white",
    progress: "bg-orange-500"
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    style: "bg-white dark:bg-slate-900 border-blue-500/20 text-gray-800 dark:text-white",
    iconBg: "bg-blue-500 text-white",
    progress: "bg-blue-500"
  }
};

const Toast = ({ message, type, duration = 4000, onClose }) => {
  const { icon, style, iconBg, progress } = toastStyles[type] || toastStyles.info;
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      width: "0%",
      transition: { duration: duration / 1000, ease: "linear" }
    });
  }, [controls, duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      drag="x"
      dragConstraints={{ left: 0, right: 300 }}
      onDragEnd={(event, info) => {
          if (info.offset.x > 100) onClose();
      }}
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-4 p-4 rounded-xl border shadow-xl shadow-black/5 min-w-[320px] max-w-sm ${style} cursor-grab active:cursor-grabbing`}
    >
      {/* Icon Area */}
      <div className={`shrink-0 p-2 rounded-full ${iconBg} shadow-sm`}>
        {icon}
      </div>

      {/* Content Area */}
      <div className="flex-1 pt-1 min-w-0">
        <h5 className="font-bold text-sm capitalize mb-0.5">{type === 'info' ? 'Update' : type}</h5>
        <p className="text-xs sm:text-sm font-medium opacity-90 leading-snug break-words">
            {message}
        </p>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="shrink-0 p-1 -mr-1 -mt-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar (Timer) */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={controls}
        className={`absolute bottom-0 left-0 h-1 ${progress} opacity-20`}
      />
    </motion.div>
  );
};

export default Toast;