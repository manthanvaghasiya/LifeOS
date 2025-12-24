import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CreditCard, PieChart as PieIcon, ArrowLeft, Calendar } from 'lucide-react';

const COLORS = ['#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#d946ef'];
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const ExpenseBreakdown = ({ transactions }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 1. Process Data for the Pie Chart and Detailed Lists
    const { chartData, detailedTransactions, totalExpense } = useMemo(() => {
        const expenses = transactions.filter(t => {
            return t.type === 'expense' && 
                   t.category !== 'Investment' && 
                   !INVESTMENT_TYPES.includes(t.category);
        });

        const grouped = {};
        const detailed = {};

        expenses.forEach(t => {
            // Group for Pie Chart
            if (!grouped[t.category]) grouped[t.category] = 0;
            grouped[t.category] += t.amount;

            // Group for Drill-Down
            if (!detailed[t.category]) detailed[t.category] = [];
            detailed[t.category].push(t);
        });

        const chartData = Object.keys(grouped)
            .map(key => ({ name: key, value: grouped[key] }))
            .sort((a, b) => b.value - a.value);

        const totalExpense = chartData.reduce((acc, curr) => acc + curr.value, 0);

        return { chartData, detailedTransactions: detailed, totalExpense };
    }, [transactions]);

    // 2. Handle Drill-down
    const handleCategoryClick = (categoryName) => {
        if (detailedTransactions[categoryName]) {
            setSelectedCategory(categoryName);
        }
    };

    if (chartData.length === 0) {
        return (
            <div className="glass-panel p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Expense Distribution</h3>
                </div>
                <div className="flex flex-col items-center justify-center text-center flex-1 min-h-[300px]">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full mb-3">
                        <PieIcon className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm">No expenses to analyze yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 h-full flex flex-col transition-all duration-300">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 shadow-sm">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                        {selectedCategory ? `${selectedCategory} Details` : 'Expense Distribution'}
                    </h3>
                </div>
                {selectedCategory && (
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                )}
            </div>

            {!selectedCategory ? (
                /* VIEW 1: PIE CHART & LIST */
                <div className="flex flex-col sm:flex-row items-center gap-10 flex-1 animate-in fade-in duration-500">
                    {/* Donut Chart */}
                    <div className="w-[190px] h-[190px] shrink-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    onClick={(data) => handleCategoryClick(data.name)}
                                    cursor="pointer"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Total</span>
                            <span className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                                {formatCurrency(totalExpense).split('.')[0]}
                            </span>
                        </div>
                    </div>

                    {/* Legend List */}
                    <div className="flex-1 w-full overflow-y-auto max-h-[250px] custom-scrollbar pr-2">
                        <div className="space-y-2">
                            {chartData.map((entry, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleCategoryClick(entry.name)}
                                    className="flex justify-between items-center group p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {entry.name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-black text-slate-900 dark:text-white">
                                            {formatCurrency(entry.value)}
                                        </span>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {Math.round((entry.value / totalExpense) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* VIEW 2: TRANSACTION LIST (Drill Down) */
                <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-2 animate-in slide-in-from-right duration-300">
                    <div className="space-y-3">
                        {detailedTransactions[selectedCategory]?.map((t) => (
                            <div 
                                key={t._id} 
                                className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex justify-between items-center group hover:border-rose-200 dark:hover:border-rose-900/50 transition-all"
                            >
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                            <Calendar className="w-3 h-3" /> {formatDate(t.date)}
                                        </span>
                                    </div>
                                </div>
                                <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
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

export default ExpenseBreakdown;