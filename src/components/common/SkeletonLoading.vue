<template>
  <div class="skeleton-container" :class="variant">
    <!-- 卡片骨架 -->
    <template v-if="type === 'card'">
      <div class="skeleton-card">
        <div class="skeleton-header">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-title-group">
            <div class="skeleton-title"></div>
            <div class="skeleton-subtitle"></div>
          </div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-line" style="width: 100%"></div>
          <div class="skeleton-line" style="width: 85%"></div>
          <div class="skeleton-line" style="width: 70%"></div>
        </div>
        <div class="skeleton-footer">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
      </div>
    </template>

    <!-- 列表骨架 -->
    <template v-else-if="type === 'list'">
      <div class="skeleton-list-item" v-for="i in count" :key="i">
        <div class="skeleton-list-icon"></div>
        <div class="skeleton-list-content">
          <div class="skeleton-line" style="width: 60%"></div>
          <div class="skeleton-line" style="width: 40%"></div>
        </div>
        <div class="skeleton-list-arrow"></div>
      </div>
    </template>

    <!-- 表格骨架 -->
    <template v-else-if="type === 'table'">
      <div class="skeleton-table">
        <div class="skeleton-table-header">
          <div class="skeleton-th" v-for="i in columns" :key="i"></div>
        </div>
        <div class="skeleton-table-row" v-for="row in count" :key="row">
          <div class="skeleton-td" v-for="col in columns" :key="col"></div>
        </div>
      </div>
    </template>

    <!-- 详情骨架 -->
    <template v-else-if="type === 'detail'">
      <div class="skeleton-detail">
        <div class="skeleton-detail-header">
          <div class="skeleton-cover"></div>
          <div class="skeleton-info">
            <div class="skeleton-line" style="width: 80%"></div>
            <div class="skeleton-line" style="width: 60%"></div>
            <div class="skeleton-line" style="width: 70%"></div>
          </div>
        </div>
        <div class="skeleton-detail-body">
          <div class="skeleton-paragraph" v-for="i in 4" :key="i">
            <div class="skeleton-line" style="width: 100%"></div>
            <div class="skeleton-line" style="width: 90%"></div>
            <div class="skeleton-line" style="width: 95%"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 简单文本骨架 -->
    <template v-else>
      <div class="skeleton-text">
        <div class="skeleton-line" v-for="i in count" :key="i" :style="{ width: getRandomWidth() }"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  // 骨架屏类型: card, list, table, detail, text
  type: {
    type: String,
    default: 'text'
  },
  // 数量（列表项/行数）
  count: {
    type: Number,
    default: 3
  },
  // 表格列数
  columns: {
    type: Number,
    default: 4
  },
  // 变体: small, medium, large
  variant: {
    type: String,
    default: 'medium'
  }
})

const getRandomWidth = () => {
  const widths = ['100%', '90%', '85%', '80%', '75%', '70%', '60%']
  return widths[Math.floor(Math.random() * widths.length)]
}
</script>

<style scoped>
.skeleton-container {
  width: 100%;
}

/* 动画 */
@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-avatar,
.skeleton-title,
.skeleton-subtitle,
.skeleton-line,
.skeleton-tag,
.skeleton-list-icon,
.skeleton-list-arrow,
.skeleton-th,
.skeleton-td,
.skeleton-cover {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e8e8e8 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: 4px;
}

/* 卡片骨架 */
.skeleton-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-title-group {
  flex: 1;
}

.skeleton-title {
  height: 16px;
  width: 60%;
  margin-bottom: 8px;
}

.skeleton-subtitle {
  height: 12px;
  width: 40%;
}

.skeleton-content {
  margin-bottom: 12px;
}

.skeleton-line {
  height: 12px;
  margin-bottom: 8px;
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

.skeleton-footer {
  display: flex;
  gap: 8px;
}

.skeleton-tag {
  height: 20px;
  width: 60px;
  border-radius: 10px;
}

/* 列表骨架 */
.skeleton-list-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-list-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 12px;
}

.skeleton-list-content {
  flex: 1;
}

.skeleton-list-arrow {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

/* 表格骨架 */
.skeleton-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-table-header {
  display: flex;
  background: #fafafa;
  padding: 12px 16px;
}

.skeleton-th {
  flex: 1;
  height: 16px;
  margin-right: 16px;
}

.skeleton-th:last-child {
  margin-right: 0;
}

.skeleton-table-row {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.skeleton-td {
  flex: 1;
  height: 14px;
  margin-right: 16px;
}

.skeleton-td:last-child {
  margin-right: 0;
}

/* 详情骨架 */
.skeleton-detail {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.skeleton-detail-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.skeleton-cover {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  flex-shrink: 0;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-detail-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-paragraph {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 文本骨架 */
.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 变体 */
.skeleton-container.small .skeleton-line {
  height: 10px;
}

.skeleton-container.large .skeleton-line {
  height: 16px;
}
</style>