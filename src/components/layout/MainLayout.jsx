import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main>
        {/* Outlet renders the child route (Dashboard, Goals, etc.) */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;