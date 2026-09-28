import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject RBAC official identity via standard Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('pravi_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.role) {
          // Encode role and identity inside standard Authorization header to prevent custom header CORS preflight issues
          const payload = btoa(
            unescape(
              encodeURIComponent(
                JSON.stringify({
                  role: user.role,
                  name: user.name || '',
                  _id: user._id || '',
                })
              )
            )
          );
          config.headers['Authorization'] = `Bearer ${payload}`;
        }
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.errors = error.response?.data?.errors;
    return Promise.reject(customError);
  }
);

export default api;
