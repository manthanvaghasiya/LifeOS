import React from 'react';
import { Clock, TrendingUp, Wallet, Receipt, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const SpendingSection = ({ transactions }) => {
  
  // 1. ✨ CALCULATE LAST 7 DAYS SPENDING
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'narrow' }); // M, T, W...
        const dateStr = d.toISOString().split('T')[0];

        // Sum expenses for this day
        const total = transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(dateStr))
            .reduce((acc, t) => acc + t.amount, 0);
            
        data.push({ day: dayStr, amount: total });
    }
    return data;
  };

  const chartData = getLast7DaysData();
  const maxSpend = Math.max(...chartData.map(d => d.amount)) || 1; // Avoid divide by zero

  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col w-full min-h-[400px] relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
      
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <Clock className="w-5 h-5" />
          </div> 
          Activity & Trends
        </h3>
      </div>

      {/* 2. ✨ THE MINI CHART (CSS Only, No Heavy Libraries) */}
      {transactions.length > 0 && (
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-end justify-between h-24 gap-2">
                {chartData.map((d, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-end h-full flex-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-gray-900 text-white px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                            {formatCurrency(d.amount)}
                        </div>
                        
                        {/* Bar */}
                        <div 
                            style={{ height: `${(d.amount / maxSpend) * 80}%`, minHeight: '4px' }} 
                            className={`w-full max-w-[12px] rounded-t-full transition-all duration-500 ${
                                d.amount > 0 ? 'bg-purple-500/80 dark:bg-purple-500' : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                        />
                        {/* Label */}
                        <span className="text-[10px] text-gray-400 mt-2 font-medium">{d.day}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 h-px bg-gray-50 dark:bg-gray-800" />
          </div>
      )}

      {/* 3. Transaction List (Existing) */}
      <div className="p-0 flex-1 overflow-y-auto custom-scrollbar">
        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {transactions.slice(0, 5).map(t => (
              <li key={t._id} className="group p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default">
                
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
