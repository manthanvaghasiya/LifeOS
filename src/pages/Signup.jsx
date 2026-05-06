import React from 'react';
import SignupForm from '../components/auth/SignupForm';
import { Check } from 'lucide-react';

const Signup = () => {
  const benefits = [
    'Get started in under 2 minutes',
    'No credit card required',
    'First month completely free',
    'Cancel anytime, no questions asked',
    '24/7 customer support',
    'Secure & encrypted data'
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* LEFT: Value Proposition */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center font-black text-slate-900">
              L
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">LifeOS</h1>
              <p className="text-xs text-slate-400 font-semibold">Personal Finance Platform</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h2 className="text-5xl font-black mb-6 leading-tight tracking-tight">
              Start Your
              <br />
              Financial
              <br />
              Journey Today
            </h2>
            <p className="text-lg text-slate-300 font-light">
              Join thousands of users who are taking control of their finances, building wealth-building habits, and achieving their financial goals.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <Check className="w-3 h-3 text-slate-900 font-bold" />
                </div>
                <span className="text-sm font-medium text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="relative z-10">
          <div className="border-t border-slate-700 pt-8">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">100% Free Trial</p>
            <p className="text-sm text-slate-300">First 30 days completely free. No payment method required to start.</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center font-black text-white">
              L
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">LifeOS</h1>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
