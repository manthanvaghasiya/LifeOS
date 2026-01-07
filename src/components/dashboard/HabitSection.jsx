import React from 'react';
import { CheckCircle, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HabitSection = ({ habits, onToggle }) => {
  
  // ✨ HELPER: Calculate Monthly Progress (Real-time)
  const getProgress = (habit) => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return habit.completedDates.filter(d => d.startsWith(prefix)).length;
  };

  // ✨ HELPER: Dynamic Streak Styling (Blue -> Orange -> Purple)
  const getStreakStyles = (streak) => {
      if (streak >= 21) return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      if (streak >= 7) return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      if (streak > 0) return "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-800";
      return "bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700";
  };

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-0 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
      
      {/* --- HEADER --- */}
      <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div> 
          Daily Rituals
        </h3>
        {habits.length > 0 && (
          <span className="text-[10px] sm:text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 whitespace-nowrap">
            {habits.length} Left
          </span>
        )}
      </div>

      {/* --- SCROLLABLE LIST --- */}
      <div className="p-3 sm:p-5 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        <AnimatePresence mode='popLayout'>
            {habits.length > 0 ? (
            habits.map(habit => (
                <motion.button 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    key={habit._id} 
                    onClick={() => onToggle(habit._id)}
                    className="w-full text-left group flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-500/50 hover:shadow-md rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer touch-manipulation"
                >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    
                    {/* Animated Checkbox */}
                    <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 transition-colors flex items-center justify-center shrink-0">
                        <motion.div 
                            initial={false}
                            animate={{ scale: habit.completedDates.some(d => d === new Date().toISOString().split('T')[0]) ? 1 : 0 }} 
                            className="w-full h-full rounded-full bg-green-500 flex items-center justify-center"
                        >
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white stroke-[3px]" />
                        </motion.div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-700 dark:text-gray-200 text-xs sm:text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                            {habit.title}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                            {getProgress(habit)}/{habit.target} this month
                        </span>
                    </div>
                </div>

                {/* Animated Streak Badge */}
                <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all duration-300 shrink-0 ml-2 ${getStreakStyles(habit.streak || 0)}`}>
                    <Flame 
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all ${
                            (habit.streak || 0) > 0 
                                ? 'fill-current animate-pulse' 
                                : 'text-gray-300 dark:text-gray-600'
                        }`} 
                    />
                    <span className="text-[9px] sm:text-[10px] font-black tracking-wide whitespace-nowrap">
                        {habit.streak || 0} <span className="hidden xs:inline opacity-80 font-bold uppercase text-[8px] sm:text-[9px]">Day</span>
                    </span>
                </div>
                </motion.button>
            ))
            ) : (
                /* --- EMPTY STATE --- */
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-10 opacity-80 px-4"
                >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4">
                        <div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                        </div>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">All Done For Today!</h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
                        Great job staying consistent. Enjoy your free time.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitSection;