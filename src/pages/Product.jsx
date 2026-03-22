import React from 'react';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';
import FinalCTA from '../components/landing/FinalCTA';
import { Layers, Activity, Crosshair, BrainCircuit } from 'lucide-react';

const Product = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-500 pt-20">
      <PublicNavbar />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">command center.</span></h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-light">LifeOS replaces 5 different applications, merging them into one seamless, gamified dashboard.</p>
        </div>

        {/* Feature 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 lg:order-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-[2rem] p-8 aspect-square flex items-center justify-center shadow-xl dark:shadow-none relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] rounded-full"></div>
            <Activity size={120} className="text-blue-500 opacity-80" strokeWidth={1} />
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6"><Activity size={24} /></div>
            <h2 className="text-4xl font-bold mb-6">Habit Tracking, Perfected.</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">Stop breaking the chain. Visually track your daily routines, monitor your consistency, and earn XP for maintaining long streaks. Built-in algorithms adjust your score based on difficulty.</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6"><Layers size={24} /></div>
            <h2 className="text-4xl font-bold mb-6">Wealth Management.</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">Know exactly where every dollar goes. Log expenses instantly, categorize transactions, and view beautiful monthly breakdown charts that tell you the truth about your finances.</p>
          </div>
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-[2rem] p-8 aspect-square flex items-center justify-center shadow-xl dark:shadow-none relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full"></div>
            <Layers size={120} className="text-emerald-500 opacity-80" strokeWidth={1} />
          </div>
        </div>
      </div>
      
      <FinalCTA />
      <PublicFooter />
    </div>
  );
};

export default Product;