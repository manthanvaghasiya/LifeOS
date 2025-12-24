import React from 'react';
import { Layers, CheckSquare, Target, Check, Trophy } from 'lucide-react';

const TaskSection = ({ tasks, goals, onToggleTask, onToggleGoal }) => {
  const totalPending = tasks.length + goals.length;

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* 1. Gradient Top Border (Matches Dashboard Theme: Orange for Action) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>

      {/* 2. Header */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
            <Layers className="w-5 h-5" />
          </div> 
          Pending Actions
        </h3>
        
        {/* Count Badge */}
        {totalPending > 0 && (
          <span className="text-xs font-bold bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
            {totalPending}
          </span>
        )}
      </div>
      
      {/* 3. Scrollable Content */}
      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        {totalPending > 0 ? (
          <div className="space-y-6">
            
            {/* --- DAILY TASKS --- */}
            {tasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Tasks</span>
                </div>
                <div className="space-y-2">
                  {tasks.map(t => (
                    <div 
                      key={t._id} 
                      onClick={() => onToggleTask(t._id)}
                      className={`group flex items-center gap-3 p-3 bg-white dark:bg-gray-800/40 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                        t.priority === 'High' 
                          ? 'border-l-4 border-l-red-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-700 dark:border-r-gray-700' 
                          : 'border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                    >
                      {/* Checkbox Interaction */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        t.priority === 'High' ? 'border-red-200 group-hover:border-red-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-orange-500'
                      }`}>
                          <Check className="w-3 h-3 text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {t.title}
                        </span>
                        {t.priority === 'High' && (
                          <span className="text-[10px] font-bold text-red-500 mt-0.5">High Priority</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- GOALS --- */}
            {goals.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Goals</span>
                </div>
                <div className="space-y-2">
                  {goals.map(g => (
                    <div 
                      key={g._id} 
                      onClick={() => onToggleGoal(g._id)}
                      className="group flex items-center gap-3 p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 cursor-pointer"
                    >
                      {/* Target Circle Interaction */}
                      <div className="w-5 h-5 rounded-full border-2 border-orange-400/50 group-hover:border-orange-500 flex items-center justify-center transition-colors">
                        <div className="w-2.5 h-2.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                        {g.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          /* EMPTY STATE (Trophy) */
          <div className="h-full flex flex-col items-center justify-center text-center py-6 opacity-80">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">You are caught up!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] mt-1">
              No pending tasks or goals. Time to focus on the bigger picture.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSection;