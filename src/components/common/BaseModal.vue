<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-mask" @click="handleMaskClick">
        <div class="modal-container" :class="size" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button v-if="closable" class="modal-close" @click="handleClose">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 大小: small, medium, large
  size: {
    type: String,
    default: 'medium'
  },
  // 是否可关闭
  closable: {
    type: Boolean,
    default: true
  },
  // 点击遮罩是否关闭
  maskClosable: {
    type: Boolean,
    default: true
  },
  // 按 ESC 是否关闭
  escClosable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'close'])

// 关闭模态框
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 点击遮罩关闭
const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

// ESC 键关闭
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.escClosable && props.visible) {
    handleClose()
  }
}

// 禁止背景滚动
const lockScroll = (lock) => {
  if (lock) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

watch(() => props.visible, (val) => {
  lockScroll(val)
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  lockScroll(false)
})
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-container.small {
  width: 400px;
}

.modal-container.medium {
  width: 560px;
}

.modal-container.large {
  width: 720px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>