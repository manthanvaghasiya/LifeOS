import React from 'react';
import { Target, CalendarCheck, TrendingUp, StickyNote } from 'lucide-react';

const FeaturesGrid = () => {
  return (
    <section className="py-32 bg-white dark:bg-[#030712] relative z-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-500">Everything in perfect sync.</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-light transition-colors duration-500">Four flawless pillars designed to eliminate friction from your routine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Habits */}
          <div className="group relative bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-colors duration-500 backdrop-blur-sm shadow-sm hover:shadow-xl dark:shadow-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-white dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-transparent border border-slate-200 dark:border-blue-500/30 rounded-2xl flex items-center justify-center mb-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <CalendarCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-500">Habits</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light transition-colors duration-500">Forge unbreakable consistency. Track your routines with beautiful streak visualizations.</p>
          </div>

          {/* Card 2: Finances */}
          <div className="group relative bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/30 transition-colors duration-500 backdrop-blur-sm shadow-sm hover:shadow-xl dark:shadow-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-white dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-transparent border border-slate-200 dark:border-emerald-500/30 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-500">Finances</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light transition-colors duration-500">Command your wealth. Intelligent expense tracking and portfolio insights at a glance.</p>
          </div>

          {/* Card 3: Goals */}
          <div className="group relative bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-amber-500/50 dark:hover:border-amber-500/30 transition-colors duration-500 backdrop-blur-sm shadow-sm hover:shadow-xl dark:shadow-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 dark:bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-white dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-transparent border border-slate-200 dark:border-amber-500/30 rounded-2xl flex items-center justify-center mb-8 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-500">Goals</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light transition-colors duration-500">Demolish massive objectives by breaking them into precise, actionable micro-tasks.</p>
          </div>

          {/* Card 4: Notes */}
          <div className="group relative bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-fuchsia-500/50 dark:hover:border-fuchsia-500/30 transition-colors duration-500 backdrop-blur-sm shadow-sm hover:shadow-xl dark:shadow-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-100 dark:bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-200 dark:group-hover:bg-fuchsia-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-white dark:bg-gradient-to-br dark:from-fuchsia-500/20 dark:to-transparent border border-slate-200 dark:border-fuchsia-500/30 rounded-2xl flex items-center justify-center mb-8 text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-[0_0_15px_rgba(217,70,239,0.2)]">
              <StickyNote size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-500">Notes</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light transition-colors duration-500">Your digital cortex. Capture inspiration instantly and organize your thoughts beautifully.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;