import React from 'react';
import { TrendingUp, Zap, Flame } from 'lucide-react';

const AuthShowcase = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-r-[40px] bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#020617]">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>

      {/* Floating Cards Container */}
      <div className="relative w-full h-full flex items-center justify-center p-8">

        {/* Finance Card - Top Left */}
        <div className="absolute top-12 left-8 w-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl animate-[float_4s_ease-in-out_infinite] hover:shadow-emerald-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Portfolio</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Savings</span>
              <span className="text-sm font-bold text-white">₹45,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Invested</span>
              <span className="text-sm font-bold text-emerald-400">₹28,500</span>
            </div>
            <div className="h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* XP/Level Card - Center */}
        <div className="relative z-10 w-56 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-2xl border border-blue-500/40 rounded-3xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all duration-300 animate-[float_5s_ease-in-out_infinite_0.2s]">
          <div className="text-center space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Current Level</p>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">12</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-300 font-semibold">8,450 / 10,000 XP</p>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="w-[84%] h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>
            <p className="text-[10px] text-blue-300 font-medium">1,550 XP to next level</p>
          </div>
        </div>

        {/* Habits Card - Bottom Right */}
        <div className="absolute bottom-12 right-8 w-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 shadow-2xl animate-[float_4s_ease-in-out_infinite_0.4s] hover:shadow-orange-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Streaks</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-300 mb-2">Morning Routine</p>
              <div className="flex gap-1">
                {[1, 1, 1, 1, 1, 0, 1].map((d, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-3 rounded-sm transition-all ${
                      d ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] text-orange-300 font-bold">14 Days 🔥</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default AuthShowcase;
