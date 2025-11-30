import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import {
    Plus, CheckCircle, Circle, Target, Calendar,
    Wallet, TrendingUp, ArrowRight, Clock, IndianRupee, Landmark, Banknote
} from 'lucide-react';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Shopping', 'Health', 'Education', 'Investment'];

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State (Initialized correctly with 'Bank')
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        type: 'expense',
        paymentMode: 'Bank'   // ✅
    });

    

    const [customCategory, setCustomCategory] = useState('');

    useEffect(() => { fetchAllData(); }, []);

    const fetchAllData = async () => {
        try {
            const [txRes, habitRes, goalRes] = await Promise.all([
                API.get('/transactions'),
                API.get('/habits'),
                API.get('/goals')
            ]);
            setTransactions(txRes.data);
            setHabits(habitRes.data);
            setGoals(goalRes.data);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    // --- LOGIC ---
    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];
    const todayDateString = todayObj.toLocaleDateString();

    const incompleteHabits = habits.filter(h => !h.completedDates.includes(todayStr));

    const activeGoals = goals
        .filter(g => !g.isCompleted)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const todayTransactions = transactions.filter(t =>
        new Date(t.date).toLocaleDateString() === todayDateString
    );

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
    const totalInvested = transactions.filter(t => t.type === 'expense' && t.category === 'Investment').reduce((acc, c) => acc + c.amount, 0);
    const totalExpensesRaw = transactions.filter(t => t.type === 'expense').reduce((acc, c) => acc + c.amount, 0);
    const totalRealExpenses = totalExpensesRaw - totalInvested;
    const balance = totalIncome - totalExpensesRaw;

    // CASH VS BANK BREAKDOWN (Calculated from Transaction History)
    const bankBalance = transactions.reduce((acc, t) => {
        // Skip Cash transactions
        if (t.paymentMode === 'Cash') return acc;
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);

    const cashBalance = transactions.reduce((acc, t) => {
        // Only count Cash transactions
        if (t.paymentMode !== 'Cash') return acc;
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);

    // --- ACTIONS ---
    const handleToggleHabit = async (id) => {
        setHabits(prev => prev.map(h => h._id === id ? { ...h, completedDates: [...h.completedDates, todayStr] } : h));
        try { await API.put(`/habits/${id}/toggle`, { date: todayStr }); } catch (err) { fetchAllData(); }
    };

    const handleToggleGoal = async (id) => {
        setGoals(prev => prev.map(g => g._id === id ? { ...g, isCompleted: true } : g));
        try { await API.put(`/goals/${id}/toggle`); } catch (err) { fetchAllData(); }
    };

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
        try {
            const res = await API.post('/transactions', {
                ...formData,
                category: finalCategory,
                date: new Date()
            });
            setTransactions([res.data, ...transactions]);
            setShowForm(false);
            setFormData({ title: '', amount: '', category: 'Food', type: 'expense', paymentMode: 'Bank' });
            setCustomCategory('');
        } catch (err) { alert('Error adding'); }
    };


    if (loading) return <DashboardSkeleton />;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">

            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hello, Achiever</h1>
                    <p className="text-gray-500 text-sm">Here is your daily briefing.</p>
                </div>
                <button onClick={() => setShowForm(true)} className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg transition transform hover:scale-105">
                    <Plus className="w-5 h-5" /> Quick Spend
                </button>
            </div>

            {/* 2. SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* TOTAL BALANCE (Split View) */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200 flex flex-col justify-between">
                    <div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total Net Worth</p>
                        <h2 className="text-3xl font-bold flex items-center gap-1"><IndianRupee className="w-6 h-6" /> {balance.toLocaleString()}</h2>
                    </div>
                    {/* Bank vs Cash Mini-Bar */}
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-xs font-medium text-blue-100">
                        <span className="flex items-center gap-1"><Landmark className="w-3 h-3" /> Bank: {formatCurrency(bankBalance)}</span>
                        <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> Cash: {formatCurrency(cashBalance)}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-600">+ {formatCurrency(totalIncome)}</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Net Expenses</p>
                    <h2 className="text-2xl font-bold text-red-600">- {formatCurrency(totalRealExpenses)}</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Invested</p>
                            <h2 className="text-2xl font-bold text-purple-600">{formatCurrency(totalInvested)}</h2>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600" /></div>
                    </div>
                </div>
            </div>

            {/* 3. MAIN SPLIT LAYOUT (50/50) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* --- LEFT: HABITS --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" /> Daily Habits
                        </h3>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">{incompleteHabits.length} Remaining</span>
                    </div>

                    <div className="p-4 space-y-3">
                        {incompleteHabits.length > 0 ? (
                            incompleteHabits.map(habit => (
                                <div key={habit._id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-xl transition-all cursor-pointer" onClick={() => handleToggleHabit(habit._id)}>
                                    <div className="flex items-center gap-4">
                                        <Circle className="w-6 h-6 text-gray-300 group-hover:text-green-500 transition-colors" strokeWidth={2} />
                                        <span className="font-semibold text-gray-700 text-lg">{habit.title}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">{habit.target} days</span>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h4 className="font-bold text-gray-800">All Habits Completed!</h4>
                                <p className="text-sm text-gray-500">You are unstoppable today.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- RIGHT: GOALS & SPENDING --- */}
                <div className="flex flex-col gap-8">

                    {/* BLOCK A: GOALS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Target className="w-5 h-5 text-orange-600" /> Pending Goals
                            </h3>
                            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{activeGoals.length}</span>
                        </div>

                        <div className="p-3 space-y-3">
                            {activeGoals.map(goal => {
                                const isOverdue = new Date(goal.deadline) < new Date().setHours(0, 0, 0, 0);
                                return (
                                    <div key={goal._id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-white flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm mb-1">{goal.title}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded ${isOverdue ? 'bg-red-100 text-red-700 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                                                {formatDate(goal.deadline)}
                                            </span>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); handleToggleGoal(goal._id); }} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                            {activeGoals.length === 0 && <div className="py-8 text-center text-gray-400 text-sm">No active goals.</div>}
                        </div>
                    </div>

                    {/* BLOCK B: TODAY'S SPENDING */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-600" /> Today's Spending
                            </h3>
                        </div>

                        <div className="p-0">
                            {todayTransactions.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {todayTransactions.map(t => (
                                        <li key={t._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-bold text-xs text-gray-800">{t.title}</p>
                                                    <p className="text-[10px] text-gray-400">{t.category}</p>
                                                </div>
                                                {/* Payment Mode Badge */}
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${t.paymentMode === 'Cash' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                    {t.paymentMode === 'Cash' ? <Banknote className="w-3 h-3" /> : <Landmark className="w-3 h-3" />}
                                                </span>
                                            </div>
                                            <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="py-8 text-center text-gray-400 text-sm">No spendings today.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* QUICK ADD MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl scale-100">
                        <h3 className="font-bold text-xl mb-6 text-gray-800">Add Today's Spend</h3>
                        <form onSubmit={handleQuickAdd} className="space-y-4">
                            <input type="text" placeholder="What is it?" required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />

                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Amount" required className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} />

                                {/* PAYMENT MODE SELECTOR */}
                                <select
                                    className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    value={formData.paymentMode}
                                    onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}
                                >
                                    <option value="Bank">Bank</option>
                                    <option value="Cash">Cash</option>
                                </select>


                            </div>

                            <select className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                {DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                <option value="Other">Other</option>
                            </select>

                            {formData.category === 'Other' && (
                                <input type="text" placeholder="Type Category" required className="w-full p-4 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
                            )}

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })} className={`flex-1 p-3 rounded-xl font-bold text-sm transition ${formData.type === 'expense' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-400'}`}>Expense</button>
                                <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })} className={`flex-1 p-3 rounded-xl font-bold text-sm transition ${formData.type === 'income' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-400'}`}>Income</button>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 p-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 shadow-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;