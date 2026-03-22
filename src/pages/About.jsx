import React from 'react';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-500 pt-20">
      <PublicNavbar />
      
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="inline-block px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-sm font-bold tracking-widest uppercase mb-8">
          Our Story
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-12 tracking-tight">Built to cure <br/><span className="text-slate-400 dark:text-slate-500">app fatigue.</span></h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:font-light prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400">
          <p className="text-2xl font-medium text-slate-900 dark:text-white mb-8">
            We were tired of having our lives fragmented across a dozen different subscriptions.
          </p>
          <p>
            You know the feeling. You have one app for your budget, another for your daily to-do list, a physical journal for your habits, and a messy notes app for everything else. None of them talk to each other. None of them give you a complete picture of your life.
          </p>
          <p>
            Worse yet, productivity tools are boring. They feel like work. When tracking your personal goals feels like filling out corporate spreadsheets, you inevitably quit.
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">Enter LifeOS.</h3>
          <p>
            We decided to build a singular, unified platform. A true "Operating System" for the ambitious individual. But we didn't just want to combine tools; we wanted to change the psychology of productivity.
          </p>
          <p>
            By introducing real RPG-style gamification, LifeOS ensures that every time you stick to a habit, hit a financial goal, or complete a task, your brain gets the dopamine hit it needs to stay consistent. You aren't just crossing off a list anymore; you are leveling up your character.
          </p>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
};

export default About;