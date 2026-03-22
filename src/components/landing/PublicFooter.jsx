import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Heart } from 'lucide-react';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', path: '/product' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Manifesto', path: '/manifesto' },
      { name: 'Changelog', path: '#', badge: 'New' },
    ],
    company: [
      { name: 'Our Story', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '#' },
      { name: 'Blog', path: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
      { name: 'Cookie Policy', path: '#' },
    ]
  };

  return (
    <footer className="relative bg-white dark:bg-[#030712] border-t border-slate-200 dark:border-white/5 pt-24 pb-12 transition-colors duration-500 overflow-hidden">
      
      {/* --- COSMIC BACKGROUND GLOW --- */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          
          {/* --- BRAND SECTION --- */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-6 inline-flex">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group-hover:shadow-blue-500/30 transition-all duration-300">
                 <img src="/logo.png" alt="LifeOS" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Life<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">OS</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs leading-relaxed font-medium">
              Architect your daily existence. A unified operating system for habits, wealth, and goals.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, color: 'hover:text-[#1DA1F2] hover:bg-blue-500/10' },
                { icon: Github, color: 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-500/10' },
                { icon: Linkedin, color: 'hover:text-[#0A66C2] hover:bg-blue-600/10' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className={`w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color} hover:-translate-y-1`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* --- LINKS COLUMNS --- */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h4 className="text-slate-900 dark:text-white font-bold mb-6 uppercase tracking-widest text-xs">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors text-sm font-semibold flex items-center gap-2 group"
                    >
                      {link.name}
                      {link.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tighter">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* --- NEWSLETTER SECTION --- */}
          <div className="lg:col-span-1 lg:ml-auto">
             <h4 className="text-slate-900 dark:text-white font-bold mb-6 uppercase tracking-widest text-xs">
                Status
              </h4>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
              </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 dark:text-slate-500 text-xs font-medium">
            © {currentYear} LifeOS Labs. Built for the modern architect.
          </p>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
            Made with <Heart size={14} className="text-red-500 fill-red-500 animate-bounce" /> in Surat
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;