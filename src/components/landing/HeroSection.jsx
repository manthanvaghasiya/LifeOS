import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 via-slate-900 to-slate-950 transition-colors duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              🎉 First Month FREE — No credit card needed
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight text-slate-900 dark:text-white transition-colors duration-500">
            Your Life,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              Fully Optimized.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light transition-colors duration-500">
            Manage finances, build wealth-building habits, and crush your goals—all in one beautifully designed system. Get started instantly. Free forever plan available.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/signup"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/pricing"
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <span>View Plans</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-4xl mx-auto mt-20">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-2xl blur-2xl"></div>

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-10 shadow-2xl dark:shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xl">Dashboard</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your financial overview at a glance</p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Spending */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  This Month
                </p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-4">₹8,420</p>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-gradient-to-r from-rose-500 to-orange-500"></div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">68% of budget</p>
              </div>

              {/* Savings */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
                  Saved This Year
                </p>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-4">₹1,24,500</p>
                <div className="w-full h-2 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-3">↑ 18% YoY</p>
              </div>

              {/* Level */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">
                  Current Level
                </p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-4">Level 18</p>
                <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">7.5k / 10k XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
