import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CreditCard, PieChart as PieIcon, ArrowLeft, Calendar, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Vibrant, distinct colors for categories
const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#f43f5e', '#3b82f6'];
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

// Custom Active Shape for the Pie Chart (Explodes the slice slightly)
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, percent } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6} // Expands outward
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={6}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        fill={fill}
      />
    </g>
  );
};

const ExpenseBreakdown = ({ transactions }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    // 1. ROBUST DATA PROCESSING
    const { chartData, detailedTransactions, totalExpense } = useMemo(() => {
        const expenses = transactions.filter(t => {
            return t.type === 'expense' && 
                   t.category !== 'Investment' && 
                   !INVESTMENT_TYPES.includes(t.category);
        });

        const grouped = {};
        const detailed = {};

        expenses.forEach(t => {
            if (!grouped[t.category]) grouped[t.category] = 0;
            grouped[t.category] += t.amount;

            if (!detailed[t.category]) detailed[t.category] = [];
            detailed[t.category].push(t);
        });

        const data = Object.keys(grouped)
            .map(key => ({ name: key, value: grouped[key] }))
            .sort((a, b) => b.value - a.value);

        const total = data.reduce((acc, curr) => acc + curr.value, 0);

        return { chartData: data, detailedTransactions: detailed, totalExpense: total };
    }, [transactions]);

    // Helper: Determine what to show in the center text
    const activeItem = activeIndex !== null ? chartData[activeIndex] : null;
    const centerLabel = activeItem ? activeItem.name : "Total Spent";
    const centerValue = activeItem ? activeItem.value : totalExpense;
    const centerSubtext = activeItem 
        ? `${Math.round((activeItem.value / totalExpense) * 100)}%` 
        : `${chartData.length} Categories`;

    if (chartData.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <PieIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium text-sm">No expenses recorded yet.</p>
            </div>
        );
    }

    return (
        // CHANGE: Removed 'border' classes and reduced mobile padding (p-4 instead of p-6)
        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] p-4 sm:p-8 shadow-sm h-full flex flex-col relative overflow-hidden group transition-all duration-300">
            
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-rose-500/10 transition-colors duration-500"></div>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 shrink-0 relative z-10 px-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-600 dark:text-rose-400">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                            {selectedCategory ? selectedCategory : 'Expenses'}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {selectedCategory ? 'Transaction Details' : 'Distribution'}
                        </p>
                    </div>
                </div>
                
                {selectedCategory && (
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                )}
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-h-[300px] flex flex-col relative">
                <AnimatePresence mode='wait'>
                    {!selectedCategory ? (
                        <motion.div 
                            key="chart-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 h-full"
                        >
                            {/* --- DONUT CHART --- */}
                            <div className="w-full sm:w-1/2 h-[240px] sm:h-[260px] relative flex items-center justify-center shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            // Adjusted radius for better mobile fit
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            dataKey="value"
                                            cornerRadius={6}
                                            onMouseEnter={(_, index) => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(null)}
                                            onClick={(data) => setSelectedCategory(data.name)}
                                            cursor="pointer"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[index % COLORS.length]} 
                                                    stroke="none"
                                                    className="transition-all duration-500"
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                
                                {/* Dynamic Center Label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-80">
                                        {centerLabel}
                                    </span>
                                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {formatCurrency(centerValue).split('.')[0]}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 transition-colors duration-300
                                        ${activeIndex !== null 
                                            ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`
                                    }>
                                        {centerSubtext}
                                    </span>
                                </div>
                            </div>

                            {/* --- INTERACTIVE LEGEND --- */}
                            <div className="w-full sm:w-1/2 overflow-y-auto max-h-[280px] custom-scrollbar pr-2 space-y-2">
                                {chartData.map((entry, index) => {
                                    const isActive = activeIndex === index;
                                    return (
                                        <div 
                                            key={index} 
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(null)}
                                            onClick={() => setSelectedCategory(entry.name)}
                                            className={`flex justify-between items-center p-3 rounded-2xl cursor-pointer transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-slate-50 dark:bg-slate-800/80 shadow-sm scale-[1.02]' 
                                                    : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className={`w-3 h-3 rounded-full shadow-sm transition-transform duration-300 ${isActive ? 'scale-125' : ''}`} 
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                                                />
                                                <div>
                                                    <span className={`block text-xs font-bold transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {entry.name}
                                                    </span>
                                                    {isActive && (
                                                        <span className="text-[9px] text-slate-400 font-medium">Click for details</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`block text-xs font-black transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {formatCurrency(entry.value)}
                                                </span>
                                                <span className="block text-[9px] font-bold text-slate-400">
                                                    {Math.round((entry.value / totalExpense) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        /* --- DRILL DOWN LIST VIEW --- */
                        <motion.div 
                            key="list-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 overflow-y-auto custom-scrollbar pr-2"
                        >
                            <div className="space-y-3">
                                {detailedTransactions[selectedCategory]?.sort((a,b) => new Date(b.date) - new Date(a.date)).map((t, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={t._id} 
                                        className="group p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-rose-500 shadow-sm">
                                                <Receipt className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{t.title}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                        <Calendar className="w-3 h-3" /> {formatDate(t.date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-black text-rose-600 dark:text-rose-400 text-sm whitespace-nowrap">
                                            - {formatCurrency(t.amount)}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ExpenseBreakdown;