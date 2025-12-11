import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { generateInsights } from '../utils/smartInsights';
import { 
  CheckCircle, Target, Clock, Wallet, TrendingUp, Layers, CheckSquare 
} from 'lucide-react';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

// --- IMPORTS FOR THE FIX ---
import DashboardHeader from '../components/dashboard/DashboardHeader';
import QuickSpendModal from '../components/dashboard/QuickSpendModal';
import SmartInsight from '../components/dashboard/SmartInsight'; 
// (If you don't have SmartInsight component yet, let me know, but I included it in previous steps)

const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showForm, setShowForm] = useState(false);

  // User State
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'Achiever' });

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

  // --- DATA LOGIC ---
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDateString = new Date().toLocaleDateString(); 
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });
  const todayTransactions = transactions.filter(t => new Date(t.date).toLocaleDateString() === todayDateString);

  // --- 1. ACCURATE BALANCE CALCULATION (Matches Financial.jsx) ---
  const calculateLifetimeBalance = (mode) => {
    return transactions.reduce((acc, t) => {
      const source = t.paymentMode || 'Bank'; 
      const destination = t.transferTo; 
      
      // Bank & Cash Logic
      if (mode === 'Bank' || mode === 'Cash') {
          if (source === mode && t.type === 'income') return acc + t.amount;
          if (t.type === 'transfer') {
              if (destination === mode) return acc + t.amount;
              if (!destination && source === 'Investment' && mode === 'Bank') return acc + t.amount;
          }
          if (source === mode && t.type === 'expense') return acc - t.amount;
          if (source === mode && t.type === 'transfer') {
              if (destination === mode) return acc; 
              return acc - t.amount;
          }
      }

      // Investment Logic
      if (mode === 'Investment') {
          const isInvCategory = t.category === 'Investment' || INVESTMENT_TYPES.includes(t.category);
          
          if (t.type === 'expense' && isInvCategory) return acc + t.amount;
          if (t.type === 'transfer') {
              if (destination === 'Investment') return acc + t.amount;
              if (!destination && source !== 'Investment' && isInvCategory) return acc + t.amount;
          }
          if (source === 'Investment' && t.type === 'transfer') {
              if (destination === 'Bank' || destination === 'Cash' || !destination) return acc - t.amount;
          }
      }
      return acc;
    }, 0);
  };

  const bankBalance = calculateLifetimeBalance('Bank');
  const cashBalance = calculateLifetimeBalance('Cash');
  const investmentBalance = calculateLifetimeBalance('Investment');
  const totalNetWorth = bankBalance + cashBalance + investmentBalance;

  // --- 2. MONTHLY STATS ---
  const monthlyIncome = thisMonthTransactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  
  const monthlyExpenses = thisMonthTransactions.filter(t => 
    t.type === 'expense' && 
    t.category !== 'Investment' && 
    !INVESTMENT_TYPES.includes(t.category)
  ).reduce((acc, c) => acc + c.amount, 0);

  const monthlyInvested = thisMonthTransactions.reduce((acc, t) => {
    const isInv = t.category === 'Investment' || INVESTMENT_TYPES.includes(t.category) || t.investmentType;
    if (isInv) {
        if (t.type === 'expense' || (t.type === 'transfer' && t.paymentMode !== 'Investment')) return acc + t.amount;
        if (t.type === 'transfer' && t.paymentMode === 'Investment') return acc - t.amount;
    }
    return acc;
  }, 0);

  // --- INSIGHTS ---
  const dailyInsight = generateInsights(transactions, habits, tasks);

  // --- PENDING ITEMS ---
  const incompleteHabits = habits.filter(h => !h.completedDates.includes(todayStr));
  const pendingTasks = tasks.filter(t => !t.isCompleted).sort((a, b) => {
      const pOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return pOrder[a.priority] - pOrder[b.priority];
  }).slice(0, 3);
  const pendingShortTermGoals = goals.filter(g => !g.isCompleted && g.type === 'Short Term').sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);

  const handleToggleHabit = async (id) => { setHabits(prev => prev.map(h => h._id === id ? { ...h, completedDates: [...h.completedDates, todayStr] } : h)); try { await API.put(`/habits/${id}/toggle`, { date: todayStr }); } catch (err) { fetchAllData(); } };
  const handleToggleGoal = async (id) => { setGoals(prev => prev.map(g => g._id === id ? { ...g, isCompleted: true } : g)); try { await API.put(`/goals/${id}/toggle`); } catch (err) { fetchAllData(); } };
  const handleToggleTask = async (id) => { setTasks(prev => prev.map(t => t._id === id ? { ...t, isCompleted: true } : t)); try { await API.put(`/tasks/${id}/toggle`); } catch (err) { fetchAllData(); } };
  
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in bg-gray-50/50 dark:bg-gray-950/20 min-h-screen">
      
      {/* 1. HEADER (With Working Button) */}
      <DashboardHeader 
        user={user} 
        onQuickSpend={() => setShowForm(true)} 
      />

      {/* 2. INSIGHT CARD */}
      <SmartInsight insight={dailyInsight} />

      {/* 3. SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Net Worth */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-2xl transition-transform hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</p>
                  <h2 className="text-3xl font-bold">₹ {totalNetWorth.toLocaleString()}</h2>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20 flex justify-between text-xs font-medium text-blue-50">
                  <span>Bank: {formatCurrency(bankBalance)}</span>
                  <span>Cash: {formatCurrency(cashBalance)}</span>
              </div>
          </div>
        </div>
        
        {/* Monthly Stats Cards */}
        <StatCard title="Income" amount={monthlyIncome} color="green" label="This Month" />
        <StatCard title="Expenses" amount={monthlyExpenses} color="red" label="This Month" />
        <StatCard title="Invested" amount={monthlyInvested} color="purple" label="This Month" />
      </div>

      {/* 4. GRID LAYOUT FOR HABITS & TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Habits */}
          <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-[450px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
              <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><CheckCircle className="w-5 h-5" /></div> Daily Rituals
                  </h3>
                  <span className="text-xs font-bold bg-gray-900 dark:bg-white dark:text-black text-white px-3 py-1.5 rounded-lg">{incompleteHabits.length} Left</span>
              </div>
              <div className="p-5 space-y-4">
                  {incompleteHabits.length > 0 ? (
                      incompleteHabits.map(habit => (
                          <div key={habit._id} onClick={() => handleToggleHabit(habit._id)} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-green-200 hover:shadow-lg rounded-2xl transition cursor-pointer">
                              <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{habit.title}</span>
                              <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg">{habit.target} days</span>
                          </div>
                      ))
                  ) : (
                      <div className="py-16 text-center text-gray-400">All Done For Today!</div>
                  )}
              </div>
          </div>

          <div className="flex flex-col gap-8">
              {/* Tasks */}
              <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                  <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400"><Layers className="w-5 h-5" /></div> Pending Actions
                      </h3>
                  </div>
                  <div className="p-5 space-y-3">
                      {pendingTasks.map(t => (
                          <div key={t._id} onClick={() => handleToggleTask(t._id)} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer">
                              <CheckSquare className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.title}</span>
                          </div>
                      ))}
                      {pendingShortTermGoals.map(g => (
                          <div key={g._id} onClick={() => handleToggleGoal(g._id)} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800 cursor-pointer">
                              <Target className="w-4 h-4 text-orange-400" />
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{g.title}</span>
                          </div>
                      ))}
                      {pendingTasks.length === 0 && pendingShortTermGoals.length === 0 && (
                          <div className="py-8 text-center text-gray-400 text-sm font-medium italic">Nothing pending. You are caught up!</div>
                      )}
                  </div>
              </div>

              {/* Today's Spend */}
              <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                  <div className="p-6 border-b border-gray-50 dark:border-gray-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400"><Clock className="w-5 h-5" /></div> Today's Spending</h3>
                  </div>
                  <div className="p-0">
                      {todayTransactions.length > 0 ? (
                          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                              {todayTransactions.map(t => (
                                  <li key={t._id} className="p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                      <div className="flex items-center gap-4">
                                          <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{t.type === 'income' ? <TrendingUp className="w-4 h-4"/> : <Wallet className="w-4 h-4"/>}</div>
                                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{t.title}</p>
                                      </div>
                                      <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>{t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}</span>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <div className="py-8 text-center text-gray-400 text-sm font-medium italic">No transactions today.</div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* 5. MODAL (This makes the button work!) */}
      {showForm && (
        <QuickSpendModal 
            onClose={() => setShowForm(false)} 
            onSuccess={(newData) => {
                setTransactions([newData, ...transactions]);
                // Re-fetch to update balances
                fetchAllData();
            }} 
        />
      )}

    </div>
  );
};

// Simple Stat Card Helper
const StatCard = ({ title, amount, color, label }) => (
  <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
       <div className={`p-3 bg-${color}-50 dark:bg-${color}-900/30 rounded-2xl text-${color}-600 dark:text-${color}-400 group-hover:bg-${color}-100 transition-colors`}>
         <TrendingUp className="w-6 h-6" />
       </div>
       <span className={`text-[10px] font-bold bg-${color}-50 dark:bg-${color}-900/20 text-${color}-700 dark:text-${color}-400 px-2 py-1 rounded-lg`}>{label}</span>
    </div>
    <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(amount)}</h2>
  </div>
);

export default Dashboard;