import React from 'react';
import { CheckSquare, Link as LinkIcon, Trash2, Calendar, Flame, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const TaskItem = ({ task, toggleTask, deleteTask }) => {
  const isCompleted = task.isCompleted;
  const isUrgent = task.isUrgent;

  // Dynamic Styles based on Priority & Urgency
  const getPriorityStyle = (p) => {
    switch (p) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30 dark:text-rose-400';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  // Urgent Container Style
  const containerStyle = isUrgent && !isCompleted
    ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50 shadow-sm shadow-red-100 dark:shadow-none" 
    : isCompleted 
      ? "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60" 
      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-md";

  return (
    <div className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 mb-2.5 ${containerStyle}`}>
      
      <div className="flex items-center gap-3.5 flex-1 overflow-hidden">
        {/* Checkbox */}
        <button 
          onClick={() => toggleTask(task._id)} 
          className={`w-5 h-5 rounded-[0.4rem] border-2 flex items-center justify-center transition-all duration-200 shrink-0
            ${isCompleted ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}
        >
          {isCompleted && <CheckSquare className="w-3.5 h-3.5 text-white" />}
        </button>

        {/* Content */}
        <div className="flex flex-col min-w-0 gap-1">
          <div className="flex items-center gap-2">
             <span className={`text-sm font-bold truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-gray-200'}`}>
               {task.title}
             </span>
             {isUrgent && !isCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">
                   <Flame className="w-3 h-3 fill-current animate-pulse" /> Urgent
                </span>
             )}
          </div>

          {!isCompleted && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority Badge */}
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${getPriorityStyle(task.priority)}`}>
                {task.priority === 'High' && <AlertCircle className="w-2.5 h-2.5" />}
                {task.priority}
              </span>

              {/* Linked Goal */}
              {task.linkedGoal && (
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md flex items-center gap-1 truncate max-w-[120px]">
                  <LinkIcon className="w-2.5 h-2.5" /> {task.linkedGoal.title}
                </span>
              )}

              {/* Date */}
              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" /> {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Action */}
      <button 
        onClick={() => deleteTask(task._id)} 
        className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TaskItem;