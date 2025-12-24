import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { X, ArrowRight, Wallet, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Shopping', 'Health', 'Education', 'Investment'];
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const TransactionForm = ({ onClose, onSuccess, initialData }) => {
  const [txType, setTxType] = useState('expense');
  
  // Default State
  const [formData, setFormData] = useState({ 
    title: '', amount: '', paymentMode: 'Bank', transferTo: 'Cash', 
    category: 'Food', investmentType: 'SIP', profitAmount: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  
  const [customCategory, setCustomCategory] = useState('');
  const [isWithdrawalWithProfit, setIsWithdrawalWithProfit] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    if (initialData) {
      setTxType(initialData.type);
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        paymentMode: initialData.paymentMode || 'Bank',
        transferTo: initialData.type === 'transfer' ? (initialData.transferTo || 'Cash') : 'Cash',
        category: initialData.category || 'Food',
        investmentType: initialData.investmentType || 'SIP',
        date: formattedDate,
        profitAmount: ''
      });

      const isStandard = DEFAULT_CATEGORIES.includes(initialData.category) || INVESTMENT_TYPES.includes(initialData.category);
      if (!isStandard && initialData.category !== 'Transfer' && initialData.category !== 'Investment') {
          setCustomCategory(initialData.category);
          setFormData(prev => ({ ...prev, category: 'Other' }));
      }
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalDate = formData.date;

    try {
      // 1. WITHDRAWAL LOGIC
      if (txType === 'transfer' && formData.paymentMode === 'Investment' && isWithdrawalWithProfit) {
        const total = Number(formData.amount);
        const profit = Number(formData.profitAmount);
        const principal = total - profit;

        const transferRes = await API.post('/transactions', {
          title: `Withdrawal: ${formData.title} (Principal)`, 
          amount: principal, 
          type: 'transfer', 
          category: 'Investment', 
          transferTo: formData.transferTo, 
          paymentMode: 'Investment', 
          investmentType: formData.investmentType, 
          date: finalDate
        });
        
        const profitRes = await API.post('/transactions', {
          title: `Profit: ${formData.title}`, 
          amount: profit, 
          type: 'income', 
          category: 'Investment Return', 
          paymentMode: formData.transferTo, 
          date: finalDate
        });
        
        onSuccess([profitRes.data, transferRes.data]);
      } 
      // 2. STANDARD LOGIC
      else {
        let finalCategory = formData.category;
        
        if (txType === 'transfer') {
            if (formData.transferTo === 'Investment') finalCategory = 'Investment';
            else finalCategory = 'Transfer';
        } else if (formData.category === 'Other') {
            finalCategory = customCategory;
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

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in scale-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Transaction' : 'New Transaction'}
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
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            {['expense', 'income', 'transfer'].map(type => (
              <button 
                key={type} 
                type="button" 
                onClick={() => setTxType(type)} 
                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                  txType === type 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
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
                          <label className="label text-indigo-600 dark:text-indigo-400">Investment Type</label>
                          <select className="input-field border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10" value={formData.investmentType} onChange={(e) => setFormData({...formData, investmentType: e.target.value})}>
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

            {/* STANDARD FIELDS */}
            {txType !== 'transfer' && (
              <div className="grid grid-cols-2 gap-4 animate-slide-up">
                <div>
                    <label className="label">Category</label>
                    <select className="input-field appearance-none" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      {DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
            
            {txType !== 'transfer' && formData.category === 'Other' && (
              <div className="animate-fade-in">
                 <input 
                   type="text" 
                   placeholder="Enter category name..." 
                   required 
                   className="input-field bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 text-indigo-700 placeholder-indigo-400" 
                   value={customCategory} 
                   onChange={(e) => setCustomCategory(e.target.value)} 
                 />
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full mt-4 btn-primary py-3.5 text-base shadow-lg shadow-indigo-500/20"
            >
              {initialData ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;