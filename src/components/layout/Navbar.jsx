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
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/habits', label: 'Habits', icon: CalendarCheck },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/transactions', label: 'Finance', icon: TrendingUp },
    { path: '/notes', label: 'Notes', icon: StickyNote },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-4 z-50 w-full px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-2xl border border-blue-100 dark:bg-slate-950/80 dark:border-blue-900/30 rounded-[2rem] shadow-xl shadow-blue-500/5 px-6 py-3 flex justify-between items-center transition-all duration-300">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-all">
                <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="hidden md:block text-xl font-black tracking-tighter text-blue-600 dark:text-blue-400 uppercase">LifeOS</span>
          </Link>

          {/* Desktop Navigation (Floating Pill) */}
          <nav className="hidden lg:flex items-center gap-1 bg-blue-50/50 p-1 rounded-full border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                  : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" /> 
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Utilities */}
          <div className="flex items-center gap-4">
            {/* XP Progress Badge */}
            <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-tighter">
                    <Zap className="w-3 h-3 text-blue-500 fill-blue-500" />
                    <span>Lvl {user.level}</span>
                </div>
                <div className="w-24 h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-1000 ease-out" style={{ width: `${xpPercent}%` }}></div>
                </div>
            </div>

            {/* Dark Mode Switcher */}
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-all">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User Profile Avatar (Removed Green Dot) */}
            <Link to="/settings" className="relative group cursor-pointer ml-1">
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
                    {initials}
                </div>
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM DOCK
          Updated to Blue theme
      */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
        <div className="flex items-center justify-around bg-white/80 backdrop-blur-2xl border border-blue-100 dark:bg-slate-950/80 dark:border-blue-900/30 shadow-2xl rounded-[2rem] px-3 h-18 py-2">
            
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className="flex flex-col items-center justify-center w-full relative h-full"
                    >
                        <div className={`flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                            active 
                            ? "w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/40 -translate-y-8 rotate-[360deg]" 
                            : "w-10 h-10 text-slate-400 hover:text-blue-500 dark:hover:text-blue-300"
                        }`}>
                            <item.icon className={`${active ? "w-6 h-6" : "w-5 h-5"}`} />
                        </div>

                        {!active && (
                          <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 mt-1">
                              {item.label}
                          </span>
                        )}
                        
                        {active && (
                            <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                        )}
                    </Link>
                )
            })}
        </div>
      </div>
    </>
  );
};

export default Navbar;