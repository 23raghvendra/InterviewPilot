import api from './axios';

export const startInterview = (config) => api.post('/interviews/start', config);
export const getInterview = (sessionId) => api.get(`/interviews/${sessionId}`);
export const submitAnswer = (sessionId, data) => api.patch(`/interviews/${sessionId}/answer`, data);
export const skipQuestion = (sessionId, data) => api.patch(`/interviews/${sessionId}/skip`, data);
export const endInterview = (sessionId) => api.post(`/interviews/${sessionId}/end`);
export const getHistory = (page = 1, limit = 10) => api.get(`/interviews/history?page=${page}&limit=${limit}`);
export const deleteInterview = (sessionId) => api.delete(`/interviews/${sessionId}`);

// AI routes
export const getHint = (data) => api.post('/ai/hint', data);
export const getFollowUp = (sessionId, questionIndex) => api.get(`/ai/follow-up?sessionId=${sessionId}&questionIndex=${questionIndex}`);
