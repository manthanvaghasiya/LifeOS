import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const SignupForm = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
  });

  // Validation helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = (name) => name.trim().length >= 2;
  const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile.replace(/[- ]/g, ''));

  // Password strength calculation
  useEffect(() => {
    const pwd = formData.password;
    let score = 0;
    if (!pwd) {
      setPasswordStrength(0);
      return;
    }
    if (pwd.length > 5) score++;
    if (pwd.length > 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(Math.min(score, 4));
  }, [formData.password]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'text-rose-400';
    if (passwordStrength === 2) return 'text-amber-400';
    if (passwordStrength === 3) return 'text-blue-400';
    return 'text-emerald-400';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isValidName(formData.fullName)) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!isValidMobile(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (passwordStrength < 2) {
      newErrors.password = 'Password must be stronger. Try adding numbers and symbols';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/register', {
        name: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('authChange'));

      toast.success(`Welcome ${data.name}! Your account is ready. 🎉`);
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = isValidName(formData.fullName) && isValidMobile(formData.mobileNumber) && isValidEmail(formData.email) && passwordStrength >= 2 && agreeTerms;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name Field */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              setErrors({ ...errors, fullName: '' });
            }}
            className={`w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
              errors.fullName
                ? 'border-rose-500/50 focus:ring-rose-500/50'
                : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
            }`}
            placeholder="John Doe"
          />
          {formData.fullName && isValidName(formData.fullName) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {errors.fullName && (
          <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {errors.fullName}
          </p>
        )}
      </div>

      {/* Mobile Number Field */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Mobile Number
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => {
              setFormData({ ...formData, mobileNumber: e.target.value });
              setErrors({ ...errors, mobileNumber: '' });
            }}
            className={`w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
              errors.mobileNumber
                ? 'border-rose-500/50 focus:ring-rose-500/50'
                : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
            }`}
            placeholder="9876543210"
          />
          {formData.mobileNumber && isValidMobile(formData.mobileNumber) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {errors.mobileNumber && (
          <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {errors.mobileNumber}
          </p>
        )}
      </div>

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
              setErrors({ ...errors, email: '' });
            }}
            className={`w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
              errors.email
                ? 'border-rose-500/50 focus:ring-rose-500/50'
                : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
            }`}
            placeholder="you@example.com"
          />
          {formData.email && isValidEmail(formData.email) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {errors.email}
          </p>
        )}
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
              setErrors({ ...errors, password: '' });
            }}
            className={`w-full pl-11 pr-11 py-2.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
              errors.password
                ? 'border-rose-500/50 focus:ring-rose-500/50'
                : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
            }`}
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

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="space-y-1 mt-2">
            <div className="flex h-1 gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-full flex-1 rounded-full transition-all ${
                    passwordStrength >= level
                      ? passwordStrength === 1
                        ? 'bg-rose-500'
                        : passwordStrength === 2
                        ? 'bg-amber-500'
                        : passwordStrength === 3
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            {passwordStrength > 0 && (
              <p className={`text-[10px] font-semibold ${getPasswordStrengthColor()}`}>
                Strength: {getPasswordStrengthLabel()}
              </p>
            )}
          </div>
        )}

        {errors.password && (
          <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {errors.password}
          </p>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-2 pt-2">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => {
            setAgreeTerms(e.target.checked);
            setErrors({ ...errors, terms: '' });
          }}
          className="w-3.5 h-3.5 rounded border-white/20 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer mt-0.5 flex-shrink-0"
        />
        <label className="text-[11px] text-slate-400 cursor-pointer">
          I agree to the{' '}
          <Link to="#" className="text-white hover:text-emerald-400 transition-colors">
            Terms
          </Link>
          {' '}and{' '}
          <Link to="#" className="text-white hover:text-emerald-400 transition-colors">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.terms && (
        <p className="text-[10px] text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {errors.terms}
        </p>
      )}

      {/* General Error */}
      {errors.submit && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-medium">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full py-3 mt-4 bg-white hover:bg-slate-100 disabled:bg-white/10 text-slate-900 disabled:text-white/40 font-bold text-sm rounded-xl transition-all disabled:opacity-100 flex items-center justify-center gap-2 group"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};

export default SignupForm;
