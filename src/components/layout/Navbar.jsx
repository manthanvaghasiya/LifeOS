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
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'Achiever', level: 1, currentXP: 0, requiredXP: 100 });
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    const syncUser = () => {
        const stored = JSON.parse(localStorage.getItem('user'));
        if (stored) setUser(stored);
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
      {/* ==============================
          TOP HEADER (Desktop Nav + Mobile Logo/Profile)
          ============================== */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-gray-950/80 dark:border-gray-800 transition-colors duration-300">
        <div className="px-4 md:px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <img src="/logo.png" alt="LifeOS" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">LifeOS</span>
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50 dark:bg-gray-900/50 dark:border-gray-700">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive(item.path)
                  ? "bg-white text-blue-600 shadow-md shadow-gray-200 dark:bg-gray-800 dark:text-blue-400 dark:shadow-none translate-y-[-1px]" 
                  : "text-gray-500 hover:bg-gray-200/50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className="w-4 h-4"/> 
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side: XP, Theme, Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-900 dark:text-white mb-0.5">
                    <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>Lvl {user.level}</span>
                </div>
                <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
                </div>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <Link to="/settings" className="relative group cursor-pointer">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-transparent group-hover:ring-blue-400 transition-all">
                    {initials}
                </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ==============================
          MOBILE BOTTOM NAV (ELEVATED FLOATING DOCK)
          This appears fixed at the bottom of the screen on mobile.
          ============================== */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
        <div className="flex items-end justify-around bg-white/90 backdrop-blur-xl border border-white/40 dark:bg-gray-900/90 dark:border-gray-800 shadow-2xl shadow-blue-900/5 rounded-3xl px-2 h-[4.5rem]">
            
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className="flex flex-col items-center w-full relative group h-full justify-end pb-2"
                    >
                        {/* Icon Container with Pop-Up Animation */}
                        <div className={`absolute bottom-3 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex items-center justify-center ${
                            active 
                            ? "w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 -translate-y-4 scale-100" 
                            : "w-auto h-auto text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 translate-y-0 scale-90"
                        }`}>
                            <item.icon className={`${active ? "w-6 h-6" : "w-6 h-6"}`} />
                        </div>

                        {/* Label (Visible only when NOT active) */}
                        <span className={`text-[10px] font-bold transition-all duration-300 ${
                            active ? "opacity-0 translate-y-2" : "text-gray-500 dark:text-gray-400 opacity-100"
                        }`}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </div>
      </div>
    </>
  );
};

export default Navbar;