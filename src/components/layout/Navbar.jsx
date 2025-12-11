import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, Target, 
  StickyNote, Menu, X, LogOut, TrendingUp, Settings, 
  Moon, Sun, Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  // Lock scroll
  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/login';
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const getLinkClass = (path, isMobile = false) => {
    const isActive = location.pathname === path;
    if (isMobile) {
        return `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all text-base ${
            isActive 
            ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`;
    }
    return `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
        isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50" 
        : "text-gray-500 hover:bg-white hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
    }`;
  };

  const xpPercent = Math.min((user.currentXP / user.requiredXP) * 100, 100);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 dark:bg-gray-950/80 dark:border-gray-800 transition-colors duration-300">
      <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group z-[60]" onClick={closeMenu}>
          <img src="/logo.png" alt="LifeOS" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">LifeOS</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/60 backdrop-blur-sm dark:bg-gray-900/50 dark:border-gray-700">
          <Link to="/" className={getLinkClass('/')}><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
          <Link to="/habits" className={getLinkClass('/habits')}><CalendarCheck className="w-4 h-4"/> Habits</Link>
          <Link to="/goals" className={getLinkClass('/goals')}><Target className="w-4 h-4"/> Goals</Link>
          <Link to="/transactions" className={getLinkClass('/transactions')}><TrendingUp className="w-4 h-4"/> Finance</Link>
          <Link to="/notes" className={getLinkClass('/notes')}><StickyNote className="w-4 h-4"/> Notes</Link>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 z-[60]">
            <div className="hidden xl:flex flex-col items-end mr-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-1">
                    <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>Lvl {user.level || 1}</span>
                </div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out" style={{ width: `${xpPercent}%` }}></div>
                </div>
            </div>

            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700 transition-all shadow-sm">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <Link to="/settings" className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-transparent group-hover:ring-blue-400 transition-all">
                    {initials}
                </div>
            </Link>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition shadow-sm">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* --- MOBILE FULLSCREEN MENU (FIXED) --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col pt-24 px-6 h-screen overflow-y-auto animate-fade-in">
            
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6 bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {initials}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded">Lvl {user.level || 1}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(user.currentXP)} / {user.requiredXP} XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${xpPercent}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="space-y-2 shrink-0">
                <Link to="/" className={getLinkClass('/', true)} onClick={closeMenu}><LayoutDashboard className="w-5 h-5" /> Dashboard</Link>
                <Link to="/habits" className={getLinkClass('/habits', true)} onClick={closeMenu}><CalendarCheck className="w-5 h-5" /> Habits</Link>
                <Link to="/goals" className={getLinkClass('/goals', true)} onClick={closeMenu}><Target className="w-5 h-5" /> Goals</Link>
                <Link to="/transactions" className={getLinkClass('/transactions', true)} onClick={closeMenu}><TrendingUp className="w-5 h-5" /> Finance</Link>
                <Link to="/notes" className={getLinkClass('/notes', true)} onClick={closeMenu}><StickyNote className="w-5 h-5" /> Notes</Link>
            </div>

            {/* DIVIDER (Fixed visibility) */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-800 w-full shrink-0"></div>

            {/* Actions */}
            <div className="space-y-3 pb-10 shrink-0">
                <Link to="/settings" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition" onClick={closeMenu}>
                    <Settings className="w-5 h-5" /> Settings
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition">
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;