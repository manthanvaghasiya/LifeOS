// src/services/api.js
import axios from 'axios';

// 1. Create a centralized Axios instance
const API = axios.create({
  baseURL: 'https://wealthfolio-api.onrender.com/api', // Change this ONE place to switch Local/Render
});

// 2. Automatically add Token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;