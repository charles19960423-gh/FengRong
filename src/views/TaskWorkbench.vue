<template>
  <div class="workbench-page">
    <div class="workbench-header">
      <h1>任务工作台</h1>
      <p>管理你的任务、草稿和统计数据</p>
    </div>

    <div class="workbench-layout">
      <aside class="workbench-sidebar">
        <nav class="sidebar-nav">
          <button 
            v-for="tab in sidebarTabs" 
            :key="tab.value"
            :class="{ active: currentTab === tab.value }"
            @click="currentTab = tab.value"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
          </button>
        </nav>
      </aside>

      <main class="workbench-content">
        <!-- 任务市场 -->
        <div v-if="currentTab === 'market'" class="panel">
          <div class="panel-header">
            <h2>📋 任务市场</h2>
            <div class="search-bar">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索任务..."
                class="search-input"
              />
              <button class="search-btn">🔍</button>
            </div>
          </div>
          <div class="filter-row">
            <select v-model="filterIdentity" class="filter-select">
              <option value="">全部身份</option>
              <option v-for="(identity, id) in authStore.identityConfigs" :key="id" :value="id">
                {{ identity.icon }} {{ identity.name }}
              </option>
            </select>
            <select v-model="filterDifficulty" class="filter-select">
              <option value="">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
              <option value="epic">史诗</option>
            </select>
            <select v-model="filterReward" class="filter-select">
              <option value="">全部奖励</option>
              <option value="gold">金币</option>
              <option value="pearl">珍珠</option>
              <option value="prestige">声望</option>
            </select>
            <label class="toggle-switch">
              <input type="checkbox" v-model="showMyTasks" />
              <span class="toggle-track"></span>
              <span class="toggle-label">显示我的任务</span>
            </label>
          </div>
          <div class="task-grid">
            <div 
              v-for="task in filteredMarketTasks" 
              :key="task.id" 
              class="market-task-card"
              @click="showTaskDetail(task)"
            >
              <div class="task-header">
                <span class="status-badge" :class="task.status">{{ task.statusText }}</span>
                <span class="difficulty-tag">{{ getDifficultyText(task.difficulty) }}</span>
              </div>
              <h3>{{ task.title }}</h3>
              <p class="task-desc">{{ task.description }}</p>
              <div class="task-info">
                <span>📍 {{ task.location }}</span>
                <span>⏰ {{ task.deadline }}</span>
              </div>
              <div class="task-footer">
                <span class="reward">{{ task.reward }}</span>
                <span v-if="task.requiredIdentity" class="identity">
                  {{ getIdentityName(task.requiredIdentity) }}
                </span>
              </div>
              <button 
                v-if="task.status === 'pending' && !isOwnTask(task)" 
                class="accept-btn"
                @click.stop="acceptMarketTask(task.id)"
              >
                🤝 接取任务
              </button>
              <div 
                v-if="task.status === 'pending' && isOwnTask(task)" 
                class="own-task-badge"
              >
                ⚠️ 自己发布的任务
              </div>
            </div>
          </div>
        </div>

        <!-- 我领取的 -->
        <div v-if="currentTab === 'accepted'" class="panel">
          <div class="panel-header">
            <h2>👤 我领取的任务</h2>
            <span class="count-badge">{{ acceptedTasks.length }} 个任务</span>
          </div>
          <div class="task-list">
            <div 
              v-for="task in acceptedTasks" 
              :key="task.id" 
              class="task-item"
            >
              <div class="task-status" :class="task.status">
                {{ getStatusIcon(task.status) }}
              </div>
              <div class="task-content">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
                <div class="task-meta">
                  <span>⏰ {{ task.deadline }}</span>
                  <span>🎯 {{ task.reward }}</span>
                </div>
              </div>
              <div class="task-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
                <span>{{ task.progress }}%</span>
              </div>
              <div class="task-actions">
                <button 
                  v-if="task.status === 'in-progress'" 
                  class="action-btn primary"
                  @click="completeTask(task.id)"
                >
                  ✅ 完成
                </button>
                <button 
                  v-if="task.status === 'in-progress'" 
                  class="action-btn secondary"
                  @click="cancelAcceptTask(task.id)"
                >
                  🚫 取消
                </button>
              </div>
            </div>
          </div>
          <div v-if="acceptedTasks.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>暂无领取的任务</p>
            <button class="empty-action" @click="currentTab = 'market'">去任务市场</button>
          </div>
        </div>

        <!-- 我发布的 -->
        <div v-if="currentTab === 'published'" class="panel">
          <div class="panel-header">
            <h2>📝 我发布的任务</h2>
            <span class="count-badge">{{ publishedTasks.length }} 个任务</span>
          </div>
          <div class="filter-tabs">
            <button 
              v-for="f in publishFilters" 
              :key="f.value"
              :class="{ active: publishFilter === f.value }"
              @click="publishFilter = f.value"
            >
              {{ f.label }}
            </button>
          </div>
          <div class="task-list">
            <div 
              v-for="task in filteredPublishedTasks" 
              :key="task.id" 
              class="task-item"
            >
              <div class="task-status" :class="task.status">
                {{ getStatusIcon(task.status) }}
              </div>
              <div class="task-content">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
                <div class="task-meta">
                  <span>⏰ {{ task.deadline }}</span>
                  <span>🎯 {{ task.reward }}</span>
                  <span v-if="task.assignee">👤 {{ getAssigneeName(task.assignee) }}</span>
                </div>
              </div>
              <div class="task-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
                <span>{{ task.progress }}%</span>
              </div>
              <div class="task-actions">
                <template v-if="showEditButton(task)">
                  <button 
                    class="action-btn primary"
                    @click="handleEdit(task)"
                  >
                    ✏️ 编辑
                  </button>
                </template>
                <button 
                  v-if="task.status === 'pending'" 
                  class="action-btn secondary"
                  @click="cancelTask(task.id)"
                >
                  ❌ 取消
                </button>
                <button 
                  v-if="task.status === 'in-progress' && task.applicants.length > 0" 
                  class="action-btn secondary"
                  @click="showApplicants(task)"
                >
                  👥 申请人 ({{ task.applicants.length }})
                </button>
              </div>
            </div>
          </div>
          <div v-if="filteredPublishedTasks.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>暂无发布的任务</p>
            <router-link to="/publish" class="empty-action">去发布任务</router-link>
          </div>
        </div>

        <!-- 草稿箱 -->
        <div v-if="currentTab === 'drafts'" class="panel">
          <div class="panel-header">
            <h2>📋 草稿箱</h2>
            <span class="count-badge">{{ myDrafts.length }} 个草稿</span>
          </div>
          <div class="draft-list">
            <div 
              v-for="draft in myDrafts" 
              :key="draft.id" 
              class="draft-item"
            >
              <div class="draft-content">
                <h4>{{ draft.title || '未命名任务' }}</h4>
                <p class="draft-meta">
                  <span>📅 {{ formatDate(draft.updatedAt) }}</span>
                  <span v-if="draft.reward">🎯 {{ draft.reward }}</span>
                </p>
              </div>
              <div class="draft-actions">
                <button class="action-btn primary" @click="editDraft(draft.id)">
                  ✏️ 编辑
                </button>
                <button class="action-btn success" @click="publishDraft(draft.id)">
                  🚀 发布
                </button>
                <button class="action-btn danger" @click="deleteDraft(draft.id)">
                  🗑️ 删除
                </button>
              </div>
            </div>
          </div>
          <div v-if="myDrafts.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <p>暂无任务草稿</p>
            <router-link to="/publish" class="empty-action">去发布任务</router-link>
          </div>
        </div>

        <!-- 统计分析 -->
        <div v-if="currentTab === 'analytics'" class="panel">
          <div class="panel-header">
            <h2>📈 统计分析</h2>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <span class="stat-value">{{ myStats.totalPublished }}</span>
                <span class="stat-label">发布任务</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <span class="stat-value">{{ myStats.totalCompleted }}</span>
                <span class="stat-label">完成任务</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <span class="stat-value">{{ myStats.totalEarned }}</span>
                <span class="stat-label">累计收入</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📉</div>
              <div class="stat-info">
                <span class="stat-value">{{ myStats.completionRate }}%</span>
                <span class="stat-label">完成率</span>
              </div>
            </div>
          </div>
          <div class="chart-section">
            <h3>任务状态分布</h3>
            <div class="pie-chart">
              <div 
                v-for="(value, key) in statusDistribution" 
                :key="key"
                class="pie-slice"
                :style="{ '--percentage': value + '%', '--color': getStatusColor(key) }"
              ></div>
              <div class="pie-center">
                <span>{{ myStats.totalTasks }}</span>
                <span>总任务</span>
              </div>
            </div>
            <div class="legend">
              <div v-for="(value, key) in statusDistribution" :key="key" class="legend-item">
                <span class="legend-color" :style="{ background: getStatusColor(key) }"></span>
                <span>{{ getStatusText(key) }}: {{ value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 任务详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="showDetailModal = false">✕</button>
        <h3>{{ selectedTask?.title }}</h3>
        <div class="modal-body">
          <p>{{ selectedTask?.description }}</p>
          <div class="detail-info">
            <span>📍 {{ selectedTask?.location }}</span>
            <span>⏰ {{ selectedTask?.deadline }}</span>
            <span>🎯 {{ selectedTask?.reward }}</span>
            <span v-if="selectedTask?.requiredIdentity">
              🏷️ {{ getIdentityName(selectedTask.requiredIdentity) }}
            </span>
          </div>
        </div>
        <button 
          v-if="selectedTask?.status === 'pending'" 
          class="modal-action"
          @click="acceptMarketTask(selectedTask.id); showDetailModal = false"
        >
          🤝 接取任务
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/task'

const authStore = useAuthStore()
const taskStore = useTaskStore()

const currentTab = ref('market')
const searchKeyword = ref('')
const filterIdentity = ref('')
const filterDifficulty = ref('')
const filterReward = ref('')
const publishFilter = ref('all')
const showDetailModal = ref(false)
const selectedTask = ref(null)
const showMyTasks = ref(false)

const publishFilters = [
  { label: '全部', value: 'all' },
  { label: '待接取', value: 'pending' },
  { label: '进行中', value: 'in-progress' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

const sidebarTabs = computed(() => [
  { icon: '📋', label: '任务市场', value: 'market' },
  { icon: '👤', label: '我领取的', value: 'accepted', badge: authStore.isLoggedIn ? taskStore.getAcceptedTasks(authStore.currentUser?.phone).length : 0 },
  { icon: '📝', label: '我发布的', value: 'published', badge: authStore.isLoggedIn ? taskStore.getMyPublishedTasks(authStore.currentUser?.phone).length : 0 },
  { icon: '📋', label: '草稿箱', value: 'drafts', badge: authStore.isLoggedIn ? taskStore.getDraftsByPublisher(authStore.currentUser?.phone).length : 0 },
  { icon: '📈', label: '统计分析', value: 'analytics' }
])

const acceptedTasks = computed(() => {
  if (!authStore.isLoggedIn) return []
  return taskStore.getAcceptedTasks(authStore.currentUser.phone)
})

const publishedTasks = computed(() => {
  if (!authStore.isLoggedIn) return []
  return taskStore.getMyPublishedTasks(authStore.currentUser.phone)
})

const filteredPublishedTasks = computed(() => {
  if (publishFilter.value === 'all') return publishedTasks.value
  return publishedTasks.value.filter(t => t.status === publishFilter.value)
})

const myDrafts = computed(() => {
  if (!authStore.isLoggedIn) return []
  return taskStore.getDraftsByPublisher(authStore.currentUser.phone)
})

const filteredMarketTasks = computed(() => {
  let tasks = taskStore.getPendingTasks()
  
  if (!showMyTasks.value && authStore.isLoggedIn) {
    tasks = tasks.filter(t => t.publisherId !== authStore.currentUser.phone)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    tasks = tasks.filter(t => 
      t.title.toLowerCase().includes(keyword) || 
      t.description.toLowerCase().includes(keyword)
    )
  }
  
  if (filterIdentity.value) {
    tasks = tasks.filter(t => t.requiredIdentity === filterIdentity.value)
  }
  
  if (filterDifficulty.value) {
    tasks = tasks.filter(t => t.difficulty === filterDifficulty.value)
  }
  
  if (filterReward.value) {
    tasks = tasks.filter(t => t.rewardType === filterReward.value)
  }
  
  return tasks
})

const myStats = computed(() => {
  const published = publishedTasks.value
  const accepted = acceptedTasks.value
  const completed = accepted.filter(t => t.status === 'completed')
  
  const totalEarned = completed.reduce((sum, t) => {
    const match = t.reward?.match(/(\d+)/)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)
  
  const completionRate = accepted.length > 0 
    ? Math.round((completed.length / accepted.length) * 100) 
    : 0
  
  return {
    totalPublished: published.length,
    totalCompleted: completed.length,
    totalTasks: accepted.length + published.length,
    totalEarned,
    completionRate
  }
})

const statusDistribution = computed(() => {
  const allTasks = [...acceptedTasks.value, ...publishedTasks.value]
  if (allTasks.length === 0) return {}
  
  const counts = {
    pending: 0,
    'in-progress': 0,
    completed: 0,
    cancelled: 0
  }
  
  allTasks.forEach(t => {
    counts[t.status]++
  })
  
  const result = {}
  Object.keys(counts).forEach(key => {
    if (counts[key] > 0) {
      result[key] = Math.round((counts[key] / allTasks.length) * 100)
    }
  })
  
  return result
})

function getStatusIcon(status) {
  const icons = {
    'pending': '🔔',
    'in-progress': '📋',
    'completed': '✅',
    'cancelled': '❌'
  }
  return icons[status] || '📋'
}

function getStatusText(status) {
  const texts = {
    'pending': '待接取',
    'in-progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return texts[status] || status
}

function getStatusColor(status) {
  const colors = {
    'pending': '#f59e0b',
    'in-progress': '#3b82f6',
    'completed': '#10b981',
    'cancelled': '#ef4444'
  }
  return colors[status] || '#6b7280'
}

function getDifficultyText(difficulty) {
  const texts = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难',
    'epic': '史诗'
  }
  return texts[difficulty] || difficulty
}

function getIdentityName(identityId) {
  const identity = authStore.getIdentityInfo(identityId)
  return identity ? `${identity.icon} ${identity.name}` : identityId
}

function getAssigneeName(phone) {
  const user = authStore.getUserByPhone(phone)
  return user ? user.nickname : phone
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function isOwnTask(task) {
  if (!authStore.isLoggedIn) return false
  return task.publisherId === authStore.currentUser.phone
}

function showTaskDetail(task) {
  selectedTask.value = task
  showDetailModal.value = true
}

function acceptMarketTask(taskId) {
  if (!authStore.isLoggedIn) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请先登录再接取任务', type: 'warning' }
    }))
    return
  }

  const task = taskStore.getTaskById(taskId)
  if (!task) return

  const identityCheck = authStore.checkIdentityMatch(task.requiredIdentity)
  if (!identityCheck.valid) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: identityCheck.message, type: 'warning' }
    }))
    return
  }

  const successRate = task.successRate || 0.8
  const success = taskStore.rollDice(successRate)

  if (!success) {
    authStore.incrementFailCount()
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: `😔 接取失败！成功率 ${Math.round(successRate * 100)}%`, type: 'error' }
    }))
    return
  }

  const result = taskStore.acceptTask(taskId, authStore.currentUser.phone)
  if (result.success) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '🎉 任务接取成功！', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'error' }
    }))
  }
}

function completeTask(taskId) {
  const result = taskStore.completeTask(taskId, authStore.currentUser.phone)
  if (result.success) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '🎉 任务完成！奖励已发放', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'error' }
    }))
  }
}

function cancelAcceptTask(taskId) {
  const result = taskStore.cancelAccept(taskId, authStore.currentUser.phone)
  if (result.success) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '任务已取消接取', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'error' }
    }))
  }
}

function cancelTask(taskId) {
  const result = taskStore.cancelTask(taskId, authStore.currentUser.phone)
  if (result.success) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '任务已取消', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'error' }
    }))
  }
}

function editTask(taskId) {
  router.push({ path: '/publish', query: { edit: taskId } })
}

function showEditButton(task) {
  return ['pending', 'in-progress', 'cancelled'].includes(task.status)
}

function canEdit(task) {
  if (!authStore.isLoggedIn) return false
  if (task.publisherId !== authStore.currentUser.phone) return false
  
  if (task.status === 'in-progress' && task.applicants && task.applicants.length > 0) {
    return authStore.currentUser.vipLevel >= 3
  }
  return true
}

function getEditTip(task) {
  if (task.status === 'in-progress' && task.applicants && task.applicants.length > 0) {
    return '⚠️ 需要VIP3+'
  }
  return ''
}

function handleEdit(task) {
  if (!authStore.isLoggedIn) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请先登录', type: 'warning' }
    }))
    return
  }
  
  if (task.publisherId !== authStore.currentUser.phone) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '只能编辑自己发布的任务', type: 'warning' }
    }))
    return
  }
  
  if (task.status === 'in-progress' && task.applicants && task.applicants.length > 0 && authStore.currentUser.vipLevel < 3) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '任务已有申请人，需要VIP3+才能编辑', type: 'warning' }
    }))
    return
  }
  
  editTask(task.id)
}

function showApplicants(task) {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: `申请人：${task.applicants.length} 人`, type: 'info' }
  }))
}

function editDraft(draftId) {
  window.dispatchEvent(new CustomEvent('editDraft', { detail: { draftId } }))
  router.push('/publish')
}

function publishDraft(draftId) {
  const result = taskStore.publishDraft(draftId)
  if (result) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '🎉 任务发布成功！', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '发布失败', type: 'error' }
    }))
  }
}

function deleteDraft(draftId) {
  const success = taskStore.deleteDraft(draftId)
  if (success) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '草稿已删除', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '删除失败', type: 'error' }
    }))
  }
}
</script>

<style scoped>
.workbench-page {
  min-height: 100vh;
  padding: 20px;
}

.workbench-header {
  text-align: center;
  margin-bottom: 20px;
}

.workbench-header h1 {
  font-size: 28px;
  color: #f59e0b;
  margin-bottom: 5px;
}

.workbench-header p {
  color: #9ca3af;
}

.workbench-layout {
  display: flex;
  gap: 20px;
}

.workbench-sidebar {
  width: 200px;
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  background: rgba(30, 27, 27, 0.8);
  border-radius: 12px;
  padding: 10px;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  margin-bottom: 5px;
  border: none;
  background: transparent;
  color: #e5e7eb;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  text-align: left;
}

.sidebar-nav button:hover {
  background: rgba(245, 158, 11, 0.2);
}

.sidebar-nav button.active {
  background: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.tab-icon {
  font-size: 18px;
}

.tab-label {
  flex: 1;
}

.tab-badge {
  background: #ef4444;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.workbench-content {
  flex: 1;
}

.panel {
  background: rgba(30, 27, 27, 0.8);
  border-radius: 12px;
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  font-size: 20px;
  color: #f59e0b;
}

.count-badge {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.search-bar {
  display: flex;
  gap: 5px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #374151;
  border-radius: 8px;
  background: rgba(55, 65, 81, 0.5);
  color: #e5e7eb;
  width: 200px;
}

.search-btn {
  padding: 8px 15px;
  border: none;
  background: #f59e0b;
  color: #1f2937;
  border-radius: 8px;
  cursor: pointer;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #374151;
  border-radius: 8px;
  background: rgba(55, 65, 81, 0.5);
  color: #e5e7eb;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.market-task-card {
  background: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s;
}

.market-task-card:hover {
  transform: translateY(-3px);
}

.market-task-card .task-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  background: #f59e0b;
  color: #1f2937;
}

.status-badge.in-progress {
  background: #3b82f6;
}

.status-badge.completed {
  background: #10b981;
}

.status-badge.cancelled {
  background: #ef4444;
}

.difficulty-tag {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  background: rgba(156, 163, 175, 0.3);
  color: #9ca3af;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  background: rgba(55, 65, 81, 0.5);
  border-radius: 8px;
}

.toggle-switch input {
  display: none;
}

.toggle-track {
  width: 40px;
  height: 20px;
  background: #374151;
  border-radius: 10px;
  position: relative;
  transition: background 0.2s;
}

.toggle-switch input:checked + .toggle-track {
  background: #f59e0b;
}

.toggle-track::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.toggle-switch input:checked + .toggle-track::after {
  transform: translateX(20px);
}

.toggle-label {
  color: #e5e7eb;
  font-size: 14px;
}

.own-task-badge {
  width: 100%;
  padding: 10px;
  text-align: center;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 8px;
  font-size: 14px;
}

.market-task-card h3 {
  margin-bottom: 8px;
  color: #f59e0b;
}

.task-desc {
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-info {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reward {
  color: #10b981;
  font-weight: bold;
}

.identity {
  font-size: 13px;
  color: #f59e0b;
}

.accept-btn {
  width: 100%;
  padding: 10px;
  border: none;
  background: #f59e0b;
  color: #1f2937;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.accept-btn:hover {
  background: #d97706;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 15px;
}

.task-status {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.2);
  border-radius: 50%;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  color: #f59e0b;
  margin-bottom: 5px;
}

.task-content p {
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #6b7280;
}

.task-progress {
  width: 120px;
  text-align: center;
}

.progress-bar {
  height: 8px;
  background: rgba(55, 65, 81, 0.8);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #10b981);
  border-radius: 4px;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #f59e0b;
  color: #1f2937;
}

.action-btn.secondary {
  background: rgba(156, 163, 175, 0.3);
  color: #e5e7eb;
}

.action-btn.success {
  background: #10b981;
  color: white;
}

.action-btn.danger {
  background: #ef4444;
  color: white;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-tabs button {
  padding: 8px 15px;
  border: none;
  background: rgba(55, 65, 81, 0.5);
  color: #9ca3af;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tabs button.active {
  background: #f59e0b;
  color: #1f2937;
}

.draft-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.draft-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 15px;
}

.draft-content h4 {
  color: #f59e0b;
  margin-bottom: 5px;
}

.draft-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #6b7280;
}

.draft-actions {
  display: flex;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 20px;
}

.stat-icon {
  font-size: 32px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #f59e0b;
}

.stat-label {
  color: #9ca3af;
  font-size: 14px;
}

.chart-section {
  background: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 20px;
}

.chart-section h3 {
  color: #f59e0b;
  margin-bottom: 20px;
}

.pie-chart {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #f59e0b 0deg 72deg,
    #3b82f6 72deg 144deg,
    #10b981 144deg 216deg,
    #ef4444 216deg 360deg
  );
  margin: 0 auto 20px;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: #1f2937;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-center span:first-child {
  font-size: 24px;
  font-weight: bold;
  color: #f59e0b;
}

.pie-center span:last-child {
  font-size: 12px;
  color: #9ca3af;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.action-btn.disabled {
  background: #4b5563;
  cursor: not-allowed;
  opacity: 0.6;
}

.edit-tip {
  font-size: 12px;
  color: #f59e0b;
  margin-left: 8px;
  white-space: nowrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state p {
  color: #9ca3af;
  margin-bottom: 15px;
}

.empty-action {
  display: inline-block;
  padding: 10px 20px;
  background: #f59e0b;
  color: #1f2937;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1f2937;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 20px;
  cursor: pointer;
}

.modal-content h3 {
  color: #f59e0b;
  margin-bottom: 15px;
}

.modal-body p {
  color: #e5e7eb;
  margin-bottom: 15px;
}

.detail-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 20px;
}

.modal-action {
  width: 100%;
  padding: 12px;
  border: none;
  background: #f59e0b;
  color: #1f2937;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}
</style>