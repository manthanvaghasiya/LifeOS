import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
// Non-lazy Layout Components (Always needed)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LevelUpModal from './components/gamification/LevelUpModal';
import { ToastProvider } from './context/ToastContext';
import NativePageTransition from './components/navigation/NativePageTransition';

// ⚡ Lazy Load Pages (Commercial Performance Optimization)
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Financial = lazy(() => import('./pages/Financial'));
const Habits = lazy(() => import('./pages/Habits'));
const Goals = lazy(() => import('./pages/Goals'));
const Notes = lazy(() => import('./pages/Notes'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Minimal Loader for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

const AnimatedRoutes = ({ isAuthenticated }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <NativePageTransition><Login /></NativePageTransition> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <NativePageTransition><Signup /></NativePageTransition> : <Navigate to="/" />} />

        {/* Public Marketing Routes */}
        <Route path="/about" element={<NativePageTransition><About /></NativePageTransition>} />
        <Route path="/pricing" element={<NativePageTransition><Pricing /></NativePageTransition>} />
        <Route path="/contact" element={<NativePageTransition><Contact /></NativePageTransition>} />

        {/* Protected Routes */}
        <Route path="/" element={<NativePageTransition>{isAuthenticated ? <Dashboard /> : <Home />}</NativePageTransition>} />
        <Route path="/transactions" element={isAuthenticated ? <NativePageTransition><Financial /></NativePageTransition> : <Navigate to="/login" />} />
        <Route path="/habits" element={isAuthenticated ? <NativePageTransition><Habits /></NativePageTransition> : <Navigate to="/login" />} />
        <Route path="/goals" element={isAuthenticated ? <NativePageTransition><Goals /></NativePageTransition> : <Navigate to="/login" />} />
        <Route path="/notes" element={isAuthenticated ? <NativePageTransition><Notes /></NativePageTransition> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <NativePageTransition><Settings /></NativePageTransition> : <Navigate to="/login" />} />

        {/* Catch-all — 404 */}
        <Route path="*" element={<NativePageTransition><NotFound /></NativePageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

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
      <AuthProvider>
        <ToastProvider>
          <Router>
            {/* Main App Container
              - Uses 100dvh for dynamic mobile viewport support.
              - Preserves mobile padding logic with safe-area-inset for bottom navigation.
            */}
            <div
              className="flex flex-col min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
              style={{
                paddingBottom: isAuthenticated
                  ? 'calc(5.5rem + env(safe-area-inset-bottom, 0px))'
                  : undefined,
              }}
            >
              {isAuthenticated && <Navbar />}

              {/* GLOBAL LEVEL UP MODAL */}
              {showLevelUp && (
                <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
              )}

              <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <AnimatedRoutes isAuthenticated={isAuthenticated} />
                </Suspense>
              </main>

              {isAuthenticated && <Footer />}
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
