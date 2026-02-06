import axiosInstance from './axiosConfig';

export const reportsAPI = {
  getAll: async (filters = {}) => {
    const response = await axiosInstance.get('/reports', { params: filters });
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/reports', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/reports/${id}/status`, { status });
    return response.data;
  },

  sendToParent: async (reportId) => {
    const response = await axiosInstance.post(`/reports/${reportId}/send`);
    return response.data;
  },

  exportPDF: async (reportId) => {
    const response = await axiosInstance.get(`/reports/${reportId}/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
};