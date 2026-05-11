import { useState, useEffect } from 'react';
import API from '../services/api';

// Default categories - unified superset from both forms
const DEFAULT_CATEGORIES = {
  expense: ['Food', 'Shopping', 'Transport', 'Travel', 'Bills', 'Health', 'Education', 'Grocery', 'Entertainment', 'Fuel'],
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Rental'],
  investmentTypes: ['SIP', 'Mutual Fund', 'Stocks', 'Gold', 'FD', 'Crypto', 'IPO'],
  bankAccounts: ['Primary Bank']
};

const useCategories = () => {
  const [categories, setCategories] = useState({
    expense: [...DEFAULT_CATEGORIES.expense],
    income: [...DEFAULT_CATEGORIES.income],
    investmentTypes: [...DEFAULT_CATEGORIES.investmentTypes],
    bankAccounts: [...DEFAULT_CATEGORIES.bankAccounts]
  });
  const [loading, setLoading] = useState(true);

  // Fetch user's custom categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/users/categories');
        const customCats = res.data;

        // Merge: defaults first, then append custom (deduped)
        setCategories({
          expense: [
            ...DEFAULT_CATEGORIES.expense,
            ...customCats.expense.filter(c => !DEFAULT_CATEGORIES.expense.includes(c))
          ],
          income: [
            ...DEFAULT_CATEGORIES.income,
            ...customCats.income.filter(c => !DEFAULT_CATEGORIES.income.includes(c))
          ],
          investmentTypes: [
            ...DEFAULT_CATEGORIES.investmentTypes,
            ...(customCats.investmentTypes ? customCats.investmentTypes.filter(c => !DEFAULT_CATEGORIES.investmentTypes.includes(c)) : [])
          ],
          bankAccounts: (customCats.bankAccounts && customCats.bankAccounts.length > 0)
            ? customCats.bankAccounts
            : [...DEFAULT_CATEGORIES.bankAccounts]
        });
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // Fall back to defaults
        setCategories({
          expense: [...DEFAULT_CATEGORIES.expense],
          income: [...DEFAULT_CATEGORIES.income],
          investmentTypes: [...DEFAULT_CATEGORIES.investmentTypes],
          bankAccounts: [...DEFAULT_CATEGORIES.bankAccounts]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add expense category
  const addExpenseCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.expense.includes(trimmed)) return;

    // Optimistic update
    setCategories(prev => ({
      ...prev,
      expense: [...prev.expense, trimmed]
    }));

    try {
      await API.put('/users/categories', { type: 'expense', name: trimmed });
    } catch (err) {
      console.error('Failed to save category:', err);
      // Revert on error
      setCategories(prev => ({
        ...prev,
        expense: prev.expense.filter(c => c !== trimmed)
      }));
    }
  };

  // Add income category
  const addIncomeCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.income.includes(trimmed)) return;

    // Optimistic update
    setCategories(prev => ({
      ...prev,
      income: [...prev.income, trimmed]
    }));

    try {
      await API.put('/users/categories', { type: 'income', name: trimmed });
    } catch (err) {
      console.error('Failed to save category:', err);
      // Revert on error
      setCategories(prev => ({
        ...prev,
        income: prev.income.filter(c => c !== trimmed)
      }));
    }
  };

  // Generic add category
  const addCategory = async (type, name) => {
    if (type === 'expense') {
      return addExpenseCategory(name);
    } else if (type === 'income') {
      return addIncomeCategory(name);
    }
  };

  // Add investment type
  const addInvestmentType = async (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.investmentTypes.includes(trimmed)) return;

    // Optimistic update
    setCategories(prev => ({
      ...prev,
      investmentTypes: [...prev.investmentTypes, trimmed]
    }));

    try {
      await API.put('/users/categories', { type: 'investmentTypes', name: trimmed });
    } catch (err) {
      console.error('Failed to save investment type:', err);
      // Revert on error
      setCategories(prev => ({
        ...prev,
        investmentTypes: prev.investmentTypes.filter(c => c !== trimmed)
      }));
    }
  };

  // Add bank account
  const addBankAccount = async (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.bankAccounts.includes(trimmed)) return;

    // Optimistic update
    setCategories(prev => {
      const isOnlyPrimary = prev.bankAccounts.length === 1 && prev.bankAccounts[0] === 'Primary Bank';
      const newBanks = isOnlyPrimary ? [trimmed] : [...prev.bankAccounts, trimmed];
      return { ...prev, bankAccounts: newBanks };
    });

    try {
      await API.put('/users/categories', { type: 'bankAccounts', name: trimmed });
    } catch (err) {
      console.error('Failed to save bank account:', err);
      // Revert on error
      setCategories(prev => ({
        ...prev,
        bankAccounts: prev.bankAccounts.filter(c => c !== trimmed)
      }));
    }
  };

  // Remove category (any type)
  const removeCategory = async (type, name) => {
    // Optimistic update
    setCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(c => c !== name)
    }));

    try {
      await API.delete(`/users/categories?type=${type}&name=${encodeURIComponent(name)}`);
    } catch (err) {
      console.error('Failed to remove category:', err);
      // Revert on error by refetching or just notifying
      // For simplicity, we won't strictly revert here, but we could
    }
  };

  return {
    expenseCategories: categories.expense,
    incomeCategories: categories.income,
    investmentTypes: categories.investmentTypes,
    bankAccounts: categories.bankAccounts,
    addCategory,
    addExpenseCategory,
    addIncomeCategory,
    addInvestmentType,
    addBankAccount,
    removeCategory,
    loading
  };
};

export default useCategories;
