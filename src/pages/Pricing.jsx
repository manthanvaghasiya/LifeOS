import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';
import { Check, X, ChevronDown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    description: 'For getting started',
    price: '₹0',
    period: '/month',
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
      { name: 'Priority support', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'For power users',
    price: '₹299',
    period: '/month',
    cta: 'Start Free Trial',
    ctaLink: '/signup',
    popular: true,
    features: [
      { name: 'Unlimited transactions', included: true },
      { name: 'Unlimited goals', included: true },
      { name: 'Advanced habit analytics', included: true },
      { name: 'Daily quest system', included: true },
      { name: 'Advanced analytics & reports', included: true },
      { name: 'Smart insights (AI-powered)', included: true },
      { name: 'Portfolio optimization', included: true },
      { name: 'Priority support (24/7)', included: true },
    ],
  },
];

const comparisonRows = [
  { feature: 'Transactions', free: '50/month', pro: 'Unlimited' },
  { feature: 'Goals', free: '3 active', pro: 'Unlimited' },
  { feature: 'Habit Tracking', free: 'Basic', pro: 'Advanced analytics' },
  { feature: 'XP System', free: 'Standard', pro: 'Full with quests' },
  { feature: 'Analytics', free: 'Basic', pro: 'Advanced reports' },
  { feature: 'AI Insights', free: '—', pro: '✓' },
  { feature: 'Portfolio Tracking', free: '—', pro: '✓' },
  { feature: 'CSV Export', free: '—', pro: '✓' },
  { feature: 'Support', free: 'Community', pro: '24/7 Priority' },
  { feature: 'Data Export', free: 'Limited', pro: 'Full' },
];

const faqs = [
  {
    q: 'Can I get a refund if I change my mind?',
    a: 'Yes. If you\'re not satisfied within the first 14 days of your Pro subscription, contact us for a full refund. No questions asked.',
  },
  {
    q: 'How secure is my financial data?',
    a: 'Your data is encrypted end-to-end with AES-256 encryption. We never store or have access to your bank credentials. All data is hosted on SOC 2 compliant infrastructure.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Absolutely. You can cancel your Pro subscription at any time from your Settings page. Your data stays accessible on the Free plan.',
  },
  {
    q: 'Can I switch between Free and Pro plans?',
    a: 'Yes. Upgrade to Pro anytime to unlock advanced features. Downgrade back to Free and your data is preserved — you just lose access to Pro-only features.',
  },
  {
    q: 'Do you offer a student discount?',
    a: 'Yes! Students with a valid .edu email address get 50% off the Pro plan. Reach out to support@lifeos.app with your student ID to claim it.',
  },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <PublicNavbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Invest in
              <br />
              <span className="text-slate-400 dark:text-slate-500">yourself.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-light">
              Transparent pricing. No hidden fees. First month free on Pro.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-32">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white dark:bg-white/[0.02] border rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'border-blue-200 dark:border-blue-500/20 shadow-xl dark:shadow-blue-500/5 ring-1 ring-blue-500/10'
                    : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Info */}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-sm text-slate-400 font-medium">{plan.period}</span>
                </div>
                {plan.popular && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-6">First month free. Cancel anytime.</p>
                )}
                {!plan.popular && <div className="mb-6" />}

                {/* CTA */}
                <Link
                  to={plan.ctaLink}
                  className={`block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-300 mb-8 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="h-px bg-slate-100 dark:bg-white/5 mb-6" />

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-blue-500' : 'text-slate-400'}`} />
                      ) : (
                        <X className="w-4 h-4 text-slate-200 dark:text-slate-700 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600 line-through'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto mb-32">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight">
              Compare plans
            </h2>

            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Feature</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">Free</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 text-center">Pro</span>
              </div>

              {/* Table Rows */}
              {comparisonRows.map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-3 gap-4 px-6 py-3.5 ${
                    idx < comparisonRows.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''
                  }`}
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{row.feature}</span>
                  <span className="text-sm text-slate-400 dark:text-slate-500 text-center">{row.free}</span>
                  <span className="text-sm text-slate-900 dark:text-white text-center font-medium">{row.pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight">
              Questions & Answers
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors duration-300"
                    aria-expanded={openFaq === idx}
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-6 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Pricing;
