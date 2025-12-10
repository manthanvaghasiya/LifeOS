import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Papa from 'papaparse';
import { formatCurrency, formatDate } from '../utils/helpers';
import FinancialHeader from '../components/financial/FinancialHeader';
import FinancialSummary from '../components/financial/FinancialSummary';
import TransactionTable from '../components/financial/TransactionTable';
import TransactionForm from '../components/financial/TransactionForm';
import FinancialAnalytics from '../components/dashboard/FinancialAnalytics';
import ExpenseBreakdown from '../components/dashboard/ExpenseBreakdown';
import { Briefcase, PieChart } from 'lucide-react';

const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const Financial = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  
  // Modal State
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setAllTransactions(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  // --- DATA FILTERING ---
  const currentMonthTransactions = allTransactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === viewDate.getMonth() && tDate.getFullYear() === viewDate.getFullYear();
  });

  const formattedMonth = viewDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });

  // --- 1. TOTAL BALANCES (Lifetime) ---
  const calculateTotalBalance = (mode) => {
    return allTransactions.reduce((acc, t) => {
      const tMode = t.paymentMode || 'Bank'; 
      
      // Money In
      if (tMode === mode && t.type === 'income') return acc + t.amount;
      // Transfer In (e.g. Bank -> Cash, Cash is mode)
      if (t.type === 'transfer' && (t.category === mode || t.transferTo === mode)) return acc + t.amount; 
      // Specific Investment Case: If mode is Investment, check if category is an investment type
      if (mode === 'Investment' && t.type === 'transfer' && (t.category === 'Investment' || INVESTMENT_TYPES.includes(t.category))) return acc + t.amount;

      // Money Out
      if (tMode === mode && t.type === 'expense') return acc - t.amount;
      if (tMode === mode && t.type === 'transfer') return acc - t.amount; 
      
      return acc;
    }, 0);
  };
  const bankBalance = calculateTotalBalance('Bank');
  const cashBalance = calculateTotalBalance('Cash');
  const investmentBalance = calculateTotalBalance('Investment');
  const totalNetWorth = bankBalance + cashBalance + investmentBalance;

  // --- 2. MONTHLY STATS ---
  const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  const monthlyExpenses = currentMonthTransactions.filter(t => t.type === 'expense' && t.category !== 'Investment' && !INVESTMENT_TYPES.includes(t.category)).reduce((acc, c) => acc + c.amount, 0);

  // --- 3. PORTFOLIO BREAKDOWN (FIXED LOGIC) ---
  const investmentBreakdown = INVESTMENT_TYPES.map(type => {
    const total = allTransactions.reduce((acc, t) => {
      // Check if this transaction matches the specific investment type (e.g., "SIP")
      const isMatchType = t.investmentType === type || t.category === type;

      if (isMatchType) {
        // ADD: Money going INTO investment
        if (t.type === 'expense' || (t.type === 'transfer' && t.paymentMode !== 'Investment')) {
            return acc + t.amount;
        }
        // SUBTRACT: Money coming OUT of investment
        if (t.type === 'transfer' && t.paymentMode === 'Investment') {
            return acc - t.amount;
        }
      }
      return acc;
    }, 0);
    return { type, total };
  }).filter(i => i.total > 0).sort((a, b) => b.total - a.total);

  // --- HANDLERS ---
  const handleExport = () => {
    const csvData = currentMonthTransactions.map(t => ({
      Date: formatDate(t.date), Title: t.title, Category: t.category, Type: t.type.toUpperCase(), Source: t.paymentMode || 'Bank', Amount: t.amount
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', `LifeOS_${formattedMonth}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete transaction?")) return;
    try { await API.delete(`/transactions/${id}`); setAllTransactions(allTransactions.filter(t => t._id !== id)); } catch (err) {}
  };

  const onTransactionSaved = (newData, isUpdate) => {
    if (Array.isArray(newData)) {
      setAllTransactions([...newData, ...allTransactions]); 
    } else if (isUpdate) {
      setAllTransactions(allTransactions.map(t => t._id === newData._id ? newData : t));
    } else {
      setAllTransactions([newData, ...allTransactions]);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading your finances...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/20 p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
        
        <FinancialHeader 
          viewDate={viewDate} 
          setViewDate={setViewDate} 
          onExport={handleExport} 
          onAdd={() => { setEditData(null); setShowForm(true); }} 
        />

        <FinancialSummary 
          totalNetWorth={totalNetWorth} 
          bankBalance={bankBalance} 
          cashBalance={cashBalance} 
          monthlyIncome={monthlyIncome} 
          monthlyExpenses={monthlyExpenses} 
          investmentBalance={investmentBalance} 
          monthLabel={formattedMonth} 
        />

        {/* Charts Section */}
        <div className="space-y-8">
          <div className="min-h-[400px]">
            <FinancialAnalytics transactions={currentMonthTransactions} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full min-h-[300px]">
              <ExpenseBreakdown transactions={currentMonthTransactions} />
            </div>
            
            {/* PORTFOLIO GRAPH */}
            <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full min-h-[300px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400"><Briefcase className="w-5 h-5" /></div>
                <h3 className="font-bold text-gray-900 dark:text-white">Portfolio Breakdown</h3>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] no-scrollbar">
                {investmentBreakdown.length > 0 ? investmentBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${index % 2 === 0 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                        <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{item.type}</span>
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white text-sm">{formatCurrency(item.total)}</span>
                  </div>
                )) : (
                    <div className="text-center text-gray-400 py-10 text-sm flex flex-col items-center">
                        <PieChart className="w-10 h-10 mb-3 opacity-20" />
                        No active investments.
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <TransactionTable 
          transactions={currentMonthTransactions} 
          onEdit={(t) => { setEditData(t); setShowForm(true); }} 
          onDelete={handleDelete} 
          monthLabel={formattedMonth} 
        />

        {showForm && (
          <TransactionForm 
            onClose={() => setShowForm(false)} 
            onSuccess={onTransactionSaved} 
            initialData={editData} 
          />
        )}

      </div>
    </div>
  );
};

export default Financial;