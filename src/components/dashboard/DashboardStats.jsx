import React from 'react';
import { IndianRupee, Landmark, Banknote, TrendingUp, CreditCard, PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const DashboardStats = ({ totalNetWorth, bankBalance, cashBalance, monthlyIncome, monthlyExpenses, monthlyInvested }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Net Worth */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-2xl transition-transform hover:scale-[1.02]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</p>
            <h2 className="text-3xl font-bold flex items-center gap-1"><IndianRupee className="w-6 h-6 text-blue-200" /> {totalNetWorth.toLocaleString()}</h2>
          </div>
          <div className="mt-6 pt-4 border-t border-white/20 flex justify-between text-xs font-medium text-blue-50">
            <span className="flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5" /> Bank: {formatCurrency(bankBalance)}</span>
            <span className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> Cash: {formatCurrency(cashBalance)}</span>
          </div>
        </div>
      </div>

      {/* 2. Income */}
      <StatCard 
        title="Total Income" 
        amount={monthlyIncome} 
        icon={<TrendingUp className="w-6 h-6" />} 
        color="text-green-600 dark:text-green-400" 
        bg="bg-green-50 dark:bg-green-900/30" 
        badge="This Month" 
        prefix="+" 
      />

      {/* 3. Expenses */}
      <StatCard 
        title="Net Expenses" 
        amount={monthlyExpenses} 
        icon={<CreditCard className="w-6 h-6" />} 
        color="text-red-600 dark:text-red-400" 
        bg="bg-red-50 dark:bg-red-900/30" 
        badge="This Month" 
        prefix="-" 
      />

      {/* 4. Invested */}
      <StatCard 
        title="Invested" 
        amount={monthlyInvested} 
        icon={<PieChart className="w-6 h-6" />} 
        color="text-purple-600 dark:text-purple-400" 
        bg="bg-purple-50 dark:bg-purple-900/30" 
        badge="This Month" 
        prefix="" 
      />
    </div>
  );
};

// Internal Helper Component
const StatCard = ({ title, amount, icon, color, bg, badge, prefix }) => (
  <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} group-hover:bg-opacity-80 transition-colors`}>{icon}</div>
      <span className={`text-[10px] font-bold ${bg} ${color} bg-opacity-50 px-2 py-1 rounded-lg`}>{badge}</span>
    </div>
    <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{prefix} {formatCurrency(amount)}</h2>
  </div>
);

// THIS EXPORT LINE IS CRITICAL
export default DashboardStats;