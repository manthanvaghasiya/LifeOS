import React from 'react';
import { Plus, Calendar, Sparkles } from 'lucide-react';

const DashboardHeader = ({ user, onQuickSpend }) => {
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  return (
    // Changed items-start to ensure button aligns left on mobile, not stretched
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in mb-8">
      
      {/* LEFT: Greeting & Date */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {currentDate}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{firstName}</span>
          <span className="ml-2 inline-block animate-wave origin-[70%_70%]">🔔</span>
        </h1>
        
        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          Your financial overview is ready.
        </p>
      </div>

      {/* RIGHT: High-Impact Action Button */}
      {/* Removed 'w-full' from container to prevent stretching */}
      <div>
         <button 
            onClick={onQuickSpend}
            // UPDATED CLASSES:
            // 1. Removed 'w-full' -> Now uses auto width
            // 2. Added 'pr-6 pl-5' -> Balanced padding
            className="group relative flex items-center gap-3 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.25rem] font-bold text-base md:text-lg shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden"
         >
            {/* Animated Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button Content */}
            <div className="relative flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 dark:bg-black/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Plus className="w-5 h-5 stroke-[3px]" /> 
              </div>
              <span className="whitespace-nowrap">Quick Spend</span>
            </div>

            {/* Shine Effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
         </button>
      </div>

    </div>
  );
};

export default DashboardHeader;
