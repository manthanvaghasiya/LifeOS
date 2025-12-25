import React from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, PieChart, 
  Landmark, Banknote, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const DashboardStats = ({ 
  totalNetWorth = 0, 
  bankBalance = 0, 
  cashBalance = 0, 
  monthlyIncome = 0, 
  monthlyExpenses = 0, 
  monthlyInvested = 0 
}) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
      
      {/* 1. HERO CARD: Net Worth (Blue Gradient) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 transition-transform hover:scale-[1.02] group">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16 transition-opacity group-hover:opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-20 -ml-12 -mb-12"></div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                    <Wallet className="w-4 h-4 text-blue-50" />
                </div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Total Balance</p>
            </div>
            
            {/* ✅ FIXED: Added 'text-white' class here to override global h2 styles */}
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              {formatCurrency(totalNetWorth)}
            </h2>
          </div>

          {/* Bottom Section: The Breakdown */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-xs font-medium text-blue-50">
            <div className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 opacity-70" /> 
                <span>Bank: <span className="text-white font-bold">{formatCurrency(bankBalance)}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 opacity-70" /> 
                <span>Cash: <span className="text-white font-bold">{formatCurrency(cashBalance)}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INCOME CARD */}
      <StatCard 
        title="Income" 
        amount={monthlyIncome} 
        icon={TrendingUp} 
        color="text-emerald-600 dark:text-emerald-400" 
        bgColor="bg-emerald-50 dark:bg-emerald-900/20"
        trendIcon={ArrowUpRight}
        trendLabel="Inflow"
      />

      {/* 3. EXPENSE CARD */}
      <StatCard 
        title="Expenses" 
        amount={monthlyExpenses} 
        icon={TrendingDown} 
        color="text-rose-600 dark:text-rose-400" 
        bgColor="bg-rose-50 dark:bg-rose-900/20"
        trendIcon={ArrowDownRight}
        trendLabel="Outflow"
      />

      {/* 4. INVESTMENT CARD */}
      <StatCard 
        title="Invested" 
        amount={monthlyInvested} 
        icon={PieChart} 
        color="text-purple-600 dark:text-purple-400" 
        bgColor="bg-purple-50 dark:bg-purple-900/20"
        trendIcon={TrendingUp}
        trendLabel="Saved"
      />

    </div>
  );
};

// --- Internal Helper Component for Consistency ---
const StatCard = ({ title, amount, icon: Icon, color, bgColor, trendIcon: TrendIcon, trendLabel }) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-900/60 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
    
    <div className="flex justify-between items-start mb-4">
        {/* Icon Wrapper */}
        <div className={`p-3.5 rounded-2xl ${bgColor} ${color} transition-colors group-hover:scale-110 duration-300`}>
            <Icon className="w-6 h-6" />
        </div>
        
        {/* Small Tag */}
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${bgColor} ${color} opacity-80`}>
            {TrendIcon && <TrendIcon className="w-3 h-3" />}
            {trendLabel}
        </div>
    </div>

    <div>
        <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
            {title} <span className="text-[10px] normal-case opacity-70">(Month)</span>
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {formatCurrency(amount)}
        </h3>
    </div>

    {/* Subtle Glow Effect on Hover */}
    <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-current ${color}`} />
  </div>
);

export default DashboardStats;
