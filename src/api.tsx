import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add this interceptor to automatically include the auth token in all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Add Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;