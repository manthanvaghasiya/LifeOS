import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';
import { Check, X, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: '₹0',
      period: '/month',
      color: 'slate',
      cta: 'Get Started',
      ctaLink: '/signup',
      popular: false,
      features: [
        { name: 'Up to 50 transactions/month', included: true },
        { name: '3 active goals', included: true },
        { name: 'Basic habit tracking', included: true },
        { name: 'Standard XP system', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Smart insights (AI)', included: false },
        { name: 'Portfolio optimization', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Pro',
      description: 'Everything for power users',
      price: '₹299',
      period: '/month',
      color: 'blue',
      cta: 'Start Free Trial',
      ctaLink: '/signup',
      popular: true,
      badge: 'MOST POPULAR',
      trialBadge: 'First Month FREE',
      features: [
        { name: 'Unlimited transactions', included: true },
        { name: 'Unlimited goals', included: true },
        { name: 'Advanced habit analytics', included: true },
        { name: 'Daily quest system', included: true },
        { name: 'Advanced analytics & reports', included: true },
        { name: 'Smart insights (AI-powered)', included: true },
        { name: 'Portfolio optimization', included: true },
        { name: 'Priority support (24/7)', included: true }
      ]
    }
  ];

  const colorMap = {
    slate: {
      bg: 'bg-white dark:bg-white/[0.02]',
      border: 'border-slate-200 dark:border-white/[0.05]',
      text: 'text-slate-900 dark:text-white',
      badge: 'bg-slate-100 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300',
      button: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
      checkColor: 'text-slate-600 dark:text-slate-400'
    },
    blue: {
      bg: 'bg-white dark:bg-white/[0.05]',
      border: 'border-blue-200 dark:border-blue-500/30',
      text: 'text-slate-900 dark:text-white',
      badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      button: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700',
      checkColor: 'text-blue-600 dark:text-blue-400'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-20">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 mb-6">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Transparent Pricing • No hidden fees</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
            Invest in Yourself
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-light">
            Choose the perfect plan. Upgrade or downgrade anytime. First month free on Pro.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => {
            const colors = colorMap[plan.color];

            return (
              <div
                key={plan.name}
                className={`relative ${colors.bg} border ${colors.border} rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'ring-2 ring-blue-500/50 shadow-2xl dark:shadow-[0_0_40px_rgba(59,130,246,0.15)] transform scale-105 md:scale-100 md:-translate-y-4'
                    : 'hover:shadow-lg'
                }`}
              >
                {/* Badges */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${colors.badge}`}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                {plan.trialBadge && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{plan.trialBadge}</span>
                    </div>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className={`text-2xl font-black mb-2 ${colors.text}`}>{plan.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-black ${colors.text}`}>{plan.price}</span>
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{plan.period}</span>
                  </div>
                  {plan.name === 'Pro' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cancel anytime. No questions asked.</p>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  to={plan.ctaLink}
                  className={`w-full py-3 rounded-xl font-bold text-center transition-all duration-300 mb-8 ${colors.button}`}
                >
                  {plan.cta}
                </Link>

                {/* Divider */}
                <div className="h-px bg-slate-200 dark:bg-white/10 mb-8"></div>

                {/* Features List */}
                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`w-5 h-5 flex-shrink-0 ${colors.checkColor} mt-0.5`} />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 dark:text-slate-700 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-500 line-through'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Placeholder */}
        <div className="max-w-3xl mx-auto text-center mt-24 pt-24 border-t border-slate-200 dark:border-white/10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Questions?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Contact our support team at <span className="font-semibold text-slate-900 dark:text-white">support@lifeos.app</span>
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:shadow-lg transition-all">
            Get in Touch
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default Pricing;
