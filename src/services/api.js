// File: src/services/api.js
import axios from 'axios';

// 1. Create a centralized Axios instance
// This URL is the only place you need to change if you switch back to localhost!
const API = axios.create({
  baseURL: 'https://wealthfolio-api.onrender.com/api', 
});

// 2. Automatically add Token to every request (The Interceptor)
// This effectively replaces your old "getHeaders()" function
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;