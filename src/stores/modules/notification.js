import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const STORAGE_KEY = 'fr_notification_data'
  const STORAGE_KEY_MESSAGES = 'fr_private_messages'

  const notifications = ref([])
  const privateMessages = ref([])

  const notificationTypes = {
    task: { icon: '📋', color: '#3b82f6' },
    achievement: { icon: '🏆', color: '#f59e0b' },
    system: { icon: '📢', color: '#6b7280' },
    order: { icon: '📦', color: '#10b981' },
    friend: { icon: '👥', color: '#8b5cf6' },
    reward: { icon: '💰', color: '#f97316' }
  }

  const mockNotifications = [
    {
      id: 'notif-001',
      userId: '13800138001',
      type: 'task',
      title: '任务完成奖励',
      content: '恭喜！你完成的任务「收集神秘符文」已获得奖励 💰 3,500',
      icon: '🏆',
      isRead: false,
      senderName: '系统',
      actionUrl: '/tasks',
      createdAt: '2024-12-18 15:30'
    },
    {
      id: 'notif-002',
      userId: '13800138001',
      type: 'friend',
      title: '好友请求',
      content: '药师阿琳 请求添加你为好友',
      icon: '👥',
      isRead: false,
      senderName: '药师阿琳',
      actionUrl: '/social',
      createdAt: '2024-12-18 14:00'
    },
    {
      id: 'notif-003',
      userId: '13800138001',
      type: 'system',
      title: '系统公告',
      content: '酒馆将于今晚22:00进行例行维护，请提前下线',
      icon: '📢',
      isRead: true,
      senderName: '系统',
      actionUrl: '/settings',
      createdAt: '2024-12-17 10:00'
    },
    {
      id: 'notif-004',
      userId: '13800138001',
      type: 'order',
      title: '订单更新',
      content: '你的订单「精良武器租赁」已确认',
      icon: '📦',
      isRead: false,
      senderName: '系统',
      actionUrl: '/orders',
      createdAt: '2024-12-18 12:00'
    },
    {
      id: 'notif-005',
      userId: '13800138002',
      type: 'achievement',
      title: '成就解锁',
      content: '恭喜解锁成就「初出茅庐」！',
      icon: '🏅',
      isRead: false,
      senderName: '系统',
      actionUrl: '/achievements',
      createdAt: '2024-12-18 11:00'
    },
    {
      id: 'notif-006',
      userId: '13800138003',
      type: 'reward',
      title: '赏金发放',
      content: '任务赏金已发放至你的账户',
      icon: '💰',
      isRead: false,
      senderName: '系统',
      actionUrl: '/profile',
      createdAt: '2024-12-18 10:00'
    }
  ]

  const mockPrivateMessages = [
    {
      id: 'msg-001',
      fromUserId: '13800138002',
      fromUserName: '江湖游侠',
      toUserId: '13800138001',
      toUserName: '馆主大人',
      content: '你好，请问这个任务怎么接取？',
      createdAt: '2024-12-18 16:00',
      isRead: false
    },
    {
      id: 'msg-002',
      fromUserId: '13800138001',
      fromUserName: '馆主大人',
      toUserId: '13800138002',
      toUserName: '江湖游侠',
      content: '点击任务卡片即可接取',
      createdAt: '2024-12-18 16:05',
      isRead: true
    },
    {
      id: 'msg-003',
      fromUserId: '13800138002',
      fromUserName: '江湖游侠',
      toUserId: '13800138001',
      toUserName: '馆主大人',
      content: '明白了，谢谢！',
      createdAt: '2024-12-18 16:08',
      isRead: false
    },
    {
      id: 'msg-004',
      fromUserId: '13800138003',
      fromUserName: '赏金猎人',
      toUserId: '13800138001',
      toUserName: '馆主大人',
      content: '请问有高难度任务吗？',
      createdAt: '2024-12-18 15:30',
      isRead: false
    }
  ]

  function loadNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        notifications.value = JSON.parse(stored)
      } else {
        notifications.value = [...mockNotifications]
        saveNotifications()
      }
    } catch {
      notifications.value = [...mockNotifications]
    }
  }

  function loadPrivateMessages() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES)
      if (stored) {
        privateMessages.value = JSON.parse(stored)
      } else {
        privateMessages.value = [...mockPrivateMessages]
        savePrivateMessages()
      }
    } catch {
      privateMessages.value = [...mockPrivateMessages]
    }
  }

  function saveNotifications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.value))
  }

  function savePrivateMessages() {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(privateMessages.value))
  }

  function getNotifications(userId) {
    return notifications.value.filter(n => n.userId === userId)
  }

  function getNotificationsByUser(userId) {
    return notifications.value.filter(n => n.userId === userId)
  }

  function getUnreadCount(userId) {
    return notifications.value.filter(n => n.userId === userId && !n.isRead).length
  }

  function addNotification(data) {
    const notification = {
      id: 'notif-' + Date.now(),
      ...data,
      isRead: false,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false })
    }
    notifications.value.unshift(notification)
    saveNotifications()
    return notification
  }

  function markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
      saveNotifications()
      return true
    }
    return false
  }

  function markAllAsRead(userId) {
    notifications.value.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true
      }
    })
    saveNotifications()
  }

  function deleteNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      saveNotifications()
      return true
    }
    return false
  }

  function getConversations(userId) {
    const userMessages = privateMessages.value.filter(
      m => m.fromUserId === userId || m.toUserId === userId
    )
    
    const conversationMap = new Map()
    
    userMessages.forEach(msg => {
      const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId
      const otherUserName = msg.fromUserId === userId ? msg.toUserName : msg.fromUserName
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: null,
          unreadCount: 0
        })
      }
      
      const conversation = conversationMap.get(otherUserId)
      
      if (!conversation.lastMessage || 
          new Date(msg.createdAt) > new Date(conversation.lastMessage.createdAt)) {
        conversation.lastMessage = msg
      }
      
      if (msg.toUserId === userId && !msg.isRead) {
        conversation.unreadCount++
      }
    })
    
    return Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    )
  }

  function getUnreadPrivateMessageCount(userId) {
    return privateMessages.value.filter(
      m => m.toUserId === userId && !m.isRead
    ).length
  }

  function addPrivateMessage(fromUserId, fromUserName, toUserId, content) {
    const message = {
      id: 'msg-' + Date.now(),
      fromUserId,
      fromUserName,
      toUserId,
      toUserName: getUserNameById(toUserId) || '未知用户',
      content,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      isRead: false
    }
    privateMessages.value.push(message)
    savePrivateMessages()
    return message
  }

  function getUserNameById(userId) {
    const userMap = {
      '13800138001': '馆主大人',
      '13800138002': '江湖游侠',
      '13800138003': '赏金猎人'
    }
    return userMap[userId]
  }

  const unreadNotifications = computed(() => notifications.value.filter(n => !n.isRead))

  return {
    notifications,
    privateMessages,
    notificationTypes,
    unreadNotifications,
    loadNotifications,
    loadPrivateMessages,
    saveNotifications,
    savePrivateMessages,
    getNotifications,
    getNotificationsByUser,
    getUnreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getConversations,
    getUnreadPrivateMessageCount,
    addPrivateMessage
  }
})
