<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" :class="['toast', type]" @click="close">
        <span class="toast-icon">{{ icon }}</span>
        <span class="toast-message">{{ message }}</span>
        <button class="toast-close" @click.stop="close">&times;</button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('info')
let timer = null

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
}

const icon = ref('ℹ')

const show = (data) => {
  message.value = data.message
  type.value = data.type || 'info'
  icon.value = icons[type.value] || icons.info
  visible.value = true
  
  // 自动关闭
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    close()
  }, 3000)
}

const close = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

// 监听显示 Toast 的事件
const handleShowToast = (event) => {
  show(event.detail)
}

onMounted(() => {
  window.addEventListener('showToast', handleShowToast)
})

onUnmounted(() => {
  window.removeEventListener('showToast', handleShowToast)
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
  cursor: pointer;
  font-size: 14px;
}

.toast.success {
  border-left: 4px solid #52c41a;
}

.toast.error {
  border-left: 4px solid #ff4d4f;
}

.toast.warning {
  border-left: 4px solid #faad14;
}

.toast.info {
  border-left: 4px solid #1890ff;
}

.toast-icon {
  font-size: 16px;
  font-weight: bold;
}

.toast.success .toast-icon {
  color: #52c41a;
}

.toast.error .toast-icon {
  color: #ff4d4f;
}

.toast.warning .toast-icon {
  color: #faad14;
}

.toast.info .toast-icon {
  color: #1890ff;
}

.toast-message {
  flex: 1;
  color: #333;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
}

.toast-close:hover {
  color: #333;
}

/* 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>