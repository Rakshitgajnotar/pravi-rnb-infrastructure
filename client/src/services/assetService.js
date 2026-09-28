import api from './api';

export const assetService = {
  // Fetch assets with query filters
  getAssets: async (params = {}) => {
    const response = await api.get('/assets', { params });
    return response.data;
  },

  // Fetch single asset by Mongo ID or custom assetId
  getAssetById: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data.data;
  },

  // Create new asset
  createAsset: async (assetData) => {
    const response = await api.post('/assets', assetData);
    return response.data;
  },

  // Update asset
  updateAsset: async (id, assetData) => {
    const response = await api.put(`/assets/${id}`, assetData);
    return response.data;
  },

  // Delete asset
  deleteAsset: async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/assets/stats');
    return response.data.data;
  },

  // Seed / Reset demo assets
  seedDemoAssets: async () => {
    const response = await api.post('/assets/seed');
    return response.data;
  },

  // Get system & DB health status
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default assetService;
