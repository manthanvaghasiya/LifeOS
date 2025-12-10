import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

const DashboardHeader = ({ user, onQuickSpend }) => {
  const firstName = user.name ? user.name.split(' ')[0] : 'Achiever';

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Hello, {firstName}</h1>
          <span className="animate-pulse">👋</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Let's make today productive.
        </p>
      </div>
      <button onClick={onQuickSpend} className="group bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="bg-white/20 p-1 rounded-lg"><Plus className="w-4 h-4" /></div> Quick Spend
      </button>
    </div>
  );
};

export default DashboardHeader;