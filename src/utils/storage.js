/**
 * 存储服务模块
 * @module utils/storage
 */

/**
 * 存储服务 - 封装 localStorage 操作
 * @namespace StorageService
 */
export const StorageService = {
  /**
   * 获取存储项
   * @param {string} key - 存储键名
   * @returns {any} 存储的值，如果是 JSON 则自动解析
   * @example
   * StorageService.getItem('user') // { name: '张三', age: 20 }
   */
  getItem: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return localStorage.getItem(key)
    }
  },

  /**
   * 设置存储项
   * @param {string} key - 存储键名
   * @param {any} value - 要存储的值
   * @example
   * StorageService.setItem('user', { name: '张三' })
   */
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      localStorage.setItem(key, String(value))
    }
  },

  /**
   * 移除存储项
   * @param {string} key - 存储键名
   * @example
   * StorageService.removeItem('user')
   */
  removeItem: (key) => {
    localStorage.removeItem(key)
  },

  /**
   * 清空所有存储
   * @example
   * StorageService.clear()
   */
  clear: () => {
    localStorage.clear()
  },

  /**
   * 获取认证令牌
   * @returns {string|null} 认证令牌
   * @example
   * StorageService.getAuthToken() // 'eyJhbGciOiJIUzI1NiIs...'
   */
  getAuthToken: () => {
    return localStorage.getItem('tavern_token')
  },

  /**
   * 设置认证令牌
   * @param {string} token - 认证令牌
   * @example
   * StorageService.setAuthToken('eyJhbGciOiJIUzI1NiIs...')
   */
  setAuthToken: (token) => {
    localStorage.setItem('tavern_token', token)
  },

  /**
   * 移除认证令牌
   * @example
   * StorageService.removeAuthToken()
   */
  removeAuthToken: () => {
    localStorage.removeItem('tavern_token')
  },

  /**
   * 获取用户数据
   * @returns {object|null} 用户数据
   * @example
   * StorageService.getUserData() // { id: 1, name: '张三' }
   */
  getUserData: () => {
    return StorageService.getItem('user_data')
  },

  /**
   * 设置用户数据
   * @param {object} data - 用户数据
   * @example
   * StorageService.setUserData({ id: 1, name: '张三' })
   */
  setUserData: (data) => {
    StorageService.setItem('user_data', data)
  },

  /**
   * 获取成就列表
   * @returns {array} 成就列表
   * @example
   * StorageService.getAchievements() // [{ id: 1, name: '首杀' }]
   */
  getAchievements: () => {
    return StorageService.getItem('achievements') || []
  },

  /**
   * 设置成就列表
   * @param {array} achievements - 成就列表
   * @example
   * StorageService.setAchievements([{ id: 1, name: '首杀' }])
   */
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
