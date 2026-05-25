import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Github, Linkedin, Instagram, ArrowRight, Check } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

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

  const columns = [
    {
      title: 'Product',
      links: [
        { name: 'Features', to: '/#features' },
        { name: 'Pricing', to: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', to: '/about' },
        { name: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', to: '/privacy' },
        { name: 'Terms of Service', to: '/terms' },
      ],
    },
  ];

  const socials = [
    { icon: Github, href: 'https://github.com', label: 'Visit our GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'Connect on LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Follow on Instagram' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-white/5">
      {/* Newsletter Row */}
      <div className="max-w-7xl mx-auto px-6 py-14 border-b border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-black tracking-tight text-white mb-2">Stay updated</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Product updates, design notes, and the occasional life-optimization tip. No spam, ever.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 md:w-72 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-300"
              required
            />
            <button
              type="submit"
              className={`px-5 py-3 bg-white text-slate-900 font-semibold text-sm rounded-xl hover:-translate-y-0.5 transition-all duration-300 ${ease} whitespace-nowrap flex items-center gap-1.5`}
            >
              {subscribed ? (
                <><Check className="w-4 h-4 text-emerald-600" /> Subscribed</>
              ) : (
                <>Subscribe <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white text-base group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                L
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white leading-none">LifeOS</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium leading-none mt-1">
                  Design your life
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The unified operating system for your finances, habits, and goals — with gamification
              that makes progress addictive.
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-5 text-xs uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((item) => (
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
          ))}
        </div>

        {/* Contact & Status Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-y border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center flex-shrink-0">
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
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Location</p>
              <p className="text-sm font-medium text-white">Surat, India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center flex-shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Status</p>
              <p className="text-sm font-medium text-emerald-400">All Systems Online</p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <p>© {currentYear} LifeOS. All rights reserved.</p>
            <span className="hidden sm:block w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1">
              Made with <Heart size={12} className="text-rose-500 fill-rose-500 mx-0.5" /> by Manthan in Surat
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
