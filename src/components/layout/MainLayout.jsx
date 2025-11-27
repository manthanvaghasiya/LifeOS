import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // Import the new Footer

const MainLayout = () => {
  return (
    // "min-h-screen" makes the div at least as tall as the window
    // "flex-col" stacks items vertically
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      
      {/* 1. Navbar at top */}
      <Navbar />
      
      {/* 2. Main Content (flex-grow pushes the footer down) */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      {/* 3. Footer at bottom */}
      <Footer />
      
    </div>
  );
};

export default MainLayout;