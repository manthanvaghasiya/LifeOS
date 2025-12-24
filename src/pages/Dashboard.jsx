import React, { useState, useEffect } from 'react';
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

const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDateString = new Date().toLocaleDateString(); 
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });
  const todayTransactions = transactions.filter(t => new Date(t.date).toLocaleDateString() === todayDateString);

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
  const totalNetWorth = bankBalance + cashBalance + investmentBalance;

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

  const dailyInsight = generateInsights(transactions, habits, tasks);
  const incompleteHabits = habits.filter(h => !h.completedDates.includes(todayStr));
  
  const pendingTasks = tasks.filter(t => !t.isCompleted).sort((a, b) => {
      const pOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return pOrder[a.priority] - pOrder[b.priority];
  });
  
  const pendingShortTermGoals = goals.filter(g => !g.isCompleted && g.type === 'Short Term').sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const handleToggleHabit = async (id) => { 
    setHabits(prev => prev.map(h => h._id === id ? { ...h, completedDates: [...h.completedDates, todayStr] } : h)); 
    try { await API.put(`/habits/${id}/toggle`, { date: todayStr }); } catch (err) { fetchAllData(); } 
  };
  const handleToggleGoal = async (id) => { 
    setGoals(prev => prev.map(g => g._id === id ? { ...g, isCompleted: true } : g)); 
    try { await API.put(`/goals/${id}/toggle`); } catch (err) { fetchAllData(); } 
  };
  const handleToggleTask = async (id) => { 
    setTasks(prev => prev.map(t => t._id === id ? { ...t, isCompleted: true } : t)); 
    try { await API.put(`/tasks/${id}/toggle`); } catch (err) { fetchAllData(); } 
  };
  
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in min-h-screen">
      <DashboardHeader user={user} onQuickSpend={() => setShowForm(true)} />

      <DashboardStats 
        totalNetWorth={totalNetWorth}
        bankBalance={bankBalance}
        cashBalance={cashBalance}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        monthlyInvested={monthlyInvested}
      />

      <div className="mb-8">
        <SmartInsight insight={dailyInsight} />
      </div>

      {/* LAYOUT UPDATE: Grid Cols 2 -> 50/50 Split on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch relative">
          
          {/* LEFT COLUMN: Habits */}
          <div className="relative min-h-[500px] lg:min-h-0">
            <div className="lg:absolute lg:inset-0 h-full">
              <HabitSection 
                habits={incompleteHabits} 
                onToggle={handleToggleHabit} 
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Tasks & Spending */}
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
                setTransactions([newData, ...transactions]);
                fetchAllData();
            }} 
        />
      )}
    </div>
  );
};

export default Dashboard;