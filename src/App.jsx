import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Real Pages
import Dashboard from './pages/Dashboard';
import Financial from './pages/Financial';
import Habits from './pages/Habits';     // <--- Newly Created
import Goals from './pages/Goals';       // <--- Newly Created
import Notes from './pages/Notes';       // <--- Newly Created
import Settings from './pages/Settings'; // <--- Newly Created

// Auth Placeholders (You can replace these later)
const Login = () => <div className="h-screen flex items-center justify-center dark:text-white">Login Page</div>;
const Signup = () => <div className="h-screen flex items-center justify-center dark:text-white">Signup Page</div>;

const App = () => {
  // Mock Auth - change to real logic later
  const isAuthenticated = true; 

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
          
          {/* Navbar shows only when logged in */}
          {isAuthenticated && <Navbar />}

          <main className="flex-grow">
            <Routes>
              {/* --- AUTH ROUTES --- */}
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

              {/* --- MAIN APP ROUTES --- */}
              {/* If logged in, show page. If not, redirect to Login */}
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/transactions" element={isAuthenticated ? <Financial /> : <Navigate to="/login" />} />
              <Route path="/habits" element={isAuthenticated ? <Habits /> : <Navigate to="/login" />} />
              <Route path="/goals" element={isAuthenticated ? <Goals /> : <Navigate to="/login" />} />
              <Route path="/notes" element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />

              {/* --- 404 CATCH ALL --- */}
              {/* This helps debug. If a route is wrong, it shows 404 instead of Dashboard */}
              <Route path="*" element={<div className="p-20 text-center text-xl">404 - Page Not Found</div>} />
            </Routes>
          </main>

          {/* Footer shows only when logged in */}
          {isAuthenticated && <Footer />}
          
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;