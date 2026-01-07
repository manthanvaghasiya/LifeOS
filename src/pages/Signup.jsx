import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, 
  Shield, Check, Cpu, Zap, Layers, Database, Wifi
} from 'lucide-react';
// 1. IMPORT TOAST HOOK
import { useToast } from '../context/ToastContext';
import API from '../services/api';

// --- PRODUCTION STYLES (Mobile Optimized) ---
const styles = `
  :root {
    --bg-primary: #050505;
    --text-primary: #e2e8f0;
    --card-bg: rgba(17, 25, 40, 0.75);
    --input-bg: #0B1121;
    --border-color: rgba(255, 255, 255, 0.125);
    --glass-blur: blur(16px) saturate(180%);
  }

  /* ANIMATIONS */
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
  @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  @keyframes grid-move {
    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* UTILITY CLASSES */
  .animate-aurora {
    background-image: 
      radial-gradient(at 100% 0%, hsla(220, 80%, 40%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 0%, hsla(260, 80%, 50%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(220, 80%, 40%, 1) 0px, transparent 50%);
    background-size: 200% 200%;
    animation: aurora 15s ease infinite alternate;
  }
  
  .input-group:focus-within .input-border { opacity: 1; transform: scale(1); }
  .perspective-container { perspective: 1200px; }
  .preserve-3d { transform-style: preserve-3d; }
  
  .grid-floor {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    animation: grid-move 3s linear infinite;
  }

  /* === MOBILE PERFORMANCE FIXES === */
  @media (max-width: 1024px) {
    .animate-aurora {
      animation: none; /* Stop heavy background animation */
      background: radial-gradient(circle at top, #1e1b4b 0%, #050505 100%);
    }
    .glass-card {
      background: #050505; /* Solid background instead of glass */
      backdrop-filter: none; /* GPU SAVER: No blur on mobile */
      border: none;
      box-shadow: none;
    }
  }

  @media (min-width: 1025px) {
    .glass-card {
      background: var(--card-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-color);
    }
  }
  /* --- HOLOGRAPHIC 2.0 STYLES --- */
@keyframes gyro-spin {
  0% { transform: rotate(0deg) rotateX(0deg); }
  100% { transform: rotate(360deg) rotateX(360deg); }
}
@keyframes dash-flow {
  to { stroke-dashoffset: -100; }
}
@keyframes float-y {
  0%, 100% { transform: translateY(0px) translateZ(50px); }
  50% { transform: translateY(-10px) translateZ(50px); }
}
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
.data-stream-path {
  stroke-dasharray: 5, 5;
  animation: dash-flow 1s linear infinite;
}
.gyro-ring {
  transform-style: preserve-3d;
}
`;
/**
 * 🚀 HOLOGRAPHIC BLUEPRINT 2.0 (High-Fidelity)
 */
const HolographicBlueprint = ({ mousePosition }) => {
  // Parallax Calculation Helpers
  // We amplify the mouse movement for inner elements to create depth
  const parallaxX = mousePosition.x * 20; 
  const parallaxY = mousePosition.y * 20;

  return (
    <div className="relative w-full h-full perspective-container flex items-center justify-center overflow-hidden rounded-r-[40px] bg-[#020617]">
      
      {/* 1. AMBIENT BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none"></div>
      
      {/* Moving Floor Grid (Atmosphere) */}
      <div className="absolute bottom-[-30%] left-[-50%] w-[200%] h-[150%] grid-floor opacity-40 pointer-events-none transform origin-bottom"
           style={{ transform: `rotateX(70deg) translateY(${mousePosition.y * 50}px)` }}></div>

      {/* === 2. THE MAIN 3D CHASSIS === */}
      <div 
        className="w-[420px] h-[580px] preserve-3d transition-transform duration-100 ease-out relative z-10"
        style={{ 
          transform: `rotateX(${mousePosition.y * -12}deg) rotateY(${mousePosition.x * 12}deg)` 
        }}
      >
        {/* GLASS CASING */}
        <div className="absolute inset-0 bg-[#0F172A]/60 border border-white/10 rounded-[30px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col overflow-hidden preserve-3d">
          
          {/* Inner Glare/Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none rounded-[30px]" style={{ transform: 'translateZ(1px)' }}></div>

          {/* HEADER: System Status */}
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

          {/* === 3. THE CORE REACTOR (Middle) === */}
          <div className="flex-1 relative flex items-center justify-center preserve-3d">
            
            {/* DATA PIPES (SVG Connectors) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" style={{ transform: 'translateZ(-10px)' }}>
              {/* Left Pipe */}
              <path d="M60 150 C 60 150, 150 150, 210 250" stroke="url(#blue-grad)" strokeWidth="2" fill="none" className="drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
              <path d="M60 150 C 60 150, 150 150, 210 250" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 8" className="animate-[dash-flow_1s_linear_infinite] opacity-50" />
              
              {/* Right Pipe */}
              <path d="M360 150 C 360 150, 270 150, 210 250" stroke="url(#purple-grad)" strokeWidth="2" fill="none" className="drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
              <path d="M360 150 C 360 150, 270 150, 210 250" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 8" className="animate-[dash-flow_1.5s_linear_infinite] opacity-50" />

              <defs>
                <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                <linearGradient id="purple-grad" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stopColor="#a855f7" stopOpacity="0" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
              </defs>
            </svg>

            {/* GYROSCOPE ASSEMBLY */}
            <div className="relative w-64 h-64 preserve-3d" style={{ transform: `translateZ(40px) rotateX(${parallaxY * 0.5}deg) rotateY(${parallaxX * 0.5}deg)` }}>
              
              {/* Outer Ring */}
              <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin-slow_20s_linear_infinite]" style={{ transform: 'translateZ(0px)' }}>
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
              </div>

              {/* Middle Ring (Tilted) */}
              <div className="absolute inset-8 border border-cyan-400/30 rounded-full animate-[spin-reverse_15s_linear_infinite]" style={{ transform: 'rotateX(60deg)' }}></div>
              
              {/* Inner Fast Ring */}
              <div className="absolute inset-16 border-l-2 border-r-2 border-indigo-400/60 rounded-full animate-[spin-slow_3s_linear_infinite] shadow-[0_0_20px_rgba(99,102,241,0.2)]"></div>

              {/* CENTER ORB (User Identity) */}
              <div className="absolute inset-0 flex items-center justify-center preserve-3d">
                <div className="w-24 h-24 rounded-full bg-[#020617] border border-blue-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.6)] relative overflow-hidden group">
                  {/* Holographic Scan Line inside Orb */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-[scan-beam_2s_linear_infinite]"></div>
                  
                  <User size={40} className="text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  
                  {/* Orb Particles */}
                  <div className="absolute inset-0 animate-[spin-slow_4s_linear_infinite] opacity-50">
                    <div className="absolute top-2 left-1/2 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* === 4. FLOATING AR WIDGETS (Pop out in Z-space) === */}
            
            {/* Widget: Performance (Left) */}
            <div 
              className="absolute top-10 left-4 w-32 bg-[#0F172A]/90 border-l-2 border-yellow-500 p-3 rounded-r-lg backdrop-blur-md shadow-lg"
              style={{ transform: 'translateZ(60px)' }} // Pushed forward 60px
            >
              <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Productivity</div>
              <div className="text-xl font-mono text-yellow-400 font-bold flex items-center gap-2">
                <Zap size={14} className="fill-yellow-400" />
                94%
              </div>
            </div>

            {/* Widget: Finance (Right) */}
            <div 
              className="absolute top-20 right-4 w-32 bg-[#0F172A]/90 border-r-2 border-emerald-500 p-3 rounded-l-lg backdrop-blur-md shadow-lg text-right"
              style={{ transform: 'translateZ(80px)' }} // Pushed forward 80px
            >
              <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Net Asset</div>
              <div className="text-lg font-mono text-emerald-400 font-bold flex items-center justify-end gap-2">
                <span className="text-xs text-emerald-600">▲</span>
                $12.4k
              </div>
            </div>

            {/* Widget: Security Badge (Bottom Floating) */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#020617] border border-blue-500/50 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              style={{ transform: 'translateZ(100px) translateX(-50%)' }} // Highest Z-Index
            >
               <Shield size={14} className="text-blue-400" />
               <span className="text-[10px] font-bold text-white tracking-widest">SECURE_ENCLAVE</span>
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>

          </div>

          {/* === 5. TERMINAL FOOTER (Data Rain) === */}
          <div className="h-40 bg-[#020617] border-t border-white/10 p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            
            {/* Scan Line Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-[scan-beam_3s_linear_infinite] pointer-events-none"></div>

            <div className="space-y-1.5 font-mono text-[10px] relative z-10">
              <div className="flex gap-2 text-slate-500">
                <span>[09:41:22]</span>
                <span>Initializing core services...</span>
              </div>
              <div className="flex gap-2 text-blue-400">
                <span>[09:41:23]</span>
                <span className="typing-effect">Mounting user_drive (Encrypted)</span>
              </div>
              <div className="flex gap-2 text-slate-500">
                <span>[09:41:24]</span>
                <span>Fetching habit metrics... OK</span>
              </div>
              <div className="flex gap-2 text-purple-400">
                <span>[09:41:25]</span>
                <span>Neural sync established.</span>
              </div>
              <div className="mt-2 pl-2 border-l-2 border-green-500 animate-pulse text-green-500 font-bold">
                 AWAITING USER INPUT_
              </div>
            </div>
          </div>

        </div>

        {/* Back Glow (Behind the Card) */}
        <div className="absolute inset-0 bg-blue-600/20 blur-[60px] -z-10 rounded-full" 
             style={{ transform: 'translateZ(-50px)' }}></div>
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  // 2. INITIALIZE TOAST
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // LOGIC: Mobile Detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', agreeTerms: false
  });

  const requestRef = useRef();

  // PERFORMANCE: Detect Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PERFORMANCE: Optimized Mouse Tracking (Disabled on Mobile)
  const handleMouseMove = useCallback((e) => {
    if (isMobile || requestRef.current) return;
    requestRef.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
      requestRef.current = null;
    });
  }, [isMobile]);

  // Logic: Password Strength
  useEffect(() => {
    const pwd = formData.password;
    let score = 0;
    if (!pwd) { setPasswordStrength(0); return; }
    if (pwd.length > 5) score++;
    if (pwd.length > 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields."); return;
    }
    if (!formData.agreeTerms) {
      toast.error("Please accept the Terms."); return;
    }

    setIsLoading(true);
    // Note: We don't use loading toasts anymore, we rely on the button spinner state.

    try {
      const { data } = await API.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('authChange'));
      
      // 3. SUCCESS TOAST
      toast.success(`Welcome, ${data.name}!`);
      navigate('/dashboard'); 
    } catch (error) {
      // 4. ERROR TOAST
      toast.error(error.response?.data?.message || "Registration failed.");
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
      
      {/* Background FX (Hidden on mobile via CSS) */}
      <div className="absolute inset-0 animate-aurora opacity-30 fixed pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay fixed pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1200px] h-auto lg:h-[750px] mx-4 rounded-2xl lg:rounded-[40px] glass-card shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/10 shrink-0 transition-all duration-300">
        
        {/* --- LEFT: FORM --- */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-20">
          
          {/* Logo Section - High Contrast Plate */}
          <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative w-12 h-12 flex-shrink-0">
              {/* Cyan Glow (Brighter than blue) */}
              <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              
              {/* Logo Container (Dark backing makes logo pop) */}
              <div className="relative w-full h-full bg-[#0F172A] border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-md">LifeOS</h1>
              {/* Status Line */}
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
                 <p className="text-[10px] text-cyan-200 font-bold uppercase tracking-[0.2em] opacity-80">Initialize</p>
              </div>
            </div>
          </div>

          {/* Headlines - Electric Contrast */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight leading-[1.2]">
              Begin your <br />
              {/* Gradient: Starts White -> Cyan -> Blue (Ensures readability) */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.25)]">
                Transformation.
              </span>
            </h2>
            
            {/* Subtext: Lighter Slate for better contrast against dark bg */}
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-cyan-500/50"></div>
              <p className="text-slate-300 text-sm font-medium">Initialize your personal command center.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            {/* Name Input */}
            <div className="space-y-1 group input-group relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-20 pointer-events-none" size={18} />
                <input 
                  type="text" 
                  value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl py-3.5 pl-11 pr-4 text-sm text-inherit placeholder-slate-600 focus:outline-none focus:ring-0 transition-all relative z-10"
                  placeholder="John Doe"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 input-border -z-0 blur-[2px] transition-all duration-300"></div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1 group input-group relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-20 pointer-events-none" size={18} />
                <input 
                  type="email" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl py-3.5 pl-11 pr-4 text-sm text-inherit placeholder-slate-600 focus:outline-none focus:ring-0 transition-all relative z-10"
                  placeholder="name@example.com"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 input-border -z-0 blur-[2px] transition-all duration-300"></div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1 group input-group relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-20 pointer-events-none" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl py-3.5 pl-11 pr-11 text-sm text-inherit placeholder-slate-600 focus:outline-none focus:ring-0 transition-all relative z-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-20 cursor-pointer">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 input-border -z-0 blur-[2px] transition-all duration-300"></div>
              </div>
              
              {/* Strength Meter */}
              <div className="flex h-1 gap-1 mt-2 px-1">
                {[1, 2, 3, 4].map((level) => (
                    <div key={level} className={`h-full rounded-full flex-1 transition-all duration-500 ${passwordStrength >= level ? (passwordStrength < 2 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 pt-2 cursor-pointer" onClick={() => setFormData(prev => ({...prev, agreeTerms: !prev.agreeTerms}))}>
              <div className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center shrink-0 ${formData.agreeTerms ? 'bg-blue-600 border-blue-600' : 'bg-[#0B1121] border-slate-600'}`}>
                {formData.agreeTerms && <Check size={12} className="text-white" />}
              </div>
              <p className="text-xs text-slate-400 select-none">I agree to the <span className="text-blue-400 underline">Terms of Service</span>.</p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 mt-4 group overflow-hidden relative"
            >
               {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                 <><span>Initialize Account</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
               )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
             <span className="text-slate-500">Already initialized? </span>
             <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">System Login</Link>
          </div>
        </div>

        {/* --- RIGHT: HOLOGRAPHIC BLUEPRINT (DESKTOP ONLY) --- */}
        {/* LOGIC: Completely remove this from DOM on mobile to prevent lag */}
        { !isMobile && (
          <div className="hidden lg:block w-1/2 relative bg-black/20">
             <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
             <HolographicBlueprint mousePosition={mousePosition} />
          </div>
        )}

      </div>
    </div>
  );
};

export default Signup;