import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null; // Use null for no user
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Sync function to handle cross-tab updates or auto-logout
  const syncUserData = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
      } else {
          setUser(null);
          setIsAuthenticated(false);
      }
  };

  useEffect(() => {
    window.addEventListener('authChange', syncUserData);
    window.addEventListener('storage', syncUserData);
    return () => {
      window.removeEventListener('authChange', syncUserData);
      window.removeEventListener('storage', syncUserData);
    };
  }, []);

  // ✨ NEW: Centralized Login Helper
  const login = (token, userData) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      // Dispatch event so api.js or other tabs know
      window.dispatchEvent(new Event('authChange'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    // Expose 'login' to the app
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
