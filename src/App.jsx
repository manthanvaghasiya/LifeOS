import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Non-lazy Layout Components (Always needed)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LevelUpModal from './components/gamification/LevelUpModal';

// ⚡ Lazy Load Pages (Commercial Performance Optimization)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Financial = lazy(() => import('./pages/Financial'));
const Habits = lazy(() => import('./pages/Habits'));
const Goals = lazy(() => import('./pages/Goals'));
const Notes = lazy(() => import('./pages/Notes'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

// Minimal Loader for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // --- GAMIFICATION STATE ---
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    
    // Listen for Level Up Event
    const handleLevelUp = (e) => {
        setNewLevel(e.detail.level);
        setShowLevelUp(true);
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('levelUp', handleLevelUp);

    return () => {
        window.removeEventListener('authChange', handleAuthChange);
        window.removeEventListener('levelUp', handleLevelUp);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        {/* Main App Container
          - Uses 'slate-50' for a premium dashboard background.
          - Preserves mobile padding logic for the bottom navigation.
        */}
        <div className={`flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 ${isAuthenticated ? 'pb-24 lg:pb-0' : ''}`}>
          
          {isAuthenticated && <Navbar />}

          {/* GLOBAL LEVEL UP MODAL */}
          {showLevelUp && (
              <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
          )}

          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

                {/* Protected Routes */}
                <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/transactions" element={isAuthenticated ? <Financial /> : <Navigate to="/login" />} />
                <Route path="/habits" element={isAuthenticated ? <Habits /> : <Navigate to="/login" />} />
                <Route path="/goals" element={isAuthenticated ? <Goals /> : <Navigate to="/login" />} />
                <Route path="/notes" element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>

          {isAuthenticated && <Footer />}
          
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;