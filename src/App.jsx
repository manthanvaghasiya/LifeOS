import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LevelUpModal from './components/gamification/LevelUpModal'; // <--- IMPORT

// Pages
import Dashboard from './pages/Dashboard';
import Financial from './pages/Financial';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // --- GAMIFICATION STATE ---
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    
    // 1. Listen for Level Up Event
    const handleLevelUp = (e) => {
        setNewLevel(e.detail.level);
        setShowLevelUp(true);
        // Play sound effect here if you want!
        // const audio = new Audio('/levelup.mp3'); audio.play();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('levelUp', handleLevelUp); // <--- Add Listener

    return () => {
        window.removeEventListener('authChange', handleAuthChange);
        window.removeEventListener('levelUp', handleLevelUp); // <--- Cleanup
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
          
          {isAuthenticated && <Navbar />}

          {/* GLOBAL LEVEL UP MODAL */}
          {showLevelUp && (
              <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
          )}

          <main className="flex-grow">
            <Routes>
              {/* Public */}
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

              {/* Protected */}
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/transactions" element={isAuthenticated ? <Financial /> : <Navigate to="/login" />} />
              <Route path="/habits" element={isAuthenticated ? <Habits /> : <Navigate to="/login" />} />
              <Route path="/goals" element={isAuthenticated ? <Goals /> : <Navigate to="/login" />} />
              <Route path="/notes" element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {isAuthenticated && <Footer />}
          
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;