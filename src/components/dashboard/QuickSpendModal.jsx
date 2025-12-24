import React, { useState } from 'react';
import API from '../../services/api';
import { X, Zap } from 'lucide-react';

const QuickSpendModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    paymentMode: 'Bank',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.title) return;

    try {
      const res = await API.post('/transactions', {
        ...formData,
        amount: Number(formData.amount),
        type: 'expense', // Default to expense for quick spend
        transferTo: null
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      alert("Failed to add transaction");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative scale-100 animate-slide-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600">
                <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Spend</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="label">Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input 
                        type="number" 
                        required 
                        autoFocus
                        className="input-field pl-9 text-lg font-bold" 
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <label className="label">What was it?</label>
                <input 
                    type="text" 
                    required 
                    className="input-field font-semibold" 
                    placeholder="e.g. Coffee"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="label">Category</label>
                    <select 
                        className="input-field appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        {['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label">Paid Via</label>
                    <select 
                        className="input-field appearance-none"
                        value={formData.paymentMode}
                        onChange={e => setFormData({...formData, paymentMode: e.target.value})}
                    >
                        <option value="Bank">Bank (UPI)</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3 mt-2 shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700">
                Log Expense
            </button>
        </form>
      </div>
    </div>
  );
};

export default QuickSpendModal;