import React from 'react';
import { Layers, CheckSquare, Target, Check, Trophy, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskSection = ({ tasks, goals, onToggleTask, onToggleGoal }) => {
  const todayTasks = tasks.filter(t => {
     if (!t.dueDate) return true; // Show Backlog
     const due = new Date(t.dueDate);
     const todayEnd = new Date();
     todayEnd.setHours(23, 59, 59, 999);
     return due <= todayEnd;
  });

  const totalPending = todayTasks.length + goals.length;

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* 1. Dynamic Gradient Top Border */}
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${totalPending > 0 ? 'from-orange-400 via-red-500 to-pink-500' : 'from-green-400 to-emerald-500'}`}></div>

      {/* 2. Responsive Header */}
      <div className="p-5 sm:p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className={`p-2 rounded-xl ${totalPending > 0 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
            <Layers className="w-5 h-5" />
          </div> 
          Pending Actions
        </h3>
        
        {totalPending > 0 && (
          <div className="flex items-center gap-2">
             <span className="hidden sm:inline text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remaining</span>
             <span className="text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-lg shadow-lg">
               {totalPending}
             </span>
          </div>
        )}
      </div>
      
      {/* 3. Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5">
        <AnimatePresence mode='popLayout'>
          {totalPending > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              
              {/* --- DAILY TASKS --- */}
              {todayTasks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">
                    <CheckSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Focus Tasks</span>
                  </div>
                  
                  <div className="space-y-2">
                    <AnimatePresence>
                      {todayTasks.map(t => (
                        <motion.button 
                          layout
                          key={t._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                          onClick={() => onToggleTask(t._id)}
                          className={`w-full text-left group relative overflow-hidden flex items-start sm:items-center gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 hover:shadow-md active:scale-[0.98]
                            ${t.priority === 'High' 
                              ? 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' 
                              : 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700/50'
                            }`}
                        >
                          {/* Priority Indicator Line */}
                          {t.priority === 'High' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}

                          {/* Checkbox Visual */}
                          <div className={`mt-0.5 sm:mt-0 w-5 h-5 sm:w-6 sm:h-6 rounded-[0.4rem] sm:rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                            t.priority === 'High' 
                              ? 'border-red-300 dark:border-red-700 bg-white dark:bg-transparent group-hover:border-red-500' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent group-hover:border-orange-500'
                          }`}>
                              <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${t.priority === 'High' ? 'text-red-500' : 'text-orange-500'} opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 duration-200`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs sm:text-sm font-bold truncate block ${t.priority === 'High' ? 'text-red-900 dark:text-red-100' : 'text-gray-700 dark:text-gray-200'}`}>
                                {t.title}
                            </span>
                            
                            {/* Metadata Row */}
                            <div className="flex items-center gap-2 mt-1">
                                {t.priority === 'High' && (
                                    <span className="flex items-center gap-1 text-[9px] font-black text-red-500 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        <AlertCircle className="w-2.5 h-2.5" /> High Priority
                                    </span>
                                )}
                                {t.dueDate && (
                                    <span className="flex items-center gap-1 text-[9px] font-medium text-gray-400">
                                        <Clock className="w-2.5 h-2.5" /> {new Date(t.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* --- GOALS --- */}
              {goals.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">
                    <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Active Goals</span>
                  </div>
                  
                  <div className="space-y-2">
                    {goals.map(g => (
                      <motion.div 
                        layout
                        key={g._id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => onToggleGoal(g._id)}
                        className="group flex items-center gap-3 p-3 sm:p-3.5 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/20 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        {/* Target Circle */}
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-orange-400/30 group-hover:border-orange-500 flex items-center justify-center transition-colors bg-white dark:bg-transparent">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-orange-900 dark:group-hover:text-orange-100 transition-colors">
                          {g.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-10 opacity-80"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-white dark:ring-gray-800">
                <Trophy className="w-10 h-10 text-amber-500 drop-shadow-sm" />
              </div>
              <p className="text-base font-black text-gray-900 dark:text-white">All Caught Up!</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 leading-relaxed">
                You've cleared your deck for today. Time to focus on the bigger picture or rest.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskSection;