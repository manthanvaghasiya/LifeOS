import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, TrendingUp, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-400/15 dark:bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-cyan-400/15 dark:bg-cyan-600/6 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-purple-400/8 dark:bg-purple-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-200/60 dark:border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              First Month FREE — No credit card needed
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-8 text-slate-900 dark:text-white transition-colors duration-500" style={{ lineHeight: '0.95' }}>
            Your Life,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              Fully Optimized.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-light transition-colors duration-500">
            Finance, habits, and goals — unified in one system that levels you up.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            to="/signup"
            className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <Link
            to="/product"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-base hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>See How It Works</span>
          </Link>
        </div>

        {/* Dashboard Preview — 3 Mini Cards */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 rounded-3xl blur-3xl" />

          <div className="relative bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 rounded-2xl p-6 lg:p-8 shadow-2xl dark:shadow-[0_0_80px_rgba(59,130,246,0.08)] backdrop-blur-sm">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-slate-100 dark:border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-rose-400/80 rounded-full" />
                <div className="w-3 h-3 bg-amber-400/80 rounded-full" />
                <div className="w-3 h-3 bg-emerald-400/80 rounded-full" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">lifeos.app/dashboard</span>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Net Worth */}
              <div className="group bg-slate-50 dark:bg-white/[0.03] rounded-xl p-5 border border-slate-100 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Net Worth</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-3">₹4,85,200</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">↑ 12.4%</span>
                  <span className="text-xs text-slate-400">this month</span>
                </div>
              </div>

              {/* Streak */}
              <div className="group bg-slate-50 dark:bg-white/[0.03] rounded-xl p-5 border border-slate-100 dark:border-white/5 hover:border-orange-200 dark:hover:border-orange-500/20 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Streak</span>
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-3">47 Days</p>
                <div className="flex gap-1">
                  {[1,1,1,1,1,1,1].map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
                  ))}
                </div>
              </div>

              {/* Level & XP */}
              <div className="group bg-slate-50 dark:bg-white/[0.03] rounded-xl p-5 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Level</span>
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-3">Level 18</p>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">7,500 / 10,000 XP</p>
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
