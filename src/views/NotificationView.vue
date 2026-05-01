<template>
  <div class="notification-page">
    <div class="page-header">
      <h1> 消息中心</h1>
      <p>查看您的消息和通知</p>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">
         系统通知 <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </button>
      <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">
         私信 <span v-if="unreadMessageCount > 0" class="badge">{{ unreadMessageCount }}</span>
      </button>
    </div>

    <div v-if="activeTab === 'notifications'" class="notifications-section">
      <div class="section-header">
        <h2>系统通知</h2>
        <button v-if="unreadCount > 0" class="mark-all-btn" @click="markAllAsRead">
          全部标为已读
        </button>
      </div>

      <div v-if="userNotifications.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无系统通知</p>
      </div>

      <div class="notification-list">
        <div
          v-for="notification in userNotifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.isRead }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon" :style="{ backgroundColor: getTypeColor(notification.type) }">
            {{ getTypeIcon(notification.type) }}
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-text">{{ notification.content }}</div>
            <div class="notification-meta">
              <span v-if="notification.senderName" class="sender">来自: {{ notification.senderName }}</span>
              <span class="time">{{ notification.createdAt }}</span>
            </div>
          </div>
          <div v-if="!notification.isRead" class="unread-dot"></div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'messages'" class="messages-section">
      <div class="section-header">
        <h2>私信</h2>
      </div>

      <div v-if="conversations.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无私信消息</p>
      </div>

      <div class="conversation-list">
        <div
          v-for="conversation in conversations"
          :key="conversation.userId"
          class="conversation-item"
          :class="{ active: selectedConversation?.userId === conversation.userId }"
          @click="selectConversation(conversation)"
        >
          <div class="conversation-avatar"></div>
          <div class="conversation-info">
            <div class="conversation-name">{{ conversation.userName }}</div>
            <div class="conversation-preview">
              {{ conversation.lastMessage.content.length > 30 
                ? conversation.lastMessage.content.slice(0, 30) + '...' 
                : conversation.lastMessage.content }}
            </div>
          </div>
          <div class="conversation-meta">
            <span class="conversation-time">{{ conversation.lastMessage.createdAt }}</span>
            <span v-if="conversation.unreadCount > 0" class="unread-badge">{{ conversation.unreadCount }}</span>
          </div>
        </div>
      </div>

      <div v-if="selectedConversation" class="chat-section">
        <div class="chat-header">
          <div class="chat-avatar"></div>
          <div class="chat-info">
            <div class="chat-name">{{ selectedConversation.userName }}</div>
          </div>
        </div>
        <div class="chat-messages">
          <div
            v-for="message in selectedMessages"
            :key="message.id"
            class="chat-message"
            :class="{ mine: message.fromUserId === authStore.currentUser?.phone }"
          >
            <div class="message-content">
              {{ message.content }}
            </div>
            <div class="message-time">{{ message.createdAt }}</div>
          </div>
        </div>
        <div class="chat-input">
          <input
            v-model="newMessage"
            type="text"
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
          />
          <button class="send-btn" @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores'
import { useAuthStore } from '@/stores'

const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const activeTab = ref('notifications')
const selectedConversation = ref(null)
const newMessage = ref('')

onMounted(() => {
  notificationStore.loadNotifications()
  notificationStore.loadPrivateMessages()
})

const userNotifications = computed(() => {
  if (!authStore.currentUser) return []
  return notificationStore.getNotificationsByUser(authStore.currentUser.phone)
})

const unreadCount = computed(() => {
  if (!authStore.currentUser) return 0
  return notificationStore.getUnreadCount(authStore.currentUser.phone)
})

const conversations = computed(() => {
  if (!authStore.currentUser) return []
  return notificationStore.getConversations(authStore.currentUser.phone)
})

const unreadMessageCount = computed(() => {
  if (!authStore.currentUser) return 0
  return notificationStore.getUnreadPrivateMessageCount(authStore.currentUser.phone)
})

const selectedMessages = computed(() => {
  if (!selectedConversation.value || !authStore.currentUser) return []
  
  const userId = authStore.currentUser.phone
  const otherUserId = selectedConversation.value.userId
  
  return notificationStore.privateMessages
    .filter(m => 
      (m.fromUserId === userId && m.toUserId === otherUserId) ||
      (m.fromUserId === otherUserId && m.toUserId === userId)
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
})

function getTypeIcon(type) {
  return notificationStore.notificationTypes[type]?.icon || ''
}

function getTypeColor(type) {
  return notificationStore.notificationTypes[type]?.color || '#6b7280'
}

function markAsRead(notificationId) {
  notificationStore.markAsRead(notificationId)
}

function markAllAsRead() {
  if (authStore.currentUser) {
    notificationStore.markAllAsRead(authStore.currentUser.phone)
  }
}

function selectConversation(conversation) {
  selectedConversation.value = conversation
  
  conversation.lastMessage.isRead = true
  notificationStore.saveNotifications()
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedConversation.value || !authStore.currentUser) return

  notificationStore.addPrivateMessage(
    authStore.currentUser.phone,
    authStore.currentUser.nickname,
    selectedConversation.value.userId,
    newMessage.value
  )

  newMessage.value = ''
}
</script>

<style scoped>
.notification-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  color: #6b7280;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.mark-all-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.empty-state p {
  color: #6b7280;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  border-left: 4px solid #3b82f6;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.notification-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.notification-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #9ca3af;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  margin-top: 8px;
}

.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.conversation-item:hover,
.conversation-item.active {
  background: #dbeafe;
}

.conversation-avatar {
  font-size: 1.5rem;
}

.conversation-info {
  flex: 1;
}

.conversation-name {
  font-weight: 500;
  color: #1f2937;
}

.conversation-preview {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 2px;
}

.conversation-meta {
  text-align: right;
}

.conversation-time {
  font-size: 0.75rem;
  color: #9ca3af;
  display: block;
}

.unread-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 4px;
}

.chat-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #3b82f6;
  color: white;
}

.chat-avatar {
  font-size: 1.5rem;
}

.chat-name {
  font-weight: 500;
}

.chat-messages {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.chat-message {
  margin-bottom: 16px;
}

.chat-message.mine {
  text-align: right;
}

.message-content {
  display: inline-block;
  padding: 10px 14px;
  background: #f3f4f6;
  border-radius: 16px;
  max-width: 70%;
}

.chat-message.mine .message-content {
  background: #3b82f6;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
}

.send-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .notification-item {
    flex-direction: column;
  }
  
  .conversation-item {
    flex-wrap: wrap;
  }
  
  .conversation-meta {
    flex: 1;
    text-align: left;
  }
}
</style>

