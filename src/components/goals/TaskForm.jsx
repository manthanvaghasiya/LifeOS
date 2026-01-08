import React, { useState } from 'react';
import { Plus, Link as LinkIcon, Zap } from 'lucide-react';

const TaskForm = ({ onAddTask, shortTermGoals }) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isUrgent, setIsUrgent] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    onAddTask({
        title: newTask,
        priority,
        isUrgent, // ✨ New Field
        dueDate: dueDate || new Date(),
        linkedGoalId
    });

    // Reset
    setNewTask('');
    setPriority('Medium');
    setIsUrgent(false);
    setDueDate('');
    setLinkedGoalId('');
  };

  return (
    <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Input Row */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap gap-2 items-center">
                {/* Priority Select */}
                <select
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-blue-300 transition-colors"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                {/* Urgency Toggle */}
                <button
                    type="button"
                    onClick={() => setIsUrgent(!isUrgent)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                        isUrgent 
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Zap className={`w-3.5 h-3.5 ${isUrgent ? 'fill-current' : ''}`} />
                    {isUrgent ? 'Urgent' : 'Normal'}
                </button>

                {/* Date Input */}
                <input
                    type="date"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                {/* Linked Goal */}
                <div className="relative flex-1 min-w-[120px]">
                    <select
                        className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg pl-8 pr-3 py-2 outline-none cursor-pointer"
                        value={linkedGoalId}
                        onChange={(e) => setLinkedGoalId(e.target.value)}
                    >
                        <option value="">Link to Goal...</option>
                        {shortTermGoals.map(g => (<option key={g._id} value={g._id}>{g.title}</option>))}
                    </select>
                    <LinkIcon className="w-3 h-3 absolute left-3 top-2.5 text-slate-400" />
                </div>
            </div>
        </form>
    </div>
  );
};

export default TaskForm;