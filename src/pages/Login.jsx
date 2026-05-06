import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Activity, ShieldCheck } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="h-screen w-full bg-slate-950 flex overflow-hidden selection:bg-blue-500/30">
      {/* Left Side — Premium Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-950 flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-sm shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">LifeOS</span>
              <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold leading-none mt-0.5">
                System
              </span>
            </div>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Lock size={14} />
            <span>Secure Access</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight" style={{ lineHeight: '1.05' }}>
            Welcome back,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Commander.
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 font-light leading-relaxed mb-10">
            Enter your secure dashboard to manage your finances, habits, and overarching life goals.
          </p>

          <div className="space-y-4">
            {[
              'End-to-end encrypted data',
              'Real-time financial syncing',
              'Advanced analytics dashboard'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          <Activity className="w-4 h-4 text-blue-400" />
          <span>All systems operational</span>
        </div>
      </div>

      {/* Right Side — Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative p-6 sm:p-12 h-screen overflow-y-auto no-scrollbar">
        {/* Mobile background glows */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-[400px] relative z-10 my-auto py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-sm">
              L
            </div>
            <span className="text-2xl font-black tracking-tight text-white">LifeOS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Sign In</h2>
            <p className="text-sm text-slate-400 font-light">Access your personal operating system.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <LoginForm />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Protected by 256-bit encryption. We never sell your data.
            </p>
          </div>
          
          {/* Sign Up Link for Mobile/Small Screens */}
          <div className="mt-6 text-center">
             <p className="text-sm text-slate-400 font-medium">
                New to LifeOS?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">
                   Create an account
                </Link>
             </p>
          </div>
        </div>
      </div>
      
      {/* Custom CSS to hide scrollbar but allow scroll on tiny devices if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default Login;
