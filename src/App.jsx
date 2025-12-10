import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Financial from './pages/Financial';

// --- PLACEHOLDER PAGES (Until you build the real files) ---
// These prevent the "Go to Dashboard" error
const Habits = () => <div className="p-10 text-center text-2xl font-bold dark:text-white">Habits Page (Coming Soon)</div>;
const Goals = () => <div className="p-10 text-center text-2xl font-bold dark:text-white">Goals Page (Coming Soon)</div>;
const Notes = () => <div className="p-10 text-center text-2xl font-bold dark:text-white">Notes Page (Coming Soon)</div>;
const Settings = () => <div className="p-10 text-center text-2xl font-bold dark:text-white">Settings Page (Coming Soon)</div>;
const Login = () => <div className="h-screen flex items-center justify-center dark:text-white">Login Page</div>;
const Signup = () => <div className="h-screen flex items-center justify-center dark:text-white">Signup Page</div>;

const App = () => {
  // Mock Auth - Change this logic when you implement real auth
  const isAuthenticated = true; // Set to true for testing

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

              {/* --- DASHBOARD (Home) --- */}
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

              {/* --- FINANCE --- */}
              <Route path="/transactions" element={isAuthenticated ? <Financial /> : <Navigate to="/login" />} />

              {/* --- MISSING ROUTES (The Fix) --- */}
              <Route path="/habits" element={isAuthenticated ? <Habits /> : <Navigate to="/login" />} />
              <Route path="/goals" element={isAuthenticated ? <Goals /> : <Navigate to="/login" />} />
              <Route path="/notes" element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />

              {/* --- CATCH ALL (Redirects unknown to Dashboard) --- */}
              <Route path="*" element={<Navigate to="/" />} />
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