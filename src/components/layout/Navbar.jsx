import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, Target, 
  StickyNote, TrendingUp, Moon, Sun, Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // XP & USER STATE
  const [user, setUser] = useState({ name: 'Achiever', level: 1, currentXP: 0, requiredXP: 100 });
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    const syncUser = () => {
        try {
            const stored = JSON.parse(localStorage.getItem('user'));
            if (stored) setUser(stored);
        } catch (e) {
            console.error("Error syncing user progress", e);
        }
    };
    syncUser();
    window.addEventListener('xpUpdate', syncUser);
    return () => window.removeEventListener('xpUpdate', syncUser);
  }, []);

  const xpPercent = Math.min((user.currentXP / user.requiredXP) * 100, 100);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/habits', label: 'Habits', icon: CalendarCheck },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/transactions', label: 'Finance', icon: TrendingUp },
    { path: '/notes', label: 'Notes', icon: StickyNote },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR - FIXED & STRAIGHT */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                <img src="/logo.png" alt="LifeOS Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            {/* UPDATED: Removed 'hidden sm:block' so it shows on mobile too */}
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block">
                Life<span className="text-blue-600 dark:text-blue-400">OS</span>
            </span>
          </Link>

          {/* DESKTOP NAV - CURVED PILL SHAPE */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-1.5 rounded-full">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive(item.path)
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-4 h-4" /> 
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Utilities */}
          <div className="flex items-center gap-4">
            {/* XP Badge */}
            <div className="hidden md:flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    <Zap className="w-3 h-3 fill-blue-600 dark:fill-blue-400" />
                    <span>Lvl {user.level}</span>
                </div>
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(37,99,235,0.3)]" 
                        style={{ width: `${xpPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Theme Toggle Button */}
            <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Profile Avatar */}
            <Link to="/settings" className="transition-transform active:scale-95">
                <div className="w-9 h-9 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-blue-500/20">
                    {initials}
                </div>
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM DOCK - ROUNDED & PREMIUM */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm">
        <div className="flex items-center justify-around bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-[2.5rem] p-2.5">
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
                            active 
                            ? "bg-blue-600 text-white w-14 h-14 -translate-y-4 rounded-full shadow-xl shadow-blue-500/40" 
                            : "text-slate-400 w-12 h-12 hover:text-blue-500"
                        }`}
                    >
                        <item.icon className={active ? "w-6 h-6" : "w-5 h-5"} />
                        {!active && (
                          <span className="text-[9px] font-bold uppercase mt-1">
                              {item.label.substring(0, 4)}
                          </span>
                        )}
                        {active && (
                            <div className="absolute -bottom-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full dark:bg-blue-400"></div>
                        )}
                    </Link>
                )
            })}
        </div>
      </div>

      {/* Fixed Header Spacer */}
      <div className="h-16 w-full"></div>
    </>
  );
};

export default Navbar;
