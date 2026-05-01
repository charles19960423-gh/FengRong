import { post, get, put, del } from '../request'

export const authApi = {
  login(data) {
    return post('/auth/login', data)
  },

  register(data) {
    return post('/auth/register', data)
  },

  logout() {
    return post('/auth/logout')
  },

  refreshToken() {
    return post('/auth/refresh')
  },

  forgotPassword(data) {
    return post('/auth/forgot-password', data)
  },

  resetPassword(data) {
    return post('/auth/reset-password', data)
  },

  getCurrentUser() {
    return get('/auth/me')
  },

  updateProfile(data) {
    return put('/auth/profile', data)
  },

  changePassword(data) {
    return put('/auth/password', data)
  },

  verifyEmail(token) {
    return get(`/auth/verify-email/${token}`)
  },

  resendVerification() {
    return post('/auth/resend-verification')
  }
}
