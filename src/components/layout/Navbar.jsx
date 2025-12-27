import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Target,
  StickyNote, TrendingUp, Moon, Sun, Zap, Menu
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ path, label, icon: Icon, isActive, isMobile }) => {
  if (isMobile) {
    return (
      <Link
        to={path}
        className={`relative flex flex-col items-center justify-center transition-all duration-300 ${isActive
            ? "text-blue-600 -translate-y-3"
            : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          }`}
      >
        <div className={`p-3 rounded-full transition-all duration-300 ${isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110"
            : "bg-transparent"
          }`}>
          <Icon size={isActive ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        {isActive && (
          <span className="absolute -bottom-6 text-[10px] font-bold tracking-wide animate-fade-in text-blue-600 dark:text-blue-400">
            {label}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link 
      to={path} 
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group ${
        isActive
          ? "text-blue-600 bg-blue-50/80 dark:bg-blue-900/20 dark:text-blue-400" 
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
      }`}
    >
      <Icon size={18} className={`transition-colors ${isActive ? "fill-blue-600/20 dark:fill-blue-400/20" : ""}`} /> 
      
      {/* WRAP LABEL: This ensures the line is exactly under the text */}
      <span className="relative">
        {label}
        {/* ANIMATED DRAWING LINE: Width transitions from 0 to full */}
        <span className={`absolute -bottom-1 left-0 h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0"}`}></span>
      </span>
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const themeContext = useTheme();

  // Safety check for context
  const { theme, toggleTheme } = themeContext || { theme: 'light', toggleTheme: () => { } };

  const { user } = useAuth();

  // 3. [FIXED] Get First Letter of Name (Fallback to 'U' only if name is missing)
  const initials = user.name && user.name !== 'User' ? user.name.charAt(0).toUpperCase() : 'U';

  const xpPercent = user.requiredXP ? Math.min((user.currentXP / user.requiredXP) * 100, 100) : 0;

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard }, // Fixed Home Link
    { path: '/habits', label: 'Habits', icon: CalendarCheck },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/transactions', label: 'Finance', icon: TrendingUp },
    { path: '/notes', label: 'Notes', icon: StickyNote },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full pt-4 px-6 hidden lg:block pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-black/20 rounded-2xl px-4 py-3 flex justify-between items-center transition-all duration-300">

           {/* Brand */}
           <Link to="/" className="flex items-center gap-3 group">
              
              {/* FIX: Size w-10 (40px) | scale-105 removes internal whitespace | object-cover fills corners */}
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-md group-hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center overflow-hidden">
                 <img 
                   src="/logo.png" 
                   alt="LifeOS" 
                   className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-300" 
                 />
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  Life<span className="text-blue-600 dark:text-blue-400">OS</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Design your life
                </span>
              </div>
            </Link>

            {/* Navigation Pills */}
            <nav className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-950/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-800/50">
              {navItems.map((item) => (
                <NavItem key={item.path} {...item} isActive={isActive(item.path)} isMobile={false} />
              ))}
            </nav>

            {/* Right Side: XP & Profile */}
            <div className="flex items-center gap-5">

              {/* XP Bar (Improved) */}
              <div className="group relative flex flex-col items-end min-w-[120px] cursor-help">
                
                {/* 1. HOVER TOOLTIP: Shows "XP Remaining" */}
                <div className="absolute -bottom-10 right-0 w-max opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                  <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-slate-700">
                    {user.requiredXP - user.currentXP} XP to Level {user.level + 1}
                  </div>
                  {/* Little Arrow */}
                  <div className="absolute -top-1 right-6 w-2 h-2 bg-slate-800 rotate-45 border-t border-l border-slate-700"></div>
                </div>

                {/* 2. LABELS: Added icon background & better spacing */}
                <div className="flex items-center gap-2 mb-1.5 transition-transform group-hover:-translate-y-0.5 duration-300">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-0.5 rounded-full">
                    <Zap size={10} className="text-amber-500 fill-amber-500 animate-pulse" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 tracking-tight">
                    Lvl {user.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                    {user.currentXP} <span className="text-slate-300 dark:text-slate-600">/</span> {user.requiredXP} XP
                  </span>
                </div>

                {/* 3. BAR: Richer Gradient & Inner Shadow */}
                <div className="w-36 h-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative group-hover:brightness-110"
                    style={{ width: `${xpPercent}%` }}
                  >
                    {/* Shiny Leading Edge */}
                    <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-all hover:rotate-12 active:scale-95"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
              </button>

              {/* Profile */}
              {/* Profile */}
              <Link to="/settings" className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      /* FIX: Display First Letter of Name */
                      <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 select-none">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER (Top Bar) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 lg:hidden px-4 h-16 flex items-center justify-between transition-colors duration-300">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="LifeOS" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-lg text-slate-900 dark:text-white">LifeOS</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/settings" className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200 dark:border-blue-800">
            {initials}
          </Link>
        </div>
      </header>

      {/* MOBILE BOTTOM DOCK */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 lg:hidden">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-slate-900/20 rounded-[2rem] px-6 h-20 flex items-center justify-between">
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} isActive={isActive(item.path)} isMobile={true} />
          ))}
        </div>
      </nav>

      {/* Spacers */}
      <div className="h-20 lg:h-24 w-full block"></div>
    </>
  );
};

export default Navbar;
