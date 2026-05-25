import React from 'react';
import { Link2, Flame, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Connect your life',
    description: 'Add your finances, habits, and goals in minutes.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200/60 dark:border-blue-500/20',
  },
  {
    number: '02',
    icon: Flame,
    title: 'Build the habit',
    description: 'Track daily, earn XP, and build momentum that compounds.',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    border: 'border-orange-200/60 dark:border-orange-500/20',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Watch yourself level up',
    description: 'See real progress across every dimension of your life.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200/60 dark:border-emerald-500/20',
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-5 tracking-tight" style={{ lineHeight: '1.05' }}>
            Simple by design.
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light">
            Three steps to a more intentional life.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-8 left-[16.666%] right-[16.666%] h-px" aria-hidden="true">
            <div className="w-full h-full bg-gradient-to-r from-blue-300 via-orange-300 to-emerald-300 dark:from-blue-500/30 dark:via-orange-500/30 dark:to-emerald-500/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="text-center flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-6 backdrop-blur-sm`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em] mb-3">
                    Step {step.number}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[15rem]">
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
