import React from 'react';
import { LayoutDashboard, Wallet, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 text-blue-600">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Wallet className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-800">WealthFolio</span>
      </div>

      {/* Menu - Simplified for now */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 hidden sm:block">Welcome, Developer</span>
        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;