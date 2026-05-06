import React from 'react';
import { Link2, Flame, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Connect your life',
    description: 'Add your finances, habits, and goals in minutes.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/8',
    border: 'border-blue-200/50 dark:border-blue-500/15',
  },
  {
    number: '02',
    icon: Flame,
    title: 'Build the habit',
    description: 'Track daily, earn XP, and build momentum that compounds.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-500/8',
    border: 'border-orange-200/50 dark:border-orange-500/15',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Watch yourself level up',
    description: 'See real progress across every dimension of your life.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/8',
    border: 'border-emerald-200/50 dark:border-emerald-500/15',
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-32 px-6 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Simple by design.
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light">
            Three steps to a more intentional life.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line — Desktop */}
          <div className="hidden md:block absolute top-16 left-[16.666%] right-[16.666%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-blue-300 via-orange-300 to-emerald-300 dark:from-blue-500/30 dark:via-orange-500/30 dark:to-emerald-500/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="text-center flex flex-col items-center">
                  {/* Icon Circle */}
                  <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  {/* Step Number */}
                  <span className="text-[11px] font-semibold text-slate-300 dark:text-slate-600 uppercase tracking-wider mb-3">
                    Step {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
