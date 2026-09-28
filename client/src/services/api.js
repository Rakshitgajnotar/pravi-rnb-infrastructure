import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // When running on Render or any cloud domain, use relative /api
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject RBAC official identity via standard Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const storedToken = localStorage.getItem('pravi_token');
      if (storedToken) {
        config.headers['Authorization'] = `Bearer ${storedToken}`;
      } else {
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
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error messaging & 401 redirection
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    // Automatically purge session and redirect to /login on 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.removeItem('pravi_user');
        localStorage.removeItem('pravi_token');
        window.location.href = '/login';
      }
    }

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.errors = error.response?.data?.errors;
    return Promise.reject(customError);
  }
);

export default api;
