import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, Target, 
  StickyNote, Menu, X, LogOut, TrendingUp, Settings
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get User Data
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Achiever' };
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Helper for Link Styles (Pill Shape)
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" // <--- CHANGED TO BLUE
        : "text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
      
      <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        
        {/* 1. BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
          <img 
            src="/logo.png" 
            alt="LifeOS Logo" 
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" 
          />
          <span className="text-xl font-extrabold tracking-tight text-gray-900">LifeOS</span>
        </Link>

        {/* 2. DESKTOP FLOATING MENU */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/60 backdrop-blur-sm">
          <Link to="/" className={getLinkClass('/')}>
            <LayoutDashboard className="w-4 h-4"/> Dashboard
          </Link>
          <Link to="/habits" className={getLinkClass('/habits')}>
            <CalendarCheck className="w-4 h-4"/> Habits
          </Link>
          <Link to="/goals" className={getLinkClass('/goals')}>
            <Target className="w-4 h-4"/> Goals
          </Link>
          <Link to="/transactions" className={getLinkClass('/transactions')}>
            <TrendingUp className="w-4 h-4"/> Finance
          </Link>
          <Link to="/notes" className={getLinkClass('/notes')}>
            <StickyNote className="w-4 h-4"/> Notes
          </Link>
        </div>

        {/* 3. RIGHT SIDE: USER & CONTROLS */}
        <div className="flex items-center gap-3">
            
            {/* User Profile */}
            <Link to="/settings" className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 group cursor-pointer" title="Settings">
                <div className="text-right hidden lg:block">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">Account</p>
                    <p className="text-sm font-bold text-gray-800 leading-none">{user.name.split(' ')[0]}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                    {initials}
                </div>
            </Link>

            {/* Logout (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
               <button 
                  onClick={handleLogout}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout">
                  <LogOut className="w-5 h-5" />
               </button>
            </div>

            {/* Mobile Hamburger */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* 4. MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-2xl animate-slideDown z-40">
            <div className="p-4 space-y-2">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition" onClick={closeMenu}>
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <Link to="/habits" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition" onClick={closeMenu}>
                    <CalendarCheck className="w-5 h-5" /> Habits
                </Link>
                <Link to="/goals" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition" onClick={closeMenu}>
                    <Target className="w-5 h-5" /> Goals
                </Link>
                <Link to="/transactions" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition" onClick={closeMenu}>
                    <TrendingUp className="w-5 h-5" /> Finance
                </Link>
                <Link to="/notes" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition" onClick={closeMenu}>
                    <StickyNote className="w-5 h-5" /> Notes
                </Link>
                
                <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition" onClick={closeMenu}>
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;