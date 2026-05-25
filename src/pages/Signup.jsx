import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle2 } from 'lucide-react';
import SignupForm from '../components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="h-screen w-full bg-slate-950 flex overflow-hidden selection:bg-emerald-500/30 text-white">
      {/* Left — premium visual panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">LifeOS</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 font-semibold leading-none mt-1">System</span>
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-7">
            <Zap size={14} />
            <span>Start Building</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight" style={{ lineHeight: '1.05' }}>
            Design your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              ideal future.
            </span>
          </h1>

          <p className="text-lg text-slate-400 font-light leading-relaxed mb-10">
            A unified operating system for your habits, finances, and goals. Stop drifting and start
            executing — for free.
          </p>

          <div className="space-y-4">
            {['Free forever plan', 'End-to-end encrypted', 'Set up in 2 minutes'].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="relative z-10 flex items-center gap-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>All systems operational</span>
        </div>
      </div>

      {/* Right — form area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative p-6 sm:p-12 h-screen overflow-y-auto no-scrollbar">
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

        <div className="w-full max-w-[400px] relative z-10 my-auto py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-base">
              L
            </div>
            <span className="text-2xl font-black tracking-tight text-white">LifeOS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-sm text-slate-400 font-light">Enter your details to get started for free.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-xl">
            <SignupForm />
          </div>

          <p className="mt-8 text-center text-[11px] text-slate-500 font-medium">
            Protected by 256-bit encryption. We never sell your data.
          </p>

          <p className="mt-6 text-center text-sm text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Signup;
