import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const HabitStats = ({ trendData }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic Chart Colors
  const chartColor = isDark ? '#818cf8' : '#4F46E5'; // Indigo-400 (Dark) vs Indigo-600 (Light)
  const textColor = isDark ? '#9ca3af' : '#9CA3AF';
  const tooltipBg = isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : 'none';
  const tooltipText = isDark ? '#f3f4f6' : '#1f2937';

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-[2rem] shadow-xl shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col h-64 relative overflow-hidden transition-all duration-300">
        
        {/* Background Icon */}
        <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10">
            <Activity className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div className="mb-4 relative z-10 p-6 pb-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Momentum</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your consistency over the last 7 days.</p>
        </div>

        <div className="flex-1 w-full min-h-[150px] relative z-10 px-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: textColor, fontSize: 10}} 
                        dy={10}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: tooltipBorder, 
                            backgroundColor: tooltipBg,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            color: tooltipText
                        }}
                        itemStyle={{ color: tooltipText }}
                        cursor={{ stroke: isDark ? '#374151' : '#E0E7FF', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke={chartColor} 
                        strokeWidth={4} 
                        dot={{r: 4, fill: chartColor, strokeWidth: 2, stroke: isDark ? '#1f2937' : '#fff'}} 
                        activeDot={{r: 6, fill: chartColor, stroke: isDark ? '#fff' : chartColor}}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default HabitStats;