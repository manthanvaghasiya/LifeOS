import React from 'react';
import { CheckCircle, Check, Flame } from 'lucide-react';

const HabitSection = ({ habits, onToggle }) => {
  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-0 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
          </div> 
          Daily Rituals
        </h3>
        {habits.length > 0 && (
          <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
            {habits.length} Left
          </span>
        )}
      </div>

      {/* Scrollable List */}
      <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        {habits.length > 0 ? (
          habits.map(habit => (
            <div 
              key={habit._id} 
              onClick={() => onToggle(habit._id)}
              className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-500/50 hover:shadow-md rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 transition-colors flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-green-500 scale-0 group-hover:scale-100 transition-transform duration-200 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                  </div>
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {habit.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                <span>{habit.streak || 0} Day Streak</span>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-80">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">All Done For Today!</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
              Great job staying consistent. Enjoy your free time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitSection;