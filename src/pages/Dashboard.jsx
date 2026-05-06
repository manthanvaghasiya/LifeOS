import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';
import { generateInsights } from '../utils/smartInsights';
import { addXP } from '../utils/gamification';
import { useToast } from '../context/ToastContext';

// UI Components
import AmbientBackground from '../components/ui/AmbientBackground';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardStats from '../components/dashboard/DashboardStats';
import SmartInsight from '../components/dashboard/SmartInsight'; 
import HabitSection from '../components/dashboard/HabitSection';
import TaskSection from '../components/dashboard/TaskSection';
import SpendingSection from '../components/dashboard/SpendingSection';
import QuickSpendModal from '../components/dashboard/QuickSpendModal';

const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const Dashboard = () => {
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || { name: 'User' });

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
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
      setError("Unable to load data. Please check your connection.");
      if (!loading) toast.error("Connection lost. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  // --- MEMOIZED CALCULATIONS ---
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

  const financialStats = useMemo(() => {
    const calculateLifetimeBalance = (mode) => {
        return transactions.reduce((acc, t) => {
          const source = t.paymentMode || 'Bank';
          const destination = t.transferTo || null;

          if (mode === 'Bank' || mode === 'Cash') {
              // Income: money coming in
              if (source === mode && t.type === 'income') return acc + t.amount;

              // Transfer IN: money being transferred to this account (but not self-transfer)
              if (t.type === 'transfer' && destination === mode && source !== mode) return acc + t.amount;

              // Special case: Investment withdrawal without specified destination defaults to Bank
              if (t.type === 'transfer' && !destination && source === 'Investment' && mode === 'Bank') return acc + t.amount;

              // Expense: money going out
              if (source === mode && t.type === 'expense') return acc - t.amount;

              // Transfer OUT: money being transferred from this account (but not self-transfer)
              if (source === mode && t.type === 'transfer' && destination !== mode) return acc - t.amount;
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
            if (t.type === 'expense' || (t.type === 'transfer' && t.paymentMode !== 'Investment')) {
                 return acc + t.amount;
            }
        }
        return acc;
    }, 0);

    return { 
        bankBalance, cashBalance, investmentBalance, 
        totalNetWorth: bankBalance + cashBalance + investmentBalance,
        monthlyIncome, monthlyExpenses, monthlyInvested 
    };
  }, [transactions, thisMonthTransactions]);

  const todayStr = new Date().toISOString().split('T')[0];
  
  const pendingTasks = useMemo(() => tasks.filter(t => !t.isCompleted).sort((a, b) => {
      const pOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return pOrder[a.priority] - pOrder[b.priority];
  }), [tasks]);
   
  const pendingShortTermGoals = useMemo(() => goals.filter(g => !g.isCompleted && g.type === 'Short Term').sort((a, b) => new Date(a.deadline) - new Date(b.deadline)), [goals]);

  const dailyInsight = useMemo(() => generateInsights(transactions, habits, tasks), [transactions, habits, tasks]);
  
  const triggerConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

    function fire(particleRatio, opts) {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // --- HANDLERS ---
  
  // 1. Habits (UPDATED LOGIC)
  const handleToggleHabit = useCallback(async (id) => { 
    const habit = habits.find(h => h._id === id);
    if (!habit) return;

    const isCompleted = habit.completedDates.includes(todayStr);

    // Optimistic Update
    setHabits(prev => prev.map(h => {
        if (h._id === id) {
            return {
                ...h,
                completedDates: isCompleted
                    ? h.completedDates.filter(d => d !== todayStr) 
                    : [...h.completedDates, todayStr]
            };
        }
        return h;
    }));

    // Logic: Only popup/celebrate if completion TARGET is met
    if (!isCompleted) {
        // Calculate progress including this new check
        const currentMonthPrefix = todayStr.slice(0, 7);
        const monthlyProgress = habit.completedDates.filter(d => d.startsWith(currentMonthPrefix)).length + 1;

        if (monthlyProgress === habit.target) {
            triggerConfetti();
            addXP(50); // Bonus XP
            toast.success(`🎯 Target Smashed! ${habit.title} completed for the month!`);
        } else {
            addXP(10); // Standard XP
            // No Toast for daily check-in (as requested: "popup remove")
        }
    }

    try { 
        await API.put(`/habits/${id}/toggle`, { date: todayStr }); 
    } catch (err) { 
        toast.error("Failed to sync habit.");
        fetchAllData(); 
    } 
  }, [habits, todayStr, toast]);

  // 2. Goals
  const handleToggleGoal = useCallback(async (id) => { 
    setGoals(prev => prev.map(g => g._id === id ? { ...g, isCompleted: true } : g)); 
    
    triggerConfetti();
    addXP(50);
    toast.success("Goal smashed! +50 XP");

    try { 
        await API.put(`/goals/${id}/toggle`); 
    } catch (err) { 
        toast.error("Failed to sync goal.");
        fetchAllData(); 
    } 
  }, [toast]);

  // 3. Tasks
  const handleToggleTask = useCallback(async (id) => { 
    setTasks(prev => prev.map(t => t._id === id ? { ...t, isCompleted: true } : t)); 
    addXP(5);
    toast.success("Task done. +5 XP");

    try { 
        await API.put(`/tasks/${id}/toggle`); 
    } catch (err) { 
        toast.error("Failed to sync task.");
        fetchAllData(); 
    } 
  }, [toast]);
   
  if (loading) return <DashboardSkeleton />;

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

  return (
    <div className="relative min-h-screen">
      
      <AmbientBackground />

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
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
                {/* UPDATED: Pass ALL habits, not incomplete ones */}
                <HabitSection 
                  habits={habits} 
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
                 <SpendingSection transactions={transactions} />
                </div>
            </div>
        </div>
      </div>

      {showForm && (
        <QuickSpendModal 
            onClose={() => setShowForm(false)} 
            onSuccess={(newData) => {
                setTransactions(prev => [newData, ...prev]);
                toast.success("Transaction recorded successfully.");
            }} 
        />
      )}
    </div>
  );
};

export default Dashboard;