import React from 'react';
import { Sparkles, Calendar, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';

const FinancialHeader = ({ viewDate, setViewDate, onExport, onAdd }) => {
  const formattedMonth = viewDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          Financial Overview <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-200 animate-pulse" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 text-lg">Your wealth command center.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-2 py-1.5 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700">
          <button onClick={handlePrevMonth} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-2 min-w-[130px] justify-center">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{formattedMonth}</span>
          </div>
          <button onClick={handleNextMonth} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button onClick={onExport} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm">
          <Download className="w-4 h-4" /> CSV
        </button>
        <button onClick={onAdd} className="group flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-bold hover:bg-black dark:hover:bg-gray-200 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-sm">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Add New
        </button>
      </div>
    </div>
  );
};

export default FinancialHeader;