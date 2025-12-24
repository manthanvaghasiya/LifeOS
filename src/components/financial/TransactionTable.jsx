import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, ArrowRight, Banknote, 
  Landmark, Pencil, Trash2, PieChart, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const TransactionTable = ({ transactions, onEdit, onDelete, monthLabel }) => {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // --- FILTERING & SORTING LOGIC ---
  const filteredData = transactions
    .filter(t => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
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

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // --- UI HELPERS ---
  const renderDetails = (t) => {
    const source = t.paymentMode || 'Bank';
    const destination = t.transferTo || (t.category === 'Investment' ? 'Investment' : t.category);

    if (t.type === 'transfer') {
      return (
        <div className="flex items-center gap-2 text-[10px] uppercase text-indigo-600 bg-indigo-50/80 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <span>{source}</span>
          <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
          <span>{destination}</span>
          {destination === 'Investment' && t.investmentType && (
            <span className="ml-1 text-indigo-700 dark:text-indigo-200">[{t.investmentType}]</span>
          )}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] uppercase tracking-widest bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-gray-600">
          {t.category}
        </span>
        <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase italic flex items-center gap-1">
          {source === 'Cash' ? <Banknote className="w-3 h-3" /> : <Landmark className="w-3 h-3" />} {source}
        </span>
      </div>
    );
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] py-20 text-center border dark:border-gray-800 shadow-sm">
        <p className="text-slate-600 dark:text-slate-300 tracking-widest uppercase text-xs font-medium">No records for {monthLabel}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col transition-all">
      
      {/* 1. HEADER CONTROLS */}
      <div className="p-4 md:p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4 bg-white/50 dark:bg-gray-900/60 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder={`Search transactions in ${monthLabel}...`} 
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-gray-100 transition-all placeholder-slate-500 text-sm" 
                    value={searchTerm} 
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <div className="flex flex-1 md:flex-none items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 transition hover:bg-gray-200 dark:hover:bg-gray-700">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    <select className="bg-transparent outline-none text-xs uppercase text-slate-800 dark:text-gray-100 cursor-pointer w-full font-medium" value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
                        <option value="all">Types</option>
                        <option value="income">Incomes</option>
                        <option value="expense">Expenses</option>
                        <option value="transfer">Transfers</option>
                    </select>
                </div>
                <select className="flex-1 md:flex-none px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none text-xs uppercase text-slate-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest</option>
                    <option value="lowest">Lowest</option>
                </select>
            </div>
        </div>
      </div>

      {/* 2. MOBILE CARD LIST (Hidden on Desktop) */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {currentItems.length > 0 ? currentItems.map(t => (
          <div key={t._id} className="p-5 flex flex-col gap-4 active:bg-gray-100 dark:active:bg-gray-800/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-medium">{formatDate(t.date)}</span>
                <h4 className="text-slate-900 dark:text-white text-sm line-clamp-1 tracking-tight font-medium">{t.title}</h4>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-sm px-2 py-1 rounded-lg font-medium ${
                  t.type === 'income' ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30' : 
                  (t.type === 'expense' ? 'text-rose-700 bg-rose-100 dark:bg-rose-900/30' : 'text-blue-700 bg-blue-100 dark:bg-blue-900/30')
                }`}>
                  {t.type === 'income' ? '+' : (t.type === 'expense' ? '-' : '')}{formatCurrency(t.amount)}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(t)} className="p-2 bg-slate-100 dark:bg-gray-800 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-gray-700"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(t._id)} className="p-2 bg-slate-100 dark:bg-gray-800 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-gray-700"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">{renderDetails(t)}</div>
          </div>
        )) : (
          <div className="p-10 text-center text-slate-500 italic text-sm">No transactions found</div>
        )}
      </div>

      {/* 3. DESKTOP TABLE (Hidden on Mobile) */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-100/50 dark:bg-slate-800/50 text-[10px] text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] font-medium">
                <th className="p-6 pl-10">Date</th>
                <th className="p-6">Description</th>
                <th className="p-6">Context</th>
                <th className="p-6 text-right">Amount</th>
                <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentItems.map(t => {
              const rowColors = {
                income: "hover:bg-emerald-50 dark:hover:bg-emerald-900/10",
                expense: "hover:bg-rose-50 dark:hover:bg-rose-900/10",
                transfer: "hover:bg-indigo-50 dark:hover:bg-indigo-900/10",
              };

              return (
                <tr key={t._id} className={`group transition-all duration-300 ${rowColors[t.type] || 'hover:bg-gray-100'}`}>
                  <td className="p-6 pl-10 whitespace-nowrap border-r border-gray-50 dark:border-gray-800/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-tighter font-medium">{new Date(t.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-sm text-slate-900 dark:text-slate-200 font-medium">{new Date(t.date).getDate()}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-slate-900 dark:text-white max-w-[220px] truncate tracking-tight font-medium">{t.title}</td>
                  <td className="p-6 whitespace-nowrap">{renderDetails(t)}</td>
                  <td className="p-6 text-right">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium border ${
                      t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200' : 
                      (t.type === 'expense' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-200' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200')
                    }`}>
                      {t.type === 'income' ? '+' : (t.type === 'expense' ? '-' : '')} {formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => onEdit(t)} className="p-2.5 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 rounded-xl transition-all"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(t._id)} className="p-2.5 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 hover:text-rose-600 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. PAGINATION FOOTER */}
      {totalPages > 1 && (
        <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-100 dark:bg-gray-800/40 backdrop-blur-sm">
          <button 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-2 text-[10px] text-slate-800 dark:text-gray-200 disabled:opacity-40 hover:text-blue-600 transition-all uppercase tracking-[0.2em] font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          
          <span className="text-[10px] text-slate-800 dark:text-gray-200 uppercase tracking-[0.3em] font-medium">
            Page <span className="text-blue-600 font-bold">{currentPage}</span> / {totalPages}
          </span>
          
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-2 text-[10px] text-slate-800 dark:text-gray-200 disabled:opacity-40 hover:text-blue-600 transition-all uppercase tracking-[0.2em] font-medium"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;