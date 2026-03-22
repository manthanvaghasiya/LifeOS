import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LayoutDashboard, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      
      {/* --- DYNAMIC AURORA BACKGROUND --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/20 dark:bg-indigo-600/20 blur-[100px] dark:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[7000ms]"></div>
        <div className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-400/20 dark:bg-fuchsia-600/20 blur-[100px] dark:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px] dark:blur-[150px] mix-blend-multiply dark:mix-blend-screen"></div>
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xKSIvPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsLCAyNTUsIDAuMDUpIi8+PC9zdmc+')] opacity-50"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm dark:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-colors duration-500">
          <Sparkles size={14} className="text-indigo-500 dark:text-indigo-400" />
          <span className="text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">The Next Generation of Productivity</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-slate-900 dark:text-white transition-colors duration-500">
          Manage your life. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 dark:from-blue-400 dark:via-indigo-400 dark:to-fuchsia-400">
            Like a machine.
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light transition-colors duration-500">
          A beautifully designed, gamified operating system for your habits, wealth, and goals. Stop playing small. Level up today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/signup" className="group relative w-full sm:w-auto p-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 dark:from-blue-500 dark:via-indigo-500 dark:to-fuchsia-500 overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.3)] dark:shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-shadow duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <div className="relative px-8 py-4 bg-white dark:bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-transparent text-slate-900 group-hover:text-white dark:text-white font-bold text-lg">
              Start Your Journey 
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-none">
            <LayoutDashboard size={20} className="text-slate-500 dark:text-slate-400" />
            Enter Workspace
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;