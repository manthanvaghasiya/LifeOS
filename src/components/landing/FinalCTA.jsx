import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-[#030712] relative z-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-5xl mx-auto bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-[3rem] p-16 text-center shadow-2xl dark:shadow-[0_0_100px_rgba(79,70,229,0.15)] relative overflow-hidden transition-colors duration-500">
        
        {/* Background flare inside CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 dark:from-indigo-500/20 dark:to-fuchsia-500/20 blur-3xl pointer-events-none transition-colors duration-500"></div>
        
        <h2 className="text-4xl lg:text-5xl font-black mb-6 relative z-10 text-slate-900 dark:text-white transition-colors duration-500">Ready to take control?</h2>
        <p className="text-slate-600 dark:text-slate-400 text-xl mb-10 max-w-xl mx-auto relative z-10 font-light transition-colors duration-500">
          Join today and start organizing your habits, finances, and goals in one premium, unified system.
        </p>
        
        <Link to="/signup" className="relative z-10 inline-flex items-center gap-2 px-10 py-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300">
          Create Free Account
          <ChevronRight size={20} />
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;