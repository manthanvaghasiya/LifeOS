import React from 'react';
import { User, Shield, Zap } from 'lucide-react';

const HolographicBlueprint = ({ mousePosition }) => {
  // Parallax Calculation
  const parallaxX = mousePosition.x * 20; 
  const parallaxY = mousePosition.y * 20;

  return (
    <div className="relative w-full h-full perspective-container flex items-center justify-center overflow-hidden rounded-r-[40px] bg-[#020617]">
      
      {/* Ambient Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none"></div>
      
      {/* Moving Floor Grid */}
      <div className="absolute bottom-[-30%] left-[-50%] w-[200%] h-[150%] grid-floor opacity-40 pointer-events-none transform origin-bottom"
           style={{ transform: `rotateX(70deg) translateY(${mousePosition.y * 50}px)` }}></div>

      {/* Main 3D Chassis */}
      <div 
        className="w-[420px] h-[580px] preserve-3d transition-transform duration-100 ease-out relative z-10"
        style={{ 
          transform: `rotateX(${mousePosition.y * -12}deg) rotateY(${mousePosition.x * 12}deg)` 
        }}
      >
        {/* Glass Casing */}
        <div className="absolute inset-0 bg-[#0F172A]/60 border border-white/10 rounded-[30px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col overflow-hidden preserve-3d">
          
          {/* Header */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B1121]/80 backdrop-blur-md relative z-20" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex items-center gap-3">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
                <div className="relative w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-xs text-blue-200 font-mono tracking-[0.2em] uppercase">LifeOS_Kernel v4.0</span>
            </div>
            <div className="flex gap-2">
               <div className="w-10 h-[2px] bg-blue-500/50"></div>
               <div className="w-2 h-[2px] bg-blue-500/50"></div>
            </div>
          </div>

          {/* Core Reactor */}
          <div className="flex-1 relative flex items-center justify-center preserve-3d">
            {/* SVG Pipes & Gyroscope (Simplified for readability, exact logic maintained) */}
            <div className="relative w-64 h-64 preserve-3d" style={{ transform: `translateZ(40px) rotateX(${parallaxY * 0.5}deg) rotateY(${parallaxX * 0.5}deg)` }}>
              <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin-slow_20s_linear_infinite]" style={{ transform: 'translateZ(0px)' }}></div>
              <div className="absolute inset-8 border border-cyan-400/30 rounded-full animate-[spin-reverse_15s_linear_infinite]" style={{ transform: 'rotateX(60deg)' }}></div>
              <div className="absolute inset-16 border-l-2 border-r-2 border-indigo-400/60 rounded-full animate-[spin-slow_3s_linear_infinite] shadow-[0_0_20px_rgba(99,102,241,0.2)]"></div>
              
              {/* Center User Orb */}
              <div className="absolute inset-0 flex items-center justify-center preserve-3d">
                <div className="w-24 h-24 rounded-full bg-[#020617] border border-blue-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.6)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-[scan-beam_2s_linear_infinite]"></div>
                  <User size={40} className="text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
            </div>

            {/* Floating Widgets */}
            <div className="absolute top-10 left-4 w-32 bg-[#0F172A]/90 border-l-2 border-yellow-500 p-3 rounded-r-lg backdrop-blur-md shadow-lg" style={{ transform: 'translateZ(60px)' }}>
              <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Productivity</div>
              <div className="text-xl font-mono text-yellow-400 font-bold flex items-center gap-2"><Zap size={14} className="fill-yellow-400" /> 94%</div>
            </div>

            <div className="absolute top-20 right-4 w-32 bg-[#0F172A]/90 border-r-2 border-emerald-500 p-3 rounded-l-lg backdrop-blur-md shadow-lg text-right" style={{ transform: 'translateZ(80px)' }}>
              <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Net Asset</div>
              <div className="text-lg font-mono text-emerald-400 font-bold flex items-center justify-end gap-2"><span className="text-xs text-emerald-600">▲</span> $12.4k</div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#020617] border border-blue-500/50 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.4)]" style={{ transform: 'translateZ(100px) translateX(-50%)' }}>
               <Shield size={14} className="text-blue-400" />
               <span className="text-[10px] font-bold text-white tracking-widest">SECURE_ENCLAVE</span>
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="h-40 bg-[#020617] border-t border-white/10 p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-[scan-beam_3s_linear_infinite] pointer-events-none"></div>
            <div className="space-y-1.5 font-mono text-[10px] relative z-10 text-slate-500">
              <div className="flex gap-2"><span>[09:41:22]</span><span>Initializing core services...</span></div>
              <div className="flex gap-2 text-blue-400"><span>[09:41:23]</span><span className="typing-effect">Mounting user_drive (Encrypted)</span></div>
              <div className="flex gap-2 text-purple-400"><span>[09:41:25]</span><span>Neural sync established.</span></div>
              <div className="mt-2 pl-2 border-l-2 border-green-500 animate-pulse text-green-500 font-bold">AWAITING USER INPUT_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicBlueprint;