import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, Info, Sparkles, TrendingUp, X } from 'lucide-react';

const SmartInsight = ({ insight, onDismiss }) => {
  if (!insight) return null;

  // Dynamic configuration based on insight type
  const config = {
    danger: {
      icon: AlertTriangle,
      gradient: 'from-red-500/10 to-rose-500/10 border-red-500/20',
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10',
      textColor: 'text-red-900 dark:text-red-100',
      pulse: 'shadow-red-500/20'
    },
    warning: {
      icon: Lightbulb,
      gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
      textColor: 'text-amber-900 dark:text-amber-100',
      pulse: 'shadow-amber-500/20'
    },
    success: {
      icon: Sparkles,
      gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
      textColor: 'text-emerald-900 dark:text-emerald-100',
      pulse: 'shadow-emerald-500/20'
    },
    info: {
      icon: TrendingUp,
      gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
      textColor: 'text-blue-900 dark:text-blue-100',
      pulse: 'shadow-blue-500/20'
    }
  };

  const theme = config[insight.type] || config.info;
  const Icon = theme.icon;

  return (
    <div className={`relative overflow-hidden rounded-[1.5rem] border ${theme.gradient} bg-white dark:bg-gray-900/60 backdrop-blur-xl shadow-lg transition-all duration-300 group`}>
      
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        
        {/* Animated Icon Box */}
        <div className={`p-3.5 rounded-2xl ${theme.iconBg} ${theme.pulse} shadow-lg shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.iconColor} relative z-10`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-black text-sm sm:text-base uppercase tracking-wider ${theme.textColor}`}>
              {insight.title}
            </h3>
            {insight.type === 'danger' && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
          
          <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-slate-600 dark:text-slate-300 opacity-90">
            {insight.message}
          </p>
        </div>

        {/* Optional Dismiss Button (Visual only unless prop provided) */}
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Bottom Progress/Accent Line */}
      <div className={`h-1 w-full bg-gradient-to-r ${theme.gradient.split(' ')[0]} opacity-30`}></div>
    </div>
  );
};

export default SmartInsight;