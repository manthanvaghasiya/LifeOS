import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CreditCard, PieChart as PieIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
// Match the types to exclude them from "Expenses"
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const ExpenseBreakdown = ({ transactions }) => {
  
  // Process Data: Filter Expenses -> Group by Category -> Sort Highest to Lowest
  const data = useMemo(() => {
    const expenses = transactions.filter(t => {
      // 1. Must be an expense
      if (t.type !== 'expense') return false;
      // 2. Must NOT be an investment (those go to Portfolio Breakdown)
      if (t.category === 'Investment') return false;
      if (INVESTMENT_TYPES.includes(t.category)) return false;
      return true;
    });

    const grouped = {};

    expenses.forEach(t => {
      if (!grouped[t.category]) grouped[t.category] = 0;
      grouped[t.category] += t.amount;
    });

    return Object.keys(grouped)
      .map(key => ({ name: key, value: grouped[key] }))
      .sort((a, b) => b.value - a.value); // Sort biggest expense first
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full min-h-[300px]">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
          <CreditCard className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">Expense Breakdown</h3>
      </div>

      {data.length > 0 ? (
        <div className="flex flex-col sm:flex-row items-center gap-6 h-full">
          
          {/* Chart */}
          <div className="w-[180px] h-[180px] shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(val) => formatCurrency(val)} 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        color: '#000'
                    }} 
                    itemStyle={{ color: '#000', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Spending</span>
            </div>
          </div>

          {/* List (Legend) */}
          <div className="flex-1 w-full space-y-3 overflow-y-auto max-h-[220px] pr-2 no-scrollbar">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-10">
            <PieChartIcon className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm">No expenses recorded yet.</p>
        </div>
      )}
    </div>
  );
};

// Simple Icon wrapper to avoid naming conflict with Recharts
const PieChartIcon = (props) => <PieIcon {...props} />;

export default ExpenseBreakdown;