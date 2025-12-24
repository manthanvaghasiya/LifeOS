import React, { useMemo } from 'react';
import { Briefcase, PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

// Must match the constants in other files
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const PortfolioBreakdown = ({ transactions }) => {
  
  // Calculate breakdown inside the component to keep parent clean
  const breakdown = useMemo(() => {
    return INVESTMENT_TYPES.map(type => {
      const total = transactions.reduce((acc, t) => {
        // 1. CHECK IF TRANSACTION RELATES TO THIS TYPE
        const isMatchType = t.investmentType === type || t.category === type;

        if (isMatchType) {
          // 2. ADD MONEY (Investment Inflow)
          if (t.type === 'expense' || (t.type === 'transfer' && t.paymentMode !== 'Investment')) {
            return acc + t.amount;
          }
          
          // 3. SUBTRACT MONEY (Investment Outflow / Withdrawal)
          if (t.type === 'transfer' && t.paymentMode === 'Investment') {
            return acc - t.amount;
          }
        }
        return acc;
      }, 0);
      return { type, total };
    }).filter(i => i.total > 0).sort((a, b) => b.total - a.total); 
  }, [transactions]);

  return (
    /* Outer Container: Matches the 'glass-panel' and padding of the Expense Breakdown */
    <div className="glass-panel p-6 h-full flex flex-col">
      
      {/* Header (Outside the inner border to match the visual hierarchy) */}
      <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Portfolio Breakdown</h3>
      </div>

      {/* Inner card with border: Matches the internal border style seen in Expense Distribution */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 h-full flex flex-col flex-1 min-h-[300px]">
        
        {/* List Content */}
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
          {breakdown.length > 0 ? (
            breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  {/* Alternating indicator colors to match the "distributed" feel */}
                  <div className={`w-3 h-3 rounded-full ${index % 2 === 0 ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {item.type}
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-10 text-sm flex flex-col items-center justify-center h-full">
              <PieChart className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-slate-500 font-medium">No active investments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioBreakdown;