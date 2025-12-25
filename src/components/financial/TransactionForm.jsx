import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { X, ArrowRight, Wallet, Building2, TrendingUp, CheckCircle2, Plus } from 'lucide-react';

// 1. Define Distinct Category Lists
const INITIAL_EXPENSE_CATS = ['Mobile', 'Bike', 'Food', 'Shopping', 'Bills', 'Pooja', 'Education', 'Guest', 'Grocery', 'Health', 'Travel'];
const INITIAL_INCOME_CATS = ['Salary', 'Investment', 'Business', 'Freelancing', 'Gift', 'Rental', 'Refund'];
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const TransactionForm = ({ onClose, onSuccess, initialData }) => {
  const [txType, setTxType] = useState('expense');
  
  // 2. State for Dynamic Categories (allows adding new ones)
  const [expenseCats, setExpenseCats] = useState(INITIAL_EXPENSE_CATS);
  const [incomeCats, setIncomeCats] = useState(INITIAL_INCOME_CATS);

  // Default State
  const [formData, setFormData] = useState({ 
    title: '', amount: '', paymentMode: 'Bank', transferTo: 'Cash', 
    category: '', investmentType: 'SIP', profitAmount: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  
  const [customCategory, setCustomCategory] = useState('');
  const [isWithdrawalWithProfit, setIsWithdrawalWithProfit] = useState(false);

  // Set default category based on type change
  useEffect(() => {
    if (!initialData) {
        if (txType === 'expense') setFormData(prev => ({ ...prev, category: expenseCats[0] }));
        else if (txType === 'income') setFormData(prev => ({ ...prev, category: incomeCats[0] }));
    }
  }, [txType]);

  // --- INITIALIZATION ---
  useEffect(() => {
    if (initialData) {
      setTxType(initialData.type);
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      const currentList = initialData.type === 'income' ? INITIAL_INCOME_CATS : INITIAL_EXPENSE_CATS;
      const isStandard = currentList.includes(initialData.category) || INVESTMENT_TYPES.includes(initialData.category);

      let initCategory = initialData.category;
      let initCustom = '';

      // If category is not in our lists, treat as "Other" or add it dynamically?
      // For this UI logic, we set it to "Other" and pre-fill custom, 
      // OR we could push it to the list. Let's stick to the "Other" logic for editing.
      if (!isStandard && initialData.category !== 'Transfer' && initialData.category !== 'Investment') {
          initCategory = 'Other';
          initCustom = initialData.category;
      } else if (!initCategory) {
          initCategory = currentList[0];
      }

      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        paymentMode: initialData.paymentMode || 'Bank',
        transferTo: initialData.type === 'transfer' ? (initialData.transferTo || 'Cash') : 'Cash',
        category: initCategory,
        investmentType: initialData.investmentType || 'SIP',
        date: formattedDate,
        profitAmount: ''
      });
      setCustomCategory(initCustom);
    }
  }, [initialData]);

  // 3. FEATURE: Add Custom Category to List
  const handleAddCategory = () => {
    if (!customCategory.trim()) return;
    
    const newCat = customCategory.trim();
    
    if (txType === 'expense') {
        setExpenseCats([...expenseCats, newCat]);
    } else if (txType === 'income') {
        setIncomeCats([...incomeCats, newCat]);
    }

    setFormData({ ...formData, category: newCat });
    setCustomCategory(''); // Clear input as it's now selected in dropdown
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalDate = formData.date;

    try {
      // WITHDRAWAL LOGIC
      if (txType === 'transfer' && formData.paymentMode === 'Investment' && isWithdrawalWithProfit) {
         // ... (Keep existing withdrawal logic)
         const total = Number(formData.amount);
         const profit = Number(formData.profitAmount);
         const principal = total - profit;

         const transferRes = await API.post('/transactions', {
           title: `Withdrawal: ${formData.title} (Principal)`, amount: principal, type: 'transfer', category: 'Investment', 
           transferTo: formData.transferTo, paymentMode: 'Investment', investmentType: formData.investmentType, date: finalDate
         });
         
         const profitRes = await API.post('/transactions', {
           title: `Profit: ${formData.title}`, amount: profit, type: 'income', category: 'Investment Return', paymentMode: formData.transferTo, date: finalDate
         });
         
         onSuccess([profitRes.data, transferRes.data]);
      } 
      // STANDARD LOGIC
      else {
        let finalCategory = formData.category;
        
        if (txType === 'transfer') {
            if (formData.transferTo === 'Investment') finalCategory = 'Investment';
            else finalCategory = 'Transfer';
        } else if (formData.category === 'Other') {
            finalCategory = customCategory; // Use the typed input if 'Other' is still selected
        }

        let finalInvType = null;
        if (finalCategory === 'Investment' || formData.paymentMode === 'Investment' || INVESTMENT_TYPES.includes(finalCategory)) {
            finalInvType = formData.investmentType;
        }

        const payload = {
          title: formData.title,
          amount: Number(formData.amount),
          type: txType,
          category: finalCategory,
          paymentMode: formData.paymentMode,
          transferTo: txType === 'transfer' ? formData.transferTo : null,
          investmentType: finalInvType,
          date: finalDate
        };

        if (initialData && initialData._id) {
          const res = await API.put(`/transactions/${initialData._id}`, payload);
          onSuccess(res.data, true);
        } else {
          const res = await API.post('/transactions', payload);
          onSuccess(res.data, false);
        }
      }
      onClose();
    } catch (err) { alert("Error saving transaction"); }
  };

  // Helper to get current list
  const getCurrentCategories = () => txType === 'income' ? incomeCats : expenseCats;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in scale-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {initialData ? 'Edit Transaction' : 'New Entry'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Segmented Control for Type */}
          <div className="grid grid-cols-3 gap-1 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            {['expense', 'income', 'transfer'].map(type => (
              <button 
                key={type} 
                type="button" 
                onClick={() => setTxType(type)} 
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  txType === type 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm scale-100' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title Input */}
            <div>
              <label className="label">Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Grocery Shopping"
                className="input-field font-semibold" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              />
            </div>
            
            {/* Amount Input */}
            <div>
              <label className="label">
                Amount {isWithdrawalWithProfit && <span className="text-emerald-500 text-[10px] ml-1">(Total Received)</span>}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number" 
                  required 
                  className="input-field pl-8 font-mono font-bold text-lg" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} 
                />
              </div>
            </div>

            {/* Date (Conditional) */}
            {initialData && (
              <div className="animate-fade-in">
                <label className="label">Date</label>
                <input 
                  type="date" 
                  required 
                  className="input-field" 
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                />
              </div>
            )}

            {/* TRANSFER FIELDS */}
            {txType === 'transfer' && (
              <div className="space-y-5 animate-slide-up">
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                      <div>
                        <label className="label">From</label>
                        <select className="input-field appearance-none" value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}>
                          <option value="Bank">Bank</option>
                          <option value="Cash">Cash</option>
                          <option value="Investment">Invest</option>
                        </select>
                      </div>
                      <div className="pb-3 text-slate-300 dark:text-slate-600"><ArrowRight className="w-5 h-5" /></div>
                      <div>
                        <label className="label">To</label>
                        <select className="input-field appearance-none" value={formData.transferTo} onChange={(e) => setFormData({ ...formData, transferTo: e.target.value })}>
                          <option value="Bank">Bank</option>
                          <option value="Cash">Cash</option>
                          <option value="Investment">Invest</option>
                        </select>
                      </div>
                  </div>

                  {/* Investment Type Selection */}
                  {(formData.transferTo === 'Investment' || formData.paymentMode === 'Investment') && (
                      <div className="animate-fade-in">
                          <label className="label text-blue-600 dark:text-blue-400">Investment Type</label>
                          <select className="input-field border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10" value={formData.investmentType} onChange={(e) => setFormData({...formData, investmentType: e.target.value})}>
                              {INVESTMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                      </div>
                  )}

                  {/* Profit Checkbox */}
                  {formData.paymentMode === 'Investment' && formData.transferTo === 'Bank' && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 animate-fade-in">
                          <label className="flex items-center gap-3 cursor-pointer mb-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isWithdrawalWithProfit ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-emerald-300'}`}>
                                {isWithdrawalWithProfit && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={isWithdrawalWithProfit} onChange={(e) => setIsWithdrawalWithProfit(e.target.checked)} />
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Include Profit?</span>
                          </label>
                          
                          {isWithdrawalWithProfit && (
                            <input 
                              type="number" 
                              placeholder="Profit Amount" 
                              className="input-field border-emerald-200 focus:border-emerald-500 text-emerald-700 placeholder-emerald-700/50" 
                              value={formData.profitAmount} 
                              onChange={(e) => setFormData({...formData, profitAmount: Number(e.target.value)})} 
                            />
                          )}
                      </div>
                  )}
              </div>
            )}

            {/* STANDARD FIELDS (Expense/Income) */}
            {txType !== 'transfer' && (
              <div className="grid grid-cols-2 gap-4 animate-slide-up">
                <div>
                    <label className="label">Category</label>
                    <select className="input-field appearance-none" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      {getCurrentCategories().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      <option value="Other">Other...</option>
                    </select>
                </div>
                <div>
                  <label className="label">Source</label>
                  <select className="input-field appearance-none" value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}>
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Custom Category Input with + Button */}
            {txType !== 'transfer' && formData.category === 'Other' && (
              <div className="animate-fade-in relative">
                 <label className="label">Add New Category</label>
                 <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="e.g. Gym, Netflix..." 
                       required 
                       className="input-field bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 text-blue-700 placeholder-blue-400" 
                       value={customCategory} 
                       onChange={(e) => setCustomCategory(e.target.value)} 
                     />
                     <button 
                        type="button" 
                        onClick={handleAddCategory}
                        disabled={!customCategory.trim()}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                     >
                        <Plus className="w-5 h-5" />
                     </button>
                 </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full mt-4 btn-primary py-4 text-sm uppercase tracking-widest font-black shadow-xl shadow-blue-500/20"
            >
              {initialData ? 'Update Entry' : 'Save Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
