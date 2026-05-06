import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, X } from 'lucide-react';
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
    email: '',
    password: '',
  });

  // Validation helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = (name) => name.trim().length >= 2;

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
    if (passwordStrength === 1) return 'text-red-400';
    if (passwordStrength === 2) return 'text-yellow-400';
    if (passwordStrength === 3) return 'text-blue-400';
    return 'text-emerald-400';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isValidName(formData.fullName)) {
      newErrors.fullName = 'Name must be at least 2 characters';
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

  const isFormValid = isValidName(formData.fullName) && isValidEmail(formData.email) && passwordStrength >= 2 && agreeTerms;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name Field */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              setErrors({ ...errors, fullName: '' });
            }}
            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              errors.fullName
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/20 focus:ring-emerald-500/50'
            }`}
            placeholder="John Doe"
          />
          {formData.fullName && isValidName(formData.fullName) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        {errors.fullName && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.fullName}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrors({ ...errors, email: '' });
            }}
            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              errors.email
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/20 focus:ring-emerald-500/50'
            }`}
            placeholder="you@example.com"
          />
          {formData.email && isValidEmail(formData.email) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Password
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: '' });
            }}
            className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              errors.password
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/20 focus:ring-emerald-500/50'
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex h-2 gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-full flex-1 rounded-full transition-all ${
                    passwordStrength >= level
                      ? passwordStrength === 1
                        ? 'bg-red-500'
                        : passwordStrength === 2
                        ? 'bg-yellow-500'
                        : passwordStrength === 3
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            {passwordStrength > 0 && (
              <p className={`text-xs font-semibold ${getPasswordStrengthColor()}`}>
                Strength: {getPasswordStrengthLabel()}
              </p>
            )}
          </div>
        )}

        {errors.password && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.password}
          </p>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => {
            setAgreeTerms(e.target.checked);
            setErrors({ ...errors, terms: '' });
          }}
          className="w-4 h-4 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer mt-1 flex-shrink-0"
        />
        <label className="text-sm text-slate-300 cursor-pointer">
          I agree to the{' '}
          <Link to="#" className="text-emerald-400 hover:text-emerald-300 font-semibold">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="#" className="text-emerald-400 hover:text-emerald-300 font-semibold">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.terms && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {errors.terms}
        </p>
      )}

      {/* General Error */}
      {errors.submit && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full py-3 mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-60 flex items-center justify-center gap-2 group"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Sign In Link */}
      <p className="text-center text-xs text-slate-500 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
          Sign in here
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
