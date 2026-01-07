// src/components/dashboard/SpendingSection.jsx
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid 
} from 'recharts';
import { 
  Clock, Wallet, Receipt, ChevronLeft, ChevronRight, Calendar 
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const SpendingSection = ({ transactions = [] }) => {
  const [referenceDate, setReferenceDate] = useState(new Date());

  // Helper: Normalize date to midnight
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() + (direction * 7));
    setReferenceDate(newDate);
  };

  const resetToToday = () => {
    setReferenceDate(new Date());
  };

  // 1. ✨ Graph Data Calculation (Keeps the 7-day view logic)
  const { chartData, dateRangeLabel, totalSpentInView } = useMemo(() => {
    const data = [];
    const end = normalizeDate(referenceDate);
    let weeklyTotal = 0;
    
    // 7-day window calculation
    const startWindow = new Date(end);
    startWindow.setDate(end.getDate() - 6);

    const txInWindow = transactions.filter(t => {
      if (t.type?.toLowerCase() !== 'expense') return false;
      const tDate = normalizeDate(t.date);
      return tDate >= startWindow && tDate <= end;
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(end.getDate() - i);
      const normalizedCurrent = normalizeDate(d);
      
      const dailyTx = txInWindow.filter(t => 
        normalizeDate(t.date).getTime() === normalizedCurrent.getTime()
      );

      const dailyTotal = dailyTx.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
      weeklyTotal += dailyTotal;

      data.push({ 
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: dailyTotal,
      });
    }

    const rangeLabel = `${startWindow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return { chartData: data, dateRangeLabel: rangeLabel, totalSpentInView: weeklyTotal };
  }, [transactions, referenceDate]);

  // 2. ✨ CHANGE: Filter ONLY Today's Transactions for the list
  const todayTransactions = useMemo(() => {
    const today = normalizeDate(new Date());
    
    return transactions
      .filter(t => normalizeDate(t.date).getTime() === today.getTime())
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 ring-1 ring-black/5">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-1">
            {payload[0].payload.fullDate}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <p className="font-mono text-purple-600 dark:text-purple-300 font-bold text-base">
              {formatCurrency(payload[0].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col w-full h-auto min-h-[500px] relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* Top Purple Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-wrap gap-4 justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <Clock className="w-5 h-5" />
          </div> 
          <div>
             <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
               Today's Finance
             </h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
               Total: <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(totalSpentInView)}</span>
             </p>
          </div>
        </div>

        {/* Date Controls */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-1 border border-gray-100 dark:border-gray-700/50">
            <button 
                onClick={() => navigateWeek(-1)}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 cursor-pointer" onClick={resetToToday}>
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono whitespace-nowrap">
                    {dateRangeLabel}
                </span>
            </div>
            <button 
                onClick={() => navigateWeek(1)}
                disabled={new Date(referenceDate) >= new Date().setHours(0,0,0,0)} 
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all disabled:opacity-30"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[220px] px-6 pt-6 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={32}>
                <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="emptyGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.1}/>
                         <stop offset="100%" stopColor="#9ca3af" stopOpacity={0.05}/>
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.05} strokeDasharray="3 3" />
                <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: 'currentColor', opacity: 0.03 }}
                    animationDuration={200}
                />
                <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} 
                    dy={10} 
                />
                <Bar 
                    dataKey="amount" 
                    radius={[6, 6, 6, 6]}
                >
                    {chartData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={entry.amount > 0 ? 'url(#purpleGradient)' : 'url(#emptyGradient)'} 
                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-6 mt-6 mb-2 h-px bg-gray-50 dark:bg-gray-800" />

      {/* 3. ✨ Transaction List (Shows ONLY Today's Transactions) */}
      <div className="px-6 pb-6">
        
        
        {todayTransactions.length > 0 ? (
          <ul className="space-y-3">
            {todayTransactions.map(t => (
              <li key={t._id} className="group p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all flex justify-between items-center cursor-default">
                 <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    t.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {t.type === 'income' ? <Wallet className="w-4 h-4"/> : <Wallet className="w-4 h-4"/>}
                  </div>
                  
                  <div className="min-w-0 flex flex-col gap-0.5">
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                        {t.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] bg-white dark:bg-gray-800 px-1.5 rounded-md border border-gray-100 dark:border-gray-700 text-gray-400">
                        {t.category}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`font-bold text-sm whitespace-nowrap tabular-nums ${
                    t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-400">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full mb-3">
              <Receipt className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No transactions today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingSection;