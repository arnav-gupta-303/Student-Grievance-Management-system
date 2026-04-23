import axios from 'axios';

const API = axios.create({
  baseURL: 'https://grieviance-backened.onrender.com/api', 
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (data) => API.post('/login', data);
export const registerUser = (data) => API.post('/register', data);
export const getGrievances = () => API.get('/grievances');
export const searchGrievances = (title) => API.get(`/grievances/search?title=${title}`);
export const createGrievance = (data) => API.post('/grievances', data);
export const updateGrievance = (id, data) => API.put(`/grievances/${id}`, data);
export const deleteGrievance = (id) => API.delete(`/grievances/${id}`);

export default API;
