import axiosInstance from './axiosConfig';

export const studentAPI = {
  getAll: async (params) => {
    const response = await axiosInstance.get('/students', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/students/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/students', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/students/${id}`);
    return response.data;
  },

  getIncidents: async (studentId) => {
    const response = await axiosInstance.get(`/students/${studentId}/incidents`);
    return response.data;
  },

  generateReport: async (studentId) => {
    const response = await axiosInstance.get(`/students/${studentId}/report`);
    return response.data;
  }
};