import React from 'react';
import { Gamepad2, Zap } from 'lucide-react';

const GamificationShowcase = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-[#030712] relative overflow-hidden border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-indigo-400/10 dark:bg-indigo-600/10 blur-[150px] rounded-[100%] pointer-events-none transition-colors duration-500"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm dark:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-colors duration-500">
            <Gamepad2 size={16} />
            <span>Built-in RPG System</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight transition-colors duration-500">
            Level up your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-200 dark:to-amber-500">actual life.</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-light transition-colors duration-500">
            Every task completed, every habit maintained, every dollar saved earns you Experience Points. Unlock new ranks and build the ultimate character: Yourself.
          </p>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"><Zap size={24} /></div>
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold text-lg transition-colors duration-500">Daily Quests</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-500">Turn mundane tasks into rewarding missions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Holographic UI Mockup */}
        <div className="relative perspective-1000">
           <div className="absolute -inset-4 bg-gradient-to-r from-amber-300 to-indigo-300 dark:from-amber-500 dark:to-indigo-500 rounded-[3rem] blur-2xl opacity-40 dark:opacity-20 animate-pulse"></div>
           
           <div className="bg-white/90 dark:bg-black/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700">
             
             <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                    <div className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center transition-colors duration-500">
                      <span className="font-bold text-2xl text-slate-900 dark:text-white">M</span>
                    </div>
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900 dark:text-white text-xl tracking-wide transition-colors duration-500">Grandmaster</h4>
                   <p className="text-sm text-amber-600 dark:text-amber-400 font-medium transition-colors duration-500">Rank: Vanguard</p>
                 </div>
               </div>
               <div className="text-right">
                 <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-200 dark:to-amber-500 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">Lvl 42</div>
               </div>
             </div>

             <div className="mb-4 flex justify-between text-sm font-bold uppercase tracking-wider">
               <span className="text-slate-500 dark:text-slate-400 transition-colors duration-500">XP Progress</span>
               <span className="text-slate-900 dark:text-white transition-colors duration-500">8,450 / 10,000</span>
             </div>
             
             <div className="h-6 bg-slate-100 dark:bg-black rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner relative p-1 transition-colors duration-500">
               <div className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 dark:from-amber-500 dark:via-orange-500 dark:to-red-500 w-[84%] rounded-full relative shadow-sm dark:shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                 <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/60 dark:bg-white/40 blur-[2px] rounded-full"></div>
               </div>
             </div>
             <p className="mt-6 text-sm text-center text-slate-500 font-medium">Just 1,550 XP away from Level 43. Keep pushing!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationShowcase;