import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Landmark, Banknote, Coins } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const FinancialSummary = ({ 
  totalNetWorth, 
  bankBalance, 
  bankBalances = [],
  cashBalance, 
  monthlyIncome, 
  monthlyIncomeCash,
  monthlyIncomeBank,
  monthlyExpenses, 
  monthlyExpensesCash,
  monthlyExpensesBank, 
  investmentBalance,
  monthLabel,
  customBreakdown
}) => {
  
  const Card = ({ title, amount, icon: Icon, colorClass, bgClass, breakdown, customBreakdown }) => (
    // ✅ ADDED: 'border border-slate-200 dark:border-slate-800' to ensure visible borders
    <div className="glass-panel p-5 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800">
      {/* Background Icon Blob */}
      <div className={`absolute -right-4 -bottom-4 p-4 rounded-full ${bgClass} opacity-20 group-hover:scale-125 transition-transform duration-500`}>
        <Icon className={`w-16 h-16 ${colorClass}`} />
      </div>

      <div className="relative z-10 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${bgClass}`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {title}
            </span>
        </div>
        <div>
          <h3 className="text-2xl font-black mb-1 text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(amount)}
          </h3>
          {breakdown && (
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 whitespace-nowrap"><Landmark className="w-3 h-3" /> Bank: {formatCurrency(breakdown.bank)}</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                <span className="flex items-center gap-1 whitespace-nowrap"><Banknote className="w-3 h-3" /> Cash: {formatCurrency(breakdown.cash)}</span>
            </div>
          )}
          {customBreakdown && (
            <div className="flex items-start gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                {customBreakdown}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const totalAvailable = (bankBalances.length > 0 
    ? bankBalances.reduce((sum, b) => sum + (Number(b.amount) || 0), 0) 
    : (Number(bankBalance) || 0)) + (Number(cashBalance) || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
      
      {/* 1. Net Worth (Big Highlight) */}
      <div className="sm:col-span-2 lg:col-span-1">
        {/* ✅ FIXED: Removed 'border-none' and added 'border border-white/20' for a premium glass edge */}
        <div className="glass-panel p-6 h-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white border border-white/20 shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
            
            <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-2 opacity-90">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-widest uppercase">Net Worth</span>
                    </div>
                    <div className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-md tracking-wider shadow-sm">
                        AVAILABLE: {formatCurrency(totalAvailable)}
                    </div>
                </div>
                <div>
                    {/* Kept the text-white fix from before */}
                    <h2 className="text-3xl font-black mb-1 text-white">{formatCurrency(totalNetWorth)}</h2>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-indigo-100">
                        {bankBalances.length > 0 ? (
                          bankBalances.map((b, index) => (
                            <React.Fragment key={b.name}>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Landmark className="w-3 h-3 flex-shrink-0" /> {b.name}: {formatCurrency(b.amount)}
                              </span>
                              <span className="w-1 h-1 bg-white/40 rounded-full flex-shrink-0"></span>
                            </React.Fragment>
                          ))
                        ) : (
                          <>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Landmark className="w-3 h-3 flex-shrink-0" /> Bank: {formatCurrency(bankBalance)}
                            </span>
                            <span className="w-1 h-1 bg-white/40 rounded-full flex-shrink-0"></span>
                          </>
                        )}
                        <span className="flex items-center gap-1 whitespace-nowrap"><Banknote className="w-3 h-3 flex-shrink-0" /> Cash: {formatCurrency(cashBalance)}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Monthly Income */}
      <Card 
        title={`Income`} 
        amount={monthlyIncome} 
        icon={TrendingUp} 
        colorClass="text-emerald-600 dark:text-emerald-400" 
        bgClass="bg-emerald-100 dark:bg-emerald-900/30" 
        breakdown={{ bank: monthlyIncomeBank, cash: monthlyIncomeCash }}
      />

      {/* 3. Monthly Expense */}
      <Card 
        title={`Expenses`}
        amount={monthlyExpenses} 
        icon={TrendingDown} 
        colorClass="text-rose-600 dark:text-rose-400" 
        bgClass="bg-rose-100 dark:bg-rose-900/30" 
        breakdown={{ bank: monthlyExpensesBank, cash: monthlyExpensesCash }}
      />

      {/* 4. Total Investments */}
      <Card 
        title="Total Invested" 
        amount={investmentBalance} 
        icon={Coins} 
        colorClass="text-amber-600 dark:text-amber-400" 
        bgClass="bg-amber-100 dark:bg-amber-900/30" 
        customBreakdown={
          <div className="flex items-start gap-1.5 w-full" title={monthLabel + " Investments"}>
            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" /> 
            <span className="whitespace-normal leading-relaxed break-words">This Month: {customBreakdown || '₹0'}</span>
          </div>
        }
      />

    </div>
  );
};

export default FinancialSummary;
