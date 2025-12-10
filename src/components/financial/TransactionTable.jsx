import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, Banknote, Landmark, Pencil, Trash2, PieChart } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const TransactionTable = ({ transactions, onEdit, onDelete, monthLabel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // --- FILTERING & SORTING ---
  const filteredData = transactions
    .filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortOrder === 'highest') return b.amount - a.amount;
      if (sortOrder === 'lowest') return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
      
      {/* HEADER CONTROLS */}
      <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-center bg-white dark:bg-gray-900/60">
        {/* Search */}
        <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-4 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder={`Search ${monthLabel}...`} 
                className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 dark:text-gray-200 font-bold transition-all placeholder-gray-400" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-5 py-4 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition group">
                <SlidersHorizontal className="w-4 h-4 text-gray-500 group-hover:text-gray-800 dark:text-gray-400" />
                <select className="bg-transparent outline-none text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer w-full" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="income">Incomes</option>
                    <option value="expense">Expenses</option>
                    <option value="transfer">Transfers</option>
                </select>
            </div>
            <select className="px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest</option>
                <option value="lowest">Lowest</option>
            </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-6 pl-10">Date</th>
                <th className="p-6">Title</th>
                <th className="p-6">Details</th>
                <th className="p-6">Amount</th>
                <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {filteredData.map(t => {
              const source = t.paymentMode || 'Bank';
              
              return (
                <tr key={t._id} className="group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  {/* Date */}
                  <td className="p-6 pl-10 text-gray-500 dark:text-gray-400">{formatDate(t.date)}</td>
                  
                  {/* Title */}
                  <td className="p-6"><span className="font-bold text-gray-800 dark:text-gray-200 text-base">{t.title}</span></td>
                  
                  {/* Details (Smart Logic) */}
                  <td className="p-6">
                    {t.type === 'transfer' ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl w-fit border border-gray-200 dark:border-gray-700">
                        {/* Source Icon */}
                        {source === 'Investment' ? <PieChart className="w-3.5 h-3.5 text-purple-500"/> : (source === 'Cash' ? <Banknote className="w-3.5 h-3.5"/> : <Landmark className="w-3.5 h-3.5"/>)}
                        <span>{source}</span>
                        
                        <ArrowRight className="w-3 h-3 text-gray-400" /> 
                        
                        {/* Destination */}
                        <span>{t.category === 'Investment' ? 'Investment' : t.category}</span>
                        
                        {/* Investment Type Badge (e.g. IPO) */}
                        {t.investmentType && (
                            <span className="ml-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide border border-purple-200 dark:border-purple-800">
                                {t.investmentType}
                            </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-xl border border-gray-200 dark:border-gray-700">
                            {t.category}
                            </span>
                            {/* Show Investment Type badge if it's an Expense on Investment (e.g. Direct Stock Buy) */}
                            {t.investmentType && t.category !== t.investmentType && (
                                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-lg text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                                    {t.investmentType}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                          {source === 'Cash' ? <Banknote className="w-3 h-3" /> : <Landmark className="w-3 h-3" />} {source}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="p-6">
                    <span className={`flex items-center gap-1.5 font-bold text-base ${t.type === 'income' ? 'text-emerald-600' : (t.type === 'expense' ? 'text-red-600' : 'text-gray-900 dark:text-white')}`}>
                      {t.type === 'income' ? '+' : (t.type === 'expense' ? '-' : '')} {formatCurrency(t.amount)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => onEdit(t)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(t._id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {filteredData.length === 0 && (
                <tr><td colSpan="5" className="p-20 text-center text-gray-400 italic">No transactions found for {monthLabel}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;