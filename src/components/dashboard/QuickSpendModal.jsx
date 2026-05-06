import React, { useState, useEffect } from 'react';
import {
  X, Check, Wallet, TrendingUp, TrendingDown,
  Coffee, ShoppingBag, Car, Zap, Heart,
  Briefcase, GraduationCap, Smartphone, MoreHorizontal,
  Landmark, ArrowRightLeft, Calendar, Plus, Star, Tag
} from 'lucide-react';
import API from '../../services/api';
import useCategories from '../../hooks/useCategories';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

// Map string names to Icon Components
const ICON_MAP = {
  Coffee, ShoppingBag, Car, Zap, Heart, Briefcase, GraduationCap, Smartphone,
  MoreHorizontal, Landmark, Wallet, TrendingUp, Tag, Star
};

// Category icon & color assignments
const CATEGORY_ICONS = {
  Food: { iconName: 'Coffee', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  Shopping: { iconName: 'ShoppingBag', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
  Transport: { iconName: 'Car', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  Travel: { iconName: 'Car', color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  Bills: { iconName: 'Zap', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  Health: { iconName: 'Heart', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  Education: { iconName: 'GraduationCap', color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  Grocery: { iconName: 'ShoppingBag', color: 'text-lime-500', bg: 'bg-lime-100 dark:bg-lime-900/30' },
  Entertainment: { iconName: 'Smartphone', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  Fuel: { iconName: 'Car', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-900/30' },
  Salary: { iconName: 'Briefcase', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  Business: { iconName: 'TrendingUp', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  Investment: { iconName: 'Landmark', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  Freelance: { iconName: 'Briefcase', color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  Gift: { iconName: 'Star', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  Rental: { iconName: 'Landmark', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' }
};

const CUSTOM_COLORS = [
  { color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  { color: 'text-fuchsia-500', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
  { color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  { color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' }
];

const QuickSpendModal = ({ onClose, onSuccess }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [customCatName, setCustomCatName] = useState('');

  const toast = useToast();
  const { expenseCategories, incomeCategories, addCategory, loading: categoriesLoading } = useCategories();

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  useEffect(() => {
    setAnimating(true);
    if (currentCategories.length > 0) {
      setCategory(currentCategories[0]);
    }
  }, [type, currentCategories]);

  const handleAddCustomCategory = async () => {
    if (!customCatName.trim()) return;

    const newCatName = customCatName.trim();
    await addCategory(type, newCatName);
    setCategory(newCatName);
    setCustomCatName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast.error("Wait! What is this spending for?");
      return;
    }
    if (!amount || amount <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const newTransaction = {
        amount: parseFloat(amount),
        title, 
        category,
        type: type, // Ensure correct type (income/expense)
        date: date, // Use the selected date
        paymentMode // ✨ FIXED: Included paymentMode in API call
      };

      const res = await API.post('/transactions', newTransaction);
      
      // ✨ FIXED: Used 'onSuccess' instead of 'onTransactionAdded'
      if (onSuccess) onSuccess(res.data);
      
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} saved successfully!`);
      
      // Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: type === 'income' ? ['#10b981', '#34d399'] : ['#ef4444', '#f97316']
      });

      handleClose(); // Close with animation
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnimating(false);
    setTimeout(onClose, 200);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4">
      {/* ... existing JSX code ... */}
      <div
        className={`absolute inset-0 bg-gray-900/30 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${animating ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform ${animating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full md:translate-y-10 opacity-0 md:scale-95'
          }`}
      >
        {/* HEADER */}
        <div className="px-6 pt-6 pb-2 shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Quick Add
            </h2>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Record a transaction
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE FORM */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* TYPE TOGGLE */}
          <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-2xl">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${type === t
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
              >
                {t === 'expense' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                <span>{t}</span>
              </button>
            ))}
          </div>

          {/* MAIN INPUTS (Amount & Title) */}
          <div className="space-y-4">
            
            {/* 1. AMOUNT + VERTICAL PAYMENT TOGGLE */}
            <div className="flex bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-gray-200 dark:focus-within:border-gray-700 transition-colors">
              
              {/* Left: Amount Input */}
              <div className="relative flex-1">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold transition-colors ${
                  type === 'expense' ? 'text-red-500' : 'text-green-500'
                }`}>
                  ₹
                </span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full pl-10 pr-4 py-4 bg-transparent text-3xl font-black text-gray-900 dark:text-white placeholder-gray-300 outline-none"
                />
              </div>

              {/* Right: Vertical Payment Mode Buttons */}
              <div className="w-20 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-900/30">
                 <button
                   onClick={() => setPaymentMode('Cash')}
                   className={`flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all ${
                      paymentMode === 'Cash' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                   }`}
                 >
                   Cash
                 </button>
                 <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                 <button
                   onClick={() => setPaymentMode('Bank')}
                   className={`flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all ${
                      paymentMode === 'Bank' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                   }`}
                 >
                   Bank
                 </button>
              </div>
            </div>

            {/* 2. TITLE INPUT (Full Width) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is this for?"
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-xl text-sm font-semibold text-gray-900 dark:text-white outline-none transition-all"
              />
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                 </div>
                 <input 
                   type="date"
                   value={date}
                   onChange={(e) => setDate(e.target.value)}
                   className="w-full sm:w-auto pl-9 pr-3 py-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 outline-none border border-transparent focus:border-gray-300 cursor-pointer"
                 />
              </div>
            </div>
          
          </div>

          {/* CATEGORIES GRID */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
              Category
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {currentCategories.map((catName, idx) => {
                // Look up category in CATEGORY_ICONS map
                const catConfig = CATEGORY_ICONS[catName];
                const iconName = catConfig?.iconName || 'Tag';
                const color = catConfig?.color || CUSTOM_COLORS[idx % CUSTOM_COLORS.length].color;
                const bg = catConfig?.bg || CUSTOM_COLORS[idx % CUSTOM_COLORS.length].bg;
                const Icon = ICON_MAP[iconName] || Tag;

                return (
                  <button
                    key={catName}
                    onClick={() => setCategory(catName)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all duration-200 ${category === catName
                      ? `${bg} shadow-sm scale-105 border-current`
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <div className={`p-2 rounded-full ${category === catName ? 'bg-white dark:bg-gray-800' : bg} ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold truncate w-full text-center ${category === catName ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                      {catName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* DYNAMIC INPUT FOR "OTHER" */}
            {category === 'Other' && (
              <div className="mt-4 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Tag className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={customCatName}
                      onChange={(e) => setCustomCatName(e.target.value)}
                      placeholder="Enter custom category..."
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-500 rounded-xl text-sm font-semibold outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomCategory()}
                    />
                  </div>

                  <button
                    onClick={handleAddCustomCategory}
                    disabled={!customCatName.trim()}
                    className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 ml-1">
                  * This will add a new category to your list.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 pt-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-10">
          <button
            onClick={handleSubmit}
            disabled={!amount || !title || loading}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg text-white shadow-xl transition-all duration-300 ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 dark:bg-white dark:text-gray-900 hover:scale-[1.02] active:scale-95 shadow-gray-200 dark:shadow-none'
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5 stroke-[3px]" />
                <span>Save Transaction</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuickSpendModal;