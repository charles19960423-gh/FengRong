<template>
  <div class="pagination" v-if="total > 0">
    <!-- 上一页 -->
    <button 
      class="pagination-btn" 
      :disabled="current <= 1"
      @click="handlePageChange(current - 1)"
    >
      ‹
    </button>
    
    <!-- 页码 -->
    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="pagination-ellipsis">...</span>
      <button 
        v-else
        class="pagination-btn"
        :class="{ active: page === current }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
    </template>
    
    <!-- 下一页 -->
    <button 
      class="pagination-btn" 
      :disabled="current >= total"
      @click="handlePageChange(current + 1)"
    >
      ›
    </button>
    
    <!-- 跳转 -->
    <div v-if="showQuickJumper" class="pagination-jumper">
      <span>到</span>
      <input 
        type="number" 
        v-model="jumpPage" 
        :min="1"
        :max="total"
        @keyup.enter="handleJump"
      />
      <span>页</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // 当前页码
  current: {
    type: Number,
    default: 1
  },
  // 总页数
  total: {
    type: Number,
    default: 1
  },
  // 每页显示的页码数
  pageSize: {
    type: Number,
    default: 7
  },
  // 是否显示快速跳转
  showQuickJumper: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change', 'update:current'])

const jumpPage = ref(props.current)

// 计算可见页码
const visiblePages = computed(() => {
  const pages = []
  const { current, total, pageSize } = props
  
  if (total <= pageSize) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 始终显示第一页
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    // 中间页码
    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    // 始终显示最后一页
    if (!pages.includes(total)) {
      pages.push(total)
    }
  }
  
  return pages
})

// 处理页码变化
const handlePageChange = (page) => {
  if (page < 1 || page > props.total || page === props.current) {
    return
  }
  emit('update:current', page)
  emit('change', page)
}

// 处理跳转
const handleJump = () => {
  let page = parseInt(jumpPage.value)
  if (isNaN(page)) {
    page = 1
  }
  page = Math.max(1, Math.min(page, props.total))
  jumpPage.value = page
  handlePageChange(page)
}

// 监听 props 变化
watch(() => props.current, (val) => {
  jumpPage.value = val
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.pagination-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.pagination-btn.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 0 8px;
  color: #999;
}

.pagination-jumper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
  font-size: 14px;
  color: #666;
}

.pagination-jumper input {
  width: 48px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
}

.pagination-jumper input:focus {
  outline: none;
  border-color: #1890ff;
}
</style>