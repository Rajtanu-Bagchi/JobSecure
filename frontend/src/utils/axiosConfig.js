import axios from 'axios';

// Determine the base URL for API requests
// In development, use the proxy or localhost, in production use the deployed API URL
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || '/api'
  : 'http://localhost:5000/api';

console.log('API requests will be sent to:', BASE_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent indefinite hanging
  timeout: 10000
});

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Log the request for debugging
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    
    // If token exists, add to headers
    if (user) {
      // Try to get the token from various possible locations in the user object
      const token = user.token || 
                   (user.data && user.data.token) ||
                   (user.user && user.user.token);
                   
      if (token) {
        console.log('Adding auth token to request');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('User object found in localStorage but no token available:', user);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      console.error('Permission denied:', error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
