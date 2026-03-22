import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-500 pt-20">
      <PublicNavbar />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Invest in yourself.</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-light">Simple, transparent pricing. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-10 rounded-[3rem] shadow-xl dark:shadow-none">
            <h3 className="text-2xl font-bold mb-2">Initiate</h3>
            <div className="text-5xl font-black mb-6">$0<span className="text-xl text-slate-400 font-medium">/forever</span></div>
            <p className="text-slate-600 dark:text-slate-400 mb-8 font-light">Perfect for getting started on your journey.</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3"><Check className="text-emerald-500" size={20} /> <span className="text-slate-700 dark:text-slate-300">Basic Habit Tracking</span></li>
              <li className="flex items-center gap-3"><Check className="text-emerald-500" size={20} /> <span className="text-slate-700 dark:text-slate-300">Standard XP System</span></li>
              <li className="flex items-center gap-3"><Check className="text-emerald-500" size={20} /> <span className="text-slate-700 dark:text-slate-300">Up to 3 Financial Goals</span></li>
            </ul>
            <Link to="/signup" className="block w-full py-4 rounded-full bg-slate-100 dark:bg-white/5 text-center font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Start Free</Link>
          </div>

          {/* Pro Tier */}
          <div className="relative p-10 rounded-[3rem] bg-slate-900 dark:bg-black border border-indigo-500/50 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 opacity-50"></div>
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">Most Popular</div>
              <h3 className="text-2xl font-bold text-white mb-2">Grandmaster</h3>
              <div className="text-5xl font-black text-white mb-6">$12<span className="text-xl text-slate-400 font-medium">/month</span></div>
              <p className="text-slate-400 mb-8 font-light">Unlimited access to the ultimate command center.</p>
              <ul className="space-y-4 mb-10 text-white">
                <li className="flex items-center gap-3"><Check className="text-indigo-400" size={20} /> <span>Unlimited Habits & Goals</span></li>
                <li className="flex items-center gap-3"><Check className="text-indigo-400" size={20} /> <span>Advanced Financial Analytics</span></li>
                <li className="flex items-center gap-3"><Check className="text-indigo-400" size={20} /> <span>Priority Support</span></li>
              </ul>
              <Link to="/signup" className="block w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 transition-transform">Upgrade Now</Link>
            </div>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
};

export default Pricing;