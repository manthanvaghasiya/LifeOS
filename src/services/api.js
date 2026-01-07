import axios from 'axios';

// Event Name (Must match Context)
const TOAST_EVENT = 'lifeos-toast-event';

// Helper to trigger toast from outside React
const triggerToast = (message, type = 'info') => {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, {
    detail: { message, type }
  }));
};

const API_URL = import.meta.env.VITE_API_URL || 'https://wealthfolio-api.onrender.com/api';

const API = axios.create({
  baseURL: API_URL, 
  timeout: 10000, // 10s timeout standard
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✨ SMART ERROR HANDLING INTERCEPTOR
API.interceptors.response.use(
  (response) => {
    // Optional: Auto-toast on successful methods like POST/PUT/DELETE?
    // For now, let's keep success messages manual for better UX control.
    return response;
  }, 
  (error) => {
    const originalRequest = error.config;

    // 1. NETWORK ERRORS (No response)
    if (!error.response) {
       triggerToast("Network error. Please check your connection.", 'error');
       return Promise.reject(error);
    }

    // 2. SESSION EXPIRED (401)
    if (error.response.status === 401) {
      if (!originalRequest._retry) {
          // Only toast if it's the first time hitting 401
          triggerToast("Session expired. Please log in again.", 'warning');
          
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('authChange'));
      }
    } 

    // 3. SERVER ERRORS (500)
    else if (error.response.status >= 500) {
        triggerToast("Server error. We are working on it.", 'error');
    }

    // 4. BAD REQUESTS (400) - Only if they have a specific message
    else if (error.response.status === 400 || error.response.status === 404) {
        // Use the message from the backend if available
        const serverMsg = error.response.data?.message || "Action failed.";
        triggerToast(serverMsg, 'error');
    }

    return Promise.reject(error);
  }
);

export default API;