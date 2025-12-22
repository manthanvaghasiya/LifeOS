import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CreditCard, PieChart as PieIcon, ArrowLeft, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const ExpenseBreakdown = ({ transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 1. Process Data for the Pie Chart
  const { chartData, categoryTransactions } = useMemo(() => {
    const expenses = transactions.filter(t => {
      if (t.type !== 'expense') return false;
      if (t.category === 'Investment') return false;
      if (INVESTMENT_TYPES.includes(t.category)) return false;
      return true;
    });

    const grouped = {};
    const detailed = {};

    expenses.forEach(t => {
      // Sum for Chart
      if (!grouped[t.category]) grouped[t.category] = 0;
      grouped[t.category] += t.amount;

      // List for Drill-Down
      if (!detailed[t.category]) detailed[t.category] = [];
      detailed[t.category].push(t);
    });

    const chartData = Object.keys(grouped)
      .map(key => ({ name: key, value: grouped[key] }))
      .sort((a, b) => b.value - a.value);
    
    return { chartData, categoryTransactions: detailed };
  }, [transactions]);

  // 2. Handle Click on Category
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full min-h-[300px] relative overflow-hidden transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 z-10">
        <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
          <CreditCard className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">
          {selectedCategory ? `${selectedCategory} Details` : 'Expense Breakdown'}
        </h3>
      </div>

      {/* VIEW 1: PIE CHART & LIST (Default) */}
      {!selectedCategory ? (
        chartData.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 h-full animate-fadeIn">
            
            {/* Chart */}
            <div className="w-[180px] h-[180px] shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    onClick={(data) => handleCategoryClick(data.name)} // Click Chart Segment
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Spending</span>
              </div>
            </div>

            {/* List (Legend) */}
            <div className="flex-1 w-full space-y-3 overflow-y-auto max-h-[220px] pr-2 no-scrollbar">
              {chartData.map((item, index) => (
                <div 
                  key={item.name} 
                  onClick={() => handleCategoryClick(item.name)} // Click List Item
                  className="flex items-center justify-between group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
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
        )
      ) : (
        /* VIEW 2: TRANSACTION LIST (Drill Down) */
        <div className="flex flex-col h-full animate-fadeIn">
          <button 
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </button>
          
          <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-3">
            {categoryTransactions[selectedCategory]?.map((t) => (
              <div key={t._id} className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{t.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(t.date)}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-red-500 text-sm">
                  - {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PieChartIcon = (props) => <PieIcon {...props} />;

export default ExpenseBreakdown;