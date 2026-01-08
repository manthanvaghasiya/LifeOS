import React from 'react';
import { TrendingUp, Zap, AlertCircle, Command } from 'lucide-react';

const HolographicCommandStation = ({ mousePosition }) => {
  const parallaxX = mousePosition.x * 25; 
  const parallaxY = mousePosition.y * 25;

  return (
    <div className="relative w-full h-full perspective-container flex items-center justify-center overflow-hidden rounded-r-[40px] bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>
      <div className="absolute bottom-[-30%] left-[-50%] w-[200%] h-[150%] grid-floor opacity-30 pointer-events-none origin-bottom" style={{ transform: `rotateX(70deg) translateY(${mousePosition.y * 40}px)` }}></div>

      <div className="w-[450px] h-[600px] preserve-3d transition-transform duration-100 ease-out relative z-10" style={{ transform: `rotateX(${mousePosition.y * -12}deg) rotateY(${mousePosition.x * 12}deg)` }}>
        <div className="absolute inset-0 bg-[#0F172A]/70 border border-white/10 rounded-[30px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col overflow-hidden preserve-3d">
          
          {/* Header */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B1121]/50 relative z-20" style={{ transform: 'translateZ(20px)' }}>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] text-blue-200 font-mono tracking-[0.2em] uppercase">LifeOS_Hub v2.4</span>
             </div>
             <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-bold">ONLINE</div>
          </div>

          {/* Core Modules */}
          <div className="flex-1 relative p-6 preserve-3d">
            {/* Center: XP Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 preserve-3d group">
               <div className="absolute inset-0 border-[4px] border-slate-700/50 rounded-full" style={{ transform: 'translateZ(0px)' }}></div>
               <div className="absolute inset-0 border-t-[4px] border-blue-500 rounded-full animate-[spin-slow_8s_linear_infinite]" style={{ transform: 'translateZ(10px)' }}></div>
               <div className="absolute inset-4 rounded-full bg-[#0B1121] border border-blue-500/30 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] backdrop-blur-md" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Current Level</span>
                  <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">12</span>
                  <div className="w-16 h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className="w-[70%] h-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse"></div>
                  </div>
                  <span className="text-[9px] text-blue-400 mt-1">2,450 XP / 3,000</span>
               </div>
            </div>

            {/* Left: WealthFolio */}
            <div className="absolute top-8 left-4 w-36 bg-[#0F172A]/90 border border-emerald-500/30 p-3 rounded-xl backdrop-blur-md shadow-xl transition-transform hover:scale-105" style={{ transform: 'translateZ(50px)' }}>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                <span className="text-[9px] text-emerald-400 font-bold uppercase">WealthFolio</span>
                <TrendingUp size={12} className="text-emerald-400" />
              </div>
              <div className="flex items-end gap-1 h-12 mt-2">
                 <div className="flex-1 bg-emerald-500/20 rounded-t h-[40%] group-hover:h-[60%] transition-all duration-500"></div>
                 <div className="flex-1 bg-emerald-500/20 rounded-t h-[70%] group-hover:h-[80%] transition-all duration-500"></div>
                 <div className="flex-1 bg-emerald-500 rounded-t h-[50%] shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:h-[90%] transition-all duration-500 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">40%</div>
                 </div>
                 <div className="flex-1 bg-emerald-500/20 rounded-t h-[60%] group-hover:h-[40%] transition-all duration-500"></div>
              </div>
            </div>

            {/* Right: Habit Streaks */}
            <div className="absolute bottom-24 right-4 w-40 bg-[#0F172A]/90 border border-orange-500/30 p-3 rounded-xl backdrop-blur-md shadow-xl" style={{ transform: 'translateZ(60px)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-orange-400 font-bold uppercase">Streaks</span>
                <Zap size={12} className="text-orange-400 fill-orange-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-[10px] text-slate-300">Deep Work</span><div className="flex gap-0.5">{[1,1,1,1,0].map((d,i) => (<div key={i} className={`w-1.5 h-3 rounded-sm ${d ? 'bg-orange-500' : 'bg-slate-700'}`}></div>))}</div></div>
                <div className="flex items-center justify-between"><span className="text-[10px] text-slate-300">Fitness</span><span className="text-[10px] text-orange-400 font-bold">21 Days 🔥</span></div>
              </div>
            </div>

            {/* Bottom: Task Priority */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 bg-[#0F172A] border-t-2 border-blue-500 p-3 rounded-lg shadow-2xl flex items-center justify-between" style={{ transform: 'translateZ(80px)' }}>
               <div>
                 <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Morning Briefing</div>
                 <div className="text-xs text-white font-medium flex items-center gap-2"><AlertCircle size={12} className="text-red-500" />2 High Priority Tasks</div>
               </div>
               <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30"><Command size={14} className="text-blue-400" /></div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-24 bg-[#020617] border-t border-white/10 p-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent w-[50%] animate-[shine_3s_ease-in-out_infinite]"></div>
             <div className="font-mono text-[9px] space-y-1 opacity-70">
                <p className="flex justify-between text-slate-500"><span>Loading WealthFolio models...</span><span className="text-emerald-500">DONE</span></p>
                <p className="flex justify-between text-slate-500"><span>Syncing habit database...</span><span className="text-blue-400 animate-pulse">SYNCING</span></p>
             </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-600/20 blur-[80px] -z-10 rounded-full" style={{ transform: 'translateZ(-50px)' }}></div>
      </div>
    </div>
  );
};

export default HolographicCommandStation;