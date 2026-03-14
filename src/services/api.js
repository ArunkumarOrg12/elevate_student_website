import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err),
);

export const studentAPI = {
  getProfile:        () => api.get('/api/student/profile'),
  getDashboard:      () => api.get('/api/student/dashboard'),
  getAssessments:    () => api.get('/api/student/assessments'),
  getSkills:         () => api.get('/api/student/skills'),
  getGrowth:         () => api.get('/api/student/growth'),
  getRecommendations:() => api.get('/api/student/recommendations'),
  getReports:        () => api.get('/api/student/reports'),
};

export default api;
