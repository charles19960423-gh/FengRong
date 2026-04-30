import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('tavern_token') || null)
  const currentUser = ref(null)
  const isLoading = ref(false)

  const identityConfigs = {
    'warrior': { id: 'warrior', name: '战士', icon: '⚔️', unlockLevel: 1, description: '擅长战斗与护卫，可接取战斗类任务' },
    'healer': { id: 'healer', name: '医者', icon: '🌿', unlockLevel: 1, description: '精通医术与救助，可接取医疗类任务' },
    'merchant': { id: 'merchant', name: '商人', icon: '💰', unlockLevel: 2, description: '擅长贸易与运输，可接取商业类任务' },
    'scout': { id: 'scout', name: '斥候', icon: '🔍', unlockLevel: 2, description: '精通侦察与探索，可接取情报类任务' },
    'mage': { id: 'mage', name: '法师', icon: '🧙', unlockLevel: 3, description: '掌握魔法与符文，可接取魔法类任务' },
    'assassin': { id: 'assassin', name: '刺客', icon: '🗡️', unlockLevel: 3, description: '擅长暗杀与潜入，可接取隐秘类任务' },
    'blacksmith': { id: 'blacksmith', name: '铁匠', icon: '🔨', unlockLevel: 4, description: '精通锻造与修复，可接取装备类任务' },
    'alchemist': { id: 'alchemist', name: '炼金师', icon: '⚗️', unlockLevel: 4, description: '擅长制药与合成，可接取炼金类任务' }
  }

  const vipConfigs = [
    { level: 1, minPrestige: 0, maxIdentities: 1, name: '初入江湖', dailyTasks: 5, discount: 0.95, coinsCost: 0, pearlsCost: 0, prestigeCost: 0, perks: ['基础任务接取'] },
    { level: 2, minPrestige: 500, maxIdentities: 2, name: '江湖游侠', dailyTasks: 8, discount: 0.9, coinsCost: 5000, pearlsCost: 50, prestigeCost: 500, perks: ['每日任务次数+1', '基础设备租赁'] },
    { level: 3, minPrestige: 1500, maxIdentities: 3, name: '武林高手', dailyTasks: 12, discount: 0.8, coinsCost: 15000, pearlsCost: 150, prestigeCost: 1500, perks: ['任务奖励+15%', '专业设备租赁'] },
    { level: 4, minPrestige: 3500, maxIdentities: 4, name: '名震一方', dailyTasks: 15, discount: 0.65, coinsCost: 35000, pearlsCost: 350, prestigeCost: 3500, perks: ['专属客服', '高端设备租赁'] },
    { level: 5, minPrestige: 7000, maxIdentities: 5, name: '一代宗师', dailyTasks: 20, discount: 0.5, coinsCost: 70000, pearlsCost: 700, prestigeCost: 7000, perks: ['全部特权解锁', '优先预约'] }
  ]

  const mockUsers = {
    '13800138001': { phone: '13800138001', nickname: '馆主大人', role: 'admin', coins: 10000, prestige: 1500, pearls: 50, level: 50, totalPrestige: 2800, vipLevel: 3, identities: ['warrior', 'mage', 'scout'], currentIdentity: 'warrior', lastAcceptTime: null, acceptFailCount: 0, points: 500 },
    '13800138002': { phone: '13800138002', nickname: '江湖游侠', role: 'user', coins: 3500, prestige: 650, pearls: 12, level: 25, totalPrestige: 650, vipLevel: 2, identities: ['warrior', 'healer'], currentIdentity: 'warrior', lastAcceptTime: null, acceptFailCount: 0, points: 200 },
    '13800138003': { phone: '13800138003', nickname: '赏金猎人', role: 'user', coins: 5800, prestige: 890, pearls: 28, level: 32, totalPrestige: 890, vipLevel: 2, identities: ['assassin', 'scout'], currentIdentity: 'assassin', lastAcceptTime: null, acceptFailCount: 0, points: 350 }
  }

  const mockClients = {
    '13900000001': { phone: '13900000001', companyName: '星辰传媒', contactPerson: '李总', role: 'client', coins: 0, pearls: 0, level: 0, totalPrestige: 0, vipLevel: 0, tasksPublished: 5, tasksCompleted: 3, lastLoginTime: null, points: 50 }
  }

  const isLoggedIn = computed(() => !!token.value && !!currentUser.value)

  const isClient = computed(() => currentUser.value?.role === 'client')

  const isAdmin = computed(() => currentUser.value?.role === 'admin' || currentUser.value?.role === 'admin')

  const currentDiscount = computed(() => {
    if (!currentUser.value) return 1
    const vip = getCurrentVipInfo()
    return vip ? vip.discount : 1
  })

  const dailyTaskLimit = computed(() => {
    if (!currentUser.value) return 5
    const vip = getCurrentVipInfo()
    return vip ? vip.dailyTasks : 5
  })

  async function login(phone, password) {
    isLoading.value = true
    try {
      if (mockUsers[phone] && password === '123456') {
        token.value = 'mock_token_' + phone
        localStorage.setItem('tavern_token', token.value)
        currentUser.value = { ...mockUsers[phone] }
        return { success: true, user: mockUsers[phone] }
      }

      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}')
      if (registeredUsers[phone] && registeredUsers[phone].password === password) {
        token.value = 'mock_token_' + phone
        localStorage.setItem('tavern_token', token.value)
        currentUser.value = { ...registeredUsers[phone] }
        return { success: true, user: registeredUsers[phone] }
      }

      throw new Error('手机号或密码错误')
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  async function register(phone, password, nickname) {
    isLoading.value = true
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}')

      if (registeredUsers[phone]) {
        throw new Error('该手机号已被注册')
      }

      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(phone)) {
        throw new Error('请输入有效的手机号码')
      }

      registeredUsers[phone] = {
        phone,
        password,
        nickname,
        role: 'user',
        coins: 1000,
        prestige: 0,
        pearls: 5,
        level: 1,
        totalPrestige: 0,
        vipLevel: 1,
        identities: ['warrior'],
        currentIdentity: 'warrior',
        lastAcceptTime: null,
        acceptFailCount: 0,
        points: 100
      }

      localStorage.setItem('registered_users', JSON.stringify(registeredUsers))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  async function clientRegister(phone, password, companyName, contactPerson) {
    isLoading.value = true
    try {
      const registeredClients = JSON.parse(localStorage.getItem('registered_clients') || '{}')

      if (registeredClients[phone]) {
        throw new Error('该手机号已被注册')
      }

      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(phone)) {
        throw new Error('请输入有效的手机号码')
      }

      if (!companyName || companyName.trim().length < 2) {
        throw new Error('请输入有效的公司名称')
      }

      registeredClients[phone] = {
        phone,
        password,
        companyName: companyName.trim(),
        contactPerson: contactPerson || '',
        role: 'client',
        coins: 0,
        pearls: 0,
        level: 0,
        totalPrestige: 0,
        vipLevel: 0,
        tasksPublished: 0,
        tasksCompleted: 0,
        lastLoginTime: null,
        points: 50
      }

      localStorage.setItem('registered_clients', JSON.stringify(registeredClients))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  async function clientLogin(phone, password) {
    isLoading.value = true
    try {
      if (mockClients[phone] && password === '123456') {
        token.value = 'mock_client_token_' + phone
        localStorage.setItem('tavern_token', token.value)
        currentUser.value = { ...mockClients[phone] }
        return { success: true, user: mockClients[phone] }
      }

      const registeredClients = JSON.parse(localStorage.getItem('registered_clients') || '{}')
      if (registeredClients[phone] && registeredClients[phone].password === password) {
        token.value = 'mock_client_token_' + phone
        localStorage.setItem('tavern_token', token.value)
        registeredClients[phone].lastLoginTime = new Date().toISOString()
        localStorage.setItem('registered_clients', JSON.stringify(registeredClients))
        currentUser.value = { ...registeredClients[phone] }
        return { success: true, user: registeredClients[phone] }
      }

      throw new Error('手机号或密码错误')
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    currentUser.value = null
    localStorage.removeItem('tavern_token')
  }

  function updateUserNav(user) {
    currentUser.value = { ...user }
    saveUserToStorage()
  }

  function autoLogin() {
    if (!token.value) return

    const tokenParts = token.value.split('_')
    if (tokenParts.length >= 3) {
      const phone = tokenParts[2]

      if (token.value.startsWith('mock_client_token_')) {
        if (mockClients[phone]) {
          currentUser.value = { ...mockClients[phone] }
        } else {
          const registeredClients = JSON.parse(localStorage.getItem('registered_clients') || '{}')
          if (registeredClients[phone]) {
            currentUser.value = { ...registeredClients[phone] }
          }
        }
        return
      }

      if (mockUsers[phone]) {
        currentUser.value = { ...mockUsers[phone] }
      } else {
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}')
        if (registeredUsers[phone]) {
          currentUser.value = { ...registeredUsers[phone] }
        }
      }
    }
  }

  function addCoins(amount) {
    if (currentUser.value) {
      currentUser.value.coins += amount
      saveUserToStorage()
      return true
    }
    return false
  }

  function deductCoins(amount) {
    if (currentUser.value && currentUser.value.coins >= amount) {
      currentUser.value.coins -= amount
      saveUserToStorage()
      return true
    }
    return false
  }

  function addPearls(amount) {
    if (currentUser.value) {
      currentUser.value.pearls += amount
      saveUserToStorage()
      return true
    }
    return false
  }

  function deductPearls(amount) {
    if (currentUser.value && currentUser.value.pearls >= amount) {
      currentUser.value.pearls -= amount
      saveUserToStorage()
      return true
    }
    return false
  }

  function addPrestige(amount) {
    if (currentUser.value) {
      currentUser.value.prestige += amount
      if (!currentUser.value.totalPrestige) {
        currentUser.value.totalPrestige = currentUser.value.prestige
      } else {
        currentUser.value.totalPrestige += amount
      }
      updateLevel()
      updateVipLevel()
      saveUserToStorage()
      return true
    }
    return false
  }

  function addPoints(amount) {
    if (currentUser.value) {
      if (!currentUser.value.points) currentUser.value.points = 0
      currentUser.value.points += amount
      saveUserToStorage()
      return true
    }
    return false
  }

  function deductPoints(amount) {
    if (currentUser.value && (currentUser.value.points || 0) >= amount) {
      currentUser.value.points -= amount
      saveUserToStorage()
      return true
    }
    return false
  }

  function updateLevel() {
    if (currentUser.value) {
      currentUser.value.level = Math.floor(currentUser.value.prestige / 200) + 1
    }
  }

  function updateVipLevel() {
    if (!currentUser.value) return
    
    for (let i = vipConfigs.length - 1; i >= 0; i--) {
      if (currentUser.value.prestige >= vipConfigs[i].minPrestige) {
        currentUser.value.vipLevel = vipConfigs[i].level
        break
      }
    }
  }

  function getIdentityConfigs() {
    return identityConfigs
  }

  function getVipConfigs() {
    return vipConfigs
  }

  function getCurrentVipInfo() {
    if (!currentUser.value) return null
    return vipConfigs.find(v => v.level === currentUser.value.vipLevel) || null
  }

  function getNextVipInfo() {
    if (!currentUser.value) return null
    const currentVip = getCurrentVipInfo()
    if (!currentVip) return null
    const index = vipConfigs.findIndex(v => v.level === currentVip.level)
    if (index >= vipConfigs.length - 1) return null
    return vipConfigs[index + 1]
  }

  function getVipUpgradeCost() {
    if (!currentUser.value) return null
    const nextVip = getNextVipInfo()
    if (!nextVip) return null
    
    return {
      coins: nextVip.coinsCost - (getCurrentVipInfo()?.coinsCost || 0),
      pearls: nextVip.pearlsCost - (getCurrentVipInfo()?.pearlsCost || 0),
      prestige: nextVip.prestigeCost - (getCurrentVipInfo()?.prestigeCost || 0)
    }
  }

  function upgradeVip(method) {
    if (!currentUser.value) return { success: false, message: '请先登录' }
    
    const nextVip = getNextVipInfo()
    if (!nextVip) return { success: false, message: '已达到最高VIP等级' }
    
    const cost = getVipUpgradeCost()
    if (!cost) return { success: false, message: '无法获取升级费用' }

    switch(method) {
      case 'coins':
        if (currentUser.value.coins >= cost.coins) {
          deductCoins(cost.coins)
          currentUser.value.vipLevel = nextVip.level
          saveUserToStorage()
          return { success: true, message: `成功升级到${nextVip.name}` }
        }
        return { success: false, message: '金币不足' }
        
      case 'pearls':
        if (currentUser.value.pearls >= cost.pearls) {
          deductPearls(cost.pearls)
          currentUser.value.vipLevel = nextVip.level
          saveUserToStorage()
          return { success: true, message: `成功升级到${nextVip.name}` }
        }
        return { success: false, message: '珍珠不足' }
        
      case 'prestige':
        if (currentUser.value.prestige >= cost.prestige) {
          currentUser.value.prestige -= cost.prestige
          currentUser.value.vipLevel = nextVip.level
          saveUserToStorage()
          return { success: true, message: `成功升级到${nextVip.name}` }
        }
        return { success: false, message: '声望不足' }
        
      default:
        return { success: false, message: '无效的升级方式' }
    }
  }

  function switchIdentity(identityId) {
    if (!currentUser.value) return false
    if (!currentUser.value.identities.includes(identityId)) return false
    
    currentUser.value.currentIdentity = identityId
    saveUserToStorage()
    return true
  }

  function unlockIdentity(identityId) {
    if (!currentUser.value) return false
    
    const identity = identityConfigs[identityId]
    if (!identity) return false
    
    if (currentUser.value.identities.includes(identityId)) return false
    
    if (currentUser.value.level < identity.unlockLevel) return false
    
    const currentVip = getCurrentVipInfo()
    if (!currentVip || currentUser.value.identities.length >= currentVip.maxIdentities) {
      return false
    }
    
    currentUser.value.identities.push(identityId)
    saveUserToStorage()
    return true
  }

  function canUnlockIdentity(identityId) {
    if (!currentUser.value) return { canUnlock: false, reason: '未登录' }
    
    const identity = identityConfigs[identityId]
    if (!identity) return { canUnlock: false, reason: '身份不存在' }
    
    if (currentUser.value.identities.includes(identityId)) {
      return { canUnlock: false, reason: '已解锁此身份' }
    }
    
    if (currentUser.value.level < identity.unlockLevel) {
      return { canUnlock: false, reason: `等级不足，需要${identity.unlockLevel}级` }
    }
    
    const currentVip = getCurrentVipInfo()
    if (!currentVip || currentUser.value.identities.length >= currentVip.maxIdentities) {
      return { canUnlock: false, reason: '身份数量已达上限，提升VIP等级可解锁更多' }
    }
    
    return { canUnlock: true, reason: '' }
  }

  function getCurrentIdentity() {
    if (!currentUser.value) return null
    const identityId = currentUser.value.currentIdentity
    return identityConfigs[identityId] || null
  }

  function hasIdentity(identityId) {
    if (!currentUser.value) return false
    return currentUser.value.identities.includes(identityId)
  }

  function checkIdentityMatch(taskIdentity) {
    if (!currentUser.value) return { valid: false, message: '请先登录' }
    if (!taskIdentity) return { valid: true, message: '无身份要求' }
    
    if (!currentUser.value.identities.includes(taskIdentity)) {
      const identity = identityConfigs[taskIdentity]
      const identityName = identity ? identity.name : taskIdentity
      return { valid: false, message: `需要身份「${identityName}」，当前身份不匹配` }
    }
    
    return { valid: true, message: '身份匹配' }
  }

  function updateAcceptTime() {
    if (!currentUser.value) return
    currentUser.value.lastAcceptTime = Date.now()
    saveUserToStorage()
  }

  function incrementFailCount() {
    if (!currentUser.value) return
    currentUser.value.acceptFailCount = (currentUser.value.acceptFailCount || 0) + 1
    saveUserToStorage()
  }

  function resetFailCount() {
    if (!currentUser.value) return
    currentUser.value.acceptFailCount = 0
    saveUserToStorage()
  }

  function getAcceptCooldownRemaining() {
    if (!currentUser.value || !currentUser.value.lastAcceptTime) return 0
    
    const cooldownSeconds = Math.min(300, (currentUser.value.acceptFailCount || 0) * 60)
    const elapsed = (Date.now() - currentUser.value.lastAcceptTime) / 1000
    const remaining = Math.max(0, cooldownSeconds - elapsed)
    
    return Math.ceil(remaining)
  }

  function getIdentityInfo(identityId) {
    return identityConfigs[identityId] || null
  }

  function saveUserToStorage() {
    if (!token.value || !currentUser.value) return
    
    const tokenParts = token.value.split('_')
    if (tokenParts.length >= 3) {
      const phone = tokenParts[2]
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}')
      
      if (registeredUsers[phone]) {
        registeredUsers[phone] = { ...currentUser.value }
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers))
      }
    }
  }

  return {
    token,
    currentUser,
    isLoading,
    isLoggedIn,
    isClient,
    isAdmin,
    currentDiscount,
    dailyTaskLimit,
    login,
    register,
    clientLogin,
    clientRegister,
    logout,
    updateUserNav,
    autoLogin,
    addCoins,
    deductCoins,
    addPearls,
    deductPearls,
    addPrestige,
    addPoints,
    deductPoints,
    getIdentityConfigs,
    getVipConfigs,
    getCurrentVipInfo,
    getNextVipInfo,
    getVipUpgradeCost,
    upgradeVip,
    switchIdentity,
    unlockIdentity,
    canUnlockIdentity,
    getCurrentIdentity,
    hasIdentity,
    checkIdentityMatch,
    updateAcceptTime,
    incrementFailCount,
    resetFailCount,
    getAcceptCooldownRemaining,
    getIdentityInfo
  }
})