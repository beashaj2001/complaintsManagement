import axios from 'axios'

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API utility functions
export const complaintsAPI = {
  getComplaints: (params) => apiClient.get('/complaints', { params }),
  getComplaint: (id) => apiClient.get(`/complaints/${id}`),
  createComplaint: (data) => apiClient.post('/complaints', data),
  updateComplaint: (id, data) => apiClient.put(`/complaints/${id}`, data),
  assignComplaint: (id, userId) => apiClient.post(`/complaints/${id}/assign`, { assigned_to_id: userId }),
  getDashboardStats: () => apiClient.get('/complaints/dashboard/stats'),
}

export const usersAPI = {
  getUsers: (params) => apiClient.get('/users', { params }),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  getTeamMembers: (teamId) => apiClient.get(`/users/teams/${teamId}/members`),
}

export const adminAPI = {
  getTeams: (params) => apiClient.get('/admin/teams', { params }),
  createTeam: (data) => apiClient.post('/admin/teams', data),
  updateTeam: (id, data) => apiClient.put(`/admin/teams/${id}`, data),
  getSLAMatrix: (params) => apiClient.get('/admin/sla-matrix', { params }),
  createSLARule: (data) => apiClient.post('/admin/sla-matrix', data),
  updateSLARule: (id, data) => apiClient.put(`/admin/sla-matrix/${id}`, data),
  runAgentAction: () => apiClient.post('/admin/agent-action'),
}

export const chatbotAPI = {
  query: (data) => apiClient.post('/chatbot/query', data),
  getSuggestions: () => apiClient.get('/chatbot/suggestions'),
}

export default apiClient