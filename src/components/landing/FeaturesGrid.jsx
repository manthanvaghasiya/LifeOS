import React from 'react';
import { Target, CalendarCheck, TrendingUp, StickyNote } from 'lucide-react';

const FeaturesGrid = () => {
  return (
    <section className="py-32 bg-[#030712] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Everything in perfect sync.</h2>
          <p className="text-xl text-slate-400 font-light">Four flawless pillars designed to eliminate friction from your routine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Habits */}
          <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-colors duration-500 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/30 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <CalendarCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Habits</h3>
            <p className="text-slate-400 leading-relaxed font-light">Forge unbreakable consistency. Track your routines with beautiful streak visualizations.</p>
          </div>

          {/* Card 2: Finances */}
          <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-emerald-500/30 transition-colors duration-500 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-8 text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Finances</h3>
            <p className="text-slate-400 leading-relaxed font-light">Command your wealth. Intelligent expense tracking and portfolio insights at a glance.</p>
          </div>

          {/* Card 3: Goals */}
          <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-amber-500/30 transition-colors duration-500 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 rounded-2xl flex items-center justify-center mb-8 text-amber-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Goals</h3>
            <p className="text-slate-400 leading-relaxed font-light">Demolish massive objectives by breaking them into precise, actionable micro-tasks.</p>
          </div>

          {/* Card 4: Notes */}
          <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] overflow-hidden hover:border-fuchsia-500/30 transition-colors duration-500 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-colors duration-500 translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500/20 to-transparent border border-fuchsia-500/30 rounded-2xl flex items-center justify-center mb-8 text-fuchsia-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
              <StickyNote size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Notes</h3>
            <p className="text-slate-400 leading-relaxed font-light">Your digital cortex. Capture inspiration instantly and organize your thoughts beautifully.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;