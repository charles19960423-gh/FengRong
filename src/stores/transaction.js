import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])

  const categories = [
    { label: '全部', value: 'all' },
    { label: '收入', value: 'income' },
    { label: '支出', value: 'expense' }
  ]

  const filteredTransactions = computed(() => transactions.value)

  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalExpense = computed(() => {
    return transactions.value
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  })

  function addTransaction(type, title, amount, details = {}) {
    const now = new Date()
    const timeStr = formatTime(now)
    
    const transaction = {
      id: Date.now().toString(),
      type: amount >= 0 ? 'income' : 'expense',
      category: type,
      title,
      amount,
      time: timeStr,
      timestamp: now.getTime(),
      details
    }
    
    transactions.value.unshift(transaction)
    
    if (transactions.value.length > 100) {
      transactions.value = transactions.value.slice(0, 100)
    }
    
    saveToStorage()
  }

  function getTransactionsByType(type) {
    if (type === 'all') return transactions.value
    return transactions.value.filter(t => type === 'income' ? t.amount > 0 : t.amount < 0)
  }

  function getTransactionIcon(type) {
    const icons = {
      recharge: '💳',
      exchange: '🔄',
      transfer: '📤',
      buy: '🛒',
      task: '✅',
      achievement: '🏆',
      friend: '👥',
      system: '📢'
    }
    return icons[type] || '📋'
  }

  function formatTime(date) {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    return `${Math.floor(days / 30)}月前`
  }

  function exportTransactions() {
    const data = transactions.value.map(t => ({
      time: t.time,
      title: t.title,
      amount: t.amount,
      type: t.type
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function saveToStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions.value))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      transactions.value = JSON.parse(saved)
    } else {
      initMockData()
    }
  }

  function initMockData() {
    const mockData = [
      { id: '1', type: 'income', category: 'task', title: '完成赏金任务', amount: 500, time: '2小时前', timestamp: Date.now() - 7200000, details: {} },
      { id: '2', type: 'income', category: 'achievement', title: '成就奖励', amount: 200, time: '5小时前', timestamp: Date.now() - 18000000, details: {} },
      { id: '3', type: 'expense', category: 'buy', title: '购买装备', amount: -350, time: '昨天', timestamp: Date.now() - 86400000, details: {} },
      { id: '4', type: 'income', category: 'recharge', title: '充值到账', amount: 1000, time: '2天前', timestamp: Date.now() - 172800000, details: {} },
      { id: '5', type: 'expense', category: 'exchange', title: '珍珠兑换', amount: -500, time: '3天前', timestamp: Date.now() - 259200000, details: {} },
      { id: '6', type: 'income', category: 'friend', title: '好友赠送', amount: 200, time: '1周前', timestamp: Date.now() - 604800000, details: {} },
      { id: '7', type: 'expense', category: 'task', title: '任务押金', amount: -100, time: '1周前', timestamp: Date.now() - 604800000, details: {} },
      { id: '8', type: 'income', category: 'task', title: '任务奖励', amount: 800, time: '1周前', timestamp: Date.now() - 604800000, details: {} }
    ]
    transactions.value = mockData
  }

  return {
    transactions,
    categories,
    filteredTransactions,
    totalIncome,
    totalExpense,
    addTransaction,
    getTransactionsByType,
    getTransactionIcon,
    exportTransactions,
    loadFromStorage
  }
})