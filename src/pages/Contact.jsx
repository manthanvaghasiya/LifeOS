import React from 'react';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-500 pt-20">
      <PublicNavbar />
      
      <div className="max-w-3xl mx-auto px-6 py-24 relative">
        {/* Background Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Get in touch.</h1>
          <p className="text-slate-600 dark:text-slate-400 font-light">Need help setting up your LifeOS? We are here.</p>
        </div>

        <form className="relative z-10 bg-white dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-10 rounded-[2rem] shadow-2xl dark:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input type="email" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
            <textarea rows="5" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="How can we help you level up?"></textarea>
          </div>
          <button type="button" className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:scale-[1.02] transition-transform">Send Message</button>
        </form>
      </div>
      
      <PublicFooter />
    </div>
  );
};

export default Contact;