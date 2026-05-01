import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  // 请求超时
  timeout: 15000
})

// 错误消息映射
const errorMessages = {
  400: '请求参数错误，请检查输入内容',
  401: '登录已过期，请重新登录',
  403: '没有权限执行此操作',
  404: '请求的资源不存在',
  408: '请求超时，请稍后重试',
  500: '服务器内部错误，请稍后重试',
  502: '网关错误，请稍后重试',
  503: '服务暂不可用，请稍后重试',
  504: '网关超时，请稍后重试'
}

// 显示错误提示的函数
const showError = (message) => {
  // 使用自定义事件通知 UI 显示错误
  window.dispatchEvent(new CustomEvent('showToast', { 
    detail: { message, type: 'error' } 
  }))
}

// 显示成功提示的函数
const showSuccess = (message) => {
  window.dispatchEvent(new CustomEvent('showToast', { 
    detail: { message, type: 'success' } 
  }))
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tavern_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 添加请求 ID 用于追踪
    config.headers['X-Request-ID'] = Date.now().toString(36) + Math.random().toString(36).substr(2)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    // 如果响应中有消息，显示成功提示
    if (response.data?.message) {
      showSuccess(response.data.message)
    }
    return response
  },
  (error) => {
    // 获取错误信息
    const status = error.response?.status
    const serverMessage = error.response?.data?.message
    const customMessage = errorMessages[status] || '网络错误，请稍后重试'
    
    // 组合错误消息
    const finalMessage = serverMessage || customMessage
    
    // 显示错误提示
    showError(finalMessage)
    
    // 根据状态码处理特定错误
    if (status === 401) {
      localStorage.removeItem('tavern_token')
      window.dispatchEvent(new CustomEvent('authChange', { detail: { type: 'logout' } }))
    } else if (status === 403) {
      // 可以在这里添加跳转逻辑
      console.warn('权限不足:', finalMessage)
    } else if (status >= 500) {
      // 服务器错误，可以记录到监控系统
      console.error('服务器错误:', status, finalMessage)
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
