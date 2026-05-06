import React, { useMemo, useState } from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer, XAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/helpers';

const DEFAULT_INVESTMENT_TYPES = ['SIP', 'IPO', 'Stocks', 'Mutual Fund', 'Gold', 'FD', 'Liquid Fund', 'Crypto'];
// Distinct gradients for bars
const BAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4'];

const PortfolioBreakdown = ({ transactions }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const { breakdown, totalPortfolioValue } = useMemo(() => {
    const allTypes = new Set(DEFAULT_INVESTMENT_TYPES);
    transactions.forEach(t => { if (t.investmentType) allTypes.add(t.investmentType); });

    let totalVal = 0;

    const data = Array.from(allTypes).map(type => {
      const total = transactions.reduce((acc, t) => {
        const isMatchType = t.investmentType === type || t.category === type;
        if (isMatchType) {
          if (t.type === 'expense' || (t.type === 'transfer' && t.paymentMode !== 'Investment')) {
            return acc + t.amount;
          }
          if (t.type === 'transfer' && t.paymentMode === 'Investment') {
            return acc - t.amount;
          }
        }
        return acc;
      }, 0);

      if (total > 0) totalVal += total;
      return { name: type, value: total };
    })
      .filter(i => i.value > 0)
      .sort((a, b) => b.value - a.value); // Sort descending

    return { breakdown: data, totalPortfolioValue: totalVal };
  }, [transactions]);

  // Custom Skyline Bar Shape
  const CustomBar = (props) => {
    const { fill, x, y, width, height, index } = props;
    const isHovered = activeIndex === index;
    const isDimmed = activeIndex !== null && activeIndex !== index;

    return (
      <g>
        <defs>
          <linearGradient id={`port-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={1} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#port-grad-${index})`}
          rx={6}
          ry={6}
          className="transition-all duration-300 cursor-pointer"
          style={{
            opacity: isDimmed ? 0.3 : 1,
            filter: isHovered ? `drop-shadow(0 4px 12px ${fill}60)` : 'none'
          }}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-slate-700/50 text-white min-w-[140px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{payload[0].payload.name}</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
            <p className="text-lg font-black text-white">
              {formatCurrency(payload[0].value)}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            {((payload[0].value / totalPortfolioValue) * 100).toFixed(1)}% of portfolio
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm h-full flex flex-col relative overflow-hidden group">

      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Portfolio</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Assets & Investments</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-700/50">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {formatCurrency(totalPortfolioValue)}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end min-h-[300px]">
        {breakdown.length > 0 ? (
          <>
            {/* CHART AREA */}
            <div className="w-full h-[220px] -ml-4 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                    interval={0}
                    tickFormatter={(val) => val.length > 5 ? `${val.slice(0, 5)}..` : val}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar
                    dataKey="value"
                    shape={<CustomBar />}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* --- MODIFIED: Show ALL items with Scroll --- */}
            <div className="mt-6 grid grid-cols-2 gap-3 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
              {breakdown.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: BAR_COLORS[index % BAR_COLORS.length] }}></div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{item.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-slate-900 dark:text-white truncate">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center opacity-40 pb-10 flex-1">
            <TrendingUp className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">No active assets found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBreakdown;