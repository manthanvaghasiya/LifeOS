import React from 'react';
import { TrendingUp, Target, Zap, Brain, BarChart3, Lock } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Finance Tracking',
      description: 'Real-time expense tracking with AI-powered insights. Know exactly where your money goes.',
      gradient: 'from-emerald-500 to-teal-500',
      size: 'md:col-span-2'
    },
    {
      icon: Target,
      title: 'Goal Management',
      description: 'Set and crush financial goals with intelligent tracking.',
      gradient: 'from-blue-500 to-indigo-500',
      size: 'md:col-span-1'
    },
    {
      icon: Zap,
      title: 'Habit Tracking',
      description: 'Build wealth-building habits that stick with streak tracking.',
      gradient: 'from-amber-500 to-orange-500',
      size: 'md:col-span-1'
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Get actionable financial advice powered by machine learning.',
      gradient: 'from-pink-500 to-rose-500',
      size: 'md:col-span-1'
    },
    {
      icon: BarChart3,
      title: 'Portfolio Optimization',
      description: 'AI-powered investment recommendations tailored to your goals.',
      gradient: 'from-violet-500 to-purple-500',
      size: 'md:col-span-1'
    },
    {
      icon: Lock,
      title: 'Bank-Level Security',
      description: 'Your data is encrypted end-to-end. PCI-DSS compliant.',
      gradient: 'from-cyan-500 to-blue-500',
      size: 'md:col-span-1'
    }
  ];

  return (
    <section id="features" className="relative py-24 px-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-500">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-500">
            Everything you need to manage your finances, habits, and goals in one beautiful platform.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className={`${feature.size} group relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.gradient} p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer`}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-white/90 flex-grow">{feature.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider">Learn More</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
