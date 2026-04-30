import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  const STORAGE_KEY = 'fr_favorites'

  const favorites = ref([])

  const favoriteTypes = {
    resource: { label: '江湖秘典', icon: '📚' },
    project: { label: '组队项目', icon: '👥' },
    event: { label: '活动', icon: '🎪' },
    task: { label: '任务', icon: '📋' }
  }

  function loadFavorites() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        favorites.value = JSON.parse(stored)
      } else {
        favorites.value = []
      }
    } catch {
      favorites.value = []
    }
  }

  function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
  }

  function addFavorite(userId, type, targetId, targetData) {
    const existing = favorites.value.find(
      f => f.userId === userId && f.type === type && f.targetId === targetId
    )

    if (existing) {
      return { success: false, message: '已添加收藏' }
    }

    const newFavorite = {
      id: 'fav-' + Date.now(),
      userId,
      type,
      targetId,
      targetData: { ...targetData },
      createdAt: new Date().toLocaleString('zh-CN')
    }

    favorites.value.unshift(newFavorite)
    saveFavorites()
    return { success: true, message: '收藏成功', favorite: newFavorite }
  }

  function removeFavorite(userId, type, targetId) {
    const index = favorites.value.findIndex(
      f => f.userId === userId && f.type === type && f.targetId === targetId
    )

    if (index === -1) {
      return { success: false, message: '未找到收藏' }
    }

    favorites.value.splice(index, 1)
    saveFavorites()
    return { success: true, message: '取消收藏成功' }
  }

  function isFavorite(userId, type, targetId) {
    return favorites.value.some(
      f => f.userId === userId && f.type === type && f.targetId === targetId
    )
  }

  function getFavoritesByUser(userId) {
    return favorites.value.filter(f => f.userId === userId)
  }

  function getFavoritesByType(userId, type) {
    return favorites.value.filter(f => f.userId === userId && f.type === type)
  }

  function getFavoriteStats(userId) {
    const userFavorites = favorites.value.filter(f => f.userId === userId)
    const stats = { total: userFavorites.length }
    
    Object.keys(favoriteTypes).forEach(type => {
      stats[type] = userFavorites.filter(f => f.type === type).length
    })

    return stats
  }

  function clearAllFavorites(userId) {
    favorites.value = favorites.value.filter(f => f.userId !== userId)
    saveFavorites()
  }

  return {
    favorites,
    favoriteTypes,
    loadFavorites,
    saveFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesByUser,
    getFavoritesByType,
    getFavoriteStats,
    clearAllFavorites
  }
})
