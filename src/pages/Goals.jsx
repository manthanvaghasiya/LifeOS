import React, { useState, useEffect, useMemo } from 'react';
import API from '../services/api';
import { Plus, Sparkles, Clock, Mountain, CheckSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

// Components
import GoalCard from '../components/goals/GoalCard';
import TaskItem from '../components/goals/TaskItem';
import TaskForm from '../components/goals/TaskForm';
import GoalForm from '../components/goals/GoalForm';

const Goals = () => {
  const { refreshUser } = useAuth();
  const toast = useToast();
  
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editGoalData, setEditGoalData] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [goalsRes, tasksRes] = await Promise.all([
        API.get('/goals'),
        API.get('/tasks')
      ]);
      setGoals(goalsRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (err) { 
      console.error(err); 
      setLoading(false);
    }
  };

  // --- 1. SMART SORTING (Urgent > High > Date) ---
  const sortedTasks = useMemo(() => {
    const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
    
    return [...tasks].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted - b.isCompleted;
        if (a.isUrgent !== b.isUrgent) return b.isUrgent - a.isUrgent; // Urgent First
        
        const pA = priorityWeight[a.priority] || 0;
        const pB = priorityWeight[b.priority] || 0;
        if (pA !== pB) return pB - pA;

        return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [tasks]);

  // --- 2. CELEBRATION HELPER ---
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 9999
    });
  };

  // --- ACTIONS ---

  const handleGoalSubmit = async (formData) => {
    try {
      if (editGoalData) {
        const res = await API.put(`/goals/${editGoalData._id}`, formData);
        setGoals(goals.map(g => g._id === editGoalData._id ? res.data : g));
        toast.success("Goal refined.");
      } else {
        const res = await API.post('/goals', formData);
        setGoals([...goals, res.data]);
        toast.success("New vision set!");
      }
      setShowGoalForm(false);
      setEditGoalData(null);
    } catch (err) { 
      toast.error("Failed to save goal.");
    }
  };

  const handleTaskAdd = async (taskData) => {
    try {
      const res = await API.post('/tasks', {
        title: taskData.title,
        priority: taskData.priority,
        isUrgent: taskData.isUrgent, 
        dueDate: taskData.dueDate,
        linkedGoal: taskData.linkedGoalId || null
      });
      setTasks([...tasks, res.data]);
      toast.success(taskData.isUrgent ? "Urgent task added!" : "Task added.");
    } catch (err) { 
      toast.error('Error adding task.');
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id);
    const isCompleting = !task.isCompleted;
    
    // Optimistic Update
    setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: isCompleting, updatedAt: new Date().toISOString() } : t));

    if (isCompleting) {
        triggerConfetti();
        const xp = task.isUrgent ? 20 : 10;
        toast.success(`Task Complete! +${xp} XP`);
    }

    try { 
      await API.put(`/tasks/${id}/toggle`); 
      if (isCompleting) await refreshUser(); 
    } catch (err) { 
      fetchAll(); // Revert
      toast.error("Sync failed.");
    }
  };

  // ✨ NEW: Smart Goal Toggle
  const toggleGoal = async (id) => {
    const goal = goals.find(g => g._id === id);
    const isCompleting = !goal.isCompleted;

    // Optimistic Update: Update state immediately so UI reflects change
    setGoals(goals.map(g => g._id === id ? { ...g, isCompleted: isCompleting, updatedAt: new Date().toISOString() } : g));

    if (isCompleting) {
        triggerConfetti();
        toast.success("Goal Milestone Reached! 🚀");
    }

    try {
        await API.put(`/goals/${id}/toggle`);
        if (isCompleting) await refreshUser();
    } catch (err) {
        fetchAll();
        toast.error("Failed to update goal.");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    try { 
      await API.delete(`/tasks/${id}`); 
      setTasks(tasks.filter(t => t._id !== id));
      toast.success("Task cleared.");
    } catch (err) { toast.error("Could not delete task."); }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete goal?")) return;
    try { 
      await API.delete(`/goals/${id}`); 
      setGoals(goals.filter(g => g._id !== id)); 
      toast.success("Goal removed.");
    } catch (err) { toast.error("Could not delete goal."); }
  };

  // --- FILTERS (FIXED LOGIC) ---
  
  // Helper to check if date is today
  const isToday = (dateString) => {
      const d = new Date(dateString);
      const today = new Date();
      return d.getDate() === today.getDate() && 
             d.getMonth() === today.getMonth() && 
             d.getFullYear() === today.getFullYear();
  };

  // ✨ FIX: Filter out old completed goals
  const filterGoals = (type) => {
      return goals.filter(g => {
          if (g.type !== type) return false;
          // Show if pending
          if (!g.isCompleted) return true;
          // Show if completed TODAY (hide old completions)
          return isToday(g.updatedAt || new Date()); 
      });
  };

  const shortTermGoals = filterGoals('Short Term');
  const longTermGoals = filterGoals('Long Term');
  
  // Task Filters
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  
  const todayList = sortedTasks.filter(t => {
      if (t.isCompleted) return false;
      const d = new Date(t.dueDate); d.setHours(0,0,0,0);
      return d.getTime() <= todayStart.getTime(); 
  });
  
  const upcomingList = sortedTasks.filter(t => {
      if (t.isCompleted) return false;
      const d = new Date(t.dueDate); d.setHours(0,0,0,0);
      return d.getTime() > todayStart.getTime();
  });

  const completedList = sortedTasks.filter(t => {
      if (!t.isCompleted) return false;
      if (!t.updatedAt) return false;
      return isToday(t.updatedAt);
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-10 animate-fade-in min-h-screen pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-200 dark:border-amber-800">
                  {goals.filter(g => !g.isCompleted).length} Pending Goals
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Execution Center <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-200 animate-pulse" />
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                Align your daily actions with your life vision.
              </p>
            </div>
            <button
              onClick={() => { setEditGoalData(null); setShowGoalForm(true); }}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 px-6 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              <Plus className="w-4 h-4" /> New Goal
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1: SMART TASK LIST */}
            <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-blue-500" /> Daily Tasks
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                        {todayList.length} Today
                    </span>
                </div>

                <TaskForm onAddTask={handleTaskAdd} shortTermGoals={shortTermGoals} />

                <div className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar max-h-[600px]">
                    {/* Today's Tasks */}
                    {todayList.map(task => (
                        <TaskItem key={task._id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
                    ))}

                    {/* Upcoming Divider */}
                    {upcomingList.length > 0 && (
                        <div className="relative py-4 flex items-center gap-3">
                            <div className="h-px bg-slate-200 dark:bg-slate-700/50 flex-1"></div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                                Upcoming
                            </span>
                            <div className="h-px bg-slate-200 dark:bg-slate-700/50 flex-1"></div>
                        </div>
                    )}
                    {upcomingList.map(task => (
                        <TaskItem key={task._id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
                    ))}

                    {/* Completed Divider */}
                    {completedList.length > 0 && (
                        <div className="pt-6 mt-2 border-t border-slate-100 dark:border-slate-800/50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2 text-center opacity-70">Done Today</p>
                            <div className="space-y-1 opacity-60">
                                {completedList.map(task => <TaskItem key={task._id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* COLUMN 2: SHORT TERM GOALS */}
            <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" /> Short Term
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
                        {shortTermGoals.filter(g => !g.isCompleted).length} Active
                    </span>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar max-h-[650px]">
                    {shortTermGoals.map(goal => (
                        <GoalCard 
                            key={goal._id} 
                            goal={goal} 
                            handleToggle={toggleGoal}
                            handleEdit={(g) => { setEditGoalData(g); setShowGoalForm(true); }} 
                            handleDelete={deleteGoal} 
                        />
                    ))}
                </div>
            </div>

            {/* COLUMN 3: LONG TERM GOALS */}
            <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Mountain className="w-5 h-5 text-indigo-500" /> Long Term
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                        {longTermGoals.filter(g => !g.isCompleted).length} Active
                    </span>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar max-h-[650px]">
                    {longTermGoals.map(goal => (
                        <GoalCard 
                            key={goal._id} 
                            goal={goal} 
                            handleToggle={toggleGoal}
                            handleEdit={(g) => { setEditGoalData(g); setShowGoalForm(true); }} 
                            handleDelete={deleteGoal} 
                        />
                    ))}
                </div>
            </div>

        </div>

        {showGoalForm && (
            <GoalForm 
                onClose={() => setShowGoalForm(false)} 
                onSubmit={handleGoalSubmit} 
                initialData={editGoalData} 
            />
        )}
    </div>
  );
};

export default Goals;