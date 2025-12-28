import React, { useState, useEffect, useMemo, useCallback } from 'react'; //
import API from '../services/api';
import { generateInsights } from '../utils/smartInsights';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardStats from '../components/dashboard/DashboardStats';
import SmartInsight from '../components/dashboard/SmartInsight'; 
import HabitSection from '../components/dashboard/HabitSection';
import TaskSection from '../components/dashboard/TaskSection';
import SpendingSection from '../components/dashboard/SpendingSection';
import QuickSpendModal from '../components/dashboard/QuickSpendModal';
import { addXP } from '../utils/gamification';

const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // parse user only once
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || { name: 'User' });

  useEffect(() => { fetchAllData(); }, []);

  // 1. Add 'error' state
const [error, setError] = useState(null);

// 2. Update fetch function
const fetchAllData = async () => {
  setLoading(true);
  setError(null); // Reset error before fetching
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
  } catch (err) { 
    console.error(err);
    // Set user-friendly error message
    setError("Unable to load data. Please check your connection.");
  } finally {
    setLoading(false);
  }
};

// 3. Add Error UI (Insert this before the return or inside the main div)
if (error) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connection Error</h2>
      <p className="text-gray-500 mb-6">{error}</p>
      <button 
        onClick={fetchAllData}
        className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
      >
        Retry Connection
      </button>
    </div>
  );
}

  const todayStr = new Date().toISOString().split('T')[0];
  
  // --- MEMOIZED CALCULATIONS (Performance Fix) ---
  // 1. Filter Transactions only when 'transactions' dependency changes
  const { thisMonthTransactions, todayTransactions } = useMemo(() => {
    const todayDateString = new Date().toLocaleDateString(); 
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return {
      thisMonthTransactions: transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      }),
      todayTransactions: transactions.filter(t => new Date(t.date).toLocaleDateString() === todayDateString)
    };
  }, [transactions]);

  // 2. Memoize Financial Totals to prevent re-calculation on UI updates
  const financialStats = useMemo(() => {
    const calculateLifetimeBalance = (mode) => {
        return transactions.reduce((acc, t) => {
          const source = t.paymentMode || 'Bank'; 
          const destination = t.transferTo; 
          
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

    const monthlyIncome = thisMonthTransactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
    const monthlyExpenses = thisMonthTransactions.filter(t => t.type === 'expense' && t.category !== 'Investment' && !INVESTMENT_TYPES.includes(t.category)).reduce((acc, c) => acc + c.amount, 0);
    const monthlyInvested = thisMonthTransactions.reduce((acc, t) => {
        const isInv = t.category === 'Investment' || INVESTMENT_TYPES.includes(t.category) || t.investmentType;
        if (isInv) {
            if (t.type === 'expense' || (t.type === 'transfer' && t.paymentMode !== 'Investment')) return acc + t.amount;
            if (t.type === 'transfer' && t.paymentMode === 'Investment') return acc - t.amount;
        }
        return acc;
    }, 0);

    return { 
        bankBalance, cashBalance, investmentBalance, 
        totalNetWorth: bankBalance + cashBalance + investmentBalance,
        monthlyIncome, monthlyExpenses, monthlyInvested 
    };
  }, [transactions, thisMonthTransactions]); // Only re-run if transactions change

  // 3. Memoize Lists
  const incompleteHabits = useMemo(() => habits.filter(h => !h.completedDates.includes(todayStr)), [habits, todayStr]);
  
  const pendingTasks = useMemo(() => tasks.filter(t => !t.isCompleted).sort((a, b) => {
      const pOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return pOrder[a.priority] - pOrder[b.priority];
  }), [tasks]);
  
  const pendingShortTermGoals = useMemo(() => goals.filter(g => !g.isCompleted && g.type === 'Short Term').sort((a, b) => new Date(a.deadline) - new Date(b.deadline)), [goals]);

  const dailyInsight = useMemo(() => generateInsights(transactions, habits, tasks), [transactions, habits, tasks]);


  // --- HANDLERS (Stabilized) ---
  const handleToggleHabit = useCallback(async (id) => { 
    setHabits(prev => prev.map(h => h._id === id ? { ...h, completedDates: [...h.completedDates, todayStr] } : h)); 
    try { 
      await API.put(`/habits/${id}/toggle`, { date: todayStr }); 
      addXP(10); 
    } catch (err) { 
      // Revert on error or refetch
      fetchAllData(); 
    } 
  }, [todayStr]);

  const handleToggleGoal = useCallback(async (id) => { 
    setGoals(prev => prev.map(g => g._id === id ? { ...g, isCompleted: true } : g)); 
    try { 
      await API.put(`/goals/${id}/toggle`);
      addXP(50); 
    } catch (err) { fetchAllData(); } 
  }, []);

  const handleToggleTask = useCallback(async (id) => { 
    setTasks(prev => prev.map(t => t._id === id ? { ...t, isCompleted: true } : t)); 
    try { 
      await API.put(`/tasks/${id}/toggle`);
      addXP(5); 
    } catch (err) { fetchAllData(); } 
  }, []);
  
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in min-h-screen">
      <DashboardHeader user={user} onQuickSpend={() => setShowForm(true)} />

      <DashboardStats 
        totalNetWorth={financialStats.totalNetWorth}
        bankBalance={financialStats.bankBalance}
        cashBalance={financialStats.cashBalance}
        monthlyIncome={financialStats.monthlyIncome}
        monthlyExpenses={financialStats.monthlyExpenses}
        monthlyInvested={financialStats.monthlyInvested}
      />

      <div className="mb-8">
        <SmartInsight insight={dailyInsight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch relative">
          <div className="relative min-h-[500px] lg:min-h-0">
            <div className="lg:absolute lg:inset-0 h-full">
              <HabitSection 
                habits={incompleteHabits} 
                onToggle={handleToggleHabit} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
              <div className="shrink-0">
                <TaskSection 
                  tasks={pendingTasks} 
                  goals={pendingShortTermGoals}
                  onToggleTask={handleToggleTask}
                  onToggleGoal={handleToggleGoal}
                />
              </div>

              <div className="h-full">
                <SpendingSection transactions={todayTransactions} />
              </div>
          </div>
      </div>

      {showForm && (
        <QuickSpendModal 
            onClose={() => setShowForm(false)} 
            onSuccess={(newData) => {
                setTransactions(prev => [newData, ...prev]);
                // Removed fetchAllData() here to save a network call. 
                // We already have the new data, just append it.
            }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
