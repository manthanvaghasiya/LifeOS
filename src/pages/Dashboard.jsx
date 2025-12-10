import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { generateInsights } from '../utils/smartInsights';
import { 
  Plus, CheckCircle, Target, Clock, 
  Wallet, TrendingUp, Landmark, Banknote, Sparkles, CreditCard, X, PieChart, CheckSquare, Layers,
  Lightbulb, AlertTriangle, CheckCircle2, Info, IndianRupee 
} from 'lucide-react';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Shopping', 'Health', 'Education', 'Investment'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Achiever' };
  const firstName = user.name.split(' ')[0]; 

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food', type: 'expense', paymentMode: 'Bank' });
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const [txRes, habitRes, goalRes, taskRes] = await Promise.all([
        API.get('/transactions'),
        API.get('/habits'),
        API.get('/goals'),
        API.get('/tasks')
      ]);
      setTransactions(txRes.data);
      setHabits(habitRes.data);
      setGoals(goalRes.data);
      setTasks(taskRes.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  // --- LOGIC ---
  const todayObj = new Date();
  const todayStr = todayObj.toISOString().split('T')[0];
  const todayDateString = todayObj.toLocaleDateString(); 
  const currentMonth = todayObj.getMonth();
  const currentYear = todayObj.getFullYear();

  // Filter: This Month's Transactions
  const thisMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  const todayTransactions = transactions.filter(t => new Date(t.date).toLocaleDateString() === todayDateString);

  // --- 1. LIFETIME NET WORTH ---
  const calculateLifetimeBalance = (mode) => {
    return transactions.reduce((acc, t) => {
      const tMode = t.paymentMode || 'Bank'; 
      if (tMode === mode && t.type === 'income') return acc + t.amount;
      if (t.type === 'transfer' && t.category === mode) return acc + t.amount;
      if (tMode === mode && t.type === 'expense') return acc - t.amount;
      if (tMode === mode && t.type === 'transfer') return acc - t.amount;
      return acc;
    }, 0);
  };

  const bankBalance = calculateLifetimeBalance('Bank');
  const cashBalance = calculateLifetimeBalance('Cash');
  const investmentBalance = calculateLifetimeBalance('Investment');
  const totalNetWorth = bankBalance + cashBalance + investmentBalance;

  // --- 2. MONTHLY STATS ---
  const monthlyIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, c) => acc + c.amount, 0);

  // Expenses: Exclude Investment
  const monthlyExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense' && t.category !== 'Investment') 
    .reduce((acc, c) => acc + c.amount, 0);

  // --- FIXED: NET MONTHLY INVESTMENT (IN - OUT) ---
  const monthlyInvested = thisMonthTransactions.reduce((acc, t) => {
    // 1. Money Added (Transfer TO Investment OR Expense categorized as Investment)
    if ((t.type === 'transfer' && t.category === 'Investment') || (t.type === 'expense' && t.category === 'Investment')) {
        return acc + t.amount;
    }
    // 2. Money Removed (Transfer FROM Investment)
    if (t.type === 'transfer' && t.paymentMode === 'Investment') {
        return acc - t.amount;
    }
    return acc;
  }, 0);

  // --- INSIGHTS ---
  const dailyInsight = generateInsights(transactions, habits, tasks);
  const getInsightStyle = (type) => {
    switch(type) {
      case 'danger': return { icon: <AlertTriangle className="w-6 h-6 text-white"/>, bg: 'bg-red-500', border: 'border-red-100', text: 'text-red-700' };
      case 'warning': return { icon: <Lightbulb className="w-6 h-6 text-white"/>, bg: 'bg-orange-500', border: 'border-orange-100', text: 'text-orange-700' };
      case 'success': return { icon: <CheckCircle2 className="w-6 h-6 text-white"/>, bg: 'bg-green-500', border: 'border-green-100', text: 'text-green-700' };
      default: return { icon: <Info className="w-6 h-6 text-white"/>, bg: 'bg-blue-500', border: 'border-blue-100', text: 'text-blue-700' };
    }
  };
  const insightStyle = getInsightStyle(dailyInsight.type);

  // Other filters
  const incompleteHabits = habits.filter(h => !h.completedDates.includes(todayStr));
  const pendingTasks = tasks.filter(t => !t.isCompleted).sort((a, b) => {
      const pOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return pOrder[a.priority] - pOrder[b.priority];
  }).slice(0, 3);
  const pendingShortTermGoals = goals.filter(g => !g.isCompleted && g.type === 'Short Term').sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);

  const handleToggleHabit = async (id) => { setHabits(prev => prev.map(h => h._id === id ? { ...h, completedDates: [...h.completedDates, todayStr] } : h)); try { await API.put(`/habits/${id}/toggle`, { date: todayStr }); } catch (err) { fetchAllData(); } };
  const handleToggleGoal = async (id) => { setGoals(prev => prev.map(g => g._id === id ? { ...g, isCompleted: true } : g)); try { await API.put(`/goals/${id}/toggle`); } catch (err) { fetchAllData(); } };
  const handleToggleTask = async (id) => { setTasks(prev => prev.map(t => t._id === id ? { ...t, isCompleted: true } : t)); try { await API.put(`/tasks/${id}/toggle`); } catch (err) { fetchAllData(); } };
  
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
    try {
        const res = await API.post('/transactions', { ...formData, category: finalCategory, date: new Date() });
        setTransactions([res.data, ...transactions]);
        setShowForm(false);
        setFormData({ title: '', amount: '', category: 'Food', type: 'expense', paymentMode: 'Bank' });
        setCustomCategory('');
    } catch (err) { alert('Error adding'); }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in bg-gray-50/50 dark:bg-gray-950/20 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Hello, {firstName}</h1>
                <span className="animate-pulse">👋</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Let's make today productive.
            </p>
        </div>
        <button onClick={() => setShowForm(true)} className="group bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/20 p-1 rounded-lg"><Plus className="w-4 h-4" /></div> Quick Spend
        </button>
      </div>

      {/* SMART INSIGHT CARD */}
      <div className={`p-6 rounded-3xl border ${insightStyle.border} bg-white dark:bg-gray-900/60 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5 transition-all duration-500 hover:shadow-md`}>
          <div className={`p-3 rounded-2xl ${insightStyle.bg} shadow-lg shadow-gray-200 dark:shadow-none shrink-0`}>{insightStyle.icon}</div>
          <div>
              <h3 className={`font-bold text-lg ${insightStyle.text} dark:text-white flex items-center gap-2`}>{dailyInsight.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed">{dailyInsight.message}</p>
          </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Worth (LIFETIME) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-2xl transition-transform hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</p>
                  <h2 className="text-3xl font-bold flex items-center gap-1"><IndianRupee className="w-6 h-6 text-blue-200" /> {totalNetWorth.toLocaleString()}</h2>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20 flex justify-between text-xs font-medium text-blue-50">
                  <span className="flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5" /> Bank: {formatCurrency(bankBalance)}</span>
                  <span className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> Cash: {formatCurrency(cashBalance)}</span>
              </div>
          </div>
        </div>
        
        {/* Income (MONTHLY) */}
        <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
             <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400 group-hover:bg-green-100 transition-colors"><TrendingUp className="w-6 h-6" /></div>
             <span className="text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg">This Month</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Total Income</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(monthlyIncome)}</h2>
        </div>

        {/* Expenses (MONTHLY) */}
        <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
             <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400 group-hover:bg-red-100 transition-colors"><CreditCard className="w-6 h-6" /></div>
             <span className="text-[10px] font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg">This Month</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Net Expenses</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(monthlyExpenses)}</h2>
        </div>

        {/* Invested (MONTHLY NET) */}
        <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
             <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 transition-colors"><PieChart className="w-6 h-6" /></div>
             <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-lg">This Month</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Net Invested</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(monthlyInvested)}</h2>
        </div>
      </div>

      {/* 3. MAIN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: HABITS */}
          <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 flex flex-col h-full min-h-[450px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
              <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-transparent backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><CheckCircle className="w-5 h-5" /></div> Daily Rituals
                  </h3>
                  <span className="text-xs font-bold bg-gray-900 dark:bg-white dark:text-black text-white px-3 py-1.5 rounded-lg shadow-md">{incompleteHabits.length} Left</span>
              </div>
              <div className="p-5 space-y-4">
                  {incompleteHabits.length > 0 ? (
                      incompleteHabits.map(habit => (
                          <div key={habit._id} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 hover:shadow-lg rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5" onClick={() => handleToggleHabit(habit._id)}>
                              <div className="flex items-center gap-4">
                                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 flex items-center justify-center transition-colors"><div className="w-3 h-3 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div></div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm group-hover:text-gray-900 dark:group-hover:text-white">{habit.title}</span>
                              </div>
                              <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg group-hover:text-green-600 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">{habit.target} days</span>
                          </div>
                      ))
                  ) : (
                      <div className="py-16 text-center"><div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><CheckCircle className="w-10 h-10 text-green-500" /></div><h4 className="text-lg font-bold text-gray-900 dark:text-white">All Done For Today!</h4></div>
                  )}
              </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-8">
              
              {/* PENDING ACTIONS */}
              <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                  <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400"><Layers className="w-5 h-5" /></div> Pending Actions
                      </h3>
                      <span className="text-xs font-bold bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-lg">{pendingTasks.length + pendingShortTermGoals.length}</span>
                  </div>
                  
                  <div className="p-5 space-y-6">
                      {pendingTasks.length > 0 && (
                          <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Daily Tasks</p>
                              <div className="space-y-2">
                                  {pendingTasks.map(t => (
                                      <div key={t._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition cursor-pointer" onClick={() => handleToggleTask(t._id)}>
                                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${t.priority === 'High' ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}><CheckSquare className="w-3 h-3 text-transparent hover:text-gray-400"/></div>
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.title}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                      {pendingShortTermGoals.length > 0 && (
                          <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Short Term Goals</p>
                              <div className="space-y-2">
                                  {pendingShortTermGoals.map(g => (
                                      <div key={g._id} className="flex items-center gap-3 p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:shadow-sm transition cursor-pointer" onClick={() => handleToggleGoal(g._id)}>
                                          <div className="w-5 h-5 border-2 border-orange-300 dark:border-orange-600 rounded-full flex items-center justify-center"><Target className="w-3 h-3 text-transparent hover:text-orange-400"/></div>
                                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{g.title}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                      {pendingTasks.length === 0 && pendingShortTermGoals.length === 0 && (
                          <div className="py-8 text-center text-gray-400 text-sm font-medium italic">Nothing pending. You are caught up!</div>
                      )}
                  </div>
              </div>

              {/* SPENDING */}
              <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 flex flex-col flex-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                  <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400"><Clock className="w-5 h-5" /></div> Today's Spending</h3>
                  </div>
                  <div className="p-0">
                      {todayTransactions.length > 0 ? (
                          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                              {todayTransactions.map(t => (
                                  <li key={t._id} className="p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
                                      <div className="flex items-center gap-4">
                                          <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{t.type === 'income' ? <TrendingUp className="w-4 h-4"/> : <Wallet className="w-4 h-4"/>}</div>
                                          <div><p className="font-medium text-sm text-gray-800 dark:text-gray-200">{t.title}</p><div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{t.category}</span></div></div>
                                      </div>
                                      <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>{t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}</span>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <div className="py-8 text-center text-gray-400 text-sm font-medium italic">No transactions recorded today.</div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative transform transition-all scale-100 border dark:border-gray-800">
                <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"><X className="w-5 h-5 text-gray-500" /></button>
                <h3 className="font-bold text-2xl mb-1 text-gray-900 dark:text-white">Quick Spend</h3>
                <p className="text-gray-500 text-sm mb-6">Track it before you forget it.</p>
                <form onSubmit={handleQuickAdd} className="space-y-4">
                    <input type="text" placeholder="What is it?" required className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="0.00" required className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                        <select className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium appearance-none" value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})}><option value="Bank">Bank</option><option value="Cash">Cash</option></select>
                    </div>
                    <select className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}<option value="Other">Other</option></select>
                    {formData.category === 'Other' && <input type="text" placeholder="Type Category Name" required className="w-full p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 dark:text-blue-300 font-bold" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 p-4 rounded-2xl font-bold text-sm transition-all ${formData.type === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}>Expense</button>
                        <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 p-4 rounded-2xl font-bold text-sm transition-all ${formData.type === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}>Income</button>
                    </div>
                    <button type="submit" className="w-full bg-gray-900 dark:bg-white dark:text-black text-white p-4 rounded-2xl font-bold hover:bg-black shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 mt-4">Save Transaction</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;