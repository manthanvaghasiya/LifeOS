import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Flame, Zap } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

// Static 7-day sparkline heights (%) — pure divs, no chart lib.
const SPARK = [42, 58, 50, 71, 64, 83, 96];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-6 overflow-hidden">
      {/* Ambient background — 3 radial blurs, all sub-15% opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-32 w-[520px] h-[520px] bg-blue-500/[0.12] dark:bg-blue-500/[0.10] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-[440px] h-[440px] bg-cyan-500/[0.10] dark:bg-cyan-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[440px] h-[440px] bg-purple-500/[0.10] dark:bg-purple-500/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Eyebrow */}
        <div className="flex justify-center mb-9">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/80" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              First month free — no card required
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-7 text-slate-900 dark:text-white"
            style={{ lineHeight: '0.95' }}
          >
            Your Life,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              Fully Optimized.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
            Finance, habits, and goals — unified in one system that levels you up.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
          <Link
            to="/signup"
            className={`group w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 ${ease} flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50`}
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <span>See How It Works</span>
          </a>
        </div>

        {/* Product preview — window chrome + 3 mini dashboard cards */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-x-8 -inset-y-6 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 rounded-[2rem] blur-3xl" aria-hidden="true" />

          <div className="relative bg-white/90 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 lg:p-6 shadow-2xl dark:shadow-[0_0_80px_rgba(59,130,246,0.08)] backdrop-blur-xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-5 pb-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-rose-400/80 rounded-full" />
                <span className="w-3 h-3 bg-amber-400/80 rounded-full" />
                <span className="w-3 h-3 bg-emerald-400/80 rounded-full" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">lifeos.app/dashboard</span>
              </div>
            </div>

            {/* Mini cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Finance */}
              <div className={`group bg-slate-50 dark:bg-white/[0.03] rounded-xl p-5 border border-slate-100 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300 ${ease}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Saved this month</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl lg:text-[1.7rem] font-black text-slate-900 dark:text-white mb-4 tracking-tight">₹47,250</p>
                {/* 7-day sparkline */}
                <div className="flex items-end gap-1.5 h-10">
                  {SPARK.map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-emerald-500/15 dark:bg-emerald-400/10 flex items-end overflow-hidden">
                      <div className="w-full rounded-sm bg-gradient-to-t from-emerald-500 to-emerald-400" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Habits — 7-day streak */}
              <div className={`group bg-slate-50 dark:bg-white/[0.03] rounded-xl p-5 border border-slate-100 dark:border-white/5 hover:border-orange-200 dark:hover:border-orange-500/20 hover:-translate-y-1 transition-all duration-300 ${ease}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current streak</span>
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <p className="text-2xl lg:text-[1.7rem] font-black text-slate-900 dark:text-white mb-4 tracking-tight">6 days</p>
                <div className="flex gap-1.5">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`flex-1 aspect-square rounded-md ${
                        i < 6
                          ? 'bg-gradient-to-br from-orange-500 to-amber-400'
                          : 'bg-slate-200 dark:bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* XP / Level */}
              <div className={`group bg-slate-50 dark:bg-white/[0.03] rounded-xl p-5 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 ${ease}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current level</span>
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-2xl lg:text-[1.7rem] font-black text-slate-900 dark:text-white mb-4 tracking-tight">Level 12</p>
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">78% to Level 13</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
