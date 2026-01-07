import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const toastStyles = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    style: "bg-white/90 dark:bg-slate-900/90 border-green-500/20 text-slate-800 dark:text-slate-100",
    iconBg: "bg-green-500 text-white",
    progress: "bg-green-500"
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    style: "bg-white/90 dark:bg-slate-900/90 border-red-500/20 text-slate-800 dark:text-slate-100",
    iconBg: "bg-red-500 text-white",
    progress: "bg-red-500"
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    style: "bg-white/90 dark:bg-slate-900/90 border-orange-500/20 text-slate-800 dark:text-slate-100",
    iconBg: "bg-orange-500 text-white",
    progress: "bg-orange-500"
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    style: "bg-white/90 dark:bg-slate-900/90 border-blue-500/20 text-slate-800 dark:text-slate-100",
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
      // ✨ ANIMATION: Slide Down from Top
      initial={{ opacity: 0, y: -50, scale: 0.95 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      
      // Interaction
      whileHover={{ scale: 1.02 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(event, info) => {
          // Swipe up to dismiss
          if (info.offset.y < -50) onClose();
      }}
      
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md w-full max-w-sm md:w-[350px] ${style} cursor-grab active:cursor-grabbing`}
    >
      {/* Icon */}
      <div className={`shrink-0 p-1.5 rounded-full ${iconBg} shadow-sm mt-0.5`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5 min-w-0">
        <h5 className="font-bold text-xs uppercase tracking-wider opacity-80 mb-0.5">{type === 'info' ? 'Notification' : type}</h5>
        <p className="text-sm font-semibold leading-snug break-words">
            {message}
        </p>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="shrink-0 p-1.5 -mr-1.5 -mt-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={controls}
        className={`absolute bottom-0 left-0 h-[3px] ${progress} opacity-40`}
      />
    </motion.div>
  );
};

export default Toast;