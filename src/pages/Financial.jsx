import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Papa from 'papaparse';
import { formatCurrency, formatDate } from '../utils/helpers';
// 1. IMPORT TOAST HOOK
import { useToast } from '../context/ToastContext';

import FinancialHeader from '../components/financial/FinancialHeader';
import FinancialSummary from '../components/financial/FinancialSummary';
import TransactionTable from '../components/financial/TransactionTable';
import TransactionForm from '../components/financial/TransactionForm';
import FinancialAnalytics from '../components/dashboard/FinancialAnalytics';
import ExpenseBreakdown from '../components/dashboard/ExpenseBreakdown';
import PortfolioBreakdown from '../components/dashboard/PortfolioBreakdown';
import useCategories from '../hooks/useCategories';

// Match constants exactly across all files
const INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];

const Financial = () => {
  // 2. INITIALIZE TOAST
  const toast = useToast();

  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  
  // Custom categories for bank logic
  const { categories } = useCategories();
  const defaultBank = categories.bankAccounts?.length > 0 ? categories.bankAccounts[0] : 'Primary Bank';
  
  // Modal State
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setAllTransactions(res.data);
      setLoading(false);
    } catch (err) { 
      console.error(err); 
      setLoading(false);
      // Optional: Notify user if data fails to load
      toast.error("Failed to load financial data.");
    }
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
      const destination = t.transferTo || null;

      // --- LOGIC FOR BANK & CASH ---
      if (mode === 'Bank' || mode === 'Cash') {
          // Income: money coming in
          if (source === mode && t.type === 'income') return acc + t.amount;

          // Transfer IN: money being transferred to this account (but not self-transfer)
          if (t.type === 'transfer' && destination === mode && source !== mode) return acc + t.amount;

          // Special case: Investment withdrawal without specified destination defaults to Bank
          if (t.type === 'transfer' && !destination && source === 'Investment' && mode === 'Bank') return acc + t.amount;

          // Expense: money going out
          if (source === mode && t.type === 'expense') return acc - t.amount;

          // Transfer OUT: money being transferred from this account (but not self-transfer)
          if (source === mode && t.type === 'transfer' && destination !== mode) return acc - t.amount;
      }

      // --- LOGIC FOR INVESTMENT (Total Portfolio Value) ---
      if (mode === 'Investment') {
          const isInvCategory = t.category === 'Investment' || INVESTMENT_TYPES.includes(t.category);

          // Add: Money entering Investment
          // 1. Expense categorized as Investment
          if (t.type === 'expense' && isInvCategory) return acc + t.amount;
          // 2. Transfer TO Investment
          if (t.type === 'transfer' && destination === 'Investment') return acc + t.amount;
          // 3. Investment category expense without explicit transfer
          if (t.type === 'transfer' && !destination && source !== 'Investment' && isInvCategory) return acc + t.amount;

          // Subtract: Money leaving Investment (Withdrawal)
          if (source === 'Investment' && t.type === 'transfer') {
              if (destination === 'Bank' || destination === 'Cash' || !destination) return acc - t.amount;
          }
      }

      return acc;
    }, 0);
  };

  const bankBalance = calculateTotalBalance('Bank');
  const cashBalance = calculateTotalBalance('Cash');
  const investmentBalance = calculateTotalBalance('Investment');
  const totalNetWorth = bankBalance + cashBalance + investmentBalance;

  const calculateBankBalances = () => {
    const balances = {};
    allTransactions.forEach(t => {
      const source = t.paymentMode || 'Bank';
      const destination = t.transferTo || null;
      
      if (source === 'Bank' && t.type === 'income') {
        const bank = t.bankAccountName || defaultBank;
        balances[bank] = (balances[bank] || 0) + t.amount;
      }
      
      if (source === 'Bank' && t.type === 'expense') {
        const bank = t.bankAccountName || defaultBank;
        balances[bank] = (balances[bank] || 0) - t.amount;
      }

      if (source === 'Bank' && t.type === 'transfer') {
        const bank = t.bankAccountName || defaultBank;
        balances[bank] = (balances[bank] || 0) - t.amount;
      }

      if (destination === 'Bank' && t.type === 'transfer') {
        const bank = t.transferToAccountName || defaultBank;
        balances[bank] = (balances[bank] || 0) + t.amount;
      }
      
      // Investment withdrawal defaulting to Bank
      if (t.type === 'transfer' && !destination && source === 'Investment') {
        const bank = t.transferToAccountName || defaultBank;
        balances[bank] = (balances[bank] || 0) + t.amount;
      }
    });
    return Object.entries(balances)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const bankBalances = calculateBankBalances();

  // --- 2. MONTHLY STATS ---
  const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  const monthlyIncomeCash = currentMonthTransactions.filter(t => t.type === 'income' && t.paymentMode === 'Cash').reduce((acc, c) => acc + c.amount, 0);
  const monthlyIncomeBank = currentMonthTransactions.filter(t => t.type === 'income' && (!t.paymentMode || t.paymentMode === 'Bank')).reduce((acc, c) => acc + c.amount, 0);
  
  // Expenses (Strictly excluding investments)
  const monthlyExpenses = currentMonthTransactions.filter(t => 
    t.type === 'expense' && 
    t.category !== 'Investment' && 
    !INVESTMENT_TYPES.includes(t.category)
  ).reduce((acc, c) => acc + c.amount, 0);

  const monthlyExpensesCash = currentMonthTransactions.filter(t => 
    t.type === 'expense' && 
    t.category !== 'Investment' && 
    !INVESTMENT_TYPES.includes(t.category) &&
    t.paymentMode === 'Cash'
  ).reduce((acc, c) => acc + c.amount, 0);

  const monthlyExpensesBank = currentMonthTransactions.filter(t => 
    t.type === 'expense' && 
    t.category !== 'Investment' && 
    !INVESTMENT_TYPES.includes(t.category) &&
    (!t.paymentMode || t.paymentMode === 'Bank')
  ).reduce((acc, c) => acc + c.amount, 0);

  const currentMonthInvestmentBreakdownObj = {};
  currentMonthTransactions.forEach(t => {
      const isInvCategory = t.category === 'Investment' || INVESTMENT_TYPES.includes(t.category);
      let amt = 0;
      if (t.type === 'expense' && isInvCategory) amt = t.amount;
      if (t.type === 'transfer' && t.transferTo === 'Investment') amt = t.amount;
      if (t.type === 'transfer' && !t.transferTo && t.paymentMode !== 'Investment' && isInvCategory) amt = t.amount;
      if (amt > 0) {
          const type = t.investmentType || (t.category === 'Investment' ? 'Other' : t.category);
          currentMonthInvestmentBreakdownObj[type] = (currentMonthInvestmentBreakdownObj[type] || 0) + amt;
      }
  });
  const currentMonthInvestmentBreakdown = Object.entries(currentMonthInvestmentBreakdownObj)
    .map(([k, v]) => `${k}: ${formatCurrency(v)}`)
    .join(' • ');

  // --- HANDLERS ---
  const handleExport = () => {
    try {
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
        
        // 3. EXPORT SUCCESS
        toast.success("Financial report exported successfully.");
    } catch (error) {
        toast.error("Failed to export data.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete transaction?")) return;
    try { 
        await API.delete(`/transactions/${id}`); 
        setAllTransactions(prev => prev.filter(t => t._id !== id)); 
        // 4. DELETE SUCCESS
        toast.success("Transaction deleted.");
    } catch (err) {
        // 5. DELETE ERROR
        toast.error("Could not delete transaction.");
    }
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
    // 6. SAVE/UPDATE SUCCESS
    toast.success(isUpdate ? "Transaction updated." : "Transaction added successfully.");
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
          bankBalances={bankBalances}
          cashBalance={cashBalance} 
          monthlyIncome={monthlyIncome} 
          monthlyIncomeCash={monthlyIncomeCash}
          monthlyIncomeBank={monthlyIncomeBank}
          monthlyExpenses={monthlyExpenses} 
          monthlyExpensesCash={monthlyExpensesCash}
          monthlyExpensesBank={monthlyExpensesBank} 
          investmentBalance={investmentBalance} 
          monthLabel={formattedMonth} 
          customBreakdown={currentMonthInvestmentBreakdown}
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