import api from './api';

export const inspectionService = {
  // Get all field inspection reports for a specific infrastructure asset
  getInspections: async (assetId) => {
    const response = await api.get(`/assets/${assetId}/inspections`);
    return response.data.data;
  },

  // Record a new field inspection report
  createInspection: async (assetId, inspectionData) => {
    const response = await api.post(`/assets/${assetId}/inspections`, inspectionData);
    return response.data;
  },
};

export default inspectionService;
