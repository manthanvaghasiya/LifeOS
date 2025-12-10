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
import PortfolioBreakdown from '../components/dashboard/PortfolioBreakdown';

// Match constants exactly across all files
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

  // --- 1. ROBUST BALANCE CALCULATION ---
  const calculateTotalBalance = (mode) => {
    return allTransactions.reduce((acc, t) => {
      const source = t.paymentMode || 'Bank'; 
      const destination = t.transferTo; 
      
      // --- LOGIC FOR BANK & CASH ---
      if (mode === 'Bank' || mode === 'Cash') {
          // Income
          if (source === mode && t.type === 'income') return acc + t.amount;
          
          // Transfer IN
          if (t.type === 'transfer') {
              if (destination === mode) return acc + t.amount;
              // Fallback: Investment withdrawals usually go to Bank if not specified
              if (!destination && source === 'Investment' && mode === 'Bank') return acc + t.amount;
          }

          // Expense
          if (source === mode && t.type === 'expense') return acc - t.amount;

          // Transfer OUT
          if (source === mode && t.type === 'transfer') {
              if (destination === mode) return acc; // Ignore self-transfer
              return acc - t.amount;
          }
      }

      // --- LOGIC FOR INVESTMENT (Total Portfolio Value) ---
      if (mode === 'Investment') {
          const isInvCategory = t.category === 'Investment' || INVESTMENT_TYPES.includes(t.category);
          
          // Add: Money entering Investment
          // 1. Expense categorized as Investment
          if (t.type === 'expense' && isInvCategory) return acc + t.amount;
          // 2. Transfer TO Investment
          if (t.type === 'transfer') {
              if (destination === 'Investment') return acc + t.amount;
              if (!destination && source !== 'Investment' && isInvCategory) return acc + t.amount;
          }

          // Subtract: Money leaving Investment (Withdrawal)
          if (source === 'Investment' && t.type === 'transfer') {
              // Only subtract if it's going out (to Bank/Cash), NOT internal transfer
              if (destination === 'Bank' || destination === 'Cash' || !destination) {
                  return acc - t.amount;
              }
          }
      }
      
      return acc;
    }, 0);
  };

  const bankBalance = calculateTotalBalance('Bank');
  const cashBalance = calculateTotalBalance('Cash');
  const investmentBalance = calculateTotalBalance('Investment');
  const totalNetWorth = bankBalance + cashBalance + investmentBalance;

  // --- 2. MONTHLY STATS ---
  const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  
  // Expenses (Strictly excluding investments)
  const monthlyExpenses = currentMonthTransactions.filter(t => 
    t.type === 'expense' && 
    t.category !== 'Investment' && 
    !INVESTMENT_TYPES.includes(t.category)
  ).reduce((acc, c) => acc + c.amount, 0);

  // --- HANDLERS ---
  const handleExport = () => {
    const csvData = currentMonthTransactions.map(t => ({
      Date: formatDate(t.date), 
      Title: t.title, 
      Category: t.category, 
      Type: t.type.toUpperCase(), 
      Source: t.paymentMode || 'Bank', 
      Amount: t.amount
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); 
    link.href = URL.createObjectURL(blob); 
    link.setAttribute('download', `LifeOS_${formattedMonth}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete transaction?")) return;
    try { await API.delete(`/transactions/${id}`); setAllTransactions(prev => prev.filter(t => t._id !== id)); } catch (err) {}
  };

  const onTransactionSaved = (newData, isUpdate) => {
    setAllTransactions(prev => {
        if (Array.isArray(newData)) {
            return [...newData, ...prev];
        } else if (isUpdate) {
            return prev.map(t => t._id === newData._id ? newData : t);
        } else {
            return [newData, ...prev];
        }
    });
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

        {/* Analytics Section */}
        <div className="space-y-8">
          <div className="min-h-[400px]">
            <FinancialAnalytics transactions={currentMonthTransactions} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Expenses */}
            <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full min-h-[300px]">
              <ExpenseBreakdown transactions={currentMonthTransactions} />
            </div>
            
            {/* Right: Portfolio Breakdown */}
            <PortfolioBreakdown transactions={allTransactions} />
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