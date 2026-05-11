// src/components/financial/TransactionForm.jsx

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import useCategories from '../../hooks/useCategories';
import {
  X, ArrowRight, Wallet, CreditCard, Calendar,
  Tag, Plus, Check, Banknote, Building2, TrendingUp
} from 'lucide-react';

const TransactionForm = ({ onClose, onSuccess, initialData }) => {
  const [txType, setTxType] = useState('expense');
  const { expenseCategories, incomeCategories, investmentTypes, bankAccounts, addCategory, addInvestmentType, addBankAccount } = useCategories();

  // Form State
  const [formData, setFormData] = useState({ 
    title: '', amount: '', paymentMode: 'Bank', transferTo: 'Cash', 
    category: '', investmentType: 'SIP', profitAmount: '', 
    bankAccountName: 'Primary Bank', transferToAccountName: 'Primary Bank',
    date: new Date().toISOString().split('T')[0] 
  });
  
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isWithdrawalWithProfit, setIsWithdrawalWithProfit] = useState(false);
  const [isAddingInv, setIsAddingInv] = useState(false);
  const [customInv, setCustomInv] = useState('');
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [customBank, setCustomBank] = useState('');

  // --- 1. SMART COLOR THEME ---
  const getThemeColor = () => {
    if (txType === 'income') return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-emerald-200 dark:ring-emerald-800';
    if (txType === 'transfer') return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-blue-200 dark:ring-blue-800';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 ring-rose-200 dark:ring-rose-800';
  };

  const getButtonColor = () => {
    if (txType === 'income') return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20';
    if (txType === 'transfer') return 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20';
    return 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 shadow-slate-500/20 text-white dark:text-slate-900';
  };

  // --- 2. INITIALIZATION & LOGIC ---
  useEffect(() => {
    // Set default category when type switches
    if (!initialData) {
      if (txType === 'expense' && !formData.category && expenseCategories.length > 0) {
        setFormData(prev => ({ ...prev, category: expenseCategories[0] }));
      } else if (txType === 'income' && !formData.category && incomeCategories.length > 0) {
        setFormData(prev => ({ ...prev, category: incomeCategories[0] }));
      }
    }

    // Ensure transferTo is always set for transfers
    if (txType === 'transfer' && !formData.transferTo) {
      setFormData(prev => ({ ...prev, transferTo: prev.transferTo || 'Cash' }));
    }
  }, [txType, expenseCategories, incomeCategories]);

  useEffect(() => {
    if (initialData) {
      setTxType(initialData.type);
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        paymentMode: initialData.paymentMode || 'Bank',
        bankAccountName: initialData.bankAccountName || (bankAccounts.length > 0 ? bankAccounts[0] : 'Primary Bank'),
        transferTo: initialData.type === 'transfer' ? (initialData.transferTo || 'Cash') : 'Cash',
        transferToAccountName: initialData.transferToAccountName || (bankAccounts.length > 0 ? bankAccounts[0] : 'Primary Bank'),
        category: initialData.category || 'Other',
        investmentType: initialData.investmentType || 'SIP',
        date: formattedDate,
        profitAmount: ''
      });
    }
  }, [initialData]);

  const handleAddInvestment = async () => {
    if (!customInv.trim()) return;
    const newType = customInv.trim();

    await addInvestmentType(newType);
    setFormData({ ...formData, investmentType: newType });
    setCustomInv('');
    setIsAddingInv(false);
  };

  const handleAddBank = async () => {
    if (!customBank.trim()) return;
    const newBank = customBank.trim();

    await addBankAccount(newBank);
    setFormData(prev => ({ 
      ...prev, 
      bankAccountName: newBank, 
      transferToAccountName: newBank 
    }));
    setCustomBank('');
    setIsAddingBank(false);
  };

  const handleAddCategory = async () => {
    if (!customCategory.trim()) return;
    const newCat = customCategory.trim();

    await addCategory(txType, newCat);
    setFormData({ ...formData, category: newCat });
    setCustomCategory('');
    setIsAddingCat(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.amount) return;

    try {
      let finalCategory = formData.category;
      
      // ... logic for withdrawals ...
      if (txType === 'transfer' && formData.paymentMode === 'Investment' && isWithdrawalWithProfit) {
         const total = Number(formData.amount);
         const profit = Number(formData.profitAmount);
         const principal = total - profit;
         
         const transferRes = await API.post('/transactions', {
           title: `Withdrawal: ${formData.title} (Principal)`, amount: principal, type: 'transfer', category: 'Investment', 
           transferTo: formData.transferTo, paymentMode: 'Investment', investmentType: formData.investmentType, date: formData.date
         });
         const profitRes = await API.post('/transactions', {
           title: `Profit: ${formData.title}`, amount: profit, type: 'income', category: 'Investment Return', paymentMode: formData.transferTo, date: formData.date
         });
         onSuccess([profitRes.data, transferRes.data]);
         onClose();
         return;
      }

      // Standard Logic
      if (txType === 'transfer') {
          if (formData.transferTo === 'Investment') finalCategory = 'Investment';
          else finalCategory = 'Transfer';
      }

      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        type: txType,
        category: finalCategory,
        paymentMode: formData.paymentMode,
        bankAccountName: formData.paymentMode === 'Bank' ? formData.bankAccountName : null,
        transferTo: txType === 'transfer' ? (formData.transferTo || 'Cash') : null,
        transferToAccountName: (txType === 'transfer' && formData.transferTo === 'Bank') ? formData.transferToAccountName : null,
        investmentType: (finalCategory === 'Investment' || formData.paymentMode === 'Investment') ? formData.investmentType : null,
        date: formData.date
      };

      if (initialData && initialData._id) {
        const res = await API.put(`/transactions/${initialData._id}`, payload);
        onSuccess(res.data, true);
      } else {
        const res = await API.post('/transactions', payload);
        onSuccess(res.data, false);
      }
      onClose();
    } catch (err) { alert("Error saving transaction"); }
  };

  const currentCategories = txType === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Main Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] animate-slide-up sm:animate-zoom-in overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* HEADER: Type Switcher */}
        <div className="pt-6 px-6 pb-2 shrink-0 bg-white dark:bg-slate-900 z-10">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                 {initialData ? 'Edit Entry' : 'New Transaction'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                 <X className="w-5 h-5" />
              </button>
           </div>

           {/* Type Tabs */}
           <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              {['expense', 'income', 'transfer'].map(type => (
                <button 
                  key={type}
                  onClick={() => setTxType(type)}
                  className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    txType === type 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
           </div>
        </div>

        {/* SCROLLABLE FORM */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

            {/* 1. AMOUNT INPUT */}
            <div className="text-center space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</label>
               <div className={`relative inline-flex items-center justify-center`}>
                  <span className={`text-4xl font-bold mr-2 ${txType === 'expense' ? 'text-slate-300' : (txType === 'income' ? 'text-emerald-300' : 'text-blue-300')}`}>₹</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    autoFocus
                    className={`w-48 bg-transparent text-5xl font-black text-center outline-none placeholder-slate-200 dark:placeholder-slate-800 ${
                       txType === 'expense' ? 'text-slate-900 dark:text-white' : 
                       (txType === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400')
                    }`}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
               </div>
            </div>

            {/* 2. TITLE & DATE */}
            <div className="grid grid-cols-[1fr,auto] gap-3">
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                     <Tag className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="What is this for?" 
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
               </div>
               <div className="relative">
                  <input 
                    type="date" 
                    className="h-full pl-4 pr-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold text-xs text-slate-600 dark:text-slate-400 outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
               </div>
            </div>

            {/* 3. CATEGORY SELECTION (Only for Income/Expense) */}
            {txType !== 'transfer' && (
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                     <button onClick={() => setIsAddingCat(!isAddingCat)} className="text-xs font-bold text-blue-500 hover:text-blue-600 transition">+ Custom</button>
                  </div>
                  
                  {isAddingCat && (
                     <div className="flex gap-2 animate-fade-in mb-2">
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="New Category Name" 
                          className="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm font-bold text-blue-700 dark:text-blue-300 outline-none"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                        />
                        <button onClick={handleAddCategory} className="p-2 bg-blue-600 text-white rounded-xl">
                           <Check className="w-4 h-4" />
                        </button>
                     </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                     {currentCategories.map(cat => (
                        <button 
                           key={cat}
                           type="button"
                           onClick={() => setFormData({ ...formData, category: cat })}
                           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                              formData.category === cat 
                                ? getThemeColor() + ' border-transparent shadow-sm scale-105' 
                                : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                           }`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
               </div>
            )}

            {/* 4. PAYMENT MODE (Toggle Switch) */}
            {txType !== 'transfer' && (
               <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Mode</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
                     {['Bank', 'Cash'].map(mode => (
                        <button
                           key={mode}
                           type="button"
                           onClick={() => setFormData({ ...formData, paymentMode: mode })}
                           className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                              formData.paymentMode === mode 
                              ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                              : 'text-slate-400 hover:text-slate-600'
                           }`}
                        >
                           {mode === 'Bank' ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                           {mode}
                        </button>
                     ))}
                  </div>
                  {formData.paymentMode === 'Bank' && (
                     <div className="mt-3 space-y-3 animate-fade-in bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Bank</label>
                           <button type="button" onClick={() => setIsAddingBank(!isAddingBank)} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-200 dark:hover:bg-blue-800 transition">+ ADD BANK ACCOUNT</button>
                        </div>
                        {isAddingBank && (
                           <div className="flex gap-2 mb-3">
                              <input autoFocus type="text" placeholder="Enter Bank Name..." className="flex-1 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm font-bold text-blue-800 dark:text-blue-200 outline-none focus:ring-2 focus:ring-blue-500/50" value={customBank} onChange={(e) => setCustomBank(e.target.value)} />
                              <button type="button" onClick={handleAddBank} className="px-4 bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl"><Check className="w-5 h-5" /></button>
                           </div>
                        )}
                        <select className="w-full p-2.5 bg-white dark:bg-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-600" value={formData.bankAccountName} onChange={(e) => setFormData({...formData, bankAccountName: e.target.value})}>
                           {bankAccounts.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                        </select>
                     </div>
                  )}
               </div>
            )}

            {/* 5. TRANSFER SPECIFIC UI */}
            {txType === 'transfer' && (
               <div className="space-y-6 animate-fade-in">
                  
                  {/* From -> To Visual Flow */}
                  <div className="flex items-start gap-4">
                     <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">From</label>
                        <select 
                           className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none"
                           value={formData.paymentMode}
                           onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                        >
                           <option value="Bank">Bank</option>
                           <option value="Cash">Cash</option>
                           <option value="Investment">Investment</option>
                        </select>
                        {formData.paymentMode === 'Bank' && (
                           <div className="mt-2 animate-fade-in">
                              <select className="w-full p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 outline-none" value={formData.bankAccountName} onChange={(e) => setFormData({...formData, bankAccountName: e.target.value})}>
                                 {bankAccounts.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                              </select>
                           </div>
                        )}
                     </div>
                     <div className="pt-3 text-slate-300"><ArrowRight className="w-5 h-5" /></div>
                     <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">To</label>
                        <select 
                           className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none"
                           value={formData.transferTo}
                           onChange={(e) => setFormData({...formData, transferTo: e.target.value})}
                        >
                           <option value="Bank">Bank</option>
                           <option value="Cash">Cash</option>
                           <option value="Investment">Investment</option>
                        </select>
                        {formData.transferTo === 'Bank' && (
                           <div className="mt-2 animate-fade-in">
                              <select className="w-full p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 outline-none" value={formData.transferToAccountName} onChange={(e) => setFormData({...formData, transferToAccountName: e.target.value})}>
                                 {bankAccounts.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                              </select>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Investment Type Selector */}
                  {(formData.transferTo === 'Investment' || formData.paymentMode === 'Investment') && (
                     <div className="space-y-3 animate-slide-up">
                        
                        {/* Header with Custom Button */}
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-blue-500 uppercase tracking-widest">Investment Type</label>
                            <button 
                                onClick={() => setIsAddingInv(!isAddingInv)} 
                                className="text-xs font-bold text-blue-500 hover:text-blue-600 transition"
                            >
                                + Custom
                            </button>
                        </div>

                        {/* Custom Input Field */}
                        {isAddingInv && (
                            <div className="flex gap-2 animate-fade-in mb-2">
                                <input 
                                autoFocus
                                type="text" 
                                placeholder="e.g. Real Estate" 
                                className="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm font-bold text-blue-700 dark:text-blue-300 outline-none"
                                value={customInv}
                                onChange={(e) => setCustomInv(e.target.value)}
                                />
                                <button onClick={handleAddInvestment} className="p-2 bg-blue-600 text-white rounded-xl">
                                <Check className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Selection List - Uses State Now */}
                        <div className="flex flex-wrap gap-2">
                           {investmentTypes.map(type => (
                              <button 
                                 key={type}
                                 type="button"
                                 onClick={() => setFormData({ ...formData, investmentType: type })}
                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                    formData.investmentType === type 
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm scale-105' 
                                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                 }`}
                              >
                                 {type}
                              </button>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Profit Logic */}
                  {formData.paymentMode === 'Investment' && formData.transferTo === 'Bank' && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 animate-fade-in">
                          <label className="flex items-center gap-3 cursor-pointer mb-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isWithdrawalWithProfit ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-emerald-300'}`}>
                                {isWithdrawalWithProfit && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={isWithdrawalWithProfit} onChange={(e) => setIsWithdrawalWithProfit(e.target.checked)} />
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Include Profit?</span>
                          </label>
                          {isWithdrawalWithProfit && (
                            <input 
                              type="number" 
                              placeholder="Profit Amount" 
                              className="w-full p-3 rounded-xl border border-emerald-200 focus:border-emerald-500 text-emerald-700 outline-none font-bold" 
                              value={formData.profitAmount} 
                              onChange={(e) => setFormData({...formData, profitAmount: Number(e.target.value)})} 
                            />
                          )}
                      </div>
                  )}
               </div>
            )}

        </div>

        {/* FOOTER */}
        <div className="p-6 pt-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
           <button 
             onClick={handleSubmit}
             disabled={!formData.amount}
             className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all transform active:scale-95 ${getButtonColor()} ${!formData.amount ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
              {initialData ? 'Update Transaction' : 'Save Transaction'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionForm;