import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const STORAGE_KEY = 'fr_inventory_data'
  const FAVORITE_KEY = 'fr_item_favorites'
  const TRANSACTION_KEY = 'fr_item_transactions'

  const items = ref([])
  const favorites = ref([])
  const transactions = ref([])

  const itemTypes = {
    'weapon': { label: '武器', icon: '⚔️', color: '#ef4444' },
    'armor': { label: '护甲', icon: '🛡️', color: '#3b82f6' },
    'material': { label: '材料', icon: '📦', color: '#10b981' },
    'consumable': { label: '消耗品', icon: '🧪', color: '#f59e0b' },
    'currency': { label: '货币', icon: '💰', color: '#ec4899' },
    'accessory': { label: '饰品', icon: '💍', color: '#8b5cf6' },
    'recipe': { label: '配方', icon: '📜', color: '#06b6d4' },
    'other': { label: '其他', icon: '📋', color: '#6b7280' }
  }

  const rarityLevels = {
    'common': { label: '普通', color: '#9ca3af', stars: 1 },
    'uncommon': { label: '优秀', color: '#10b981', stars: 2 },
    'rare': { label: '稀有', color: '#3b82f6', stars: 3 },
    'epic': { label: '史诗', color: '#8b5cf6', stars: 4 },
    'legendary': { label: '传说', color: '#f59e0b', stars: 5 }
  }

  const mockItems = [
    {
      id: 'item-001',
      name: '神秘符文',
      icon: '✨',
      type: 'material',
      category: '符文',
      quantity: 5,
      description: '古老遗迹中发现的神秘符文碎片',
      rarity: 'rare',
      value: 1000,
      ownerId: '13800138001',
      obtainedAt: '2024-12-10'
    },
    {
      id: 'item-002',
      name: '淡水珍珠',
      icon: '💎',
      type: 'currency',
      category: '货币',
      quantity: 150,
      description: '可用于兑换各种物品',
      rarity: 'common',
      value: 10,
      ownerId: '13800138001',
      obtainedAt: '2024-12-15'
    },
    {
      id: 'item-003',
      name: '精良长剑',
      icon: '⚔️',
      type: 'weapon',
      category: '武器',
      quantity: 1,
      description: '锻造精良的长剑',
      rarity: 'epic',
      value: 5000,
      ownerId: '13800138002',
      obtainedAt: '2024-12-12'
    },
    {
      id: 'item-004',
      name: '疗伤草药',
      icon: '🌿',
      type: 'consumable',
      category: '药品',
      quantity: 10,
      description: '可恢复少量生命值',
      rarity: 'common',
      value: 50,
      ownerId: '13800138001',
      obtainedAt: '2024-12-08'
    }
  ]

  function loadInventory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
      } else {
        items.value = [...mockItems]
        saveInventory()
      }
    } catch {
      items.value = [...mockItems]
    }
  }

  function saveInventory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function loadFavorites() {
    try {
      const stored = localStorage.getItem(FAVORITE_KEY)
      favorites.value = stored ? JSON.parse(stored) : []
    } catch {
      favorites.value = []
    }
  }

  function saveFavorites() {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites.value))
  }

  function toggleFavorite(itemId, userId) {
    const index = favorites.value.findIndex(f => f.itemId === itemId && f.userId === userId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
      return { success: true, isFavorite: false }
    } else {
      favorites.value.push({
        itemId,
        userId,
        createdAt: new Date().toISOString()
      })
      saveFavorites()
      return { success: true, isFavorite: true }
    }
  }

  function isFavorite(itemId, userId) {
    return favorites.value.some(f => f.itemId === itemId && f.userId === userId)
  }

  function getFavoriteItems(userId) {
    const userFavorites = favorites.value.filter(f => f.userId === userId)
    return items.value.filter(i => userFavorites.some(f => f.itemId === i.id))
  }

  function loadTransactions() {
    try {
      const stored = localStorage.getItem(TRANSACTION_KEY)
      transactions.value = stored ? JSON.parse(stored) : []
    } catch {
      transactions.value = []
    }
  }

  function saveTransactions() {
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(transactions.value))
  }

  function createTransaction(buyerId, sellerId, itemId, quantity, price) {
    const item = getItemById(itemId)
    if (!item) return { success: false, message: '物品不存在' }
    if (item.ownerId !== sellerId) return { success: false, message: '卖家不是物品所有者' }
    if (item.quantity < quantity) return { success: false, message: '数量不足' }

    const transaction = {
      id: 'tx-' + Date.now(),
      buyerId,
      sellerId,
      itemId,
      itemName: item.name,
      itemIcon: item.icon,
      quantity,
      price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      escrowAmount: price
    }

    transactions.value.unshift(transaction)
    saveTransactions()
    
    const lockResult = lockItem(itemId, sellerId, quantity, transaction.id)
    if (!lockResult.success) {
      const idx = transactions.value.findIndex(t => t.id === transaction.id)
      if (idx !== -1) transactions.value.splice(idx, 1)
      saveTransactions()
      return { success: false, message: lockResult.message }
    }

    return { success: true, transaction }
  }

  function lockItem(itemId, ownerId, quantity, transactionId) {
    const item = getItemById(itemId)
    if (!item) return { success: false, message: '物品不存在' }
    if (item.ownerId !== ownerId) return { success: false, message: '你不是物品所有者' }
    if (item.quantity < quantity) return { success: false, message: '数量不足' }

    item.quantity -= quantity
    
    if (!item.locked) item.locked = []
    item.locked.push({ quantity, transactionId })
    
    saveInventory()
    return { success: true }
  }

  function unlockItem(itemId, transactionId) {
    const item = getItemById(itemId)
    if (!item || !item.locked) return { success: false, message: '没有锁定的物品' }

    const lockIndex = item.locked.findIndex(l => l.transactionId === transactionId)
    if (lockIndex === -1) return { success: false, message: '未找到锁定记录' }

    const locked = item.locked[lockIndex]
    item.quantity += locked.quantity
    item.locked.splice(lockIndex, 1)
    
    if (item.locked.length === 0) delete item.locked
    
    saveInventory()
    return { success: true }
  }

  function completeTransaction(transactionId) {
    const transaction = transactions.value.find(t => t.id === transactionId)
    if (!transaction) return { success: false, message: '交易不存在' }
    if (transaction.status !== 'pending') return { success: false, message: '交易状态不正确' }

    const unlockResult = unlockItem(transaction.itemId, transactionId)
    if (!unlockResult.success) return unlockResult

    const item = getItemById(transaction.itemId)
    if (!item) {
      addItem({
        name: transaction.itemName,
        icon: transaction.itemIcon,
        type: 'other',
        category: '交易',
        quantity: transaction.quantity,
        description: '交易获得',
        rarity: 'common',
        value: Math.floor(transaction.price / transaction.quantity),
        ownerId: transaction.buyerId
      })
    } else {
      addItem({
        ...item,
        ownerId: transaction.buyerId,
        quantity: transaction.quantity
      })
    }

    transaction.status = 'completed'
    transaction.completedAt = new Date().toISOString()
    saveTransactions()

    return { success: true }
  }

  function cancelTransaction(transactionId) {
    const transaction = transactions.value.find(t => t.id === transactionId)
    if (!transaction) return { success: false, message: '交易不存在' }
    if (transaction.status !== 'pending') return { success: false, message: '交易状态不正确' }

    const unlockResult = unlockItem(transaction.itemId, transactionId)
    if (!unlockResult.success) return unlockResult

    transaction.status = 'cancelled'
    transaction.cancelledAt = new Date().toISOString()
    saveTransactions()

    return { success: true }
  }

  function getTransactionsByUser(userId) {
    return transactions.value.filter(t => t.buyerId === userId || t.sellerId === userId)
  }

  function getTransactionById(transactionId) {
    return transactions.value.find(t => t.id === transactionId) || null
  }

  function filterItemsByPrice(minPrice, maxPrice) {
    return items.value.filter(item => {
      const itemPrice = item.value * (item.quantity || 1)
      return itemPrice >= (minPrice || 0) && itemPrice <= (maxPrice || Infinity)
    })
  }

  function searchItems(keyword) {
    if (!keyword) return items.value
    const lowerKeyword = keyword.toLowerCase()
    return items.value.filter(item => 
      item.name.toLowerCase().includes(lowerKeyword) ||
      item.description.toLowerCase().includes(lowerKeyword) ||
      item.category.toLowerCase().includes(lowerKeyword)
    )
  }

  function getItemsByOwner(ownerId) {
    return items.value.filter(i => i.ownerId === ownerId)
  }

  function getItemById(itemId) {
    return items.value.find(i => i.id === itemId) || null
  }

  function addItem(data) {
    const existingItem = items.value.find(
      i => i.ownerId === data.ownerId && i.name === data.name && i.type === data.type
    )

    if (existingItem) {
      existingItem.quantity += data.quantity || 1
    } else {
      const newItem = {
        id: 'item-' + Date.now(),
        ...data,
        quantity: data.quantity || 1,
        obtainedAt: new Date().toISOString().split('T')[0]
      }
      items.value.unshift(newItem)
    }
    saveInventory()
    return existingItem || { ...items.value[0] }
  }

  function removeItem(itemId, quantity = 1) {
    const index = items.value.findIndex(i => i.id === itemId)
    if (index === -1) return { success: false, message: '物品不存在' }

    const item = items.value[index]
    if (item.quantity < quantity) return { success: false, message: '数量不足' }

    item.quantity -= quantity
    if (item.quantity <= 0) {
      items.value.splice(index, 1)
    }
    saveInventory()
    return { success: true }
  }

  function transferItem(itemId, fromId, toId, quantity = 1) {
    const item = getItemById(itemId)
    if (!item) return { success: false, message: '物品不存在' }
    if (item.ownerId !== fromId) return { success: false, message: '你不是物品所有者' }
    if (item.quantity < quantity) return { success: false, message: '数量不足' }

    const result = removeItem(itemId, quantity)
    if (!result.success) return result

    addItem({
      ...item,
      id: 'item-' + Date.now(),
      ownerId: toId,
      quantity
    })
    return { success: true }
  }

  const itemCategories = computed(() => {
    const categories = {}
    items.value.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = []
      }
      categories[item.category].push(item)
    })
    return categories
  })

  function getTotalValue(ownerId) {
    return items.value
      .filter(i => i.ownerId === ownerId)
      .reduce((sum, item) => sum + (item.value * item.quantity), 0)
  }

  return {
    items,
    favorites,
    transactions,
    itemCategories,
    itemTypes,
    rarityLevels,
    loadInventory,
    saveInventory,
    loadFavorites,
    saveFavorites,
    loadTransactions,
    saveTransactions,
    getItemsByOwner,
    getItemById,
    addItem,
    removeItem,
    transferItem,
    getTotalValue,
    toggleFavorite,
    isFavorite,
    getFavoriteItems,
    createTransaction,
    completeTransaction,
    cancelTransaction,
    getTransactionsByUser,
    getTransactionById,
    filterItemsByPrice,
    searchItems
  }
})