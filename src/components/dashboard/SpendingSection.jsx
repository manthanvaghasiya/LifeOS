import React, { useMemo } from 'react';
// Added Recharts imports for production-grade visualization
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, TrendingUp, Wallet, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const SpendingSection = ({ transactions }) => {
  
  // 1. ✨ OPTIMIZED DATA CALCULATION (Refactored)
  // FIXED: Timezone consistency and Number safety
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        
        // Use Local Time for day names (e.g., "Mon") to match user's wall clock
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Use Local Time YYYY-MM-DD for comparison to avoid UTC timezone shifts
        // (e.g. 8PM EST shouldn't count as tomorrow)
        const dateKey = d.toLocaleDateString('en-CA'); 

        const total = transactions
            .filter(t => {
                if (t.type !== 'expense') return false;
                
                // Robustly handle Date objects or Strings
                const tDate = new Date(t.date);
                const tDateKey = tDate.toLocaleDateString('en-CA');
                
                return tDateKey === dateKey;
            })
            // Ensure we add Numbers, guarding against string '100' + '200' = '100200'
            .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
            
        data.push({ 
            day: dayName, 
            amount: total,
            fullDate: dateKey
        });
    }
    return data;
  }, [transactions]);

  // 2. ✨ CUSTOM TOOLTIP COMPONENT
  // Provides precise feedback without cluttering the UI
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md text-white text-xs p-3 rounded-xl shadow-2xl border border-white/10">
          <p className="font-bold mb-1 text-gray-300">{payload[0].payload.day}</p>
          <p className="font-mono text-purple-300 font-bold text-sm">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col w-full min-h-[400px] relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* ... existing header code ... */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
      
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <Clock className="w-5 h-5" />
          </div> 
          Activity & Trends
        </h3>
      </div>

      {/* 3. ✨ RECHARTS IMPLEMENTATION */}
      {/* FIXED: Removed arbitrary margin, ensured strict height for ResponsiveContainer */}
      <div className="h-[180px] w-full mt-4 px-2">
        {transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
                    <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} 
                        dy={10} 
                    />
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)', radius: 4 }} // Soft highlight instead of transparent
                    />
                    <Bar 
                        dataKey="amount" 
                        radius={[4, 4, 4, 4]}
                        animationDuration={1000}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                // Show a faint gray bar if value is 0 so the chart doesn't look "broken"
                                fill={entry.amount > 0 ? '#8b5cf6' : 'rgba(255,255,255,0.05)'} 
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        ) : (
            // ... existing empty state ...
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs">
                 <p>No activity data available for this week</p>
            </div>
        )}
      </div>

      <div className="mx-6 mt-4 h-px bg-gray-50 dark:bg-gray-800" />

      {/* 4. Transaction List (Existing) */}
      <div className="p-0 flex-1 overflow-y-auto custom-scrollbar">
        {/* ... existing list rendering code ... */}
        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {transactions.slice(0, 5).map(t => (
              <li key={t._id} className="group p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default">
                {/* ... existing list item content ... */}
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
            <p className="text-xs font-medium">No transactions recorded today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingSection;