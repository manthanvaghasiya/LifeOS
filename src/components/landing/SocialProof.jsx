import React from 'react';
import { TrendingUp, Flame, ShieldCheck, Star } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '₹2.4Cr+', label: 'Managed', color: 'text-emerald-500' },
  { icon: Flame, value: '10k+', label: 'Habits tracked', color: 'text-orange-500' },
  { icon: ShieldCheck, value: '94%', label: 'Streak retention', color: 'text-blue-500' },
  { icon: Star, value: '4.9★', label: 'Average rating', color: 'text-amber-500' },
];

const SocialProof = () => {
  return (
    <section className="relative py-16 px-6 border-y border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.015]">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-10">
          Built for people who care about their future
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`text-center ${idx < 3 ? 'md:border-r md:border-slate-200 md:dark:border-white/5' : ''}`}
              >
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-3`} />
                <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
