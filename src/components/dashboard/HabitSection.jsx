import React from 'react';
import { CheckCircle } from 'lucide-react';

const HabitSection = ({ habits, onToggle }) => {
  return (
    <div className="bg-white dark:bg-gray-900/60 dark:border-gray-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 flex flex-col h-full min-h-[450px] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-transparent backdrop-blur-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><CheckCircle className="w-5 h-5" /></div> 
          Daily Rituals
        </h3>
        <span className="text-xs font-bold bg-gray-900 dark:bg-white dark:text-black text-white px-3 py-1.5 rounded-lg shadow-md">{habits.length} Left</span>
      </div>
      <div className="p-5 space-y-4">
        {habits.length > 0 ? (
          habits.map(habit => (
            <div key={habit._id} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 hover:shadow-lg rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5" onClick={() => onToggle(habit._id)}>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 flex items-center justify-center transition-colors">
                  <div className="w-3 h-3 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm group-hover:text-gray-900 dark:group-hover:text-white">{habit.title}</span>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg group-hover:text-green-600 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">{habit.target} days</span>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><CheckCircle className="w-10 h-10 text-green-500" /></div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">All Done For Today!</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitSection;