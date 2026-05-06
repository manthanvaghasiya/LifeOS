import React from 'react';
import { TrendingUp, Flame, Target, Zap, Swords, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Finance Tracking',
    description: 'Track every rupee with intelligent categorization and real-time portfolio insights.',
    size: 'md:col-span-2 md:row-span-1',
    accent: 'border-emerald-200/50 dark:border-emerald-500/10',
    accentBg: 'from-emerald-50 to-transparent dark:from-emerald-500/[0.03] dark:to-transparent',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    visual: 'chart',
  },
  {
    icon: Flame,
    title: 'Habit Streaks',
    description: 'Build consistency with visual streak tracking that keeps you accountable.',
    size: 'md:col-span-1',
    accent: 'border-orange-200/50 dark:border-orange-500/10',
    accentBg: 'from-orange-50 to-transparent dark:from-orange-500/[0.03] dark:to-transparent',
    iconColor: 'text-orange-600 dark:text-orange-400',
    visual: 'streak',
  },
  {
    icon: Target,
    title: 'Goal Pipeline',
    description: 'Break massive goals into executable micro-actions with progress tracking.',
    size: 'md:col-span-1',
    accent: 'border-blue-200/50 dark:border-blue-500/10',
    accentBg: 'from-blue-50 to-transparent dark:from-blue-500/[0.03] dark:to-transparent',
    iconColor: 'text-blue-600 dark:text-blue-400',
    visual: 'progress',
  },
  {
    icon: Zap,
    title: 'XP & Levels',
    description: 'Earn experience points for every action. Level up your real-life character.',
    size: 'md:col-span-1',
    accent: 'border-purple-200/50 dark:border-purple-500/10',
    accentBg: 'from-purple-50 to-transparent dark:from-purple-500/[0.03] dark:to-transparent',
    iconColor: 'text-purple-600 dark:text-purple-400',
    visual: 'xp',
  },
  {
    icon: Swords,
    title: 'Daily Quests',
    description: 'Get personalized daily challenges that push your limits and build discipline.',
    size: 'md:col-span-1',
    accent: 'border-amber-200/50 dark:border-amber-500/10',
    accentBg: 'from-amber-50 to-transparent dark:from-amber-500/[0.03] dark:to-transparent',
    iconColor: 'text-amber-600 dark:text-amber-400',
    visual: 'quests',
  },
  {
    icon: BarChart3,
    title: 'Insights & Analytics',
    description: 'Deep reports across all dimensions of your life. Know where you stand.',
    size: 'md:col-span-2',
    accent: 'border-cyan-200/50 dark:border-cyan-500/10',
    accentBg: 'from-cyan-50 to-transparent dark:from-cyan-500/[0.03] dark:to-transparent',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    visual: 'analytics',
  },
];

const MiniVisual = ({ type }) => {
  switch (type) {
    case 'chart':
      return (
        <div className="flex items-end gap-1.5 h-12 mt-auto">
          {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-emerald-400/20 dark:bg-emerald-400/10"
              style={{ height: `${h}%` }}
            >
              <div
                className="w-full rounded-sm bg-emerald-500/40 dark:bg-emerald-400/30"
                style={{ height: `${h * 0.7}%` }}
              />
            </div>
          ))}
        </div>
      );
    case 'streak':
      return (
        <div className="grid grid-cols-7 gap-1 mt-auto">
          {Array.from({ length: 21 }, (_, i) => {
            const filled = i < 18;
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm ${
                  filled
                    ? 'bg-orange-500/60 dark:bg-orange-400/40'
                    : 'bg-slate-200 dark:bg-white/5'
                }`}
              />
            );
          })}
        </div>
      );
    case 'progress':
      return (
        <div className="space-y-2 mt-auto">
          <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-blue-500/50 dark:bg-blue-400/40 rounded-full" />
          </div>
          <div className="w-3/4 h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="w-3/5 h-full bg-blue-500/30 dark:bg-blue-400/20 rounded-full" />
          </div>
        </div>
      );
    case 'xp':
      return (
        <div className="mt-auto">
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-1">
            <span>7,500 XP</span>
            <span>10,000 XP</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
          </div>
        </div>
      );
    case 'quests':
      return (
        <div className="space-y-1.5 mt-auto">
          {['Complete workout', 'Log expenses'].map((q, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded border-2 ${i === 0 ? 'border-amber-500 bg-amber-500/30' : 'border-slate-300 dark:border-white/10'}`} />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{q}</span>
            </div>
          ))}
        </div>
      );
    case 'analytics':
      return (
        <div className="flex items-end gap-1 h-12 mt-auto">
          {[30, 50, 35, 70, 45, 80, 60, 90, 55, 75, 85, 65].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-cyan-400/20 dark:bg-cyan-400/10"
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
    <section id="features" className="relative py-32 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Everything you need.
            <br />
            <span className="text-slate-400 dark:text-slate-500">Nothing you don't.</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light">
            Six integrated modules working together to give you clarity and control.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`${feature.size} group relative overflow-hidden rounded-2xl bg-gradient-to-b ${feature.accentBg} border ${feature.accent} p-6 lg:p-8 transition-all duration-500 hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 flex flex-col`}
              >
                {/* Icon */}
                <div className="mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Mini Visual */}
                <MiniVisual type={feature.visual} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
