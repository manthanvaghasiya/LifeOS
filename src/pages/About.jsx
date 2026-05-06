import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <PublicNavbar />

      <main className="pt-32 pb-24 px-6">
        {/* Hero */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/8 border border-indigo-200/50 dark:border-indigo-500/15 text-indigo-700 dark:text-indigo-400 text-xs font-medium uppercase tracking-wider mb-8">
            Our Story
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight" style={{ lineHeight: '1.05' }}>
            Built to cure
            <br />
            <span className="text-slate-300 dark:text-slate-600">app fatigue.</span>
          </h1>

          <p className="text-xl text-slate-900 dark:text-white font-medium mb-8 leading-relaxed">
            We were tired of having our lives fragmented across a dozen different subscriptions.
          </p>
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="space-y-6 text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            <p>
              You know the feeling. You have one app for your budget, another for your daily to-do list, a physical journal for your habits, and a messy notes app for everything else. None of them talk to each other. None of them give you a complete picture.
            </p>
            <p>
              Worse yet, productivity tools are boring. They feel like work. When tracking your personal goals feels like filling out corporate spreadsheets, you inevitably quit.
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mt-16 mb-8 tracking-tight">
            Enter LifeOS.
          </h2>

          <div className="space-y-6 text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            <p>
              We built a singular, unified platform — a true "Operating System" for the ambitious individual. But we didn't just want to combine tools. We wanted to change the psychology of productivity.
            </p>
            <p>
              By introducing real RPG-style gamification, LifeOS ensures that every time you stick to a habit, hit a financial goal, or complete a task, your brain gets the reward it needs to stay consistent. You aren't just crossing off a list. You're leveling up.
            </p>
          </div>
        </div>

        {/* Why Section */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">
            Why we built this.
          </h2>
          <div className="space-y-6 text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            <p>
              Because the tools that exist today were built for teams, not for individuals. They optimize for productivity, not for life. We believe personal growth deserves the same quality of software that billion-dollar companies get.
            </p>
            <p>
              LifeOS is our answer to the question: what would it look like if you treated your own life with the same rigor, intention, and design that the best companies treat their products?
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tight">
            The team.
          </h2>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black text-white">MV</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Manthan Vaghasiya</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">Founder & Builder</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Full-stack developer from Surat, India. Obsessed with building tools that make personal growth feel less like a chore and more like a game. Ships fast, iterates faster.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center pt-16 border-t border-slate-100 dark:border-white/5">
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 font-light">
            Ready to take control of your life?
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default About;
