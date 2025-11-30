import React from 'react';
import { Target, Calendar, Pencil, Trash2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const GoalCard = ({ goal, handleEdit, handleDelete, handleToggle }) => {
  const today = new Date();
  const dueDate = new Date(goal.deadline);
  
  // Calculate Time Difference
  const diffTime = dueDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // LOGIC: Status Colors
  const isOverdue = daysLeft < 0;
  const isCompleted = goal.isCompleted;

  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  let iconColor = 'text-gray-500 bg-gray-50';
  let statusText = daysLeft + ' Days Left';
  
  if (isCompleted) {
    // SUCCESS (Green)
    borderColor = 'border-green-300';
    bgColor = 'bg-green-50';
    iconColor = 'text-green-600 bg-green-100';
    statusText = 'Completed';
  } else if (isOverdue) {
    // FAILURE / OVERDUE (Red)
    borderColor = 'border-red-300';
    bgColor = 'bg-red-50';
    iconColor = 'text-red-600 bg-red-100';
    statusText = `Overdue by ${Math.abs(daysLeft)} days`;
  } else {
    // ACTIVE (Blue/Orange)
    borderColor = goal.type === 'Long Term' ? 'border-indigo-200' : 'border-orange-200';
    iconColor = goal.type === 'Long Term' ? 'text-indigo-600 bg-indigo-50' : 'text-orange-500 bg-orange-50';
  }

  return (
    <div className={`p-4 rounded-xl border-2 shadow-sm flex flex-col justify-between h-full transition hover:shadow-md ${borderColor} ${bgColor}`}>
      
      {/* Header (Compact) */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${iconColor}`}>
                {goal.type === 'Long Term' ? <Target className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div>
                <h3 className={`font-bold text-sm leading-tight ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                    {goal.title}
                </h3>
            </div>
        </div>
        
        {/* Actions (Edit/Delete) */}
        <div className="flex gap-1">
            {!isCompleted && (
                <button onClick={() => handleEdit(goal)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-md transition"><Pencil className="w-3 h-3" /></button>
            )}
            <button onClick={() => handleDelete(goal._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md transition"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>

      {/* Deadline Info */}
      <div className="mb-3 pl-1">
        <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(goal.deadline)}
        </p>
        <p className={`text-xs font-bold mt-1 ${isCompleted ? 'text-green-600' : (isOverdue ? 'text-red-600' : 'text-gray-700')}`}>
            {statusText}
        </p>
      </div>

      {/* Action Button (Toggle Complete) */}
      <button 
        onClick={() => handleToggle(goal._id)} 
        className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition border
            ${isCompleted 
                ? 'bg-white border-green-200 text-green-700 hover:bg-gray-50' 
                : (isOverdue ? 'bg-red-600 border-red-600 text-white hover:bg-red-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')
            }`}
      >
        {isCompleted ? 'Undo' : (isOverdue ? 'Finish Late' : 'Mark Done')}
        {isCompleted && <CheckCircle className="w-3 h-3" />}
      </button>
    </div>
  );
};

export default GoalCard;