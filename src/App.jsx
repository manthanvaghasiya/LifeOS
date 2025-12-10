import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // <--- Import Context

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Financial from './pages/Financial';
// ... import other pages (Habits, Goals, Login, etc.)

const App = () => {
  // Mock authentication check (Replace with your actual auth logic)
  const isAuthenticated = !!localStorage.getItem('token'); 

  return (
    <ThemeProvider> {/* <--- WRAP EVERYTHING HERE */}
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
          
          {/* Show Navbar only if logged in */}
          {isAuthenticated && <Navbar />}

          <main className="flex-grow">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

              {/* Protected Routes */}
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/transactions" element={isAuthenticated ? <Financial /> : <Navigate to="/login" />} />
              {/* Add other routes here */}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Show Footer only if logged in */}
          {isAuthenticated && <Footer />}
          
        </div>
      </Router>
    </ThemeProvider>
  );
};

// Placeholder Login/Signup components if you don't have them yet
const Login = () => <div className="h-screen flex items-center justify-center">Login Page</div>;
const Signup = () => <div className="h-screen flex items-center justify-center">Signup Page</div>;

export default App;