import React from 'react';
import { TrendingUp, Flame, Target, Zap, Swords, BarChart3 } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

// Order + spans follow the asymmetric bento brief:
// Row 1: Finance (2) | Habits (1)   Row 2: Goals (1) | XP (2)   Row 3: Quests (1) | Analytics (2)
const features = [
  {
    icon: TrendingUp,
    title: 'Smart Finance Tracking',
    description: 'Track every rupee with intelligent categorization and real-time portfolio insight.',
    span: 'md:col-span-2',
    tint: 'from-emerald-50 dark:from-emerald-500/[0.05]',
    border: 'border-slate-200 hover:border-emerald-300 dark:border-white/5 dark:hover:border-emerald-500/25',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    visual: 'finance',
  },
  {
    icon: Flame,
    title: 'Habit Streaks',
    description: 'Build consistency with streaks that keep you accountable.',
    span: 'md:col-span-1',
    tint: 'from-orange-50 dark:from-orange-500/[0.05]',
    border: 'border-slate-200 hover:border-orange-300 dark:border-white/5 dark:hover:border-orange-500/25',
    iconColor: 'text-orange-600 dark:text-orange-400',
    visual: 'streak',
  },
  {
    icon: Target,
    title: 'Goal Pipeline',
    description: 'Break big goals into executable steps.',
    span: 'md:col-span-1',
    tint: 'from-purple-50 dark:from-purple-500/[0.05]',
    border: 'border-slate-200 hover:border-purple-300 dark:border-white/5 dark:hover:border-purple-500/25',
    iconColor: 'text-purple-600 dark:text-purple-400',
    visual: 'goals',
  },
  {
    icon: Zap,
    title: 'XP & Levels',
    description: 'Earn experience for every action and level up your real-life character over time.',
    span: 'md:col-span-2',
    tint: 'from-amber-50 dark:from-amber-500/[0.05]',
    border: 'border-slate-200 hover:border-amber-300 dark:border-white/5 dark:hover:border-amber-500/25',
    iconColor: 'text-amber-600 dark:text-amber-400',
    visual: 'xp',
  },
  {
    icon: Swords,
    title: 'Daily Quests',
    description: 'Personalized challenges that build discipline.',
    span: 'md:col-span-1',
    tint: 'from-blue-50 dark:from-blue-500/[0.05]',
    border: 'border-slate-200 hover:border-blue-300 dark:border-white/5 dark:hover:border-blue-500/25',
    iconColor: 'text-blue-600 dark:text-blue-400',
    visual: 'quests',
  },
  {
    icon: BarChart3,
    title: 'Insights & Analytics',
    description: 'Deep reports across every dimension of your life. Always know exactly where you stand.',
    span: 'md:col-span-2',
    tint: 'from-cyan-50 dark:from-cyan-500/[0.05]',
    border: 'border-slate-200 hover:border-cyan-300 dark:border-white/5 dark:hover:border-cyan-500/25',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    visual: 'analytics',
  },
];

const MiniVisual = ({ type }) => {
  switch (type) {
    case 'finance':
      return (
        <div className="flex items-end gap-1.5 h-14 mt-auto">
          {[35, 55, 42, 68, 50, 78, 60, 88, 72, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-emerald-500/10 dark:bg-emerald-400/10 flex items-end overflow-hidden">
              <div className="w-full rounded-sm bg-gradient-to-t from-emerald-500/70 to-emerald-400/90 dark:from-emerald-500/50 dark:to-emerald-400/70" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      );
    case 'streak':
      return (
        <div className="grid grid-cols-7 gap-1.5 mt-auto">
          {Array.from({ length: 21 }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[5px] ${
                i < 18 ? 'bg-gradient-to-br from-orange-500/70 to-amber-400/80 dark:from-orange-500/50 dark:to-amber-400/50' : 'bg-slate-200 dark:bg-white/5'
              }`}
            />
          ))}
        </div>
      );
    case 'goals':
      return (
        <div className="space-y-2.5 mt-auto">
          {[80, 55, 35].map((w, i) => (
            <div key={i} className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500/60 dark:bg-purple-400/50 rounded-full" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      );
    case 'xp':
      return (
        <div className="mt-auto pt-2">
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-1.5 font-medium">
            <span>7,800 XP</span>
            <span>Level 13 · 10,000 XP</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="feat-xp-bar h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>
      );
    case 'quests':
      return (
        <div className="space-y-2 mt-auto">
          {[{ t: 'Complete workout', done: true }, { t: 'Log expenses', done: true }, { t: 'Read 20 pages', done: false }].map((q, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`w-3.5 h-3.5 rounded-[5px] border-2 flex items-center justify-center ${q.done ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-white/15'}`}>
                {q.done && (
                  <svg viewBox="0 0 10 10" className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 5l2.5 2.5L9 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-xs ${q.done ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{q.t}</span>
            </div>
          ))}
        </div>
      );
    case 'analytics':
      return (
        <div className="flex items-end gap-1.5 h-14 mt-auto">
          {[30, 50, 35, 70, 45, 80, 55, 92, 60, 76, 88, 66].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500/50 to-blue-500/60 dark:from-cyan-500/35 dark:to-blue-500/45"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
};

const FeaturesGrid = () => {
  return (
    <section id="features" className="relative py-20 md:py-32 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-5 tracking-tight" style={{ lineHeight: '1.05' }}>
            Everything you need.
            <br />
            <span className="text-slate-400 dark:text-slate-500">Nothing you don't.</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light">
            Six integrated modules working together to give you clarity and control.
          </p>
        </div>

        {/* Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`${feature.span} group relative overflow-hidden rounded-2xl bg-gradient-to-b ${feature.tint} to-transparent border ${feature.border} bg-white dark:bg-white/[0.02] p-6 lg:p-8 flex flex-col min-h-[15rem] hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 ${ease}`}
              >
                <div className="mb-5">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-7 max-w-md">
                  {feature.description}
                </p>

                <MiniVisual type={feature.visual} />
              </div>
            );
          })}
        </div>
      </div>

      {/* XP bar fills once, only when motion is welcome */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .feat-xp-bar { animation: featXpFill 1000ms cubic-bezier(0.22, 1, 0.36, 1) both; }
          @keyframes featXpFill { from { width: 0; } to { width: 78%; } }
        }
      `}</style>
    </section>
  );
};

export default FeaturesGrid;
