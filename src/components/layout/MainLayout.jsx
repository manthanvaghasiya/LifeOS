import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar'; // Adjusted path based on standard structure
import Footer from '../layout/Footer';
import AmbientBackground from '../ui/AmbientBackground'; // <--- IMPORT THIS

const MainLayout = () => {
  return (
    // Added 'relative overflow-hidden' to contain the fixed background within the app context if needed, 
    // though 'fixed' in AmbientBackground handles viewport positioning.
    <div className="relative flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      {/* 1. Global Ambient Background (Behind everything) */}
      <AmbientBackground />

      {/* 2. Content Wrapper (sits ABOVE background) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        <Navbar />

        <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>

        <Footer />
        
      </div>
    </div>
  );
};

export default MainLayout;
