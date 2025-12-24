import React from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2, Check } from 'lucide-react';

const HabitGrid = ({ habits, weekDays, today, handlePrevWeek, handleNextWeek, toggleHabitDate, handleEdit, deleteHabit }) => {
  
  // Helper to format dates for headers
  const formatHeaderDate = (dateStr) => {
    const d = new Date(dateStr);
    return { 
      day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
      date: d.getDate() 
    };
  };

  const dateRangeText = `${new Date(weekDays[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(weekDays[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
      
      {/* --- HEADER (Shared) --- */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-transparent">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Weekly Grid</h3>
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
              <button onClick={handlePrevWeek} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-full transition text-gray-500 dark:text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 min-w-[90px] text-center">{dateRangeText}</span>
              <button onClick={handleNextWeek} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-full transition text-gray-500 dark:text-gray-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="md:hidden flex flex-col divide-y divide-gray-50 dark:divide-gray-800">
          {habits.length > 0 ? habits.map((habit) => (
              <div key={habit._id} className="p-5 flex flex-col gap-4">
                  {/* Top Row: Title & Actions */}
                  <div className="flex justify-between items-start">
                      <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-base">{habit.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400 font-medium bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
                                Target: {habit.target} Days
                              </span>
                              <span className="text-xs text-indigo-500 font-bold">
                                {habit.completedDates.length} Done
                              </span>
                          </div>
                      </div>
                      <div className="flex gap-1">
                          <button onClick={() => handleEdit(habit)} className="p-2 text-gray-400 hover:text-indigo-500 bg-gray-50 dark:bg-gray-800 rounded-lg transition"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteHabit(habit._id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-800 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                  </div>

                  {/* Bottom Row: Days Grid */}
                  <div className="flex justify-between items-center gap-1">
                      {weekDays.map(date => {
                          const { day } = formatHeaderDate(date);
                          const isCompleted = habit.completedDates.includes(date);
                          const isFuture = new Date(date) > new Date();
                          const isToday = date === today;

                          return (
                              <div key={date} className="flex flex-col items-center gap-2">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-indigo-500' : 'text-gray-400'}`}>{day.charAt(0)}</span>
                                  <button 
                                      onClick={() => !isFuture && toggleHabitDate(habit._id, date)}
                                      disabled={isFuture}
                                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                          ${isFuture 
                                              ? 'bg-gray-50 dark:bg-gray-800 opacity-30 cursor-not-allowed' 
                                              : isCompleted 
                                                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none scale-105' 
                                                  : 'bg-gray-100 dark:bg-gray-800 text-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                                          }`}
                                  >
                                      <Check className="w-3.5 h-3.5" strokeWidth={4} />
                                  </button>
                              </div>
                          );
                      })}
                  </div>
              </div>
          )) : (
              <div className="py-12 text-center text-gray-400 text-sm font-medium">No habits being tracked this week.</div>
          )}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                  <tr className="border-b border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">
                      <th className="p-5 w-1/3">Habit</th>
                      {weekDays.map(date => {
                          const { day, date: dateNum } = formatHeaderDate(date);
                          const isToday = date === today;
                          return (
                              <th key={date} className="p-3 text-center min-w-[60px]">
                                  <div className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 dark:text-gray-400'}`}>
                                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{day}</span>
                                      <span className="text-sm font-black">{dateNum}</span>
                                  </div>
                              </th>
                          );
                      })}
                      <th className="p-5 text-center">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {habits.map((habit) => (
                      <tr key={habit._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition border-b border-gray-50 dark:border-gray-800 last:border-0">
                          
                          {/* Habit Name Cell */}
                          <td className="p-5">
                              <p className="font-bold text-gray-800 dark:text-gray-200 text-base">{habit.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                  <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((habit.completedDates.length / habit.target) * 100, 100)}%` }}></div>
                                  </div>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{habit.completedDates.length}/{habit.target}</span>
                              </div>
                          </td>

                          {/* Checkboxes */}
                          {weekDays.map(date => {
                              const isCompleted = habit.completedDates.includes(date);
                              const isFuture = new Date(date) > new Date();
                              return (
                                  <td key={date} className="p-2 text-center">
                                      <button 
                                          onClick={() => !isFuture && toggleHabitDate(habit._id, date)}
                                          disabled={isFuture}
                                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 mx-auto
                                              ${isFuture 
                                                  ? 'bg-gray-50 dark:bg-gray-900/50 opacity-30 cursor-not-allowed' 
                                                  : isCompleted 
                                                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none transform scale-110' 
                                                      : 'bg-gray-100 dark:bg-gray-800 text-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                                              }`}
                                      >
                                          <Check className="w-4 h-4" strokeWidth={4} />
                                      </button>
                                  </td>
                              );
                          })}

                          {/* Actions */}
                          <td className="p-5 text-center">
                              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleEdit(habit)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition"><Pencil className="w-4 h-4" /></button>
                                  <button onClick={() => deleteHabit(habit._id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                              </div>
                          </td>
                      </tr>
                  ))}
                  {habits.length === 0 && (
                      <tr><td colSpan={9} className="py-12 text-center text-gray-400 text-sm font-medium">No habits being tracked this week.</td></tr>
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default HabitGrid;