import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin } from 'lucide-react';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-100 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-black text-white text-sm group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                L
              </div>
              <span className="text-xl font-black text-white">LifeOS</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your complete personal finance operating system. Manage finances, build habits, and achieve goals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Security', 'Roadmap'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Pricing' ? '/pricing' : '#'}
                    className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Contact', 'Careers'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Contact' ? '/contact' : '#'}
                    className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {['Privacy', 'Terms', 'Cookie Policy', 'Status'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Section - Contact & Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
              <a href="mailto:support@lifeos.app" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                support@lifeos.app
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
              <p className="text-sm font-medium text-white">Surat, India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
              <p className="text-sm font-medium text-emerald-400">All Systems Online</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {currentYear} LifeOS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500 mx-1" /> in Surat
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
