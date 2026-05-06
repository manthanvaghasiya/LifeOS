import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isValidEmail(formData.email) && formData.password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your credentials.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/login', formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      if (rememberMe) localStorage.setItem('rememberMe', 'true');
      window.dispatchEvent(new Event('authChange'));

      toast.success(`Welcome back, ${data.name}! 🎉`);
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 animate-in">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setError('');
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
            placeholder="you@example.com"
          />
          {formData.email && isValidEmail(formData.email) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Password
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setError('');
            }}
            className="w-full pl-11 pr-11 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-[11px] pt-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-white/20 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer"
          />
          <span className="text-slate-400 group-hover:text-white transition-colors">
            Remember me
          </span>
        </label>
        <Link
          to="/"
          className="text-white hover:text-emerald-400 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full py-3 mt-4 bg-white hover:bg-slate-100 disabled:bg-white/10 text-slate-900 disabled:text-white/40 font-bold text-sm rounded-xl transition-all disabled:opacity-100 flex items-center justify-center gap-2 group"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
