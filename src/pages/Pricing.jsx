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


        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default Pricing;