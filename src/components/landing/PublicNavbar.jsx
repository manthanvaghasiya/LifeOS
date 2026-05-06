import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PublicNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group z-20">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-xl flex items-center justify-center font-black text-white text-sm group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                LifeOS
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">
                Design your life
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — Center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side — Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile — Right Side */}
          <div className="md:hidden flex items-center gap-2 z-20">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all duration-300"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — Full-Width Sheet */}
      <div
        className={`md:hidden fixed inset-0 top-[72px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 ease-out ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              to={link.href}
              className={`block text-lg font-medium py-3 px-4 rounded-xl transition-all duration-300 ${
                isActive(link.href)
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <Link
              to="/login"
              className="block w-full text-center py-3 text-sm font-medium text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="block w-full text-center py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
