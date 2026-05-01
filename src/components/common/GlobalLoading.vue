<template>
  <Teleport to="body">
    <Transition name="loading-fade">
      <div v-if="visible" class="global-loading">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p v-if="text" class="loading-text">{{ text }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const text = ref('')

const show = (options = {}) => {
  if (options === true) {
    visible.value = true
    text.value = ''
  } else if (typeof options === 'string') {
    visible.value = true
    text.value = options
  } else {
    visible.value = options.visible !== false
    text.value = options.text || ''
  }
}

const hide = () => {
  visible.value = false
  text.value = ''
}

// 监听显示 Loading 的事件
const handleShowLoading = (event) => {
  show(event.detail)
}

const handleHideLoading = () => {
  hide()
}

onMounted(() => {
  window.addEventListener('showGlobalLoading', handleShowLoading)
  window.addEventListener('hideGlobalLoading', handleHideLoading)
})

onUnmounted(() => {
  window.removeEventListener('showGlobalLoading', handleShowLoading)
  window.removeEventListener('hideGlobalLoading', handleHideLoading)
})

// 导出方法供外部调用
defineExpose({ show, hide })
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  position: relative;
  width: 50px;
  height: 50px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #1890ff;
  animation: spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  opacity: 0.8;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
  opacity: 0.6;
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

/* 动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>