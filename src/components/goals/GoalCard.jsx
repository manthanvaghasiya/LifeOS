import React from 'react';
import { Target, Calendar, Plus, Pencil, Trash2, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const GoalCard = ({ goal, handleEdit, handleDelete, handleAddFunds, handleComplete }) => {
  const isFinancial = goal.type === 'Long Term';
  
  // Financial Progress Logic
  const percentage = isFinancial && goal.targetAmount > 0 
    ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) 
    : 0;
  const isFunded = percentage >= 100;

  // Time Logic (For Short Term)
  const today = new Date();
  const dueDate = new Date(goal.deadline);
  const diffTime = dueDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;

  return (
    <div className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-full transition hover:shadow-md ${isFinancial ? 'bg-white border-gray-100' : 'bg-orange-50 border-orange-100'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isFinancial ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-orange-500 shadow-sm'}`}>
                {isFinancial ? <Target className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>
            <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isFinancial ? 'text-indigo-400' : 'text-orange-400'}`}>
                    {goal.type}
                </span>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{goal.title}</h3>
            </div>
        </div>
        <div className="flex gap-1">
            <button onClick={() => handleEdit(goal)} className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(goal._id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* BODY CONTENT (Changes based on Type) */}
      <div className="mb-6">
        {isFinancial ? (
            // FINANCIAL VIEW
            <>
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-gray-500">of {formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${isFunded ? 'bg-green-500' : 'bg-indigo-600'}`} style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="text-right mt-1">
                    <span className={`text-xs font-bold ${isFunded ? 'text-green-600' : 'text-indigo-600'}`}>{percentage}% Reached</span>
                </div>
            </>
        ) : (
            // SHORT TERM TIME VIEW
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Due: {formatDate(goal.deadline)}</span>
                </div>
                <div>
                    {isOverdue ? (
                        <span className="text-red-500 font-bold text-sm bg-red-100 px-3 py-1 rounded-full">Overdue by {Math.abs(daysLeft)} days</span>
                    ) : (
                        <span className="text-orange-600 font-bold text-2xl">{daysLeft} <span className="text-sm font-normal text-gray-500">days left</span></span>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* FOOTER BUTTONS */}
      {isFinancial ? (
          <button onClick={() => handleAddFunds(goal)} disabled={isFunded}
            className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition ${isFunded ? 'bg-green-100 text-green-700 cursor-default' : 'bg-black text-white hover:bg-gray-800'}`}>
            {isFunded ? 'Goal Achieved! 🎉' : <><Plus className="w-4 h-4" /> Add Funds</>}
          </button>
      ) : (
          <button onClick={() => handleDelete(goal._id)} className="w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 transition">
            <CheckCircle className="w-4 h-4" /> Mark Complete
          </button>
      )}
    </div>
  );
};

export default GoalCard;