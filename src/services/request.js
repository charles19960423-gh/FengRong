import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://api.example.com'

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('tavern_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tavern_token')
      localStorage.removeItem('current_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function get(url, params = {}) {
  return axiosInstance.get(url, { params })
}

export function post(url, data = {}) {
  return axiosInstance.post(url, data)
}

export function put(url, data = {}) {
  return axiosInstance.put(url, data)
}

export function del(url, params = {}) {
  return axiosInstance.delete(url, { params })
}

export default axiosInstance
