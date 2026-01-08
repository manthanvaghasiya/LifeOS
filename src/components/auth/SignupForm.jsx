import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import API from '../../services/api'; // Adjusted path
import { useToast } from '../../context/ToastContext'; // Use Global Toast

const SignupForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', agreeTerms: false
  });

  // Real-time Password Strength Calculation
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

    // 1. Validation Logic with Toast Feedback
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Missing required fields.");
      return;
    }
    if (!formData.agreeTerms) {
      toast.warning("You must accept the Terms of Service.");
      return;
    }
    if (passwordStrength < 2) {
      toast.error("Password is too weak. Try adding numbers or symbols.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      // 2. Success Logic
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('authChange'));
      
      toast.success(`Access Granted. Welcome, ${data.name}!`);
      navigate('/dashboard'); 
    } catch (error) {
      // 3. Error Logic (Powerful Feedback)
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-20">
      
      {/* Header / Logo */}
      <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="relative w-12 h-12 flex-shrink-0">
          <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative w-full h-full bg-[#0F172A] border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-md">LifeOS</h1>
          <div className="flex items-center gap-2 mt-0.5">
             <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
             <p className="text-[10px] text-cyan-200 font-bold uppercase tracking-[0.2em] opacity-80">Initialize</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight leading-[1.2]">
          Begin your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.25)]">
            Transformation.
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-cyan-500/50"></div>
          <p className="text-slate-300 text-sm font-medium">Initialize your personal command center.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        {/* Name */}
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

        {/* Email */}
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

        {/* Password */}
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

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 pt-2 cursor-pointer" onClick={() => setFormData(prev => ({...prev, agreeTerms: !prev.agreeTerms}))}>
          <div className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center shrink-0 ${formData.agreeTerms ? 'bg-blue-600 border-blue-600' : 'bg-[#0B1121] border-slate-600'}`}>
            {formData.agreeTerms && <Check size={12} className="text-white" />}
          </div>
          <p className="text-xs text-slate-400 select-none">I agree to the <span className="text-blue-400 underline">Terms of Service</span>.</p>
        </div>

        {/* Action Button */}
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
  );
};

export default SignupForm;