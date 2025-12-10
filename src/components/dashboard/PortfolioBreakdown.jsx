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
        // Matches if 'investmentType' is set OR 'category' is the type name (e.g. Category="IPO")
        const isMatchType = t.investmentType === type || t.category === type;

        if (isMatchType) {
          
          // 2. ADD MONEY (Investment Inflow)
          // Case A: Direct Expense (e.g. "Expense: Gold")
          // Case B: Transfer TO Investment (e.g. "Bank -> Investment (SIP)")
          // Note: We ignore transfers FROM Investment to avoid double counting internal moves
          if (t.type === 'expense' || (t.type === 'transfer' && t.paymentMode !== 'Investment')) {
            return acc + t.amount;
          }
          
          // 3. SUBTRACT MONEY (Investment Outflow / Withdrawal)
          // Case C: Transfer FROM Investment (e.g. "Investment (IPO) -> Bank")
          if (t.type === 'transfer' && t.paymentMode === 'Investment') {
            return acc - t.amount;
          }
        }
        return acc;
      }, 0);
      return { type, total };
    }).filter(i => i.total > 0).sort((a, b) => b.total - a.total); // Remove 0s and sort biggest to smallest
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full min-h-[300px]">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Briefcase className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">Portfolio Breakdown</h3>
      </div>
      
      {/* List */}
      <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] no-scrollbar">
        {breakdown.length > 0 ? breakdown.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
            <div className="flex items-center gap-3">
              {/* Color dot alternates purple/blue */}
              <div className={`w-3 h-3 rounded-full ${index % 2 === 0 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{item.type}</span>
            </div>
            <span className="font-extrabold text-gray-900 dark:text-white text-sm">
              {formatCurrency(item.total)}
            </span>
          </div>
        )) : (
          <div className="text-center text-gray-400 py-10 text-sm flex flex-col items-center justify-center h-full">
            <PieChart className="w-10 h-10 mb-3 opacity-20" />
            No active investments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBreakdown;