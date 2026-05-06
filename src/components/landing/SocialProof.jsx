import React from 'react';
import { TrendingUp, Flame, Star, Users } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '₹2.4Cr+', label: 'Finances managed', color: 'text-emerald-500' },
  { icon: Flame, value: '10k+', label: 'Habits tracked', color: 'text-orange-500' },
  { icon: Users, value: '94%', label: 'Streak retention', color: 'text-blue-500' },
  { icon: Star, value: '4.9★', label: 'Average rating', color: 'text-amber-500' },
];

const SocialProof = () => {
  return (
    <section className="relative py-16 px-6 border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm font-medium text-slate-400 dark:text-slate-500 mb-10 tracking-wide">
          Built for people who care about their future
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center group">
                <div className="flex justify-center mb-3">
                  <Icon className={`w-5 h-5 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
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
