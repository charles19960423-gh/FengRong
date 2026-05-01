import { get, post, put, del } from '../request'

export const taskApi = {
  getTasks(params = {}) {
    return get('/tasks', params)
  },

  getTaskById(taskId) {
    return get(`/tasks/${taskId}`)
  },

  createTask(data) {
    return post('/tasks', data)
  },

  updateTask(taskId, data) {
    return put(`/tasks/${taskId}`, data)
  },

  deleteTask(taskId) {
    return del(`/tasks/${taskId}`)
  },

  acceptTask(taskId) {
    return post(`/tasks/${taskId}/accept`)
  },

  submitTask(taskId, data) {
    return post(`/tasks/${taskId}/submit`, data)
  },

  reviewTask(taskId, data) {
    return post(`/tasks/${taskId}/review`, data)
  },

  getTaskCategories() {
    return get('/tasks/categories')
  },

  getMyTasks(params = {}) {
    return get('/tasks/mine', params)
  },

  searchTasks(keyword, params = {}) {
    return get('/tasks/search', { keyword, ...params })
  }
}
