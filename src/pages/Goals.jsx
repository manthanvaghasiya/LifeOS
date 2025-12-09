import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Plus, X, Target, Clock, Sparkles, Mountain, 
  Calendar, CheckCircle2, MoreVertical, Pencil, Trash2, CheckSquare, Link as LinkIcon 
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { addXP } from '../utils/gamification';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Goals Form State
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalEditId, setGoalEditId] = useState(null);
  const [goalFormData, setGoalFormData] = useState({ title: '', type: 'Long Term', deadline: '' });
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Tasks Form State
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState(''); // <--- NEW STATE

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

  // --- GOAL HANDLERS ---
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
        if (isCompleting) addXP(50); // BIG REWARD
    } catch (err) { fetchAll(); }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete goal?")) return;
    try { await API.delete(`/goals/${id}`); setGoals(goals.filter(g => g._id !== id)); } catch (err) {}
  };

  const openGoalEdit = (goal) => {
    setGoalFormData({ title: goal.title, type: goal.type || 'Long Term', deadline: goal.deadline ? goal.deadline.split('T')[0] : '' });
    setGoalEditId(goal._id); setShowGoalForm(true); setMenuOpenId(null);
  };

  const closeGoalForm = () => { setShowGoalForm(false); setGoalEditId(null); setGoalFormData({ title: '', type: 'Long Term', deadline: '' }); };

  // --- TASK HANDLERS ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      // Send linkedGoalId to backend
      const res = await API.post('/tasks', { 
          title: newTask, 
          priority, 
          dueDate: dueDate || new Date(),
          linkedGoal: linkedGoalId || null 
      });
      setTasks([...tasks, res.data]);
      // Reset Form
      setNewTask(''); setPriority('Medium'); setDueDate(''); setLinkedGoalId('');
    } catch (err) { alert('Error adding task'); }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id);
    const isCompleting = !task.isCompleted;

    setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: isCompleting } : t));
    
    try { 
        await API.put(`/tasks/${id}/toggle`); 
        if (isCompleting) addXP(20); // MEDIUM REWARD
    } catch (err) { fetchAll(); }
  };
  const deleteTask = async (id) => {
    if(!window.confirm("Delete task?")) return;
    try { await API.delete(`/tasks/${id}`); setTasks(tasks.filter(t => t._id !== id)); } catch (err) {}
  };

  // --- DATA FILTERING ---
  const visibleGoals = goals.filter(g => !g.isCompleted || new Date(g.updatedAt).toLocaleDateString() === new Date().toLocaleDateString());
  const longTermGoals = visibleGoals.filter(g => g.type === 'Long Term');
  const shortTermGoals = visibleGoals.filter(g => g.type === 'Short Term');

  // Filter Tasks
  const sortedTasks = tasks.sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted - b.isCompleted;
    const pOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  const activeTasks = sortedTasks.filter(t => !t.isCompleted);
  const completedTasks = sortedTasks.filter(t => t.isCompleted);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 font-medium">Loading your command center...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 pb-20">
      <div className="max-w-[1600px] mx-auto space-y-10 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    Execution Center <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-200 animate-pulse" />
                </h1>
                <p className="text-gray-500 font-medium mt-1 text-base">Align your daily actions with your life vision.</p>
            </div>
            <button onClick={() => setShowGoalForm(true)} className="group flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-sm">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> New Goal
            </button>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1: DAILY TASKS */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-blue-50 flex flex-col relative overflow-hidden min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><CheckSquare className="w-5 h-5" /></div>
                        Daily Tasks
                    </h3>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">{activeTasks.length}</span>
                </div>

                {/* Task Input */}
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <form onSubmit={addTask} className="space-y-3">
                        <input type="text" placeholder="Add a new task..." className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500/20" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                        
                        <div className="grid grid-cols-2 gap-2">
                            <select className="p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none cursor-pointer" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <input type="date" className="p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none cursor-pointer" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>

                        {/* NEW: Link to Goal Dropdown */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <select 
                                    className="w-full p-2 pl-8 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none appearance-none cursor-pointer hover:border-blue-300 transition"
                                    value={linkedGoalId} 
                                    onChange={(e) => setLinkedGoalId(e.target.value)}
                                >
                                    <option value="">Link to Goal (Optional)</option>
                                    {shortTermGoals.map(g => (
                                        <option key={g._id} value={g._id}>{g.title}</option>
                                    ))}
                                </select>
                                <LinkIcon className="w-3 h-3 absolute left-3 top-2.5 text-gray-400" />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition shadow-md"><Plus className="w-4 h-4" /></button>
                        </div>
                    </form>
                </div>

                {/* Task List */}
                <div className="p-4 space-y-3 overflow-y-auto max-h-[500px] no-scrollbar">
                    {activeTasks.map(task => <TaskItem key={task._id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />)}
                    {completedTasks.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-gray-100 opacity-60">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Completed</p>
                            <div className="space-y-2">
                                {completedTasks.map(task => <TaskItem key={task._id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />)}
                            </div>
                        </div>
                    )}
                    {tasks.length === 0 && <EmptyState message="No tasks yet." icon={<CheckSquare className="w-8 h-8 text-blue-300"/>} />}
                </div>
            </div>

            {/* COLUMN 2: SHORT TERM */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-100/50 border border-orange-50 flex flex-col relative overflow-hidden min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-red-500"></div>
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-xl text-orange-600"><Clock className="w-5 h-5" /></div> Short Term
                    </h3>
                    <span className="text-xs font-bold bg-orange-50 text-orange-700 px-3 py-1 rounded-lg border border-orange-100">{shortTermGoals.length}</span>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto max-h-[530px] no-scrollbar">
                    {shortTermGoals.length > 0 ? shortTermGoals.map(goal => (
                        <GoalItem key={goal._id} goal={goal} handleToggle={toggleGoal} handleEdit={openGoalEdit} handleDelete={deleteGoal} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
                    )) : <EmptyState message="No short term goals." icon={<Clock className="w-8 h-8 text-orange-300"/>} />}
                </div>
            </div>

            {/* COLUMN 3: LONG TERM */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col relative overflow-hidden min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Mountain className="w-5 h-5" /></div> Long Term
                    </h3>
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">{longTermGoals.length}</span>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto max-h-[530px] no-scrollbar">
                    {longTermGoals.length > 0 ? longTermGoals.map(goal => (
                        <GoalItem key={goal._id} goal={goal} handleToggle={toggleGoal} handleEdit={openGoalEdit} handleDelete={deleteGoal} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
                    )) : <EmptyState message="No long term vision." icon={<Mountain className="w-8 h-8 text-indigo-300"/>} />}
                </div>
            </div>

        </div>

        {/* GOAL MODAL */}
        {showGoalForm && (
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative transform transition-all scale-100 border border-gray-100">
                    <button onClick={closeGoalForm} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition"><X className="w-5 h-5 text-gray-500" /></button>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{goalEditId ? 'Refine Goal' : 'New Goal'}</h2>
                    <form onSubmit={handleGoalSubmit} className="space-y-5">
                        <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Title</label><input type="text" required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black/5 font-medium text-gray-800" value={goalFormData.title} onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})} placeholder="e.g. Save ₹1 Lakh" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Horizon</label><select className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-medium text-gray-700 cursor-pointer" value={goalFormData.type} onChange={(e) => setGoalFormData({...goalFormData, type: e.target.value})}><option value="Short Term">Short Term</option><option value="Long Term">Long Term</option></select></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Deadline</label><input type="date" required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-medium text-gray-700 cursor-pointer" value={goalFormData.deadline} onChange={(e) => setGoalFormData({...goalFormData, deadline: e.target.value})} /></div>
                        </div>
                        <button type="submit" className="w-full bg-gray-900 text-white p-4 rounded-2xl font-bold hover:bg-black shadow-xl mt-4">Save Vision</button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

// --- TASK ITEM WITH LINKED GOAL BADGE ---
const TaskItem = ({ task, toggleTask, deleteTask }) => {
    const isCompleted = task.isCompleted;
    return (
        <div className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-300 hover:shadow-sm ${isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <button onClick={() => toggleTask(task._id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-transparent hover:border-blue-400'}`}><CheckSquare className="w-3.5 h-3.5" /></button>
                <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</span>
                    {!isCompleted && (
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>{task.priority}</span>
                            
                            {/* LINKED GOAL BADGE */}
                            {task.linkedGoal && (
                                <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <LinkIcon className="w-2.5 h-2.5" /> {task.linkedGoal.title}
                                </span>
                            )}
                            
                            <span className="text-[9px] text-gray-400 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {formatDate(task.dueDate)}</span>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={() => deleteTask(task._id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
        </div>
    );
};

// ... GoalItem and EmptyState remain same as before

const GoalItem = ({ goal, handleToggle, handleEdit, handleDelete, menuOpenId, setMenuOpenId }) => {
    const isOverdue = new Date(goal.deadline) < new Date().setHours(0,0,0,0) && !goal.isCompleted;
    const isCompleted = goal.isCompleted;
    const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className={`relative group p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg flex justify-between items-center ${isCompleted ? 'bg-green-50 border-green-100 opacity-90' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
            <div className="flex items-center gap-4 overflow-hidden">
                <button onClick={() => handleToggle(goal._id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-gray-400'}`}><CheckCircle2 className="w-4 h-4" /></button>
                <div className="min-w-0">
                    <h4 className={`font-semibold text-sm truncate transition-all ${isCompleted ? 'text-green-800 line-through' : 'text-gray-800'}`}>{goal.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${isCompleted ? 'bg-green-200 text-green-800' : (isOverdue ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500')}`}><Calendar className="w-3 h-3" />{isCompleted ? 'Done' : (isOverdue ? 'Overdue' : formatDate(goal.deadline))}</span>
                        {!isCompleted && !isOverdue && <span className="text-[10px] font-medium text-gray-400">{daysLeft} days left</span>}
                    </div>
                </div>
            </div>
            <div className="relative shrink-0">
                <button onClick={() => setMenuOpenId(menuOpenId === goal._id ? null : goal._id)} className="p-2 text-gray-300 hover:text-gray-600 rounded-xl transition"><MoreVertical className="w-5 h-5" /></button>
                {menuOpenId === goal._id && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-100 shadow-xl rounded-xl p-1 z-20 w-32 animate-fade-in">
                        <button onClick={() => handleEdit(goal)} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition text-left"><Pencil className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDelete(goal._id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition text-left"><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ message, icon }) => (
    <div className="py-20 text-center flex flex-col items-center justify-center opacity-50">
        <div className="mb-3 p-4 bg-gray-50 rounded-full">{icon}</div>
        <p className="text-gray-500 font-medium text-sm">{message}</p>
    </div>
);

export default Goals;