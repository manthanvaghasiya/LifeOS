import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Plus, X, Target, Clock, Sparkles, Mountain, 
  Calendar, CheckSquare, Link as LinkIcon, Trash2 
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { addXP } from '../utils/gamification';
import GoalCard from '../components/goals/GoalCard';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalEditId, setGoalEditId] = useState(null);
  const [goalFormData, setGoalFormData] = useState({ title: '', type: 'Long Term', deadline: '' });

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState('');

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
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (goalEditId) {
        const res = await API.put(`/goals/${goalEditId}`, goalFormData);
        setGoals(goals.map(g => g._id === goalEditId ? res.data : g));
      } else {
        const res = await API.post('/goals', goalFormData);
        setGoals([...goals, res.data]);
      }
      closeGoalForm();
    } catch (err) { alert("Error saving goal."); }
  };

  const toggleGoal = async (id) => {
    const goal = goals.find(g => g._id === id);
    const isCompleting = !goal.isCompleted;
    setGoals(goals.map(g => g._id === id ? { ...g, isCompleted: isCompleting, updatedAt: new Date().toISOString() } : g));
    try { 
        await API.put(`/goals/${id}/toggle`); 
        if (isCompleting) addXP(50); 
    } catch (err) { fetchAll(); }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete goal?")) return;
    try { await API.delete(`/goals/${id}`); setGoals(goals.filter(g => g._id !== id)); } catch (err) {}
  };

  const openGoalEdit = (goal) => {
    setGoalFormData({ title: goal.title, type: goal.type || 'Long Term', deadline: goal.deadline ? goal.deadline.split('T')[0] : '' });
    setGoalEditId(goal._id); setShowGoalForm(true);
  };

  const closeGoalForm = () => { setShowGoalForm(false); setGoalEditId(null); setGoalFormData({ title: '', type: 'Long Term', deadline: '' }); };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await API.post('/tasks', { 
          title: newTask, 
          priority, 
          dueDate: dueDate || new Date(),
          linkedGoal: linkedGoalId || null 
      });
      setTasks([...tasks, res.data]);
      setNewTask(''); setPriority('Medium'); setDueDate(''); setLinkedGoalId('');
    } catch (err) { alert('Error adding task'); }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id);
    const isCompleting = !task.isCompleted;
    setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: isCompleting } : t));
    try { 
        await API.put(`/tasks/${id}/toggle`); 
        if (isCompleting) addXP(20);
    } catch (err) { fetchAll(); }
  };
  
  const deleteTask = async (id) => {
    if(!window.confirm("Delete task?")) return;
    try { await API.delete(`/tasks/${id}`); setTasks(tasks.filter(t => t._id !== id)); } catch (err) {}
  };

  // --- DATA FILTERING LOGIC ---
  const longTermGoals = goals.filter(g => g.type === 'Long Term');
  
  const shortTermGoals = goals.filter(g => {
      if (g.type !== 'Short Term') return false;
      if (!g.isCompleted) return true;
      const lastUpdate = new Date(g.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      return lastUpdate === today; // Auto-remove after 1 day
  });

  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);
  const pendingGoalsCount = goals.filter(g => !g.isCompleted).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-10 animate-fade-in min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-200 dark:border-amber-800">
                  {pendingGoalsCount} Pending Goals
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Execution Center <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-200 animate-pulse" />
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Align your daily actions with your life vision.
              </p>
          </div>
          <button 
            onClick={() => setShowGoalForm(true)} 
            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 px-6 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            <Plus className="w-4 h-4" /> New Goal
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLUMN 1: DAILY TASKS */}
          <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-blue-500" /> Daily Tasks
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    {activeTasks.length} Pending
                  </span>
              </div>

              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                  <form onSubmit={addTask} className="flex flex-col gap-3">
                      <input 
                        type="text" 
                        placeholder="What needs to be done?" 
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                        value={newTask} 
                        onChange={(e) => setNewTask(e.target.value)} 
                      />
                      
                      <div className="flex gap-2">
                          <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg px-2 py-2 outline-none" value={priority} onChange={(e) => setPriority(e.target.value)}>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                          </select>
                          
                          <div className="relative flex-1">
                            <select 
                                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg pl-8 pr-3 py-2 outline-none"
                                value={linkedGoalId} 
                                onChange={(e) => setLinkedGoalId(e.target.value)}
                            >
                                <option value="">Link Goal</option>
                                {shortTermGoals.map(g => ( <option key={g._id} value={g._id}>{g.title}</option> ))}
                            </select>
                            <LinkIcon className="w-3 h-3 absolute left-3 top-2.5 text-slate-400" />
                          </div>

                          <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 hover:bg-blue-700 transition shadow-md">
                            <Plus className="w-4 h-4" />
                          </button>
                      </div>
                  </form>
              </div>

              <div className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar max-h-[500px]">
                  {activeTasks.map(task => <TaskItem key={task._id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />)}
                  {completedTasks.length > 0 && (
                      <div className="pt-4 mt-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2 text-center">Completed Today</p>
                          <div className="space-y-1 opacity-60">
                              {completedTasks.map(task => <TaskItem key={task._id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />)}
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* COLUMN 2: SHORT TERM */}
          <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" /> Short Term
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
                    {shortTermGoals.filter(g => !g.isCompleted).length} Pending
                  </span>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar max-h-[650px]">
                  {shortTermGoals.map(goal => (
                      <GoalCard key={goal._id} goal={goal} handleToggle={toggleGoal} handleEdit={openGoalEdit} handleDelete={deleteGoal} />
                  ))}
              </div>
          </div>

          {/* COLUMN 3: LONG TERM */}
          <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Mountain className="w-5 h-5 text-indigo-500" /> Long Term
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                    {longTermGoals.filter(g => !g.isCompleted).length} Pending
                  </span>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar max-h-[650px]">
                  {longTermGoals.map(goal => (
                      <GoalCard key={goal._id} goal={goal} handleToggle={toggleGoal} handleEdit={openGoalEdit} handleDelete={deleteGoal} />
                  ))}
              </div>
          </div>
      </div>

      {showGoalForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border border-slate-200 dark:border-slate-800">
                  <button onClick={closeGoalForm} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X className="w-5 h-5 text-slate-500" /></button>
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{goalEditId ? 'Refine Goal' : 'New Goal'}</h2>
                  <form onSubmit={handleGoalSubmit} className="space-y-5">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Title</label>
                        <input type="text" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold dark:text-white" value={goalFormData.title} onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})} placeholder="e.g. Save ₹1 Lakh" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Horizon</label>
                            <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold text-slate-700 dark:text-gray-200" value={goalFormData.type} onChange={(e) => setGoalFormData({...goalFormData, type: e.target.value})}>
                                <option value="Short Term">Short Term</option>
                                <option value="Long Term">Long Term</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Deadline</label>
                            <input type="date" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold text-slate-700 dark:text-gray-200" value={goalFormData.deadline} onChange={(e) => setGoalFormData({...goalFormData, deadline: e.target.value})} />
                          </div>
                      </div>
                      <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl font-black hover:scale-[1.02] transition-all shadow-xl mt-4 uppercase tracking-widest text-sm">Save Vision</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const TaskItem = ({ task, toggleTask, deleteTask }) => {
    const isCompleted = task.isCompleted;
    const priorityConfig = {
        'High': 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30 dark:text-rose-400',
        'Medium': 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400',
        'Low': 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400'
    };

    return (
        <div className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${isCompleted ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-75' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-md'}`}>
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <button onClick={() => toggleTask(task._id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}><CheckSquare className="w-3 h-3" /></button>
                <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-semibold truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-gray-200'}`}>{task.title}</span>
                    {!isCompleted && (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${priorityConfig[task.priority]}`}>{task.priority}</span>
                            {task.linkedGoal && <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1 truncate"><LinkIcon className="w-2.5 h-2.5" /> {task.linkedGoal.title}</span>}
                            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-bold"><Calendar className="w-2.5 h-2.5" /> {formatDate(task.dueDate)}</span>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={() => deleteTask(task._id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
        </div>
    );
};

export default Goals;