import React from 'react';
import { Sparkles, Calendar, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';

const FinancialHeader = ({ viewDate, setViewDate, onExport, onAdd }) => {
  const formattedMonth = viewDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in">
      
      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Financial Overview <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-base">
          Track, analyze, and optimize your wealth.
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        
        {/* Month Navigator */}
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center border-x border-slate-100 dark:border-slate-800 mx-1">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm select-none">
              {formattedMonth}
            </span>
          </div>
          
          <button 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <button 
          onClick={onExport} 
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm hover:shadow text-sm"
        >
          <Download className="w-4 h-4" /> 
          <span className="hidden sm:inline">Export</span>
        </button>
        
        <button 
          onClick={onAdd} 
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition shadow-lg shadow-slate-900/10 transform active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

    </div>
  );
};

export default FinancialHeader;