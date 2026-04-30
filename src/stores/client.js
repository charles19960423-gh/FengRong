import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useClientStore = defineStore('client', () => {
  const STORAGE_KEY = 'fr_client_tasks'
  const CLIENT_TASKS_KEY = 'fr_client_published_tasks'

  const clientTasks = ref([])
  const notifications = ref([])

  const mockClientTasks = [
    {
      id: 'client-task-001',
      clientPhone: '13900000001',
      clientName: '星辰传媒',
      title: '品牌形象宣传片制作',
      description: '需要制作一支3分钟的品牌形象宣传片，展示公司文化和服务理念。',
      category: 'video',
      budget: 30000,
      deadline: '2024-06-30',
      status: 'in-progress',
      statusText: '进行中',
      progress: 60,
      assignedTo: '13800138002',
      assignedName: '江湖游侠',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'client-task-002',
      clientPhone: '13900000001',
      clientName: '星辰传媒',
      title: '产品发布会活动策划',
      description: '策划并执行一场200人规模的产品发布会，包含场地、物料、嘉宾邀请等。',
      category: 'event',
      budget: 50000,
      deadline: '2024-05-15',
      status: 'pending',
      statusText: '待接单',
      progress: 0,
      assignedTo: null,
      assignedName: null,
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10'
    },
    {
      id: 'client-task-003',
      clientPhone: '13900000001',
      clientName: '星辰传媒',
      title: '社交媒体运营方案',
      description: '制定微博、抖音、小红书三个平台的年度运营方案。',
      category: 'planning',
      budget: 15000,
      deadline: '2024-04-20',
      status: 'completed',
      statusText: '已完成',
      progress: 100,
      assignedTo: '13800138003',
      assignedName: '赏金猎人',
      completedAt: '2024-04-18',
      createdAt: '2024-02-20',
      updatedAt: '2024-04-18'
    }
  ]

  const taskCategories = {
    'video': { label: '视频制作', icon: '🎬' },
    'event': { label: '活动策划', icon: '🎪' },
    'planning': { label: '方案策划', icon: '📋' },
    'design': { label: '设计制作', icon: '🎨' },
    'marketing': { label: '营销推广', icon: '📢' },
    'other': { label: '其他需求', icon: '📦' }
  }

  function loadClientTasks() {
    try {
      const stored = localStorage.getItem(CLIENT_TASKS_KEY)
      if (stored) {
        clientTasks.value = JSON.parse(stored)
      } else {
        clientTasks.value = [...mockClientTasks]
        saveClientTasks()
      }
    } catch {
      clientTasks.value = [...mockClientTasks]
    }
  }

  function saveClientTasks() {
    localStorage.setItem(CLIENT_TASKS_KEY, JSON.stringify(clientTasks.value))
  }

  function getClientTasksByPhone(phone) {
    return clientTasks.value.filter(t => t.clientPhone === phone)
  }

  function getClientTaskById(taskId) {
    return clientTasks.value.find(t => t.id === taskId) || null
  }

  function publishClientTask(taskData) {
    const newTask = {
      id: 'client-task-' + Date.now(),
      ...taskData,
      status: 'pending',
      statusText: '待接单',
      progress: 0,
      assignedTo: null,
      assignedName: null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    clientTasks.value.unshift(newTask)
    saveClientTasks()
    addNotification({
      type: 'success',
      message: '任务发布成功，等待服务商接单'
    })
    return newTask
  }

  function updateClientTask(taskId, updates) {
    const index = clientTasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      clientTasks.value[index] = {
        ...clientTasks.value[index],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      saveClientTasks()
      return true
    }
    return false
  }

  function assignTask(taskId, executorPhone, executorName) {
    return updateClientTask(taskId, {
      status: 'in-progress',
      statusText: '进行中',
      assignedTo: executorPhone,
      assignedName: executorName
    })
  }

  function completeClientTask(taskId) {
    return updateClientTask(taskId, {
      status: 'completed',
      statusText: '已完成',
      progress: 100,
      completedAt: new Date().toISOString().split('T')[0]
    })
  }

  function cancelClientTask(taskId) {
    return updateClientTask(taskId, {
      status: 'cancelled',
      statusText: '已取消'
    })
  }

  function getAvailableClientTasks() {
    return clientTasks.value.filter(t => t.status === 'pending')
  }

  const clientStats = computed(() => {
    const tasks = clientTasks.value
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      totalBudget: tasks.reduce((sum, t) => sum + (t.budget || 0), 0),
      spentBudget: tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.budget || 0), 0)
    }
  })

  function addNotification(notif) {
    notifications.value.unshift({
      id: 'notif-' + Date.now(),
      ...notif,
      timestamp: new Date().toISOString()
    })
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }

  function getNotifications() {
    return notifications.value
  }

  function clearNotifications() {
    notifications.value = []
  }

  function getCategoryLabel(category) {
    return taskCategories[category]?.label || category
  }

  function getCategoryIcon(category) {
    return taskCategories[category]?.icon || '📦'
  }

  return {
    clientTasks,
    notifications,
    taskCategories,
    loadClientTasks,
    saveClientTasks,
    getClientTasksByPhone,
    getClientTaskById,
    publishClientTask,
    updateClientTask,
    assignTask,
    completeClientTask,
    cancelClientTask,
    getAvailableClientTasks,
    clientStats,
    addNotification,
    getNotifications,
    clearNotifications,
    getCategoryLabel,
    getCategoryIcon
  }
})
