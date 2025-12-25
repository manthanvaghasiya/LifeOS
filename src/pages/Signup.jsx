import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, ArrowRight, CheckCircle2, Shield, 
  Github, Chrome, Eye, EyeOff, Zap, Layers, Wallet, Target, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 1. MOUSE PARALLAX EFFECT (Smoother)
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    // Smaller divisor = More movement. 
    const x = (e.clientX - left - width / 2) / 40; 
    const y = (e.clientY - top - height / 2) / 40;
    setMousePosition({ x, y });
  };

  // Form Logic
  useEffect(() => {
    const pwd = formData.password;
    let score = 0;
    if (pwd.length > 5) score++;
    if (pwd.length > 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isValid = (field) => {
    if (!touched[field]) return false;
    if (field === 'email') return /\S+@\S+\.\S+/.test(formData.email);
    if (field === 'fullName') return formData.fullName.length > 2;
    if (field === 'password') return formData.password.length >= 6;
    if (field === 'confirmPassword') return formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
    return false;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must accept the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Welcome to LifeOS!");
      navigate('/login');
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-900 bg-surface lg:bg-white">
      
      {/* =======================================================================
          LEFT SIDE: THE LEVITATING ECOSYSTEM (Redesigned)
         ======================================================================= */}
      <div 
        className="hidden lg:flex w-[48%] bg-[#0B1121] fixed left-0 top-0 h-full flex-col justify-between p-16 text-white overflow-hidden perspective-1000 z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      >
        {/* --- ATMOSPHERE LAYERS --- */}
        
        {/* 1. Deep Space Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0"></div>

        {/* 2. Grid Floor (The "Tron" Look) */}
        <div className="absolute bottom-0 left-[-50%] w-[200%] h-[50%] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] transform perspective-500 rotate-x-60 opacity-20 pointer-events-none"></div>

        {/* 3. Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000 duration-[12s]"></div>


        {/* --- LOGO --- */}
        <div className="relative z-10 flex items-center gap-3 animate-fade-in-down">
          <img src="/logo.png" alt="LifeOS Logo" className="h-10 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          <span className="text-2xl font-bold tracking-tight text-white">LifeOS</span>
        </div>


        {/* --- MAIN 3D COMPOSITION --- */}
        <div className="relative z-10 flex flex-col justify-center h-full">
          
          {/* IMPROVED TEXT: Bolder, Better Colors */}
          <div className="mb-16 relative z-20">
             <h2 className="text-6xl font-bold tracking-tight text-white">
               Architect your <br/>
               {/* Holographic Text Effect */}
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 animate-gradient-x">
                 digital destiny.
               </span>
             </h2>
             <p className="mt-6 text-lg text-blue-200/70 max-w-md leading-relaxed">
               Stop reacting. Start creating. The first operating system designed to synchronize your habits, finance, and work.
             </p>
          </div>

          {/* THE LEVITATING STACK (3 Cards hovering) */}
          <div className="relative w-full h-[300px]" style={{ transformStyle: 'preserve-3d' }}>
             
             {/* Card 1: Finance (Back Left) */}
             <div 
               className="absolute top-10 left-0 w-64 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl transition-transform duration-200 ease-out"
               style={{ transform: `translateX(${mousePosition.x * -0.5}px) translateY(${mousePosition.y * -0.5}px) scale(0.9)` }}
             >
                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg"><Wallet size={16} className="text-green-400"/></div>
                  <span className="text-sm font-medium text-white/80">Net Worth</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full w-[75%] bg-green-400"></div>
                </div>
                <span className="text-xs text-green-300">+24% this month</span>
             </div>

             {/* Card 2: Habits (Back Right) */}
             <div 
               className="absolute top-0 right-10 w-64 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl transition-transform duration-200 ease-out z-10"
               style={{ transform: `translateX(${mousePosition.x * 0.8}px) translateY(${mousePosition.y * 0.8}px) scale(0.95)` }}
             >
                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg"><Target size={16} className="text-purple-400"/></div>
                  <span className="text-sm font-medium text-white/80">Habit Streak</span>
                </div>
                <div className="flex justify-between gap-1">
                  {[1,2,3,4,5,6,7].map(d => (
                    <div key={d} className={`h-8 w-6 rounded-md ${d > 5 ? 'bg-white/5' : 'bg-purple-500/40 border border-purple-500/50'}`}></div>
                  ))}
                </div>
             </div>

             {/* Card 3: Main Focus (Front Center - The Hero) */}
             <div 
               className="absolute top-[80px] left-[15%] w-[320px] p-6 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-100 ease-out z-20 group"
               style={{ transform: `translateX(${mousePosition.x * 1.5}px) translateY(${mousePosition.y * 1.5}px)` }}
             >
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative bg-[#0f172a]/90 rounded-xl p-5 border border-white/5 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Current Focus</span>
                    <span className="text-xs bg-cyan-500/10 text-cyan-300 px-2 py-1 rounded border border-cyan-500/20 animate-pulse">Live</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Q4 Product Launch</h3>
                  <p className="text-sm text-slate-400 mb-4">Launch marketing campaign</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0f172a]"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#0f172a]"></div>
                    </div>
                    <span className="text-xs text-slate-400">+3 collaborators</span>
                  </div>
                </div>
             </div>

          </div>

        </div>

        {/* Footer */}
        <div className="relative z-10 flex gap-6 text-xs text-slate-400 font-medium tracking-wide">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">System Status: Optimal</span>
        </div>
      </div>

      {/* =======================================================
          RIGHT SIDE: THE FORM (Production Ready)
         ======================================================= */}
      <div className="w-full lg:w-[52%] lg:ml-auto flex flex-col justify-center items-center p-4 sm:p-12 xl:p-24 relative min-h-screen">
        
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex flex-col items-center mb-6 animate-fade-in-down">
          <img src="/logo.png" alt="LifeOS Logo" className="h-12 w-auto drop-shadow-lg mb-2" />
          <span className="text-xl font-bold text-secondary tracking-tight">LifeOS</span>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-[480px] bg-white lg:bg-transparent rounded-3xl shadow-xl lg:shadow-none p-6 sm:p-10 lg:p-0 border border-gray-100 lg:border-none animate-fade-in-up">
          
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight mb-2">Create Account</h1>
            <p className="text-text-muted text-base sm:text-lg">Start your 14-day free trial today.</p>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-text-body text-sm group">
               <Chrome size={20} className="text-text-body group-hover:text-primary transition-colors" /> 
               <span className="group-hover:text-text-main transition-colors">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-text-body text-sm group">
               <Github size={20} className="text-text-body group-hover:text-black transition-colors" /> 
               <span className="group-hover:text-text-main transition-colors">GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="group space-y-1.5">
              <label className="text-sm font-bold text-text-body ml-1 group-focus-within:text-primary transition-colors">Full Name</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  name="fullName" type="text" placeholder="John Doe"
                  value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
                  className={`w-full pl-12 pr-10 py-3.5 bg-surface border-2 ${errors.fullName ? 'border-error/50 bg-error/5' : isValid('fullName') ? 'border-success/50 bg-success/5' : 'border-transparent'} rounded-2xl focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10 transition-all outline-none font-medium text-text-main placeholder:text-gray-300`}
                />
                {isValid('fullName') && <CheckCircle2 className="absolute right-4 top-4 text-success animate-bounce-short" size={20} />}
              </div>
              {errors.fullName && <p className="text-xs text-error font-medium ml-1 animate-pulse">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="group space-y-1.5">
              <label className="text-sm font-bold text-text-body ml-1 group-focus-within:text-primary transition-colors">Email Address</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  name="email" type="email" placeholder="john@example.com"
                  value={formData.email} onChange={handleChange} onBlur={handleBlur}
                  className={`w-full pl-12 pr-10 py-3.5 bg-surface border-2 ${errors.email ? 'border-error/50 bg-error/5' : isValid('email') ? 'border-success/50 bg-success/5' : 'border-transparent'} rounded-2xl focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10 transition-all outline-none font-medium text-text-main placeholder:text-gray-300`}
                />
                 {isValid('email') && <CheckCircle2 className="absolute right-4 top-4 text-success animate-bounce-short" size={20} />}
              </div>
              {errors.email && <p className="text-xs text-error font-medium ml-1 animate-pulse">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="group space-y-1.5">
              <label className="text-sm font-bold text-text-body ml-1 group-focus-within:text-primary transition-colors">Password</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  name="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={formData.password} onChange={handleChange} onBlur={handleBlur}
                  className={`w-full pl-12 pr-12 py-3.5 bg-surface border-2 ${errors.password ? 'border-error/50 bg-error/5' : 'border-transparent'} rounded-2xl focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10 transition-all outline-none font-medium text-text-main placeholder:text-gray-300`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-text-body transition-colors focus:outline-none">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="overflow-hidden transition-all duration-500 ease-in-out" style={{ maxHeight: formData.password ? '24px' : '0px', opacity: formData.password ? 1 : 0 }}>
                <div className="flex gap-2 mt-2 px-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${passwordStrength >= level ? (passwordStrength < 2 ? 'bg-red-400' : passwordStrength < 4 ? 'bg-yellow-400' : 'bg-emerald-500') : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
              {errors.password && <p className="text-xs text-error font-medium ml-1 animate-pulse">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="group space-y-1.5">
              <label className="text-sm font-bold text-text-body ml-1 group-focus-within:text-primary transition-colors">Confirm Password</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <Shield className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  name="confirmPassword" type="password" placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                  className={`w-full pl-12 pr-10 py-3.5 bg-surface border-2 ${errors.confirmPassword ? 'border-error/50 bg-error/5' : isValid('confirmPassword') ? 'border-success/50 bg-success/5' : 'border-transparent'} rounded-2xl focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10 transition-all outline-none font-medium text-text-main placeholder:text-gray-300`}
                />
                 {isValid('confirmPassword') && <CheckCircle2 className="absolute right-4 top-4 text-success animate-bounce-short" size={20} />}
              </div>
              {errors.confirmPassword && <p className="text-xs text-error font-medium ml-1 animate-pulse">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <div className="relative flex items-center pt-0.5">
                <input
                  id="agreeTerms" name="agreeTerms" type="checkbox"
                  checked={formData.agreeTerms} onChange={handleChange}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-primary checked:bg-primary hover:border-primary"
                />
                <CheckCircle2 size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[40%] text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <label htmlFor="agreeTerms" className="text-sm text-text-muted cursor-pointer select-none leading-tight">
                I agree to the <Link to="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-xs text-error font-medium ml-1">{errors.agreeTerms}</p>}

            {/* Shimmer Button */}
            <button
              type="submit" disabled={isLoading}
              className="relative w-full py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 text-white font-bold bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <div className="relative flex justify-center items-center gap-2">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-lg">Create Account</span> 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="text-center text-sm text-text-muted pt-8">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline transition-all">Sign in</Link>
          </div>
          
          <div className="mt-8 text-center lg:hidden">
            <p className="text-xs text-gray-400">© 2025 LifeOS Inc.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;