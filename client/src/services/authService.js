import api from './api';

export const authService = {
  // Get all available official roles and users
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data.data;
  },

  // Get currently active user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Switch active role
  switchRole: async (role) => {
    const response = await api.post('/auth/switch', { role });
    return response.data.data;
  },
};

export default authService;
