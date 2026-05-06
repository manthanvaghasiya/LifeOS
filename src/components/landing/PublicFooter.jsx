import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Github, Linkedin, Twitter, ArrowRight, Activity } from 'lucide-react';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800/50">
      {/* Newsletter Row */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-slate-800/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Stay in the loop</h3>
            <p className="text-sm text-slate-400">Get product updates, tips, and insights. No spam, ever.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-slate-900 font-semibold text-sm rounded-xl hover:bg-slate-100 transition-colors duration-300 whitespace-nowrap"
            >
              {subscribed ? '✓ Subscribed' : 'Stay updated'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-xl flex items-center justify-center font-black text-white text-sm group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                L
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-none">LifeOS</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium leading-none mt-0.5">
                  Design your life
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The unified operating system for your finances, habits, and goals — with gamification that makes progress addictive.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {[
                { name: 'Pricing', to: '/pricing' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { name: 'About', to: '/about' },
                { name: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {[
                { name: 'Privacy Policy', to: '/privacy' },
                { name: 'Terms of Service', to: '/terms' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Status Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-y border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Email</p>
              <a href="mailto:support@lifeos.app" className="text-sm font-medium text-white hover:text-blue-400 transition-colors duration-300">
                support@lifeos.app
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Location</p>
              <p className="text-sm font-medium text-white">Surat, India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Status</p>
              <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                All Systems Online
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500">
            <p>© {currentYear} LifeOS. All rights reserved.</p>
            <div className="flex items-center gap-1">
              Made with <Heart size={12} className="text-rose-500 fill-rose-500 mx-0.5" /> in Surat
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-300"
              aria-label="Follow us on Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-300"
              aria-label="Visit our GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-300"
              aria-label="Connect on LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
