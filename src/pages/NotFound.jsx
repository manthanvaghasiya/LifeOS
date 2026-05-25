import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden transition-colors duration-500">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Moon icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center mb-8">
          <Moon className="w-7 h-7 text-slate-300 dark:text-slate-600" />
        </div>

        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-black text-slate-200 dark:text-slate-800 tracking-tighter mb-2 leading-none">
          404
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          This page is taking a rest day.
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Even the best systems need a
          break sometimes.
        </p>

        <Link
          to="/"
          className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:-translate-y-0.5 transition-all duration-300 ${ease} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
