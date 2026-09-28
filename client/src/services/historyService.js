import api from './api';

export const historyService = {
  // Get complete chronological audit trail / history for an asset
  getHistory: async (assetId) => {
    const response = await api.get(`/assets/${assetId}/history`);
    return response.data.data;
  },
};

export default historyService;
