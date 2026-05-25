import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

const FinalCTA = () => {
  return (
    <section className="relative py-20 md:py-32 px-6 overflow-hidden">
      {/* Background wash */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[460px] bg-gradient-to-r from-blue-500/[0.12] via-cyan-500/[0.08] to-purple-500/[0.12] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight" style={{ lineHeight: '1.05' }}>
          Stop drifting.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
            Start designing.
          </span>
        </h2>

        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 font-light max-w-lg mx-auto">
          Take control of your finances, habits, and goals — all in one system that grows with you.
        </p>

        <Link
          to="/signup"
          className={`group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 ${ease} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50`}
        >
          <span>Start Free Trial</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>

        <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">
          No credit card. 2-minute setup. Cancel anytime.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
