import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const items = ref([])
  const maxCapacity = 50

  const itemCategories = [
    { id: 'all', name: '全部', icon: '📦' },
    { id: 'consumable', name: '消耗品', icon: '🧪' },
    { id: 'material', name: '材料', icon: '💎' },
    { id: 'equipment', name: '装备', icon: '⚔️' },
    { id: 'special', name: '特殊', icon: '✨' }
  ]

  const itemTemplates = {
    health_potion_1: { id: 'health_potion_1', name: '初级体力丹', icon: '💊', category: 'consumable', description: '恢复50点体力', effect: { stamina: 50 }, price: 100 },
    health_potion_2: { id: 'health_potion_2', name: '中级体力丹', icon: '🧪', category: 'consumable', description: '恢复100点体力', effect: { stamina: 100 }, price: 250 },
    health_potion_3: { id: 'health_potion_3', name: '高级体力丹', icon: '💎💊', category: 'consumable', description: '恢复500点体力', effect: { stamina: 500 }, price: 5, currency: 'pearls' },
    exp_scroll: { id: 'exp_scroll', name: '经验卷轴', icon: '📜', category: 'consumable', description: '获得500点经验', effect: { exp: 500 }, price: 500 },
    exp_book: { id: 'exp_book', name: '传说经验书', icon: '💎📚', category: 'consumable', description: '获得5000点经验', effect: { exp: 5000 }, price: 10, currency: 'pearls' },
    prestige_token: { id: 'prestige_token', name: '声望令牌', icon: '⭐', category: 'consumable', description: '获得50声望', effect: { prestige: 50 }, price: 800 },
    prestige_token_2: { id: 'prestige_token_2', name: '至尊声望令', icon: '💎⭐', category: 'consumable', description: '获得500声望', effect: { prestige: 500 }, price: 15, currency: 'pearls' },
    pearl_bag: { id: 'pearl_bag', name: '珍珠袋', icon: '💎', category: 'material', description: '内含5颗珍珠', effect: { pearls: 5 }, price: 500 },
    gold_box: { id: 'gold_box', name: '神秘宝箱', icon: '📦', category: 'special', description: '随机获得稀有物品', effect: { random: true }, price: 1500 },
    rare_box: { id: 'rare_box', name: '金色宝箱', icon: '💎📦', category: 'special', description: '随机获得稀有奖励', effect: { random: true }, price: 20, currency: 'pearls' }
  }

  const capacityUsed = computed(() => {
    return items.value.reduce((sum, item) => sum + item.count, 0)
  })

  const capacityPercent = computed(() => {
    return Math.round((capacityUsed.value / maxCapacity) * 100)
  })

  const filteredItems = computed(() => {
    return groupItemsByCategory()
  })

  function addItem(itemId, count = 1) {
    if (capacityUsed.value + count > maxCapacity) {
      return { success: false, message: '背包已满！' }
    }

    const existingItem = items.value.find(item => item.id === itemId)
    if (existingItem) {
      existingItem.count += count
    } else {
      const template = itemTemplates[itemId]
      if (template) {
        items.value.push({ ...template, count })
      } else {
        return { success: false, message: '物品不存在' }
      }
    }

    saveToStorage()
    return { success: true, message: `获得 ${itemTemplates[itemId]?.name || itemId} x${count}` }
  }

  function removeItem(itemId, count = 1) {
    const existingItem = items.value.find(item => item.id === itemId)
    if (!existingItem) {
      return { success: false, message: '物品不存在' }
    }

    if (existingItem.count <= count) {
      items.value = items.value.filter(item => item.id !== itemId)
    } else {
      existingItem.count -= count
    }

    saveToStorage()
    return { success: true }
  }

  function useItem(itemId, authStore) {
    const item = items.value.find(i => i.id === itemId)
    if (!item || item.count <= 0) {
      return { success: false, message: '物品不存在或数量不足' }
    }

    const template = itemTemplates[itemId]
    const effects = template.effect

    if (effects.stamina) {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: { message: `💊 使用 ${template.name}，体力 +${effects.stamina}`, type: 'success' }
      }))
    }

    if (effects.exp) {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: { message: `📚 使用 ${template.name}，获得 ${effects.exp} 经验`, type: 'success' }
      }))
    }

    if (effects.prestige && authStore) {
      authStore.addPrestige(effects.prestige)
      window.dispatchEvent(new CustomEvent('notification', {
        detail: { message: `⭐ 使用 ${template.name}，声望 +${effects.prestige}`, type: 'success' }
      }))
    }

    if (effects.pearls && authStore) {
      authStore.addPearls(effects.pearls)
      window.dispatchEvent(new CustomEvent('notification', {
        detail: { message: `💎 使用 ${template.name}，珍珠 +${effects.pearls}`, type: 'success' }
      }))
    }

    if (effects.random) {
      const rewards = [
        { type: 'coins', amount: Math.floor(Math.random() * 200) + 100 },
        { type: 'pearls', amount: Math.floor(Math.random() * 5) + 1 },
        { type: 'prestige', amount: Math.floor(Math.random() * 30) + 10 }
      ]
      const reward = rewards[Math.floor(Math.random() * rewards.length)]
      
      if (reward.type === 'coins' && authStore) {
        authStore.addCoins(reward.amount)
      } else if (reward.type === 'pearls' && authStore) {
        authStore.addPearls(reward.amount)
      } else if (reward.type === 'prestige' && authStore) {
        authStore.addPrestige(reward.amount)
      }

      window.dispatchEvent(new CustomEvent('notification', {
        detail: { message: `🎁 打开宝箱！获得${reward.type === 'coins' ? '金币' : reward.type === 'pearls' ? '珍珠' : '声望'} +${reward.amount}`, type: 'success' }
      }))
    }

    removeItem(itemId, 1)
    return { success: true }
  }

  function sellItem(itemId, authStore) {
    const item = items.value.find(i => i.id === itemId)
    if (!item || item.count <= 0) {
      return { success: false, message: '物品不存在或数量不足' }
    }

    const template = itemTemplates[itemId]
    const sellPrice = Math.floor((template.price || 0) * 0.6)

    if (authStore) {
      authStore.addCoins(sellPrice)
    }

    removeItem(itemId, 1)
    return { success: true, message: `出售 ${template.name}，获得 ${sellPrice} 金币` }
  }

  function groupItemsByCategory() {
    const grouped = {}
    itemCategories.forEach(cat => {
      grouped[cat.id] = { ...cat, items: [] }
    })

    items.value.forEach(item => {
      const catId = item.category || 'special'
      grouped[catId].items.push(item)
      grouped['all'].items.push(item)
    })

    return grouped
  }

  function clearInventory() {
    items.value = []
    saveToStorage()
  }

  function saveToStorage() {
    localStorage.setItem('inventory', JSON.stringify(items.value))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('inventory')
    if (saved) {
      items.value = JSON.parse(saved)
    } else {
      initMockData()
    }
  }

  function initMockData() {
    items.value = [
      { ...itemTemplates.health_potion_1, count: 5 },
      { ...itemTemplates.exp_scroll, count: 2 },
      { ...itemTemplates.prestige_token, count: 3 },
      { ...itemTemplates.pearl_bag, count: 1 },
      { ...itemTemplates.gold_box, count: 1 }
    ]
  }

  return {
    items,
    maxCapacity,
    capacityUsed,
    capacityPercent,
    itemCategories,
    itemTemplates,
    filteredItems,
    addItem,
    removeItem,
    useItem,
    sellItem,
    clearInventory,
    loadFromStorage
  }
})