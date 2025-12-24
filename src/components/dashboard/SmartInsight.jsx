import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';

const SmartInsight = ({ insight }) => {
  if (!insight) return null;

  // Configuration for different insight types
  const getInsightStyle = (type) => {
    switch(type) {
      case 'danger': 
        return { 
          icon: <AlertTriangle className="w-6 h-6 text-white"/>, 
          iconBg: 'bg-red-500 shadow-lg shadow-red-500/30', 
          border: 'border-l-4 border-l-red-500',
          titleColor: 'text-red-700 dark:text-red-400' 
        };
      case 'warning': 
        return { 
          icon: <Lightbulb className="w-6 h-6 text-white"/>, 
          iconBg: 'bg-orange-500 shadow-lg shadow-orange-500/30', 
          border: 'border-l-4 border-l-orange-500',
          titleColor: 'text-orange-700 dark:text-orange-400' 
        };
      case 'success': 
        return { 
          icon: <CheckCircle2 className="w-6 h-6 text-white"/>, 
          iconBg: 'bg-green-500 shadow-lg shadow-green-500/30', 
          border: 'border-l-4 border-l-green-500',
          titleColor: 'text-green-700 dark:text-green-400' 
        };
      default: 
        return { 
          icon: <Info className="w-6 h-6 text-white"/>, 
          iconBg: 'bg-blue-500 shadow-lg shadow-blue-500/30', 
          border: 'border-l-4 border-l-blue-500',
          titleColor: 'text-blue-700 dark:text-blue-400' 
        };
    }
  };

  const style = getInsightStyle(insight.type);

  return (
    <div className={`relative overflow-hidden p-6 rounded-[1.5rem] bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5 transition-all duration-300 hover:shadow-md ${style.border}`}>
      
      {/* Icon Container with Glow */}
      <div className={`p-3 rounded-2xl ${style.iconBg} shrink-0 transition-transform duration-300 hover:scale-105`}>
        {style.icon}
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${style.titleColor}`}>
          {insight.title}
          {insight.type === 'success' && <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 font-medium text-sm leading-relaxed">
          {insight.message}
        </p>
      </div>

    </div>
  );
};

export default SmartInsight;