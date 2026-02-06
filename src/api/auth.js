import axiosInstance from './axiosConfig';

export const authAPI = {
  login: async (credentials) => {
    // Expects { email, password }
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    // Optional: Call backend to invalidate token if using stateful sessions
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};