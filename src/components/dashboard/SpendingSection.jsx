import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, TrendingUp, Wallet, Receipt, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const SpendingSection = ({ transactions = [] }) => {
  // State to track the end date of the currently viewed week
  const [referenceDate, setReferenceDate] = useState(new Date());

  // Helper to navigate weeks
  const navigateWeek = (direction) => {
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() + (direction * 7));
    setReferenceDate(newDate);
  };

  // Reset to today
  const resetToToday = () => {
    setReferenceDate(new Date());
  };

  // 1. ✨ DATA CALCULATION WITH DATE SELECTION
  const { chartData, dateRangeLabel, totalSpentInView } = useMemo(() => {
    const data = [];
    const end = new Date(referenceDate);
    let weeklyTotal = 0;

    // Generate data for the 7-day window ending at referenceDate
    for (let i = 6; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(end.getDate() - i);
        
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = d.toLocaleDateString('en-CA'); // YYYY-MM-DD for matching

        const dailyTotal = transactions
            .filter(t => {
                // FIX: Case-insensitive check for 'expense'
                if (t.type?.toLowerCase() !== 'expense') return false;
                
                const tDate = new Date(t.date);
                const tDateKey = tDate.toLocaleDateString('en-CA');
                
                return tDateKey === dateKey;
            })
            .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
            
        weeklyTotal += dailyTotal;

        data.push({ 
            day: dayName, 
            amount: dailyTotal,
            fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
    }

    // Calculate nice label "Jan 01 - Jan 07"
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const rangeLabel = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return { chartData: data, dateRangeLabel: rangeLabel, totalSpentInView: weeklyTotal };
  }, [transactions, referenceDate]);

  // 2. ✨ CUSTOM TOOLTIP
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl p-[clamp(0.5rem,1vw,0.75rem)] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 ring-1 ring-black/5">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-1">
            {payload[0].payload.fullDate}
          </p>
          <p className="font-mono text-purple-600 dark:text-purple-300 font-bold text-[clamp(0.875rem,1.5vw,1rem)]">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[clamp(1.5rem,2.5vw,2rem)] shadow-sm border border-gray-100 flex flex-col w-full min-h-[clamp(400px,45vh,550px)] relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
      
      {/* 3. ✨ HEADER WITH DATE CONTROLS */}
      <div className="p-[clamp(1rem,1.5vw,1.5rem)] border-b border-gray-50 dark:border-gray-800 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center shrink-0">
        
        {/* Title */}
        <h3 className="text-[clamp(1rem,1.25vw,1.125rem)] font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <Clock className="w-5 h-5" />
          </div> 
          <span>Activity</span>
        </h3>

        {/* Date Navigator */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-100 dark:border-gray-700/50 self-start sm:self-auto">
            <button 
                onClick={() => navigateWeek(-1)}
                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all shadow-sm hover:shadow"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center cursor-pointer" onClick={resetToToday} title="Reset to current week">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono">
                    {dateRangeLabel}
                </span>
            </div>

            <button 
                onClick={() => navigateWeek(1)}
                className={`p-1.5 rounded-md transition-all shadow-sm hover:shadow ${
                    // Optional: Disable going far into future if desired, currently allowed
                    'hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* 4. ✨ CHART AREA */}
      <div className="h-[clamp(180px,25vh,260px)] w-full mt-[clamp(1rem,1.5vw,1.5rem)] px-[clamp(0.5rem,1vw,1rem)] relative">
        {/* Total Overlay */}
        <div className="absolute top-0 right-6 text-right z-10 pointer-events-none opacity-50">
             <p className="text-[10px] font-semibold text-gray-400 uppercase">Total</p>
             <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpentInView)}</p>
        </div>

        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }} 
                    dy={10} 
                />
                <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: 'currentColor', opacity: 0.05 }}
                />
                <Bar 
                    dataKey="amount" 
                    radius={[6, 6, 6, 6]}
                    animationDuration={800}
                >
                    {chartData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            // VISIBILITY FIX: Show faint bar for 0 values
                            fill={entry.amount > 0 ? 'url(#purpleGradient)' : 'rgba(156, 163, 175, 0.1)'} 
                            className="transition-all duration-300 hover:opacity-80"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-6 mt-4 h-px bg-gray-50 dark:bg-gray-800" />

      {/* 5. ✨ TRANSACTION LIST (Filtered by selected week) */}
      <div className="p-0 flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {/* We show recent transactions generally, or you can filter this list by the date range too. 
                Currently keeping it as "Recent Activity" from global list for context. */}
            {transactions.slice(0, 5).map(t => (
              <li key={t._id} className="group p-[clamp(1rem,1.25vw,1.25rem)] flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default">
                 <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
                    t.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {t.type === 'income' ? <TrendingUp className="w-4 h-4"/> : <Wallet className="w-4 h-4"/>}
                  </div>
                  
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate pr-2">
                        {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                        {t.category}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(t.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`font-bold text-sm whitespace-nowrap ml-3 ${
                    t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 text-gray-400 h-full">
            <div className="mb-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full">
              <Receipt className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-xs font-medium">No transactions recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingSection;