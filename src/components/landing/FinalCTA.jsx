import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 dark:from-blue-500/10 dark:via-cyan-500/10 dark:to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main CTA Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-3xl p-12 md:p-16 text-center border border-slate-700 dark:border-slate-800 shadow-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="w-4 h-4" />
            Limited Time Offer
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Start Your Financial
            <br />
            Transformation Today
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto font-light">
            Join thousands of users optimizing their finances, building wealth, and achieving their goals. First month completely free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/signup"
              className="group relative w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>View Pricing</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-slate-700">
            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold">Bank-Level Security</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2 text-slate-300">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold">No Credit Card Required</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2 text-slate-300">
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
