import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Financial from './pages/Financial';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Login from './pages/Login';   // <--- We will create this
import Signup from './pages/Signup'; // <--- We will create this

const App = () => {
  // 1. REAL CHECK: Only true if token exists in storage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // 2. LISTEN FOR LOGIN/LOGOUT EVENTS
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    
    // Listen for custom events triggered by Login/Navbar
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
          
          {/* Show Navbar ONLY if authenticated */}
          {isAuthenticated && <Navbar />}

          <main className="flex-grow">
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              {/* If already logged in, redirect Login/Signup to Dashboard */}
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

              {/* --- PROTECTED ROUTES --- */}
              {/* If NOT logged in, redirect to Login */}
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/transactions" element={isAuthenticated ? <Financial /> : <Navigate to="/login" />} />
              <Route path="/habits" element={isAuthenticated ? <Habits /> : <Navigate to="/login" />} />
              <Route path="/goals" element={isAuthenticated ? <Goals /> : <Navigate to="/login" />} />
              <Route path="/notes" element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Show Footer ONLY if authenticated */}
          {isAuthenticated && <Footer />}
          
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;