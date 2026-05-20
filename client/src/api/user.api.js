import api from './axios';

export const getReport = (reportId) => api.get(`/reports/${reportId}`);
export const getUserReports = (page = 1, limit = 10) => api.get(`/reports/user/all?page=${page}&limit=${limit}`);
export const getStatsOverview = () => api.get('/reports/stats/overview');
