import React from 'react';
import { BarChart2, Layers, Activity, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip } from 'recharts';

const HabitMonthlyOverview = ({ leaderboardMonth, setLeaderboardMonth, monthlyStats, activeHabitsCount, avgDailyConsistency }) => {
  
  // Alignment Constants
  const COLUMN_WIDTH = 45;
  const STICKY_WIDTH = 100;
  const CHART_WIDTH = Math.max(monthlyStats.length * COLUMN_WIDTH, 600); 

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 transition-all duration-300">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <BarChart2 className="w-5 h-5" />
                    </div>
                    Monthly Deep Dive
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-1">Analyze your consistency trend.</p>
            </div>

            <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                <input 
                    type="month" 
                    value={leaderboardMonth} 
                    onChange={(e) => setLeaderboardMonth(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white dark:hover:bg-gray-700/80 shadow-sm" 
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT: SUMMARY CARD */}
            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-900 dark:via-violet-900 dark:to-purple-900 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-500/30 flex flex-col justify-between relative overflow-hidden min-h-[220px] lg:min-h-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="relative z-10">
                    <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Selected Month</div>
                    {/* ✅ FIXED: Added 'text-white' to force white color */}
                    <h4 className="text-2xl md:text-3xl font-black mb-1 text-white">{new Date(leaderboardMonth).toLocaleString('default', { month: 'long' })}</h4>
                    <span className="text-indigo-200 text-lg font-medium">{new Date(leaderboardMonth).getFullYear()}</span>
                </div>

                <div className="relative z-10 mt-8 pt-8 border-t border-white/20">
                    <div className="flex items-end gap-3 mb-1">
                        <span className="text-5xl md:text-6xl font-black tracking-tighter">{avgDailyConsistency}</span>
                        <span className="text-2xl font-bold mb-1.5">%</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-100 font-medium">
                        <Activity className="w-4 h-4" /> Avg. Consistency
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                        <Layers className="w-4 h-4 text-indigo-200" />
                        <span className="font-bold">{activeHabitsCount}</span> Habits Active
                    </div>
                </div>
            </div>

            {/* RIGHT: UNIFIED CHART & TABLE SCROLL VIEW */}
            <div className="lg:col-span-3 relative border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden bg-white dark:bg-gray-900/50 shadow-inner">
                
                <div className="overflow-x-auto custom-scrollbar">
                    <div style={{ width: `${CHART_WIDTH + STICKY_WIDTH}px`, minWidth: '100%' }}>
                        
                        {/* A. The Graph (Aligned) */}
                        <div className="h-48 pt-6 relative border-b border-gray-100 dark:border-gray-800" style={{ width: `${CHART_WIDTH}px`, marginLeft: `${STICKY_WIDTH}px` }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyStats} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap={10}>
                                    <Tooltip 
                                        cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} 
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-xl border border-slate-700">
                                                        <div className="mb-1 opacity-70 border-b border-white/20 pb-1">{new Date(data.date).toLocaleDateString(undefined, {weekday:'short', day:'numeric'})}</div>
                                                        <div className="flex justify-between gap-3"><span>Done:</span> <span className="text-emerald-400">{data.completed}</span></div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                                        {monthlyStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.completed >= entry.goal ? '#10B981' : '#6366F1'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* B. The Data Table */}
                        <table className="w-full text-center border-collapse">
                            <tbody className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                
                                {/* NEW ROW: DATE (Day & Number) */}
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
                                    <td className="sticky left-0 z-20 w-[100px] p-3 font-bold text-left bg-gray-100 dark:bg-gray-800 text-gray-400 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)]">
                                        Date
                                    </td>
                                    {monthlyStats.map(stat => (
                                        <td key={`date-${stat.date}`} className="p-2 w-[45px] border-r border-gray-50 dark:border-gray-800/50">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] uppercase opacity-60">{new Date(stat.date).toLocaleDateString(undefined, {weekday: 'short'})}</span>
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{stat.day}</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Row 1: Completed */}
                                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                                    <td className="sticky left-0 z-20 w-[100px] p-3 font-bold text-left bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-md text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)]">
                                        Completed
                                    </td>
                                    {monthlyStats.map(stat => (
                                        <td key={stat.date} className="p-3 w-[45px] text-indigo-600 dark:text-indigo-400 font-bold">
                                            {stat.completed}
                                        </td>
                                    ))}
                                </tr>
                                
                                {/* Row 2: Left */}
                                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                                    <td className="sticky left-0 z-20 w-[100px] p-3 font-bold text-left bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-md text-red-500 dark:text-red-400 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)]">
                                        Left
                                    </td>
                                    {monthlyStats.map(stat => (
                                        <td key={stat.date} className="p-3 w-[45px] text-red-400 group-hover:text-red-500 font-medium">
                                            {stat.left}
                                        </td>
                                    ))}
                                </tr>
                                
                                {/* Row 3: Score */}
                                <tr className="bg-indigo-50/30 dark:bg-indigo-900/10 group">
                                    <td className="sticky left-0 z-20 w-[100px] p-3 font-bold text-left bg-indigo-50/95 dark:bg-indigo-900/95 backdrop-blur-md text-indigo-900 dark:text-indigo-200 border-r border-indigo-100 dark:border-indigo-800 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)]">
                                        Score
                                    </td>
                                    {monthlyStats.map(stat => (
                                        <td key={stat.date} className={`p-3 w-[45px] font-bold ${stat.percent === 100 ? 'text-emerald-500' : 'text-indigo-700 dark:text-indigo-300'}`}>
                                            {stat.percent}%
                                        </td>
                                    ))}
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HabitMonthlyOverview;
