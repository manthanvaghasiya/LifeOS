import React from 'react';
import { Clock, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const SpendingSection = ({ transactions }) => {
  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 flex flex-col flex-1 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400"><Clock className="w-5 h-5" /></div> 
          Today's Spending
        </h3>
      </div>
      <div className="p-0">
        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {transactions.map(t => (
              <li key={t._id} className="p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                    {t.type === 'income' ? <TrendingUp className="w-4 h-4"/> : <Wallet className="w-4 h-4"/>}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{t.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{t.category}</span>
                    </div>
                  </div>
                </div>
                <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center text-gray-400 text-sm font-medium italic">No transactions recorded today.</div>
        )}
      </div>
    </div>
  );
};

export default SpendingSection;