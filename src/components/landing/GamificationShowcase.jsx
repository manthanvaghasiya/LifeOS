import React from 'react';
import { Gamepad2, Trophy, Zap, TrendingUp, Check } from 'lucide-react';

const GamificationShowcase = () => {
  const badges = [
    { icon: Trophy, label: 'Milestone Master', color: 'from-amber-500 to-orange-500' },
    { icon: Zap, label: 'Streak Champion', color: 'from-cyan-500 to-blue-500' },
    { icon: TrendingUp, label: 'Wealth Builder', color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <section id="gamification" className="relative py-24 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10 dark:from-amber-500/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Gamepad2 size={16} />
              <span>Gamified Experience</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
              Level Up Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Actual Life
              </span>
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">
              Every task completed, every habit maintained, and every goal achieved earns you Experience Points. Unlock ranks, earn badges, and build the ultimate character: yourself.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                'Earn XP from daily activities',
                'Unlock achievement badges',
                'Climb the global leaderboard',
                'Celebrate your progress'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Showcase Cards */}
          <div className="relative">
            {/* Main Profile Card */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-8 border border-slate-700 dark:border-slate-800 shadow-2xl">
              {/* Level Badge */}
              <div className="absolute -top-6 right-8 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 border-4 border-white dark:border-slate-950 shadow-xl">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">Lvl</p>
                  <p className="text-3xl font-black text-white">18</p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-8 pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-white dark:border-slate-700">
                    <span className="text-2xl font-black text-white">MC</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-xl">Master Commander</p>
                    <p className="text-amber-400 font-bold text-sm">Gold Tier Member</p>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Experience Progress</p>
                    <p className="text-amber-400 font-bold">7,850 / 10,000</p>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[78.5%]"></div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6">
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">Recent Badges</p>
                  <div className="flex gap-3">
                    {badges.map((badge, idx) => {
                      const IconComponent = badge.icon;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 bg-gradient-to-br ${badge.color} rounded-xl p-4 text-center group cursor-pointer hover:scale-105 transition-transform`}
                        >
                          <IconComponent className="w-6 h-6 text-white mx-auto mb-2" />
                          <p className="text-white text-xs font-bold">{badge.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <p className="text-amber-400 text-2xl font-black">156</p>
                    <p className="text-slate-400 text-xs font-bold uppercase">Habits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-400 text-2xl font-black">₹2.4L</p>
                    <p className="text-slate-400 text-xs font-bold uppercase">Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-cyan-400 text-2xl font-black">24</p>
                    <p className="text-slate-400 text-xs font-bold uppercase">Goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationShowcase;
