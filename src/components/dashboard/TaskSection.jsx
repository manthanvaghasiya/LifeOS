import React from 'react';
import { Layers, CheckSquare, Target } from 'lucide-react';

const TaskSection = ({ tasks, goals, onToggleTask, onToggleGoal }) => {
  const totalPending = tasks.length + goals.length;

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400"><Layers className="w-5 h-5" /></div> 
          Pending Actions
        </h3>
        <span className="text-xs font-bold bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-lg">{totalPending}</span>
      </div>
      
      <div className="p-5 space-y-6">
        {/* Tasks */}
        {tasks.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Daily Tasks</p>
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition cursor-pointer" onClick={() => onToggleTask(t._id)}>
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${t.priority === 'High' ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}>
                    <CheckSquare className="w-3 h-3 text-transparent hover:text-gray-400"/>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals */}
        {goals.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Short Term Goals</p>
            <div className="space-y-2">
              {goals.map(g => (
                <div key={g._id} className="flex items-center gap-3 p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:shadow-sm transition cursor-pointer" onClick={() => onToggleGoal(g._id)}>
                  <div className="w-5 h-5 border-2 border-orange-300 dark:border-orange-600 rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 text-transparent hover:text-orange-400"/>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{g.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPending === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm font-medium italic">Nothing pending. You are caught up!</div>
        )}
      </div>
    </div>
  );
};

export default TaskSection;