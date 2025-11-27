import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const FinancialAnalytics = ({ transactions }) => {
  // 1. Get Current Month Data Only
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // 2. Group by Week
  const weeklyData = [
    { name: 'Week 1', income: 0, expense: 0, investment: 0 },
    { name: 'Week 2', income: 0, expense: 0, investment: 0 },
    { name: 'Week 3', income: 0, expense: 0, investment: 0 },
    { name: 'Week 4', income: 0, expense: 0, investment: 0 },
    { name: 'Week 5', income: 0, expense: 0, investment: 0 },
  ];

  monthlyTransactions.forEach(t => {
    const date = new Date(t.date);
    const weekIndex = Math.floor((date.getDate() - 1) / 7);
    
    if (weeklyData[weekIndex]) {
        if (t.type === 'income') {
            weeklyData[weekIndex].income += t.amount;
        } else if (t.category === 'Investment') {
            // SEPARATE INVESTMENT FROM EXPENSE
            weeklyData[weekIndex].investment += t.amount;
        } else {
            // REGULAR EXPENSE
            weeklyData[weekIndex].expense += t.amount;
        }
    }
  });

  // Clean up empty Week 5
  const finalData = weeklyData[4].income === 0 && weeklyData[4].expense === 0 && weeklyData[4].investment === 0
    ? weeklyData.slice(0, 4) 
    : weeklyData;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Financial Analytics
        </h3>
        <p className="text-sm text-gray-500">Income vs Expense vs Investment</p>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={finalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
              {/* NEW: Investment Gradient (Purple) */}
              <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}} 
                dy={10}
            />
            <YAxis hide />
            <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => `₹${value}`}
            />
            
            {/* Income Line (Green) */}
            <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
            />
            
            {/* Expense Line (Red) */}
            <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#EF4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
            />

            {/* NEW: Investment Line (Purple) */}
            <Area 
                type="monotone" 
                dataKey="investment" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorInvestment)" 
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 font-medium">Income</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 font-medium">Expense</span>
          </div>
          {/* NEW Legend Item */}
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 font-medium">Investment</span>
          </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;