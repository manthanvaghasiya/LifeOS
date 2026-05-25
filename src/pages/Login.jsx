import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="h-screen w-full bg-slate-950 flex overflow-hidden selection:bg-blue-500/30 text-white">
      {/* Left — premium visual panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">LifeOS</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-blue-400 font-semibold leading-none mt-1">System</span>
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-7">
            <ShieldCheck size={14} />
            <span>Secure Access</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight" style={{ lineHeight: '1.05' }}>
            Welcome back to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              your system.
            </span>
          </h1>

          <p className="text-lg text-slate-400 font-light leading-relaxed mb-10">
            Step back into your secure dashboard to manage your finances, habits, and goals — exactly
            where you left off.
          </p>

          <div className="space-y-4">
            {['End-to-end encrypted data', 'Real-time financial syncing', 'Advanced analytics dashboard'].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
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
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

        <div className="w-full max-w-[400px] relative z-10 my-auto py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-base">
              L
            </div>
            <span className="text-2xl font-black tracking-tight text-white">LifeOS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Sign In</h2>
            <p className="text-sm text-slate-400 font-light">Access your personal operating system.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-xl">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-[11px] text-slate-500 font-medium">
            Protected by 256-bit encryption. We never sell your data.
          </p>

          <p className="mt-6 text-center text-sm text-slate-400 font-medium lg:hidden">
            New to LifeOS?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">
              Create an account
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

export default Login;
