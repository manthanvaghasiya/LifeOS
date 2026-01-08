import React, { useState, useMemo } from 'react';
import { CheckCircle, Check, Flame, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HabitSection = ({ habits, onToggle }) => {
  // State to track locally which habits were completed recently
  const [delayedHabits, setDelayedHabits] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];

  const getProgress = (habit) => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return habit.completedDates.filter(d => d.startsWith(prefix)).length;
  };

  const getStreakStyles = (streak) => {
      if (streak >= 21) return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      if (streak >= 7) return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      if (streak > 0) return "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-800";
      return "bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700";
  };

  // Logic: Show habit IF (Not completed today) OR (Completed today AND is in delayedHabits list)
  const visibleHabits = useMemo(() => {
    return habits.filter(h => {
        const isCompleted = h.completedDates.includes(todayStr);
        if (!isCompleted) return true; // Show if not done
        if (delayedHabits[h._id]) return true; // Show if done but within delay window
        return false; // Hide if done and delay expired
    });
  }, [habits, delayedHabits, todayStr]);

  const handleCheck = (id) => {
    // If we are checking it (completing it), set a timer
    const habit = habits.find(h => h._id === id);
    const isCompleted = habit.completedDates.includes(todayStr);
    
    if (!isCompleted) {
        setDelayedHabits(prev => ({ ...prev, [id]: true }));
        // Remove from list after 1 minute (60000ms)
        setTimeout(() => {
            setDelayedHabits(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }, 60000);
    }
    
    onToggle(id);
  };

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-0 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
      
      <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div> 
          Daily Rituals
        </h3>
        {visibleHabits.length > 0 && (
          <span className="text-[10px] sm:text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 whitespace-nowrap">
            {visibleHabits.length} Left
          </span>
        )}
      </div>

      <div className="p-3 sm:p-5 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        <AnimatePresence mode='popLayout'>
            {visibleHabits.length > 0 ? (
            visibleHabits.map(habit => {
                const isCompleted = habit.completedDates.includes(todayStr);
                return (
                <motion.button 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    key={habit._id} 
                    onClick={() => handleCheck(habit._id)}
                    className={`w-full text-left group flex items-center justify-between p-3 sm:p-4 border rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer touch-manipulation
                        ${isCompleted 
                            ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50' 
                            : 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-500/50 hover:shadow-md'
                        }`}
                >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-colors flex items-center justify-center shrink-0 ${isCompleted ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-green-500'}`}>
                        {isCompleted && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white stroke-[3px]" />}
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                        <span className={`font-bold text-xs sm:text-sm transition-colors truncate ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                            {habit.title}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 truncate flex items-center gap-2">
                           {isCompleted ? (
                               <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-bold animate-pulse">
                                   <Clock className="w-3 h-3" /> Disappears in 1m
                               </span>
                           ) : (
                               `${getProgress(habit)}/${habit.target} this month`
                           )}
                        </span>
                    </div>
                </div>

                <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all duration-300 shrink-0 ml-2 ${getStreakStyles(habit.streak || 0)}`}>
                    <Flame className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${(habit.streak || 0) > 0 ? 'fill-current animate-pulse' : 'text-gray-300 dark:text-gray-600'}`} />
                    <span className="text-[9px] sm:text-[10px] font-black tracking-wide whitespace-nowrap">
                        {habit.streak || 0}
                    </span>
                </div>
                </motion.button>
            )})
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center py-10 opacity-80 px-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4">
                        <div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                        </div>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">All Done For Today!</h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">Great job staying consistent.</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitSection;