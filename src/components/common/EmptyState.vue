<template>
  <div class="empty-state" :class="size">
    <div class="empty-icon">{{ icon }}</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action"></slot>
    </div>
    <button v-else-if="buttonText" class="empty-button" @click="$emit('click')">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  // 图标
  icon: {
    type: String,
    default: '📭'
  },
  // 标题
  title: {
    type: String,
    default: '暂无数据'
  },
  // 描述
  description: {
    type: String,
    default: ''
  },
  // 按钮文字
  buttonText: {
    type: String,
    default: ''
  },
  // 大小: small, medium, large
  size: {
    type: String,
    default: 'medium'
  }
})

defineEmits(['click'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #999;
  margin: 0 0 20px 0;
  max-width: 300px;
}

.empty-button {
  padding: 10px 24px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.empty-button:hover {
  background: #40a9ff;
}

/* 大小变体 */
.empty-state.small .empty-icon {
  font-size: 32px;
}

.empty-state.small .empty-title {
  font-size: 14px;
}

.empty-state.large .empty-icon {
  font-size: 64px;
}

.empty-state.large .empty-title {
  font-size: 20px;
}
</style>