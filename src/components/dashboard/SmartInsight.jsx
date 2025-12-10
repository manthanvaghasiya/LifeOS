import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const SmartInsight = ({ insight }) => {
  const getInsightStyle = (type) => {
    switch(type) {
      case 'danger': return { icon: <AlertTriangle className="w-6 h-6 text-white"/>, bg: 'bg-red-500', border: 'border-red-100', text: 'text-red-700' };
      case 'warning': return { icon: <Lightbulb className="w-6 h-6 text-white"/>, bg: 'bg-orange-500', border: 'border-orange-100', text: 'text-orange-700' };
      case 'success': return { icon: <CheckCircle2 className="w-6 h-6 text-white"/>, bg: 'bg-green-500', border: 'border-green-100', text: 'text-green-700' };
      default: return { icon: <Info className="w-6 h-6 text-white"/>, bg: 'bg-blue-500', border: 'border-blue-100', text: 'text-blue-700' };
    }
  };

  const style = getInsightStyle(insight.type);

  return (
    <div className={`p-6 rounded-3xl border ${style.border} bg-white dark:bg-gray-900/60 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5 transition-all duration-500 hover:shadow-md`}>
      <div className={`p-3 rounded-2xl ${style.bg} shadow-lg shadow-gray-200 dark:shadow-none shrink-0`}>
        {style.icon}
      </div>
      <div>
        <h3 className={`font-bold text-lg ${style.text} dark:text-white flex items-center gap-2`}>
          {insight.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed">
          {insight.message}
        </p>
      </div>
    </div>
  );
};

// THIS LINE WAS MISSING
export default SmartInsight;