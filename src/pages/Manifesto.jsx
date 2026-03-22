import React from 'react';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';

const Manifesto = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-500 pt-20">
      <PublicNavbar />
      
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-16 tracking-tighter uppercase leading-none">
          Life is a <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-500">multiplayer game.</span>
        </h1>
        
        <div className="space-y-12 text-2xl md:text-4xl font-black tracking-tight text-slate-300 dark:text-slate-700">
          <p className="hover:text-slate-900 dark:hover:text-white transition-colors duration-500 cursor-default">01. Motivation is a myth. Consistency is a mechanic.</p>
          <p className="hover:text-slate-900 dark:hover:text-white transition-colors duration-500 cursor-default">02. If you don't track it, you can't improve it.</p>
          <p className="hover:text-slate-900 dark:hover:text-white transition-colors duration-500 cursor-default">03. Friction is the enemy of execution.</p>
          <p className="hover:text-slate-900 dark:hover:text-white transition-colors duration-500 cursor-default">04. Your daily habits are your ultimate stats.</p>
          <p className="text-indigo-600 dark:text-indigo-500">05. Play to win.</p>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
};

export default Manifesto;