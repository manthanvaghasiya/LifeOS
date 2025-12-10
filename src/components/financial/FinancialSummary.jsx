import React from 'react';
import { IndianRupee, Landmark, Banknote, TrendingUp, CreditCard, PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const FinancialSummary = ({ 
  totalNetWorth, bankBalance, cashBalance, 
  monthlyIncome, monthlyExpenses, investmentBalance, 
  monthLabel 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. Net Worth (Blue Gradient) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200/50 transition-transform hover:scale-[1.02]">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Total Net Worth</p>
            <h2 className="text-4xl font-bold flex items-center gap-1">
              <IndianRupee className="w-8 h-8 text-blue-300" /> {totalNetWorth.toLocaleString()}
            </h2>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-xs font-semibold text-blue-50">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Bank: {formatCurrency(bankBalance)}</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div> Cash: {formatCurrency(cashBalance)}</span>
          </div>
        </div>
      </div>

      {/* 2. Income */}
      <SummaryCard 
        title="Income" 
        amount={monthlyIncome} 
        icon={<TrendingUp className="w-7 h-7" />} 
        colorClass="text-green-600 dark:text-green-400" 
        bgClass="bg-green-50 dark:bg-green-900/30" 
        badge={monthLabel} 
        prefix="+" 
      />

      {/* 3. Expenses */}
      <SummaryCard 
        title="Net Expenses" 
        amount={monthlyExpenses} 
        icon={<CreditCard className="w-7 h-7" />} 
        colorClass="text-red-600 dark:text-red-400" 
        bgClass="bg-red-50 dark:bg-red-900/30" 
        badge={monthLabel} 
        prefix="-" 
      />

      {/* 4. Total Investment */}
      <SummaryCard 
        title="Total Invested" 
        amount={investmentBalance} 
        icon={<PieChart className="w-7 h-7" />} 
        colorClass="text-purple-600 dark:text-purple-400" 
        bgClass="bg-purple-50 dark:bg-purple-900/30" 
        badge="Overall" 
        prefix="" 
      />
    </div>
  );
};

// Internal Helper Component for Cards 2, 3, 4
const SummaryCard = ({ title, amount, icon, colorClass, bgClass, badge, prefix }) => (
  <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3.5 rounded-2xl transition-colors ${bgClass} ${colorClass} group-hover:bg-opacity-80`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${bgClass} ${colorClass} bg-opacity-50`}>
        {badge}
      </span>
    </div>
    <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
      {prefix} {formatCurrency(amount)}
    </h2>
  </div>
);

export default FinancialSummary;