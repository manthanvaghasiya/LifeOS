import axios from 'axios';

// BEST PRACTICE: Use Environment Variables for URLs
// Create a .env file in project root with: VITE_API_URL=https://wealthfolio-api.onrender.com/api
const API_URL = import.meta.env.VITE_API_URL || 'https://wealthfolio-api.onrender.com/api';

const API = axios.create({
  baseURL: API_URL, 
});

// 1. Request Interceptor (Add Token)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 2. ✨ RESPONSE INTERCEPTOR (Handle Session Expiry)
API.interceptors.response.use(
  (response) => response, // Return successful responses directly
  (error) => {
    // If the error is 401 (Unauthorized), it means the token is invalid/expired
    if (error.response && error.response.status === 401) {
      
      // A. Clear Storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // B. Trigger the Event Listener in AuthContext to update State
      window.dispatchEvent(new Event('authChange')); 
      
      // C. Optional: Redirect to login (Router will handle this via state change usually)
    }
    return Promise.reject(error);
  }
);

export default API;
