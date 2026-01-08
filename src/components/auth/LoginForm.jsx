import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import API from '../../services/api'; 
import { useToast } from '../../context/ToastContext'; // Powerful Alerts

const LoginForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation Logic
    if (!formData.email || !formData.password) {
        toast.warning("Please enter your credentials.");
        return;
    }

    setIsLoading(true);
    
    try {
      const { data } = await API.post('/auth/login', formData);
      
      // 2. Success Logic
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('authChange'));
      
      toast.success("Identity Verified. Welcome back, Commander.");
      navigate('/dashboard');
    } catch (error) {
      // 3. Error Logic (Powerful Feedback)
      const errorMsg = error.response?.data?.message || "Access Denied. Check your credentials.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-20">
      
      {/* Logo Section */}
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

      {/* Headlines */}
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
  );
};

export default LoginForm;