import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import Papa from 'papaparse';
import {
  Plus, Search, Download, Filter, ChevronLeft, ChevronRight, Pencil, Trash2, Save, X,
  TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft, Landmark, Banknote
} from 'lucide-react';
import ExpenseBreakdown from '../components/dashboard/ExpenseBreakdown';
import FinancialAnalytics from '../components/dashboard/FinancialAnalytics';

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Shopping', 'Health', 'Education', 'Investment'];

const Financial = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    paymentMode: 'Bank'   // ✅
  });

  const [customCategory, setCustomCategory] = useState('');
  const [txType, setTxType] = useState('expense');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  // --- CALCULATIONS ---
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  const totalInvested = transactions.filter(t => t.type === 'expense' && t.category === 'Investment').reduce((acc, c) => acc + c.amount, 0);
  const totalExpensesRaw = transactions.filter(t => t.type === 'expense').reduce((acc, c) => acc + c.amount, 0);
  const totalRealExpenses = totalExpensesRaw - totalInvested;
  const balance = totalIncome - totalExpensesRaw;

  // BANK vs CASH BREAKDOWN
  const bankBalance = transactions.reduce((acc, t) => {
    if (t.paymentMode === 'Cash') return acc;
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const cashBalance = transactions.reduce((acc, t) => {
    if (t.paymentMode !== 'Cash') return acc; // Only Count Cash
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const usedCategories = transactions.map(t => t.category);
  const availableCategories = [...new Set([...DEFAULT_CATEGORIES, ...usedCategories])];

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ 1. Decide category
  let finalCategory =
    txType === 'investment'
      ? 'Investment'
      : (formData.category === 'Other' ? customCategory : formData.category);

  // ✅ 2. Decide type
  let finalType = txType === 'investment' ? 'expense' : txType;

  // ✅ 3. CREATE finalData HERE ✅✅✅ (THIS IS THE LINE YOU ASKED ABOUT)
  const finalData = {
    ...formData,
    type: finalType,
    category: finalCategory,
    paymentMode: formData.paymentMode   // KEEP EXACTLY THIS
  };

  try {
    if (editId) {
      const res = await API.put(`/transactions/${editId}`, finalData);
      setTransactions(transactions.map(t => t._id === editId ? res.data : t));
    } else {
      const res = await API.post('/transactions', finalData);
      setTransactions([res.data, ...transactions]);
    }
    closeForm();
  } catch (err) {
    alert("Error saving transaction");
  }
};


  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try { await API.delete(`/transactions/${id}`); setTransactions(transactions.filter(t => t._id !== id)); } catch (err) { }
  };

  const openEdit = (t) => {
    setEditId(t._id);
    const isStandard = availableCategories.includes(t.category);

    setTxType(t.category === 'Investment' ? 'investment' : t.type);

    setFormData({
      title: t.title,
      amount: t.amount,
      category: isStandard ? t.category : 'Other',
      type: t.type,
      // CRITICAL FIX: Read the existing mode, or default to Bank
      paymentMode: t.paymentMode || 'Bank'
    });

    if (!isStandard) setCustomCategory(t.category);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({ title: '', amount: '', category: 'Food', type: 'expense', paymentMode: 'Bank' });
    setTxType('expense');
    setCustomCategory('');
  };

  const handleExport = () => {
    const csvData = transactions.map(t => ({
      Date: formatDate(t.date),
      Title: t.title,
      Category: t.category,
      Type: t.type.toUpperCase(),
      Mode: t.paymentMode,
      Amount: t.amount
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', 'LifeOS_Financials.csv');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const filteredData = transactions
    .filter(t => (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase())) && (filterType === 'all' || t.type === filterType))
    .sort((a, b) => sortOrder === 'newest' ? new Date(b.date) - new Date(a.date) : sortOrder === 'oldest' ? new Date(a.date) - new Date(b.date) : sortOrder === 'highest' ? b.amount - a.amount : a.amount - b.amount);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-10 text-center">Loading Financial Data...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Wallet className="w-8 h-8 text-blue-600" /> Financial Overview</h1><p className="text-sm text-gray-500">Analytics, records, and management.</p></div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition"><Download className="w-4 h-4" /> CSV</button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"><Plus className="w-5 h-5" /> Add New</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL BALANCE SPLIT */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total Net Worth</p>
            <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-xs font-medium text-blue-100">
            <span className="flex items-center gap-1"><Landmark className="w-3 h-3" /> Bank: {formatCurrency(bankBalance)}</span>
            <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> Cash: {formatCurrency(cashBalance)}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm font-medium mb-1">Income</p><h2 className="text-2xl font-bold text-green-600">+ {formatCurrency(totalIncome)}</h2></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm font-medium mb-1">Net Expenses</p><h2 className="text-2xl font-bold text-red-600">- {formatCurrency(totalRealExpenses)}</h2></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm font-medium mb-1">Invested</p><h2 className="text-2xl font-bold text-purple-600">{formatCurrency(totalInvested)}</h2></div><div className="p-2 bg-purple-50 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600" /></div></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-h-[350px]"><FinancialAnalytics transactions={transactions} /></div>
        <div className="lg:col-span-1 min-h-[350px]"><ExpenseBreakdown transactions={transactions} /></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center bg-gray-50/50">
          <div className="relative flex-1 w-full"><Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} /></div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-xl"><Filter className="w-4 h-4 text-gray-500" /><select className="bg-transparent outline-none text-sm font-medium text-gray-600" value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}><option value="all">All</option><option value="income">Income</option><option value="expense">Expense</option></select></div>
            <select className="px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm font-medium text-gray-600 bg-white" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Highest</option><option value="lowest">Lowest</option></select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100"><th className="p-5 font-semibold">Date</th><th className="p-5 font-semibold">Title</th><th className="p-5 font-semibold">Category</th><th className="p-5 font-semibold">Mode</th><th className="p-5 font-semibold">Type</th><th className="p-5 font-semibold">Amount</th><th className="p-5 font-semibold text-center">Actions</th></tr></thead>
            <tbody className="text-sm">
              {paginatedData.map(t => (
                <tr key={t._id} className="border-b border-gray-50 hover:bg-gray-50 transition group">
                  <td className="p-5 text-gray-500">{formatDate(t.date)}</td>
                  <td className="p-5 font-medium text-gray-800">{t.title}</td>
                  <td className="p-5"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">{t.category}</span></td>

                  {/* NEW: Payment Mode Column */}
                  <td className="p-5">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border ${t.paymentMode === 'Cash' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {t.paymentMode === 'Cash' ? <Banknote className="w-3 h-3" /> : <Landmark className="w-3 h-3" />}
                      {t.paymentMode || 'Bank'}
                    </span>
                  </td>

                  <td className="p-5">{t.category === 'Investment' ? <span className="flex items-center gap-1 text-purple-600 font-bold text-xs"><TrendingUp className="w-3 h-3" /> Invest</span> : <span className={`text-xs font-bold uppercase ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{t.type}</span>}</td>
                  <td className="p-5"><span className={`flex items-center gap-1 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}{formatCurrency(t.amount)}</span></td>
                  <td className="p-5 text-center"><div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openEdit(t)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(t._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
              {paginatedData.length === 0 && <tr><td colSpan="7" className="p-10 text-center text-gray-400">No transactions found.</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (<div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button><span className="text-sm text-gray-600 font-medium">Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button></div>)}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button onClick={closeForm} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-1 text-gray-800">{editId ? 'Edit Transaction' : 'New Transaction'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div><label className="block text-xs font-bold text-gray-600 uppercase mb-1">Title</label><input type="text" required className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Grocery Shopping" /></div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-600 uppercase mb-1">Amount</label><input type="number" required className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} placeholder="0.00" /></div>

                {/* NEW: PAYMENT MODE SELECTOR */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Source</label>
                  <select
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  >
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                  </select>


                </div>
              </div>

              <div><label className="block text-xs font-bold text-gray-600 uppercase mb-1">Type</label><select className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={txType} onChange={(e) => setTxType(e.target.value)}><option value="income">Income</option><option value="expense">Expense</option><option value="investment">Investment</option></select></div>

              {txType !== 'investment' && (<div><label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label><select className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>{availableCategories.filter(c => c !== 'Investment').map(cat => <option key={cat} value={cat}>{cat}</option>)}<option value="Other">Other (Custom)</option></select>{formData.category === 'Other' && <input type="text" placeholder="Type custom category..." required className="w-full p-3 border border-blue-200 bg-blue-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-blue-800" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />}</div>)}
              <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-xl flex justify-center items-center gap-2 mt-2">{editId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />} {editId ? 'Update Transaction' : 'Save Transaction'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Financial;