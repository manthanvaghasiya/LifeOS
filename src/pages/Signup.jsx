import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, ArrowRight, CheckCircle2, Shield, 
  Eye, EyeOff, Wallet, Target
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';

/**
 * Reusable Social Button Component
 */
const SocialButton = ({ icon, label, onClick, variant = 'light' }) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`
      flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-b-[4px] 
      transition-all duration-200 text-sm font-bold group active:border-b-2 active:translate-y-[2px]
      ${variant === 'dark' 
        ? 'bg-[#24292e] text-white border-[#24292e] border-b-black hover:bg-[#2f363d] hover:border-b-black shadow-lg shadow-gray-200' 
        : 'bg-white text-text-body border-gray-100 border-b-gray-200 hover:bg-gray-50 hover:border-b-gray-300'
      }
    `}
  >
    {icon}
    <span className={variant === 'light' ? 'group-hover:text-text-main transition-colors' : ''}>{label}</span>
  </button>
);

/**
 * Reusable Input Field Component with Validation & Icons
 */
const InputField = ({ 
  label, name, type, placeholder, value, error, isValid, 
  onChange, onBlur, icon: Icon, showPasswordToggle, onTogglePassword 
}) => (
  <div className="group space-y-1.5">
    <label className="text-sm font-bold text-text-body ml-1 group-focus-within:text-primary transition-colors cursor-pointer" htmlFor={name}>
      {label}
    </label>
    <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
      <Icon className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full pl-12 pr-12 py-3.5 bg-surface border-2 rounded-2xl transition-all outline-none font-medium text-text-main placeholder:text-gray-300
          focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10
          ${error ? 'border-error/50 bg-error/5' : isValid ? 'border-success/50 bg-success/5' : 'border-transparent'}
        `}
      />
      
      {/* Validation Icon or Password Toggle */}
      <div className="absolute right-4 top-4 flex items-center">
        {showPasswordToggle ? (
          <button 
            type="button" 
            onClick={onTogglePassword} 
            className="text-gray-400 hover:text-text-body transition-colors focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {type === 'text' ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        ) : isValid ? (
          <CheckCircle2 className="text-success animate-bounce-short" size={20} />
        ) : null}
      </div>
    </div>
    {error && <p className="text-xs text-error font-medium ml-1 animate-pulse">{error}</p>}
  </div>
);

/**
 * Password Strength Meter Component
 */
const PasswordStrengthMeter = ({ strength, visible }) => (
  <div 
    className="overflow-hidden transition-all duration-500 ease-in-out" 
    style={{ maxHeight: visible ? '24px' : '0px', opacity: visible ? 1 : 0 }}
  >
    <div className="flex gap-2 mt-2 px-1">
      {[1, 2, 3, 4].map((level) => (
        <div 
          key={level} 
          className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
            strength >= level 
              ? (strength < 2 ? 'bg-error' : strength < 4 ? 'bg-warning' : 'bg-success') 
              : 'bg-gray-100'
          }`} 
        />
      ))}
    </div>
    <p className="text-[10px] text-right mt-1 text-text-muted font-medium">
      {strength === 0 ? '' : strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong'}
    </p>
  </div>
);

/**
 * 3D Ecosystem Visuals (Left Side)
 */
const LevitatingEcosystem = ({ mousePosition }) => (
  <div className="relative z-10 flex flex-col justify-center h-full">
    <div className="mb-16 relative z-20">
      <h2 className="text-6xl font-bold tracking-tight text-white leading-[1.1]">
        Architect your <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 animate-gradient-x">
          digital destiny.
        </span>
      </h2>
      <p className="mt-6 text-lg text-blue-200/70 max-w-md leading-relaxed">
        Stop reacting. Start creating. The first operating system designed to synchronize your habits, finance, and work.
      </p>
    </div>

    <div className="relative w-full h-[300px]" style={{ transformStyle: 'preserve-3d' }}>
      {/* Finance Card */}
      <div 
        className="absolute top-10 left-0 w-64 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl transition-transform duration-75 ease-out will-change-transform"
        style={{ transform: `translate3d(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px, 0) scale(0.9)` }}
      >
        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
          <div className="p-2 bg-green-500/20 rounded-lg"><Wallet size={16} className="text-green-400"/></div>
          <span className="text-sm font-medium text-white/80">Net Worth</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-full w-[75%] bg-green-400"></div>
        </div>
        <span className="text-xs text-green-300 font-mono">+24% this month</span>
      </div>

      {/* Habits Card */}
      <div 
        className="absolute top-0 right-10 w-64 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl transition-transform duration-75 ease-out z-10 will-change-transform"
        style={{ transform: `translate3d(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px, 0) scale(0.95)` }}
      >
        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
          <div className="p-2 bg-purple-500/20 rounded-lg"><Target size={16} className="text-purple-400"/></div>
          <span className="text-sm font-medium text-white/80">Habit Streak</span>
        </div>
        <div className="flex justify-between gap-1">
          {[1,2,3,4,5,6,7].map(d => (
            <div key={d} className={`h-8 w-6 rounded-md transition-colors ${d > 5 ? 'bg-white/5' : 'bg-purple-500/40 border border-purple-500/50'}`}></div>
          ))}
        </div>
      </div>

      {/* Main Focus Card */}
      <div 
        className="absolute top-[80px] left-[15%] w-[320px] p-6 rounded-2xl bg-[#0f172a]/90 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-75 ease-out z-20 group will-change-transform"
        style={{ transform: `translate3d(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px, 0)` }}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative h-full">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Current Focus</span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 animate-pulse">Live</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Q4 Product Launch</h3>
          <p className="text-sm text-slate-400 mb-4">Launch marketing campaign</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0f172a] shadow-sm"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#0f172a] shadow-sm"></div>
            </div>
            <span className="text-xs text-slate-400 font-medium">+3 collaborators</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Main Signup Component
 */
const Signup = () => {
  const navigate = useNavigate();
  
  // -- State --
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // -- Refs for animation optimization --
  const requestRef = useRef();

  // -- Event Handlers --

  // Optimized Mouse Move with requestAnimationFrame
  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 1024) return; // Disable on mobile/tablet
    
    if (requestRef.current) return; // Skip if frame is already requested

    requestRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      // Calculate normalized position (-1 to 1) for smoother scaling
      const x = (e.clientX - left - width / 2) / 40; 
      const y = (e.clientY - top - height / 2) / 40;
      setMousePosition({ x, y });
      requestRef.current = null;
    });
  }, []);

  const handleMouseLeave = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = null;
    setMousePosition({ x: 0, y: 0 });
  };

  // Password Logic
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

  // Form Logic
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const checkValidity = (field) => {
    if (!touched[field]) return false;
    switch (field) {
      case 'email': return /\S+@\S+\.\S+/.test(formData.email);
      case 'fullName': return formData.fullName.trim().length > 2;
      case 'password': return formData.password.length >= 6;
      case 'confirmPassword': return formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
      default: return false;
    }
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
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, agreeTerms: true }); // Touch all on submit
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const { data } = await API.post('/auth/register', payload);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email
      }));

      toast.success(`Welcome to LifeOS, ${data.name}!`, { id: loadingToast });
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Registration Error:", error);
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // SVGs for Logos
  const GoogleLogo = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const GithubLogo = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.527.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.545 3.285-1.23 3.285-1.23.66 1.653.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex w-full font-sans overflow-x-hidden selection:bg-primary/30 selection:text-secondary bg-surface lg:bg-white">
      
      {/* =======================================================================
          LEFT SIDE: THE LEVITATING ECOSYSTEM (Desktop Only)
         ======================================================================= */}
      <div 
        className="hidden lg:flex w-[48%] bg-[#0B1121] fixed left-0 top-0 h-full flex-col justify-between p-16 text-white overflow-hidden perspective-1000 z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background & Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0"></div>
        <div className="absolute bottom-0 left-[-50%] w-[200%] h-[50%] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] transform perspective-500 rotate-x-60 opacity-20 pointer-events-none"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000 duration-[12s]"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3 animate-fade-in-down">
          <img src="/logo.png" alt="LifeOS Logo" className="h-10 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          <span className="text-2xl font-bold tracking-tight text-white">LifeOS</span>
        </div>

        {/* 3D Visuals Component */}
        <LevitatingEcosystem mousePosition={mousePosition} />

        {/* Footer */}
        <div className="relative z-10 flex gap-6 text-xs text-slate-400 font-medium tracking-wide">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">System Status: <span className="text-green-400">Optimal</span></span>
        </div>
      </div>

      {/* =======================================================
          RIGHT SIDE: THE SIGNUP FORM
         ======================================================= */}
      <div className="w-full lg:w-[52%] lg:ml-auto flex flex-col justify-center items-center p-4 sm:p-12 xl:p-24 relative min-h-screen">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden flex flex-col items-center mb-8 animate-fade-in-down">
          <img src="/logo.png" alt="LifeOS Logo" className="h-12 w-auto drop-shadow-lg mb-2" />
          <h1 className="text-2xl font-bold text-secondary tracking-tight">LifeOS</h1>
          <p className="text-text-muted">Design your life</p>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-[480px] bg-white lg:bg-transparent rounded-3xl shadow-xl lg:shadow-none p-6 sm:p-10 lg:p-0 border border-gray-100 lg:border-none animate-fade-in-up">
          
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight mb-2">Create Account</h1>
            <p className="text-text-muted text-base sm:text-lg">Start your 14-day free trial today.</p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <SocialButton icon={<GoogleLogo />} label="Google" onClick={() => {}} />
            <SocialButton icon={<GithubLogo />} label="GitHub" variant="dark" onClick={() => {}} />
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            <InputField 
              label="Full Name" name="fullName" type="text" placeholder="John Doe"
              value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
              error={errors.fullName} isValid={checkValidity('fullName')} icon={User}
            />

            <InputField 
              label="Email Address" name="email" type="email" placeholder="john@example.com"
              value={formData.email} onChange={handleChange} onBlur={handleBlur}
              error={errors.email} isValid={checkValidity('email')} icon={Mail}
            />

            <div>
              <InputField 
                label="Password" name="password" 
                type={showPassword ? "text" : "password"} placeholder="••••••••"
                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                error={errors.password} isValid={false} icon={Lock}
                showPasswordToggle={true} onTogglePassword={() => setShowPassword(!showPassword)}
              />
              <PasswordStrengthMeter strength={passwordStrength} visible={!!formData.password} />
            </div>

            <InputField 
              label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••"
              value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
              error={errors.confirmPassword} isValid={checkValidity('confirmPassword')} icon={Shield}
            />

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="relative flex items-center pt-0.5">
                <input
                  id="agreeTerms" name="agreeTerms" type="checkbox"
                  checked={formData.agreeTerms} onChange={handleChange}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <CheckCircle2 size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[40%] text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <label htmlFor="agreeTerms" className="text-sm text-text-muted cursor-pointer select-none leading-tight">
                I agree to the <Link to="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-xs text-error font-medium ml-1 mt-1">{errors.agreeTerms}</p>}

            {/* Submit Button */}
            <button
              type="submit" 
              disabled={isLoading}
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