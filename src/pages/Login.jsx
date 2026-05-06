import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Shield, Smartphone, Brain } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const benefits = [
    { icon: Zap, label: 'Real-Time Tracking', desc: 'Monitor finances instantly' },
    { icon: Brain, label: 'AI-Powered', desc: 'Smart financial insights' },
    { icon: Shield, label: 'Bank Secure', desc: 'End-to-end encrypted' },
    { icon: Smartphone, label: 'Any Device', desc: 'Works everywhere' }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '₹500Cr+', label: 'Tracked Transactions' },
    { number: '98%', label: 'User Satisfaction' }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Value Proposition */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        {/* Logo & Branding */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-16 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center font-black text-slate-900 text-xl group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300">
              L
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">LifeOS</h1>
              <p className="text-xs text-cyan-400 font-bold tracking-widest">PERSONAL FINANCE PLATFORM</p>
            </div>
          </Link>

          {/* Main Heading */}
          <div className="max-w-md">
            <h2 className="text-5xl font-black text-white mb-8 leading-tight">
              Welcome Back,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                Commander.
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              Access your personal operating system for finances, habits, and goals. Your data is always secure and encrypted.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Key Features</p>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white text-sm">{benefit.label}</span>
                  </div>
                  <p className="text-xs text-slate-400">{benefit.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Trusted by Thousands</p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-2xl font-black text-blue-400">{stat.number}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <Shield className="w-4 h-4 text-emerald-400" />
            PCI-DSS Compliant • End-to-End Encrypted
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center font-black text-slate-900">
              L
            </div>
            <h1 className="text-2xl font-black text-white">LifeOS</h1>
          </div>

          {/* Form Container */}
          <div className="bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2">Sign In</h2>
              <p className="text-slate-400 text-sm font-light">Access your financial dashboard and take control</p>
            </div>

            {/* Login Form Component */}
            <LoginForm />

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all group">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Google</span>
              </button>

              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all group">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-white/10">
              <p className="text-slate-400 text-sm mb-3">New to LifeOS?</p>
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors">
                Create your account free →
              </Link>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 font-semibold mb-4">Protected by industry-leading security</p>
            <div className="flex items-center justify-center gap-4 text-slate-600">
              <span className="text-xs">🔐 256-bit SSL</span>
              <span className="text-xs">✓ PCI-DSS</span>
              <span className="text-xs">🛡️ GDPR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
