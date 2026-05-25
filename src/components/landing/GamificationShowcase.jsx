import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Zap, TrendingUp, Wallet, Sparkles } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

const bullets = [
  { icon: Zap, text: 'Earn XP from every habit, transaction, and goal' },
  { icon: Trophy, text: 'Unlock achievement badges as you progress' },
  { icon: TrendingUp, text: 'Watch your character grow over time' },
  { icon: Sparkles, text: 'Celebrate every milestone with a satisfying win' },
];

const GamificationShowcase = () => {
  const [xpWidth, setXpWidth] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Fill the XP bar shortly after mount so it reads as "live".
    const t = setTimeout(() => setXpWidth(78.5), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // The +50 XP toast slides in after a beat, reinforcing the reward loop.
    const t = setTimeout(() => setShowToast(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative py-20 md:py-32 px-6 overflow-hidden">
      {/* Ambient amber→purple wash behind the card */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 right-0 lg:right-[8%] -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-br from-amber-500/10 via-orange-500/[0.06] to-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium uppercase tracking-wider mb-7">
              <Zap size={13} className="fill-amber-500/30" />
              <span>Gamified Experience</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-7 tracking-tight" style={{ lineHeight: '1.05' }}>
              Level Up Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400">
                Actual Life
              </span>
            </h2>

            <p className="text-lg text-slate-500 dark:text-slate-400 mb-9 leading-relaxed font-light max-w-lg">
              Discipline meets dopamine. Every habit completed, rupee saved, and goal crushed earns
              real experience — so staying consistent finally feels rewarding.
            </p>

            <div className="space-y-4">
              {bullets.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: live-feeling card */}
          <div className="relative">
            {/* +50 XP toast */}
            <div
              className={`absolute -top-3 right-4 lg:right-6 z-20 transition-all duration-500 ${ease} motion-reduce:transition-none ${
                showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-amber-200/60 dark:border-amber-500/25 rounded-xl shadow-lg shadow-amber-500/10">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-black text-amber-600 dark:text-amber-400">+50 XP</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Habit completed</p>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="relative bg-slate-900 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-2xl dark:shadow-[0_0_80px_rgba(245,158,11,0.07)]">
              {/* Level + class */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                  <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider leading-none">Level</span>
                  <span className="text-2xl font-black text-white leading-none mt-0.5">12</span>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Class</p>
                  <p className="text-white font-black text-xl tracking-tight leading-none">Wealth Architect</p>
                </div>
              </div>

              {/* XP progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Experience</span>
                  <span className="text-sm text-amber-400 font-bold">7,850 / 10,000</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{ width: `${xpWidth}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium">2,150 XP to Level 13</p>
              </div>

              {/* Badges */}
              <div className="mb-8">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-3">Recent Badges</p>
                <div className="flex gap-2.5">
                  {[
                    { icon: Flame, label: 'Streak', gradient: 'from-orange-500 to-amber-500' },
                    { icon: Trophy, label: 'Milestone', gradient: 'from-amber-500 to-yellow-500' },
                    { icon: Wallet, label: 'Wealth', gradient: 'from-emerald-500 to-teal-500' },
                  ].map((badge) => {
                    const BadgeIcon = badge.icon;
                    return (
                      <div
                        key={badge.label}
                        className={`flex-1 bg-gradient-to-br ${badge.gradient} rounded-2xl p-3 text-center hover:scale-105 transition-transform duration-300 ${ease}`}
                      >
                        <BadgeIcon className="w-5 h-5 text-white mx-auto mb-1.5" />
                        <p className="text-white text-[10px] font-bold">{badge.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats footer */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-amber-400 text-xl font-black">156</p>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Habits</p>
                </div>
                <div className="text-center">
                  <p className="text-emerald-400 text-xl font-black">₹2.4L</p>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-400 text-xl font-black">24</p>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Goals</p>
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
