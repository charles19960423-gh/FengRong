import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const STORAGE_KEY = 'fr_notifications'

  const notifications = ref([])
  const privateMessages = ref([])

  const mockNotifications = [
    {
      id: 'notif-001',
      userId: '13800138001',
      type: 'system',
      title: '系统维护通知',
      content: '尊敬的用户，我们将于今晚22:00-24:00进行系统维护，期间可能影响部分功能使用，敬请谅解。',
      senderId: null,
      senderName: null,
      relatedId: null,
      isRead: false,
      createdAt: '2024-01-15 10:00:00'
    },
    {
      id: 'notif-002',
      userId: '13800138001',
      type: 'task',
      title: '任务完成通知',
      content: '您的任务「完成短视频拍摄」已完成，获得100金币奖励！',
      senderId: null,
      senderName: null,
      relatedId: 'task-001',
      isRead: false,
      createdAt: '2024-01-15 09:30:00'
    },
    {
      id: 'notif-003',
      userId: '13800138001',
      type: 'team',
      title: '组队邀请',
      content: '「赏金猎人」邀请您加入项目「品牌微电影项目」，角色：摄影师',
      senderId: '13800138003',
      senderName: '赏金猎人',
      relatedId: 'team-001',
      isRead: false,
      createdAt: '2024-01-14 16:00:00'
    },
    {
      id: 'notif-004',
      userId: '13800138001',
      type: 'event',
      title: '活动提醒',
      content: '您报名的「短视频创作经验分享会」将于明天20:00开始，请准时参加！',
      senderId: null,
      senderName: null,
      relatedId: 'event-002',
      isRead: true,
      createdAt: '2024-01-14 10:00:00'
    }
  ]

  const mockPrivateMessages = [
    {
      id: 'pm-001',
      fromUserId: '13800138002',
      fromUserName: '江湖游侠',
      toUserId: '13800138001',
      content: '您好，我想了解一下那个微电影项目的具体情况。',
      isRead: false,
      createdAt: '2024-01-15 11:00:00'
    },
    {
      id: 'pm-002',
      fromUserId: '13800138001',
      fromUserName: '馆主大人',
      toUserId: '13800138002',
      content: '好的，项目下月初开始，需要摄影师和剪辑师各一名。',
      isRead: true,
      createdAt: '2024-01-15 11:05:00'
    },
    {
      id: 'pm-003',
      fromUserId: '13800138003',
      fromUserName: '赏金猎人',
      toUserId: '13800138001',
      content: '@馆主大人 这个周末有空聚一下吗？',
      isRead: false,
      createdAt: '2024-01-15 09:00:00'
    }
  ]

  function loadNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        notifications.value = data.notifications || []
        privateMessages.value = data.privateMessages || []
      } else {
        notifications.value = [...mockNotifications]
        privateMessages.value = [...mockPrivateMessages]
        saveNotifications()
      }
    } catch {
      notifications.value = [...mockNotifications]
      privateMessages.value = [...mockPrivateMessages]
    }
  }

  function saveNotifications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      notifications: notifications.value,
      privateMessages: privateMessages.value
    }))
  }

  function addNotification(userId, type, title, content, relatedId = null, senderId = null, senderName = null) {
    const newNotification = {
      id: 'notif-' + Date.now(),
      userId,
      type,
      title,
      content,
      senderId,
      senderName,
      relatedId,
      isRead: false,
      createdAt: new Date().toLocaleString('zh-CN')
    }
    notifications.value.unshift(newNotification)
    saveNotifications()
    return newNotification
  }

  function addPrivateMessage(fromUserId, fromUserName, toUserId, content) {
    const newMessage = {
      id: 'pm-' + Date.now(),
      fromUserId,
      fromUserName,
      toUserId,
      content,
      isRead: false,
      createdAt: new Date().toLocaleString('zh-CN')
    }
    privateMessages.value.push(newMessage)
    saveNotifications()
    return newMessage
  }

  function markAsRead(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value[index].isRead = true
      saveNotifications()
    }
  }

  function markAllAsRead(userId) {
    notifications.value.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true
      }
    })
    saveNotifications()
  }

  function markPrivateMessageAsRead(messageId) {
    const index = privateMessages.value.findIndex(m => m.id === messageId)
    if (index !== -1) {
      privateMessages.value[index].isRead = true
      saveNotifications()
    }
  }

  function getNotificationsByUser(userId) {
    return notifications.value.filter(n => n.userId === userId)
  }

  function getUnreadCount(userId) {
    return notifications.value.filter(n => n.userId === userId && !n.isRead).length
  }

  function getPrivateMessages(userId) {
    return privateMessages.value.filter(m => 
      m.fromUserId === userId || m.toUserId === userId
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  function getUnreadPrivateMessageCount(userId) {
    return privateMessages.value.filter(m => 
      m.toUserId === userId && !m.isRead
    ).length
  }

  function getConversations(userId) {
    const messages = getPrivateMessages(userId)
    const conversations = {}
    
    messages.forEach(msg => {
      const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId
      const otherUserName = msg.fromUserId === userId ? msg.toUserName : msg.fromUserName
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg,
          unreadCount: privateMessages.value.filter(
            m => m.toUserId === userId && m.fromUserId === otherUserId && !m.isRead
          ).length
        }
      }
    })
    
    return Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    )
  }

  const notificationTypes = {
    system: { label: '系统通知', icon: '🔔', color: '#6b7280' },
    task: { label: '任务通知', icon: '📋', color: '#3b82f6' },
    team: { label: '组队邀请', icon: '👥', color: '#10b981' },
    event: { label: '活动提醒', icon: '🎪', color: '#f59e0b' },
    mention: { label: '@提醒', icon: '💬', color: '#8b5cf6' }
  }

  return {
    notifications,
    privateMessages,
    notificationTypes,
    loadNotifications,
    saveNotifications,
    addNotification,
    addPrivateMessage,
    markAsRead,
    markAllAsRead,
    markPrivateMessageAsRead,
    getNotificationsByUser,
    getUnreadCount,
    getPrivateMessages,
    getUnreadPrivateMessageCount,
    getConversations
  }
})
