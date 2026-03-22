import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PublicNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  // State for scroll effect and mobile menu
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add scroll listener for dynamic floating effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Centralized navigation items (Added 'Home')
  const navItems = ['Home', 'Product', 'Manifesto', 'Pricing', 'Story'];

  // Helper to get the correct path
  const getPath = (item) => {
    if (item === 'Home') return '/';
    if (item === 'Story') return '/about';
    return `/${item.toLowerCase()}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      
      {/* --- FLOATING PILL CONTAINER --- */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`relative flex items-center justify-between px-4 sm:px-6 py-3 rounded-full border transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-[#030712]/80 backdrop-blur-2xl border-slate-200/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
            : 'bg-transparent border-transparent'
        }`}>
          
          {/* --- BRAND & LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group z-20">
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-md group-hover:shadow-blue-500/30 dark:group-hover:shadow-indigo-500/40 transition-all duration-300 w-10 h-10 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              {/* Actual Logo Image */}
              <img 
                src="/logo.png" 
                alt="LifeOS" 
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Life<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">OS</span>
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION (CENTERED) --- */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 bg-slate-100/50 dark:bg-white/[0.03] p-1 rounded-full border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
            {navItems.map((item) => {
              const path = getPath(item);
              const isActive = location.pathname === path;
              
              return (
                <Link 
                  key={item} 
                  to={path} 
                  className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? 'text-slate-900 dark:text-white bg-white dark:bg-white/10 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  {item}
                </Link>
              )
            })}
          </div>

          {/* --- RIGHT SIDE ACTIONS (DESKTOP) --- */}
          <div className="hidden md:flex items-center gap-4 z-20">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 hover:rotate-12"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>
            
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors px-2">
              Log in
            </Link>
            
            {/* Premium CTA Button */}
            <Link to="/signup" className="relative group px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:hidden"></div>
              <span className="relative z-10 group-hover:text-white dark:group-hover:text-slate-900">Get Started</span>
            </Link>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center gap-3 z-20">
            <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-white/5 rounded-full">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-900 dark:text-white bg-slate-100/50 dark:bg-white/5 rounded-full"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      <div className={`md:hidden absolute top-full left-4 right-4 mt-4 p-6 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl transition-all duration-300 origin-top ${mobileMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link 
              key={item} 
              to={getPath(item)}
              className="text-xl font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
          <div className="h-px w-full bg-slate-200 dark:bg-white/10 my-4"></div>
          <Link to="/login" className="text-center text-lg font-bold text-slate-900 dark:text-white py-3 border border-slate-200 dark:border-white/10 rounded-xl">
            Log in
          </Link>
          <Link to="/signup" className="text-center text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg shadow-blue-500/30">
            Get Started - Free
          </Link>
        </div>
      </div>
      
    </nav>
  );
};

export default PublicNavbar;