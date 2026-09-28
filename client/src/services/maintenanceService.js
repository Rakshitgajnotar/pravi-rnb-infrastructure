import api from './api';

export const maintenanceService = {
  // Get all maintenance records across the system (supports status filter)
  getAllMaintenance: async (params = {}) => {
    const response = await api.get('/maintenance', { params });
    return response.data.data;
  },

  // Get maintenance records for a specific asset
  getMaintenanceByAsset: async (assetId) => {
    const response = await api.get(`/assets/${assetId}/maintenance`);
    return response.data.data;
  },

  // Schedule/create maintenance for an asset
  createMaintenance: async (assetId, maintenanceData) => {
    const response = await api.post(`/assets/${assetId}/maintenance`, maintenanceData);
    return response.data;
  },

  // Update maintenance record (e.g. status transition, actual cost, completion)
  updateMaintenance: async (id, updateData) => {
    const response = await api.put(`/maintenance/${id}`, updateData);
    return response.data;
  },
};

export default maintenanceService;
