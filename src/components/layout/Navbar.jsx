import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../../services/api'; // Need API to fetch fresh XP
import { 
  Wallet, LayoutDashboard, CalendarCheck, Target, 
  StickyNote, Menu, X, LogOut, TrendingUp, Settings, Moon, Sun, Zap 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  // User State with XP
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'Achiever', level: 1, currentXP: 0, requiredXP: 100 });
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Fetch latest stats on mount
  // LIVE XP UPDATE LISTENER
  useEffect(() => {
    const syncUser = () => {
        const stored = JSON.parse(localStorage.getItem('user'));
        if (stored) setUser(stored);
    };

    // Initial Load
    syncUser();

    // Listen for our custom event
    window.addEventListener('xpUpdate', syncUser);
    
    // Cleanup
    return () => window.removeEventListener('xpUpdate', syncUser);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105 dark:shadow-blue-900" 
        : "text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
    }`;
  };

  // Calculate XP Percentage
  const xpPercent = Math.min((user.currentXP / user.requiredXP) * 100, 100);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800 transition-colors duration-300">
      
      <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
          <img src="/logo.png" alt="LifeOS" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">LifeOS</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/60 backdrop-blur-sm dark:bg-gray-800/50 dark:border-gray-700">
          <Link to="/" className={getLinkClass('/')}><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
          <Link to="/habits" className={getLinkClass('/habits')}><CalendarCheck className="w-4 h-4"/> Habits</Link>
          <Link to="/goals" className={getLinkClass('/goals')}><Target className="w-4 h-4"/> Goals</Link>
          <Link to="/transactions" className={getLinkClass('/transactions')}><TrendingUp className="w-4 h-4"/> Finance</Link>
          <Link to="/notes" className={getLinkClass('/notes')}><StickyNote className="w-4 h-4"/> Notes</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
            
            {/* GAMIFICATION BAR (New Feature) */}
            <div className="hidden lg:flex flex-col items-end mr-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-1">
                    <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>Lvl {user.level || 1}</span>
                </div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
                        style={{ width: `${xpPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* THEME TOGGLE */}
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700 transition-all">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* PROFILE */}
            <Link to="/settings" className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 group cursor-pointer">
                <div className="text-right hidden lg:block">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Account</p>
                    <p className="text-sm font-bold text-gray-800 leading-none dark:text-gray-200">{user.name.split(' ')[0]}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-transparent group-hover:ring-blue-100 dark:group-hover:ring-blue-900 transition-all">
                    {initials}
                </div>
            </Link>

            {/* LOGOUT */}
            <div className="hidden md:flex items-center gap-1">
               <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"><LogOut className="w-5 h-5" /></button>
            </div>

            {/* MOBILE HAMBURGER */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-2xl animate-slideDown z-40 dark:bg-gray-900/95 dark:border-gray-800">
            <div className="p-4 space-y-2">
                <div className="flex items-center justify-between px-4 pb-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Current Level</span>
                    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Lvl {user.level || 1}</span>
                </div>
                <div className="px-4 mb-4">
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${xpPercent}%` }}></div>
                    </div>
                </div>
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 transition" onClick={closeMenu}><LayoutDashboard className="w-5 h-5" /> Dashboard</Link>
                {/* ... other mobile links ... */}
                <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2 space-y-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"><LogOut className="w-5 h-5" /> Logout</button>
                </div>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;