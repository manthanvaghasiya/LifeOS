import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Filter, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const FinancialAnalytics = ({ transactions }) => {
  // State to toggle visibility of specific lines
  const [activeSeries, setActiveSeries] = useState({
    income: true,
    expense: true,
    investment: true
  });

  // --- 1. ADVANCED DATA PROCESSING ---
  const dailyData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const grouped = {};
    
    // Sort transactions by date
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTx.forEach(t => {
      const dateObj = new Date(t.date);
      const day = dateObj.getDate();
      const monthShort = dateObj.toLocaleString('default', { month: 'short' });
      const key = `${day} ${monthShort}`; 
      const sortKey = dateObj.getTime();

      if (!grouped[key]) {
        grouped[key] = { name: key, income: 0, expense: 0, investment: 0, sortId: sortKey };
      }
      
      // LOGIC: Smart Categorization
      if (t.type === 'income') {
        grouped[key].income += t.amount;
      } 
      else if (
        (t.type === 'expense' && t.category === 'Investment') || 
        (t.type === 'transfer' && t.category === 'Investment') ||
        (t.investmentType && t.investmentType !== 'None')
      ) {
        // Classify as Investment
        grouped[key].investment += t.amount;
      } 
      else if (t.type === 'expense') {
        // Standard Expense
        grouped[key].expense += t.amount;
      }
    });

    return Object.values(grouped).sort((a, b) => a.sortId - b.sortId);
  }, [transactions]);

  // --- 2. PREMIUM TOOLTIP COMPONENT ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-3 text-xs uppercase tracking-widest">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center justify-between gap-6 min-w-[140px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 capitalize">{entry.name}</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(entry.value)}
                    </span>
                </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Helper to toggle lines
  const toggleSeries = (key) => {
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (transactions.length === 0) {
    return (
        <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm h-full min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4 animate-pulse">
                <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Financial Trends</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Add transactions to visualize your wealth velocity.</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm h-full flex flex-col">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Wealth Velocity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Income vs Expense vs Investment flow.</p>
        </div>
        
        {/* Modern Filter Pills */}
        <div className="flex gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-2xl">
            <button 
                onClick={() => toggleSeries('income')} 
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSeries.income ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <div className={`w-2 h-2 rounded-full ${activeSeries.income ? 'bg-green-500' : 'bg-gray-300'}`}></div> Income
            </button>
            <button 
                onClick={() => toggleSeries('expense')} 
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSeries.expense ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <div className={`w-2 h-2 rounded-full ${activeSeries.expense ? 'bg-red-500' : 'bg-gray-300'}`}></div> Expense
            </button>
            <button 
                onClick={() => toggleSeries('investment')} 
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSeries.investment ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <div className={`w-2 h-2 rounded-full ${activeSeries.investment ? 'bg-purple-500' : 'bg-gray-300'}`}></div> Invest
            </button>
        </div>
      </div>

      {/* CHART AREA */}
      <div style={{ width: '100%', height: 350 }}> 
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.1} />
                
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} 
                    dy={10} 
                />
                
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} 
                    tickFormatter={(val) => `₹${val/1000}k`} 
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }} />

                {activeSeries.investment && (
                    <Area 
                        type="monotone" 
                        dataKey="investment" 
                        stroke="#8b5cf6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorInvestment)" 
                        animationDuration={1500}
                    />
                )}
                {activeSeries.income && (
                    <Area 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorIncome)" 
                        animationDuration={1500}
                    />
                )}
                {activeSeries.expense && (
                    <Area 
                        type="monotone" 
                        dataKey="expense" 
                        stroke="#ef4444" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorExpense)" 
                        animationDuration={1500}
                    />
                )}
            </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialAnalytics;