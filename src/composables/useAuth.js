import { ref, computed } from 'vue'
import { useAuthStore } from '../stores'

export function useAuth() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const currentUser = computed(() => authStore.currentUser)
  const token = computed(() => authStore.token)

  async function login(phone, password) {
    loading.value = true
    error.value = null
    try {
      const result = await authStore.login(phone, password)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null
    try {
      await authStore.logout()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data) {
    loading.value = true
    error.value = null
    try {
      const result = await authStore.register(data)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data) {
    loading.value = true
    error.value = null
    try {
      const result = await authStore.updateProfile(data)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function loadUser() {
    return authStore.loadUser()
  }

  function hasRole(role) {
    return authStore.hasRole(role)
  }

  function getVipLevel() {
    return authStore.getVipLevel()
  }

  return {
    isLoggedIn,
    currentUser,
    token,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    loadUser,
    hasRole,
    getVipLevel
  }
}
