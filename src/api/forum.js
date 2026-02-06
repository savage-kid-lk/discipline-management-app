import axiosInstance from './axiosConfig';

export const forumAPI = {
  getPosts: async () => {
    const response = await axiosInstance.get('/forum/posts');
    return response.data;
  },
  createPost: async (data) => {
    const response = await axiosInstance.post('/forum/posts', data);
    return response.data;
  },
  likePost: async (id) => {
    const response = await axiosInstance.post(`/forum/posts/${id}/like`);
    return response.data;
  }
};