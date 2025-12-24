import React from 'react';
import { Target, Calendar, Pencil, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const GoalCard = ({ goal, handleEdit, handleDelete, handleToggle }) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dueDate = new Date(goal.deadline); dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isOverdue = daysLeft < 0;
  const isCompleted = goal.isCompleted;
  const isLongTerm = goal.type === 'Long Term';

  let containerClasses = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800";
  let iconBg = "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
  let statusBadge = null;

  if (isCompleted) {
    containerClasses = "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30";
    iconBg = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
        <CheckCircle className="w-3 h-3" /> Completed
      </span>
    );
  } else if (isOverdue) {
    containerClasses = "bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/30 shadow-lg shadow-rose-500/5";
    iconBg = "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400";
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 uppercase tracking-wider">
        <AlertCircle className="w-3 h-3" /> Overdue
      </span>
    );
  } else {
    iconBg = isLongTerm ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    statusBadge = (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${daysLeft <= 3 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
        <Clock className="w-3 h-3" /> {daysLeft === 0 ? 'Today' : `${daysLeft}d Left`}
      </span>
    );
  }

  return (
    <div className={`group relative p-5 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md w-full min-w-0 ${containerClasses}`}>
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex items-start gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
                {isLongTerm ? <Target className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
                {/* IMPROVEMENT: Removed 'truncate', added 'whitespace-normal' and 'break-words' to show all text */}
                <h3 className={`font-bold text-sm leading-snug whitespace-normal break-words ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                  {goal.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {statusBadge}
                </div>
            </div>
        </div>
        
        {/* Actions (reveal on hover) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {!isCompleted && (
              <button onClick={() => handleEdit(goal)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={() => handleDelete(goal._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Calendar className="w-3.5 h-3.5" /> <span>{formatDate(goal.deadline)}</span>
        </div>
        <button 
          onClick={() => handleToggle(goal._id)} 
          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
            isCompleted 
              ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50" 
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 active:scale-95"
          }`}
        >
          {isCompleted ? 'UNDO' : 'DONE'}
        </button>
      </div>
    </div>
  );
};

export default GoalCard;