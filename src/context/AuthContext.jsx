import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null; 
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // 1. ✨ NEW: Function to manually fetch fresh data (XP, Level, etc.)
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await API.get('/users/profile');
      // Update state and storage with fresh data from DB
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      console.error("Failed to refresh user profile", error);
    }
  };

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

  // Centralized Login Helper
  const login = (token, userData) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // Update state immediately
      setIsAuthenticated(true);
      window.dispatchEvent(new Event('authChange'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));
  };

  // PRODUCTION FIX: Fetch fresh user data on app load if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      // If we have a token, fetch the latest user profile to ensure data exists
      if (token) {
        try {
            await refreshUser(); // Reuse the refresh logic
        } catch (error) {
             // If token is expired/invalid, log the user out cleanly
             logout(); 
        }
      }
    };

    initializeAuth();
  }, []);
  
  return (
    // 2. ✨ EXPOSE 'refreshUser' HERE
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);