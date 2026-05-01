<template>
  <div class="favorite-page">
    <div class="page-header">
      <h1>我的收藏</h1>
      <p>管理您收藏的内容</p>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
        全部 ({{ stats.total }})
      </button>
      <button :class="{ active: activeTab === 'resource' }" @click="activeTab = 'resource'">
         江湖秘典 ({{ stats.resource }})
      </button>
      <button :class="{ active: activeTab === 'project' }" @click="activeTab = 'project'">
         组队项目 ({{ stats.project }})
      </button>
      <button :class="{ active: activeTab === 'event' }" @click="activeTab = 'event'">
         活动 ({{ stats.event }})
      </button>
      <button :class="{ active: activeTab === 'task' }" @click="activeTab = 'task'">
         任务 ({{ stats.task }})
      </button>
    </div>

    <div class="favorite-list">
      <div v-if="filteredFavorites.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无收藏内容</p>
        <p class="empty-hint">去浏览感兴趣的内容并添加收藏吧</p>
      </div>

      <div
        v-for="favorite in filteredFavorites"
        :key="favorite.id"
        class="favorite-card"
      >
        <div class="favorite-icon">{{ getTypeIcon(favorite.type) }}</div>
        <div class="favorite-content">
          <div class="favorite-title">{{ favorite.targetData.title || '未命名' }}</div>
          <div class="favorite-desc">{{ favorite.targetData.description || favorite.targetData.content || '暂无描述' }}</div>
          <div class="favorite-meta">
            <span class="type-badge">{{ getTypeLabel(favorite.type) }}</span>
            <span class="add-time">收藏于{{ favorite.createdAt }}</span>
          </div>
        </div>
        <button class="remove-btn" @click="removeFavorite(favorite)">
          <span class="remove-icon"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFavoriteStore } from '@/stores'
import { useAuthStore } from '@/stores'

const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()

const activeTab = ref('all')

onMounted(() => {
  favoriteStore.loadFavorites()
})

const stats = computed(() => {
  if (!authStore.currentUser) return { total: 0, resource: 0, project: 0, event: 0, task: 0 }
  return favoriteStore.getFavoriteStats(authStore.currentUser.phone)
})

const userFavorites = computed(() => {
  if (!authStore.currentUser) return []
  return favoriteStore.getFavoritesByUser(authStore.currentUser.phone)
})

const filteredFavorites = computed(() => {
  if (activeTab.value === 'all') return userFavorites.value
  return favoriteStore.getFavoritesByType(authStore.currentUser?.phone || '', activeTab.value)
})

function getTypeIcon(type) {
  return favoriteStore.favoriteTypes[type]?.icon || ''
}

function getTypeLabel(type) {
  return favoriteStore.favoriteTypes[type]?.label || type
}

function removeFavorite(favorite) {
  if (!authStore.currentUser) return

  const result = favoriteStore.removeFavorite(
    authStore.currentUser.phone,
    favorite.type,
    favorite.targetId
  )
  alert(result.message)
}
</script>

<style scoped>
.favorite-page {
  max-width: 800px;
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
  flex-wrap: wrap;
}

.tabs button {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.tabs button.active {
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.favorite-icon {
  font-size: 2rem;
  width: 50px;
  text-align: center;
}

.favorite-content {
  flex: 1;
}

.favorite-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.favorite-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
}

.type-badge {
  padding: 2px 8px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 12px;
}

.add-time {
  color: #9ca3af;
}

.remove-btn {
  padding: 8px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.remove-icon {
  font-size: 1.25rem;
  color: #6b7280;
}

.remove-btn:hover {
  background: #fee2e2;
}

.remove-btn:hover .remove-icon {
  color: #ef4444;
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

.empty-hint {
  font-size: 0.875rem;
  margin-top: 4px;
}

@media (max-width: 640px) {
  .favorite-card {
    flex-direction: column;
  }
  
  .favorite-icon {
    text-align: left;
  }
  
  .remove-btn {
    align-self: flex-end;
  }
}
</style>

