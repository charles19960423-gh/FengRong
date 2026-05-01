<template>
  <div class="page-title" :class="align">
    <h1 v-if="title">{{ title }}</h1>
    <h2 v-if="subtitle">{{ subtitle }}</h2>
    <div v-if="$slots.default" class="page-title-extra">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 主标题
  title: {
    type: String,
    default: ''
  },
  // 副标题
  subtitle: {
    type: String,
    default: ''
  },
  // 对齐方式: left, center, right
  align: {
    type: String,
    default: 'left'
  }
})
</script>

<style scoped>
.page-title {
  margin-bottom: 24px;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-title h2 {
  font-size: 16px;
  font-weight: 400;
  color: #666;
  margin: 0;
}

.page-title.center {
  text-align: center;
}

.page-title.right {
  text-align: right;
}

.page-title-extra {
  margin-top: 12px;
}
</style>