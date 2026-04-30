import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tavern_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tavern_token')
      window.dispatchEvent(new CustomEvent('authChange', { detail: { type: 'logout' } }))
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (data) => api.put('/users/me', data)
}

export const taskApi = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  claimTask: (id) => api.post(`/tasks/${id}/claim`),
  completeTask: (id, data) => api.post(`/tasks/${id}/complete`, data)
}

export const achievementApi = {
  getAchievements: (params) => api.get('/achievements', { params }),
  getAchievement: (id) => api.get(`/achievements/${id}`),
  getUserAchievements: (userId) => api.get(`/users/${userId}/achievements`)
}

export const gearApi = {
  getGears: (params) => api.get('/gears', { params }),
  getGear: (id) => api.get(`/gears/${id}`),
  createGear: (data) => api.post('/gears', data),
  updateGear: (id, data) => api.put(`/gears/${id}`, data),
  deleteGear: (id) => api.delete(`/gears/${id}`)
}

export const prestigeApi = {
  getPrestige: (userId) => api.get(`/users/${userId}/prestige`),
  addPrestige: (userId, amount) => api.post(`/users/${userId}/prestige`, { amount })
}

export const notificationApi = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
}

export default api
