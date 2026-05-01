<template>
  <div class="notification-container">
    <transition-group name="notification">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="['notification', notification.type]"
        @click="closeNotification(notification.id)"
      >
        <span class="notification-icon">{{ getIcon(notification.type) }}</span>
        <span class="notification-message">{{ notification.message }}</span>
        <button class="notification-close" @click.stop="closeNotification(notification.id)"></button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const notifications = ref([])
let notificationId = 0

function addNotification(message, type = 'info') {
  const id = ++notificationId
  notifications.value.push({ id, message, type })
  
  setTimeout(() => {
    closeNotification(id)
  }, 4000)
}

function closeNotification(id) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

function getIcon(type) {
  const icons = {
    success: '',
    error: '',
    warning: '',
    info: ''
  }
  return icons[type] || icons.info
}

function handleNotification(event) {
  const { message, type } = event.detail
  addNotification(message, type)
}

onMounted(() => {
  window.addEventListener('notification', handleNotification)
})

onUnmounted(() => {
  window.removeEventListener('notification', handleNotification)
})

defineExpose({ addNotification })
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.notification.info {
  background: #3498db;
}

.notification.success {
  background: #2ecc71;
}

.notification.error {
  background: #e74c3c;
}

.notification.warning {
  background: #f39c12;
}

.notification-icon {
  font-size: 1.2rem;
}

.notification-message {
  flex: 1;
  font-size: 0.95rem;
}

.notification-close {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>

