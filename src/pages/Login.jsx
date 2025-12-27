import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, 
  ArrowRight, Check, Zap, Activity, Cpu, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';

/**
 * Reusable Social Button Component
 */
const SocialButton = ({ icon, label, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold text-slate-700 hover:shadow-md transform hover:-translate-y-0.5 duration-200 group active:scale-[0.98]"
  >
    {icon}
    <span className="group-hover:text-slate-900 transition-colors">{label}</span>
  </button>
);

/**
 * Reusable Input Field Component
 */
const InputField = ({ 
  label, name, type, placeholder, value, error, 
  onChange, icon: Icon, showPasswordToggle, onTogglePassword 
}) => (
  <div className="space-y-2 group">
    <label htmlFor={name} className="text-sm font-bold text-slate-700 ml-1 transition-colors group-focus-within:text-blue-600">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
      </div>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          block w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl text-slate-900 placeholder-gray-400 
          focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none font-medium
          ${error ? '!border-red-500 !bg-red-50 focus:!ring-red-500/10' : ''}
        `}
      />
      {showPasswordToggle && (
        <button 
          type="button" 
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-700 transition-colors cursor-pointer focus:outline-none"
          aria-label={type === 'password' ? "Show password" : "Hide password"}
        >
          {type === 'text' ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-bold ml-1 animate-pulse">{error}</p>}
  </div>
);

/**
 * 3D Visuals Component (Right Side - Desktop)
 */
const CommandCenterVisuals = ({ mousePosition }) => (
  <div className="hidden lg:flex w-[50%] fixed right-0 top-0 h-full bg-[#0B1121] flex-col justify-center p-12 xl:p-20 pt-32 text-white overflow-hidden perspective-1000 z-10">
    {/* Background Depth */}
    <div className="absolute inset-0 bg-gradient-to-bl from-[#0f172a] via-[#111827] to-[#0f172a] z-0"></div>
    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse duration-[8s]"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-1000 duration-[12s]"></div>

    {/* Central Content */}
    <div className="relative z-10 w-full max-w-lg mx-auto mt-10">
      <div className="mb-16 text-right">
          
          {/* Logo & Name - Positioned upside of "Design your life" */}
          <div className="flex items-center justify-end gap-3 mb-6 animate-fade-in-down">
            <img src="/logo.png" alt="LifeOS" className="h-10 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">LifeOS</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-4 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Zap size={10} className="fill-blue-300 animate-pulse" /> "Design your life"
          </div>
          
          <h1 className="text-white text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Welcome to your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-purple-400 animate-gradient-x">
              command center.
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-sm ml-auto">
            Your habits, finance, and goals are syncing in real-time. Ready to optimize your day?
          </p>
      </div>

      {/* 3D Floating Visuals */}
      <div className="relative w-full h-[320px]" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Background Card: Analytics */}
          <div 
            className="absolute top-10 right-0 w-64 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl will-change-transform"
            style={{ 
              transform: `translate3d(${mousePosition.x * -0.6}px, ${mousePosition.y * -0.6}px, 0) scale(0.9)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-400"/>
                <span className="text-xs font-semibold text-white/80">Velocity</span>
              </div>
              <span className="text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded">High</span>
            </div>
            <div className="flex items-end justify-between">
                <div className="flex gap-1 h-12 items-end">
                  <div className="w-2 h-[40%] bg-blue-500/30 rounded-t"></div>
                  <div className="w-2 h-[70%] bg-blue-500/50 rounded-t"></div>
                  <div className="w-2 h-[50%] bg-blue-500/40 rounded-t"></div>
                  <div className="w-2 h-[100%] bg-blue-400 rounded-t shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                </div>
                <span className="text-xl font-bold text-white">+12%</span>
            </div>
          </div>

          {/* Background Card: Global Sync */}
          <div 
            className="absolute top-4 left-0 w-64 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl will-change-transform"
            style={{ 
              transform: `translate3d(${mousePosition.x * 0.7}px, ${mousePosition.y * 0.7}px, 0) scale(0.9)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 bg-purple-500/20 rounded-lg"><Globe size={14} className="text-purple-400"/></div>
              <span className="text-xs font-semibold text-white/80">Global Sync</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Database Connected</span>
            </div>
          </div>

          {/* Hero Card: System Status */}
          <div 
            className="absolute top-[80px] left-0 right-0 mx-auto w-[320px] p-6 rounded-2xl bg-[#1e293b]/90 border border-cyan-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-20 backdrop-blur-xl group will-change-transform"
            style={{ 
              transform: `translate3d(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px, 0)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Cpu size={12} /> Core Systems
                </span>
                <span className="text-[10px] bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.2)]">Active</span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">Synchronization Complete</h3>
              <p className="text-xs text-slate-400 mb-5">User profile loaded successfully.</p>
              
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full w-full animate-pulse"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Loading assets...</span>
                <span className="text-cyan-400">100%</span>
              </div>
            </div>
          </div>

      </div>
    </div>

    {/* Footer */}
    <div className="absolute bottom-10 right-10 text-xs text-slate-500 flex gap-6 z-20 font-medium tracking-wide">
      <span className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</span>
      <span className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</span>
    </div>
  </div>
);

/**
 * Main Login Component
 */
const Login = () => {
  const navigate = useNavigate();
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  // Refs for animation optimization
  const requestRef = useRef();

  /**
   * Optimized 3D Parallax Logic
   * Uses requestAnimationFrame for 60fps performance
   */
  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 1024) return;
    
    if (requestRef.current) return;

    requestRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 45;
      const y = (e.clientY - top - height / 2) / 45;
      setMousePosition({ x, y });
      requestRef.current = null;
    });
  }, []);

  const handleMouseLeave = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = null;
    setMousePosition({ x: 0, y: 0 });
  };

  /**
   * Form Field Handler
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validation Logic
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Accessing terminal...");
    
    try {
      const { data } = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // 1. Store Data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name, // "Manthan"
        email: data.email,
        level: data.level || 1,
        currentXP: data.currentXP || 0
      }));

      // 2. Notify AuthContext (The Bridge)
      window.dispatchEvent(new Event('authChange')); 

      // 3. Single Navigation
      toast.success(`Welcome back, ${data.name}!`, { id: loadingToast });
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // SVGs for Social Icons
  const GoogleIcon = () => (
    <svg className="h-5 w-5 drop-shadow-sm transition-transform group-hover:scale-110" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.654-3.343-11.303-8l-6.571,4.819C9.656,39.663,16.318,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );

  const GithubIcon = () => (
    <svg className="h-5 w-5 drop-shadow-sm text-[#181717] transition-transform group-hover:scale-110" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.27 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.37-12-12-12"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex w-full font-sans bg-white text-slate-900 overflow-hidden">
      
      {/* =======================================================================
          LEFT SIDE: THE LOGIN FORM
         ======================================================================= */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center p-6 sm:p-12 xl:p-24 min-h-screen bg-white relative z-20">
        
        {/* --- MOBILE BRANDING --- */}
        <div className="lg:hidden flex flex-col items-center mb-10 animate-fade-in-down">
          <img src="/logo.png" alt="LifeOS Logo" className="h-12 w-auto drop-shadow-lg mb-2" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">LifeOS</span>
          <span className="text-lg text-slate-500 tracking-tight italic mt-1">"Design your life"</span>
        </div>

        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="mt-3 text-slate-500 text-lg">Enter your credentials to access the terminal.</p>
          </div>

          {/* --- SOCIAL BUTTONS --- */}
          <div className="flex gap-4">
            <SocialButton icon={<GoogleIcon />} label="Google" onClick={() => {}} />
            <SocialButton icon={<GithubIcon />} label="GitHub" onClick={() => {}} />
          </div>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or sign in with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* --- LOGIN FORM --- */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            <InputField 
              label="Email Address" name="email" type="email" placeholder="name@company.com"
              value={formData.email} onChange={handleChange}
              error={errors.email} icon={Mail}
            />

            <InputField 
              label="Password" name="password" 
              type={showPassword ? "text" : "password"} placeholder="••••••••"
              value={formData.password} onChange={handleChange}
              error={errors.password} icon={Lock}
              showPasswordToggle={true} onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Extras: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                   <Check size={12} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                </div>
                <label htmlFor="rememberMe" className="text-sm text-slate-600 font-medium cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              {/* Shine Animation */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out"></div>
              
              <div className="relative flex items-center gap-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 font-medium">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline transition-colors">Create one now</Link>
          </p>

        </div>
      </div>

      {/* --- RIGHT SIDE: VISUALS (Desktop Only) --- */}
      <CommandCenterVisuals mousePosition={mousePosition} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />

    </div>
  );
};

export default Login;
