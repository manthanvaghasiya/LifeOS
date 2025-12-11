import React, { useState } from 'react';
import API from '../../services/api';
import { X } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Shopping', 'Health', 'Education', 'Investment'];

const QuickSpendModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food', type: 'expense', paymentMode: 'Bank' });
  const [customCategory, setCustomCategory] = useState('');

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
    try {
        const res = await API.post('/transactions', { ...formData, category: finalCategory, date: new Date() });
        if(onSuccess) onSuccess(res.data);
        onClose(); // Close modal on success
    } catch (err) { 
        console.error("Quick Add Error:", err);
        alert('Error adding transaction. Check console.'); 
    }
  };

  return (
    // Z-INDEX UPDATED TO 60
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative border border-gray-100 dark:border-gray-800">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"><X className="w-5 h-5 text-gray-500" /></button>
            <h3 className="font-bold text-2xl mb-1 text-gray-900 dark:text-white">Quick Spend</h3>
            <p className="text-gray-500 text-sm mb-6">Track it before you forget it.</p>
            <form onSubmit={handleQuickAdd} className="space-y-4">
                <input type="text" placeholder="What is it?" required className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="0.00" required className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                    <select className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium appearance-none" value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})}><option value="Bank">Bank</option><option value="Cash">Cash</option></select>
                </div>
                <select className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-black bg-gray-50 dark:bg-gray-800 dark:text-white font-medium appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}<option value="Other">Other</option></select>
                {formData.category === 'Other' && <input type="text" placeholder="Type Category Name" required className="w-full p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 dark:text-blue-300 font-bold" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />}
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 p-4 rounded-2xl font-bold text-sm transition-all ${formData.type === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}>Expense</button>
                    <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 p-4 rounded-2xl font-bold text-sm transition-all ${formData.type === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}>Income</button>
                </div>
                <button type="submit" className="w-full bg-gray-900 dark:bg-white dark:text-black text-white p-4 rounded-2xl font-bold hover:bg-black shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 mt-4">Save Transaction</button>
            </form>
        </div>
    </div>
  );
};

export default QuickSpendModal;