import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * MainLayout
 * Purpose: Central wrapper for the application.
 * Features:
 * - Dynamic Dark Mode background
 * - Responsive padding to clear floating mobile navigation
 * - Max-width constraint for premium desktop viewing
 */
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      {/* 1. Global Navigation
          Sticky positioning is managed within the component
      */}
      <Navbar />

      {/* 2. Main Content Area
          pb-32: Essential padding to ensure content clears the Floating Mobile Dock
          max-w-[1600px]: Matches the "Wealth Hub" and "Knowledge Base" desktop width
      */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* 3. Global Footer 
          The footer sits at the very bottom, below the main content
      */}
      <Footer />
      
    </div>
  );
};

export default MainLayout;