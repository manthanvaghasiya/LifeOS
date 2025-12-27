import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Initialize State from Local Storage immediately
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : { name: 'User', level: 1, currentXP: 0 };
    } catch {
      return { name: 'User', level: 1, currentXP: 0 };
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // 2. THE MISSING PIECE: Listen for changes
  useEffect(() => {
    const syncUserData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setIsAuthenticated(!!localStorage.getItem('token'));
      } catch (e) {
        console.error("Sync Error:", e);
      }
    };

    // Listen for the event you dispatched in Login.jsx
    window.addEventListener('authChange', syncUserData);
    window.addEventListener('storage', syncUserData); // Syncs across tabs

    return () => {
      window.removeEventListener('authChange', syncUserData);
      window.removeEventListener('storage', syncUserData);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser({ name: 'User', level: 1, currentXP: 0 });
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
