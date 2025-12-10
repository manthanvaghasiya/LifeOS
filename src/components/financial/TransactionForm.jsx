import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { X } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Shopping', 'Health', 'Education', 'Investment'];
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const TransactionForm = ({ onClose, onSuccess, initialData }) => {
  const [txType, setTxType] = useState('expense');
  
  const [formData, setFormData] = useState({ 
    title: '', amount: '', paymentMode: 'Bank', transferTo: 'Cash', 
    category: 'Food', investmentType: 'SIP', profitAmount: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  
  const [customCategory, setCustomCategory] = useState('');
  const [isWithdrawalWithProfit, setIsWithdrawalWithProfit] = useState(false);

  // Initialize form
  useEffect(() => {
    if (initialData) {
      setTxType(initialData.type);
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '';
      setFormData({
        ...initialData,
        date: formattedDate,
        profitAmount: ''
      });
      // Handle Custom Category
      if (!DEFAULT_CATEGORIES.includes(initialData.category) && !INVESTMENT_TYPES.includes(initialData.category) && initialData.category !== 'Transfer') {
          setCustomCategory(initialData.category);
      }
    }
  }, [initialData]);

  // Helper to check if Investment is involved in Transfer
  const isInvestmentTransfer = txType === 'transfer' && (formData.paymentMode === 'Investment' || formData.transferTo === 'Investment');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalDate = formData.date ? new Date(formData.date) : new Date();
    
    // LOGIC: Determine Category based on Context
    let finalCategory;
    if (txType === 'transfer') {
        // If Investment involved, Category = Selected Investment Type (e.g. SIP)
        if (isInvestmentTransfer) {
            finalCategory = formData.category; // User selected "SIP" or "IPO"
        } else {
            finalCategory = 'Transfer'; // Standard Bank<->Cash
        }
    } else {
        // Normal Income/Expense
        finalCategory = formData.category === 'Other' ? customCategory : formData.category;
    }

    try {
      // 1. WITHDRAWAL WITH PROFIT LOGIC
      if (txType === 'transfer' && formData.paymentMode === 'Investment' && isWithdrawalWithProfit) {
        const total = Number(formData.amount);
        const profit = Number(formData.profitAmount);
        const principal = total - profit;

        const transferRes = await API.post('/transactions', {
          title: `Withdrawal: ${formData.title} (Principal)`, amount: principal, type: 'transfer', 
          category: finalCategory, // e.g. "IPO"
          paymentMode: 'Investment', investmentType: finalCategory, date: finalDate
        });
        const profitRes = await API.post('/transactions', {
          title: `Profit: ${formData.title}`, amount: profit, type: 'income', 
          category: 'Investment Return', paymentMode: formData.transferTo, date: finalDate
        });
        onSuccess([profitRes.data, transferRes.data]);
      } 
      // 2. STANDARD LOGIC
      else {
        // Determine Investment Type field
        let finalInvType = null;
        // If Category is an Investment Type (e.g. SIP), set invType to SIP
        if (INVESTMENT_TYPES.includes(finalCategory)) {
            finalInvType = finalCategory;
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
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"><X className="w-5 h-5 text-gray-500" /></button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{initialData ? 'Edit' : 'New'} Transaction</h2>
        
        {/* Type Toggles */}
        <div className="flex gap-2 mb-6 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          {['expense', 'income', 'transfer'].map(type => (
            <button key={type} type="button" onClick={() => setTxType(type)} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${txType === type ? 'bg-white dark:bg-gray-700 shadow-lg text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>{type}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Title</label><input type="text" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black/5 font-bold text-gray-800 dark:text-white" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
          
          {/* Amount */}
          <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Amount {isWithdrawalWithProfit && "(Total)"}</label><input type="number" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black/5 font-bold text-gray-800 dark:text-white" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} /></div>

          {/* Date (Only on Edit) */}
          {initialData && (
            <div className="animate-fadeIn"><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Date</label><input type="date" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black/5 font-bold text-gray-800 dark:text-white cursor-pointer" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
          )}

          {/* Profit Split (Withdrawals) */}
          {txType === 'transfer' && formData.paymentMode === 'Investment' && formData.transferTo === 'Bank' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800">
              <div className="flex items-center justify-between mb-2"><label className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">Include Profit?</label><input type="checkbox" className="w-5 h-5 accent-green-600 cursor-pointer" checked={isWithdrawalWithProfit} onChange={(e) => setIsWithdrawalWithProfit(e.target.checked)} /></div>
              {isWithdrawalWithProfit && <input type="number" placeholder="Profit Amount" className="w-full p-3 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-700 rounded-xl outline-none font-bold text-green-700 dark:text-green-400" value={formData.profitAmount} onChange={(e) => setFormData({...formData, profitAmount: Number(e.target.value)})} />}
            </div>
          )}

          {/* TRANSFER LOGIC */}
          {txType === 'transfer' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">From</label><select className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none font-bold text-gray-700 dark:text-gray-300" value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}><option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Investment">Investment</option></select></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">To</label><select className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none font-bold text-gray-700 dark:text-gray-300" value={formData.transferTo} onChange={(e) => setFormData({ ...formData, transferTo: e.target.value })}><option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Investment">Investment</option></select></div>
              </div>
              
              {/* SMART CATEGORY: Only Show if Investment Involved */}
              {isInvestmentTransfer && (
                <div className="mt-4 animate-fadeIn">
                    <label className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase ml-1 mb-1 block">Investment Category</label>
                    <select className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 border-none rounded-2xl outline-none font-bold text-purple-700 dark:text-purple-300" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        {INVESTMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
              )}
            </>
          ) : (
            // INCOME / EXPENSE LOGIC
            <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Category</label>
                  <select className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none font-bold text-gray-700 dark:text-gray-300" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <optgroup label="Investments">{INVESTMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</optgroup>
                    <option value="Other">Other</option>
                  </select>
              </div>
              <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Source</label><select className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none font-bold text-gray-700 dark:text-gray-300" value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}><option value="Bank">Bank</option><option value="Cash">Cash</option></select></div>
            </div>
          )}
          
          {/* Custom Category Input (Only for non-transfer) */}
          {txType !== 'transfer' && formData.category === 'Other' && <input type="text" placeholder="Type category name..." required className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 font-bold border-none rounded-2xl outline-none animate-fadeIn" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />}
          
          <button type="submit" className="w-full bg-gray-900 dark:bg-white dark:text-black text-white p-4 rounded-2xl font-bold hover:bg-black dark:hover:bg-gray-200 shadow-xl mt-2 transition-transform transform hover:-translate-y-1">
            {initialData ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;