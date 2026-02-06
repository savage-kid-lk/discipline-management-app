import axiosInstance from './axiosConfig';

export const dashboardAPI = {
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },
  getChartData: async () => {
    const response = await axiosInstance.get('/dashboard/chart');
    return response.data;
  },
  getRecentIncidents: async () => {
    const response = await axiosInstance.get('/dashboard/recent-incidents');
    return response.data;
  }
};