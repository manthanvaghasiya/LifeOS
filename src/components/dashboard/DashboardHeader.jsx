import React from 'react';
import { Plus, Bell, Calendar, Sparkles } from 'lucide-react';

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

  const firstName = user.name ? user.name.split(' ')[0] : 'Achiever';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
      
      {/* LEFT: Greeting & Date */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {currentDate}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{firstName}</span>
          <span className="ml-2 inline-block animate-wave origin-[70%_70%]">👋</span>
        </h1>
        
        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          Let's make today productive.
        </p>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto">
         
         {/* Notification Bell (Visual) - Hidden on Mobile to save space for the button */}
         <button className="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg transition-all relative group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
         </button>

         {/* Quick Spend Button (Primary Action) 
             - Mobile: w-full, extra padding, bold gradient
             - Desktop: Auto width
         */}
         <button 
            onClick={onQuickSpend}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
         >
            <div className="bg-white/20 dark:bg-black/10 p-1 rounded-lg">
                <Plus className="w-4 h-4" /> 
            </div>
            <span>Quick Spend</span>
         </button>
      </div>

    </div>
  );
};

export default DashboardHeader;