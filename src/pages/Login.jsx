import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, 
  AlertCircle, Command, TrendingUp, Zap 
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { useMediaQuery } from '../hooks/useMediaQuery';

// --- SHARED STYLES (MATCHES SIGNUP) ---
const styles = `
  :root {
    --bg-primary: #050505;
    --text-primary: #e2e8f0;
    --card-bg: rgba(17, 25, 40, 0.75);
    --input-bg: #0B1121;
    --border-color: rgba(255, 255, 255, 0.125);
    --glass-blur: blur(16px) saturate(180%);
  }
  @keyframes aurora {
    0% { background-position: 50% 50%, 50% 50%; }
    100% { background-position: 350% 50%, 350% 50%; }
  }
  @keyframes scan-beam {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(500%); opacity: 0; }
  }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes shine { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
  
  .animate-aurora {
    background-image: 
      radial-gradient(at 100% 0%, hsla(220, 80%, 40%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 0%, hsla(260, 80%, 50%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(220, 80%, 40%, 1) 0px, transparent 50%);
    background-size: 200% 200%;
    animation: aurora 15s ease infinite alternate;
  }
  .perspective-container { perspective: 1200px; }
  .preserve-3d { transform-style: preserve-3d; }
  .grid-floor {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    transform: perspective(500px) rotateX(60deg);
  }
  @media (max-width: 1024px) {
    .animate-aurora { animation: none; background: radial-gradient(circle at top, #1e1b4b 0%, #050505 100%); }
    .glass-card { background: #050505; backdrop-filter: none; border: none; box-shadow: none; }
  }
  @media (min-width: 1025px) {
    .glass-card { background: var(--card-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--border-color); }
  }
`;

/**
 * 🚀 HOLOGRAPHIC COMMAND STATION (Visualizes Wealth, Habits, XP)
 */
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

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // LOGIC: Mobile Detection
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const requestRef = useRef();

  // LOGIC: Optimized Mouse Tracking
  const handleMouseMove = useCallback((e) => {
    if (isMobile || requestRef.current) return;
    requestRef.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
      requestRef.current = null;
    });
  }, [isMobile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Authenticating...");
    
    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('authChange'));
      
      toast.success("Identity Verified.", { id: loadingToast });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Access Denied", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] relative font-sans selection:bg-blue-500/30 py-6 sm:py-20 overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      <style>{styles}</style>
      
      {/* Background FX */}
      <div className="absolute inset-0 animate-aurora opacity-30 fixed pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay fixed pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1200px] h-auto lg:h-[750px] mx-4 rounded-2xl lg:rounded-[40px] glass-card shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/10 shrink-0">
        
        {/* --- LEFT: LOGIN FORM --- */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-20">
          
          {/* Logo Section - High Contrast */}
          <div className="flex items-center gap-4 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 bg-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-full h-full bg-[#0F172A] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md group-hover:text-blue-100 transition-colors">LifeOS</h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></div>
                 <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-[0.25em] drop-shadow-sm">System Online</p>
              </div>
            </div>
          </div>

          {/* Headlines - Electric Ice */}
          <div className="mb-10 relative">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight leading-[1.15]">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-400 to-purple-400 animate-[shine_5s_ease-in-out_infinite] bg-[length:200%_auto] drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                Commander.
              </span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-blue-500/50"></div>
              <p className="text-slate-300 text-lg">Enter credentials to unlock dashboard.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            {/* Email */}
            <div className="space-y-2 group input-group relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Identifier</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-20 pointer-events-none" size={18} />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-inherit placeholder-slate-600 focus:outline-none focus:ring-0 transition-all relative z-10" placeholder="user@lifeos.app"/>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 input-border -z-0 blur-[2px] transition-all duration-300"></div>
              </div>
            </div>
            {/* Password */}
            <div className="space-y-2 group input-group relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Passkey</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-20 pointer-events-none" size={18} />
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-12 text-inherit placeholder-slate-600 focus:outline-none focus:ring-0 transition-all relative z-10" placeholder="••••••••"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-20 cursor-pointer">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 input-border -z-0 blur-[2px] transition-all duration-300"></div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 mt-4 group overflow-hidden relative">
               {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (<><span>Unlock System</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>)}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-sm">
             <Link to="/signup" className="text-slate-400 hover:text-white transition-colors">Create Account</Link>
             <Link to="/forgot-password" className="text-slate-400 hover:text-white transition-colors">Forgot Password?</Link>
          </div>
        </div>

        {/* --- RIGHT: 3D COMMAND STATION (Desktop Only) --- */}
        { !isMobile && (
          <div className="hidden lg:block w-1/2 relative bg-black/20">
             <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
             <HolographicCommandStation mousePosition={mousePosition} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;