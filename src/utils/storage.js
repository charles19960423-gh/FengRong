export const StorageService = {
  getItem: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return localStorage.getItem(key)
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      localStorage.setItem(key, String(value))
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key)
  },

  clear: () => {
    localStorage.clear()
  },

  getAuthToken: () => {
    return localStorage.getItem('tavern_token')
  },

  setAuthToken: (token) => {
    localStorage.setItem('tavern_token', token)
  },

  removeAuthToken: () => {
    localStorage.removeItem('tavern_token')
  },

  getUserData: () => {
    return StorageService.getItem('user_data')
  },

  setUserData: (data) => {
    StorageService.setItem('user_data', data)
  },

  getAchievements: () => {
    return StorageService.getItem('achievements') || []
  },

  setAchievements: (achievements) => {
    StorageService.setItem('achievements', achievements)
  },

  getTasks: () => {
    return StorageService.getItem('fr_task_history') || []
  },

  setTasks: (tasks) => {
    StorageService.setItem('fr_task_history', tasks)
  },

  getEquippedAchievements: () => {
    return StorageService.getItem('equippedAchievements') || []
  },

  setEquippedAchievements: (equipped) => {
    StorageService.setItem('equippedAchievements', equipped)
  },

  getRegisteredUsers: () => {
    return StorageService.getItem('registered_users') || {}
  },

  setRegisteredUsers: (users) => {
    StorageService.setItem('registered_users', users)
  }
}

export default StorageService
