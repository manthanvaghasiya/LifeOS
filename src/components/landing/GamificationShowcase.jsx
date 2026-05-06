import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Zap, TrendingUp, Star, ArrowUp } from 'lucide-react';

const GamificationShowcase = () => {
  const [xpWidth, setXpWidth] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Animate XP bar on mount
    const timer = setTimeout(() => setXpWidth(78.5), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show level-up toast after delay
    const timer = setTimeout(() => setShowToast(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden transition-colors duration-500">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-amber-500/5 via-transparent to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/8 border border-amber-200/50 dark:border-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-medium uppercase tracking-wider mb-8">
              <Zap size={14} />
              <span>Gamified Experience</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight" style={{ lineHeight: '1.05' }}>
              Level Up Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Actual Life
              </span>
            </h2>

            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light max-w-lg">
              Discipline meets dopamine. Earn XP for every habit completed, every transaction logged, and every goal crushed. Watch your character grow as you grow.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: Zap, text: 'Earn XP from daily activities' },
                { icon: Trophy, text: 'Unlock achievement badges' },
                { icon: TrendingUp, text: 'Track your growth over time' },
                { icon: Star, text: 'Celebrate every milestone' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/8 border border-amber-200/30 dark:border-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Showcase Card */}
          <div className="relative">
            {/* Level Up Toast */}
            <div className={`absolute -top-4 right-4 lg:right-8 z-20 transition-all duration-700 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-amber-200/50 dark:border-amber-500/20 rounded-xl shadow-lg shadow-amber-500/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <ArrowUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Level Up!</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">You reached Level 19</p>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="relative bg-slate-900 dark:bg-slate-900/80 rounded-2xl p-8 border border-slate-800 dark:border-white/5 shadow-2xl">
              {/* Level Badge */}
              <div className="absolute -top-5 right-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-white dark:border-slate-950">
                  <span className="text-[10px] font-bold text-white/80 uppercase">Lvl</span>
                  <span className="text-2xl font-black text-white leading-none">18</span>
                </div>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4 mb-8 pt-2">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-slate-700">
                  <span className="text-xl font-black text-white">MC</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Master Commander</p>
                  <p className="text-amber-400 text-sm font-medium">Gold Tier Member</p>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Experience</span>
                  <span className="text-sm text-amber-400 font-bold">7,850 / 10,000</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${xpWidth}%` }}
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="mb-8">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-3">Recent Badges</p>
                <div className="flex gap-2">
                  {[
                    { icon: Trophy, label: 'Milestone', gradient: 'from-amber-500 to-orange-500' },
                    { icon: Zap, label: 'Streak', gradient: 'from-cyan-500 to-blue-500' },
                    { icon: TrendingUp, label: 'Wealth', gradient: 'from-emerald-500 to-teal-500' },
                  ].map((badge, idx) => {
                    const BadgeIcon = badge.icon;
                    return (
                      <div key={idx} className={`flex-1 bg-gradient-to-br ${badge.gradient} rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300`}>
                        <BadgeIcon className="w-5 h-5 text-white mx-auto mb-1.5" />
                        <p className="text-white text-[10px] font-semibold">{badge.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800">
                <div className="text-center">
                  <p className="text-amber-400 text-xl font-black">156</p>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase">Habits</p>
                </div>
                <div className="text-center">
                  <p className="text-emerald-400 text-xl font-black">₹2.4L</p>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase">Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-cyan-400 text-xl font-black">24</p>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase">Goals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationShowcase;
