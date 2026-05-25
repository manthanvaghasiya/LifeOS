import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';
import { ArrowRight, Github, Linkedin } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <PublicNavbar />

      <main className="pt-36 pb-24 px-6">
        {/* Hero */}
        <header className="max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-medium uppercase tracking-wider mb-8">
            Our Story
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight" style={{ lineHeight: '1.02' }}>
            Built to cure
            <br />
            <span className="text-slate-300 dark:text-slate-600">app fatigue.</span>
          </h1>

          <p className="text-xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
            We were tired of having our lives fragmented across a dozen different subscriptions —
            none of which talked to each other.
          </p>
        </header>

        {/* The problem */}
        <section className="max-w-3xl mx-auto mb-20">
          <div className="space-y-6 text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            <p>
              You know the feeling. One app for your budget, another for your to-do list, a physical
              journal for habits, and a messy notes app for everything else. None of them give you a
              complete picture of your life.
            </p>
            <p>
              Worse, productivity tools are boring. They feel like work. When tracking your personal
              goals feels like filling out corporate spreadsheets, you inevitably quit.
            </p>
          </div>
        </section>

        {/* The solution */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-black mb-7 tracking-tight">Enter LifeOS.</h2>
          <div className="space-y-6 text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            <p>
              We built a single, unified platform — a true operating system for the ambitious
              individual. But we didn't just want to combine tools. We wanted to change the
              psychology of productivity itself.
            </p>
            <p>
              With real RPG-style gamification, every habit you keep, goal you hit, and rupee you
              save rewards your brain just enough to keep going. You aren't crossing off a list.
              You're <span className="text-slate-700 dark:text-slate-200 font-medium">leveling up.</span>
            </p>
          </div>
        </section>

        {/* Why */}
        <section className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-black mb-7 tracking-tight">Why we built this.</h2>
          <div className="space-y-6 text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            <p>
              The tools that exist today were built for teams, not for individuals. They optimize for
              output, not for life. We believe personal growth deserves the same quality of software
              that billion-dollar companies reserve for their products.
            </p>
            <p>
              LifeOS is our answer to a simple question: what would it look like to treat your own
              life with the rigor, intention, and design of the best products in the world?
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">The team.</h2>

          <div className="flex flex-col sm:flex-row items-start gap-6 p-6 lg:p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <span className="text-2xl font-black text-white">MV</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Manthan Vaghasiya</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">Founder &amp; Builder</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 max-w-md">
                Full-stack developer from Surat, India. Obsessed with building tools that make
                personal growth feel less like a chore and more like a game. Ships fast, iterates
                faster.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                  aria-label="Manthan on GitHub"
                >
                  <Github size={16} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                  aria-label="Manthan on LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-3xl mx-auto text-center pt-16 border-t border-slate-200 dark:border-white/5">
          <p className="text-2xl md:text-3xl font-black tracking-tight mb-6">
            Ready to take control of your life?
          </p>
          <Link
            to="/signup"
            className={`group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:-translate-y-0.5 transition-all duration-300 ${ease} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40`}
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default About;
