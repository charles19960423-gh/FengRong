<template>
  <div class="client-console">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1>🏢 {{ authStore.currentUser?.companyName || '客户控制台' }}</h1>
          <p>欢迎回来，{{ authStore.currentUser?.contactPerson || '联系人' }}</p>
        </div>
        <button class="publish-btn" @click="showPublishModal = true">+ 发布新任务</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <span class="stat-value">{{ clientStore.clientStats.total }}</span>
          <span class="stat-label">总任务数</span>
        </div>
      </div>
      <div class="stat-card pending">
        <div class="stat-icon">⏳</div>
        <div class="stat-info">
          <span class="stat-value">{{ clientStore.clientStats.pending }}</span>
          <span class="stat-label">待接单</span>
        </div>
      </div>
      <div class="stat-card progress">
        <div class="stat-icon">🔄</div>
        <div class="stat-info">
          <span class="stat-value">{{ clientStore.clientStats.inProgress }}</span>
          <span class="stat-label">进行中</span>
        </div>
      </div>
      <div class="stat-card completed">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <span class="stat-value">{{ clientStore.clientStats.completed }}</span>
          <span class="stat-label">已完成</span>
        </div>
      </div>
      <div class="stat-card budget">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <span class="stat-value">¥{{ formatNumber(clientStore.clientStats.totalBudget) }}</span>
          <span class="stat-label">总预算</span>
        </div>
      </div>
      <div class="stat-card spent">
        <div class="stat-icon">📤</div>
        <div class="stat-info">
          <span class="stat-value">¥{{ formatNumber(clientStore.clientStats.spentBudget) }}</span>
          <span class="stat-label">已支出</span>
        </div>
      </div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="{ active: currentTab === tab.value }"
        @click="currentTab = tab.value"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <div v-if="currentTab === 'tasks'" class="tasks-section">
      <div class="filter-bar">
        <select v-model="statusFilter" class="filter-select">
          <option value="all">全部状态</option>
          <option value="pending">待接单</option>
          <option value="in-progress">进行中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      <div class="tasks-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card"
          :class="task.status"
        >
          <div class="task-header">
            <span class="category-badge">
              {{ clientStore.getCategoryIcon(task.category) }} {{ clientStore.getCategoryLabel(task.category) }}
            </span>
            <span class="status-badge" :class="task.status">{{ task.statusText }}</span>
          </div>
          <h3>{{ task.title }}</h3>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-meta">
            <span class="meta-item">💰 预算: ¥{{ formatNumber(task.budget) }}</span>
            <span class="meta-item">📅 截止: {{ task.deadline }}</span>
          </div>
          <div v-if="task.progress > 0 && task.status === 'in-progress'" class="task-progress">
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: task.progress + '%' }"></div>
            </div>
            <span>{{ task.progress }}%</span>
          </div>
          <div v-if="task.assignedName" class="task-executor">
            <span>👤 执行方: {{ task.assignedName }}</span>
          </div>
          <div class="task-actions">
            <button class="action-btn" @click="viewTaskDetail(task)">查看详情</button>
            <button
              v-if="task.status === 'in-progress'"
              class="action-btn primary"
              @click="confirmComplete(task)"
            >
              确认完成
            </button>
            <button
              v-if="task.status === 'pending'"
              class="action-btn danger"
              @click="cancelTask(task)"
            >
              取消任务
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredTasks.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无任务</p>
        <button class="empty-action" @click="showPublishModal = true">发布第一个任务</button>
      </div>
    </div>

    <div v-if="currentTab === 'notifications'" class="notifications-section">
      <div class="notifications-header">
        <h3>消息通知</h3>
        <button class="clear-btn" @click="clientStore.clearNotifications()">清空</button>
      </div>
      <div class="notifications-list">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="notification-item"
          :class="notif.type"
        >
          <span class="notif-icon">{{ notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : 'ℹ️' }}</span>
          <div class="notif-content">
            <p>{{ notif.message }}</p>
            <span class="notif-time">{{ formatTime(notif.timestamp) }}</span>
          </div>
        </div>
        <div v-if="notifications.length === 0" class="empty-notifications">
          暂无消息通知
        </div>
      </div>
    </div>

    <div v-if="showPublishModal" class="modal-overlay" @click.self="showPublishModal = false">
      <div class="modal-content">
        <h2>发布新任务</h2>
        <form @submit.prevent="publishTask">
          <div class="form-group">
            <label>任务标题</label>
            <input v-model="newTask.title" type="text" placeholder="如：品牌形象宣传片制作" required />
          </div>
          <div class="form-group">
            <label>任务分类</label>
            <select v-model="newTask.category" required>
              <option v-for="(cat, key) in clientStore.taskCategories" :key="key" :value="key">
                {{ cat.icon }} {{ cat.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>详细描述</label>
            <textarea v-model="newTask.description" placeholder="请详细描述任务需求..." rows="4" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>预算金额 (元)</label>
              <input v-model.number="newTask.budget" type="number" placeholder="如：30000" min="100" required />
            </div>
            <div class="form-group">
              <label>截止日期</label>
              <input v-model="newTask.deadline" type="date" required />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showPublishModal = false">取消</button>
            <button type="submit" class="btn-submit">发布任务</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content detail-modal">
        <h2>任务详情</h2>
        <div v-if="selectedTask" class="task-detail">
          <div class="detail-header">
            <span class="category-badge">
              {{ clientStore.getCategoryIcon(selectedTask.category) }} {{ clientStore.getCategoryLabel(selectedTask.category) }}
            </span>
            <span class="status-badge" :class="selectedTask.status">{{ selectedTask.statusText }}</span>
          </div>
          <h3>{{ selectedTask.title }}</h3>
          <div class="detail-meta">
            <div class="meta-row">
              <span class="meta-label">预算:</span>
              <span class="meta-value">¥{{ formatNumber(selectedTask.budget) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">截止日期:</span>
              <span class="meta-value">{{ selectedTask.deadline }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">发布时间:</span>
              <span class="meta-value">{{ selectedTask.createdAt }}</span>
            </div>
            <div class="meta-row" v-if="selectedTask.assignedName">
              <span class="meta-label">执行方:</span>
              <span class="meta-value">{{ selectedTask.assignedName }}</span>
            </div>
          </div>
          <div class="detail-description">
            <h4>任务描述</h4>
            <p>{{ selectedTask.description }}</p>
          </div>
          <div v-if="selectedTask.progress > 0" class="detail-progress">
            <h4>进度</h4>
            <div class="progress-bar-container large">
              <div class="progress-bar" :style="{ width: selectedTask.progress + '%' }"></div>
            </div>
            <span>{{ selectedTask.progress }}%</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDetailModal = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useClientStore } from '../stores/client'

const authStore = useAuthStore()
const clientStore = useClientStore()

const currentTab = ref('tasks')
const statusFilter = ref('all')
const showPublishModal = ref(false)
const showDetailModal = ref(false)
const selectedTask = ref(null)

const tabs = [
  { value: 'tasks', label: '我的任务', icon: '📋' },
  { value: 'notifications', label: '消息通知', icon: '🔔' }
]

const newTask = ref({
  title: '',
  category: 'video',
  description: '',
  budget: 0,
  deadline: ''
})

const notifications = computed(() => clientStore.getNotifications())

const myTasks = computed(() => {
  if (!authStore.currentUser?.phone) return []
  return clientStore.getClientTasksByPhone(authStore.currentUser.phone)
})

const filteredTasks = computed(() => {
  if (statusFilter.value === 'all') return myTasks.value
  return myTasks.value.filter(t => t.status === statusFilter.value)
})

function formatNumber(num) {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return date.toLocaleDateString()
}

function publishTask() {
  const task = clientStore.publishClientTask({
    clientPhone: authStore.currentUser.phone,
    clientName: authStore.currentUser.companyName,
    ...newTask.value
  })
  showPublishModal.value = false
  newTask.value = {
    title: '',
    category: 'video',
    description: '',
    budget: 0,
    deadline: ''
  }
}

function viewTaskDetail(task) {
  selectedTask.value = task
  showDetailModal.value = true
}

function confirmComplete(task) {
  if (confirm('确认任务已完成？')) {
    clientStore.completeClientTask(task.id)
    clientStore.addNotification({
      type: 'success',
      message: `任务「${task.title}」已标记完成`
    })
  }
}

function cancelTask(task) {
  if (confirm('确认取消该任务？')) {
    clientStore.cancelClientTask(task.id)
    clientStore.addNotification({
      type: 'warning',
      message: `任务「${task.title}」已取消`
    })
  }
}

onMounted(() => {
  clientStore.loadClientTasks()
})
</script>

<style scoped>
.client-console {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-header p {
  color: #6b7280;
}

.publish-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
}

.tabs {
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.tabs button.active {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-bar {
  margin-bottom: 20px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.category-badge {
  padding: 4px 12px;
  background: #f3f4f6;
  border-radius: 16px;
  font-size: 0.875rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  color: white;
}

.status-badge.pending { background: #f59e0b; }
.status-badge.in-progress { background: #3b82f6; }
.status-badge.completed { background: #10b981; }
.status-badge.cancelled { background: #6b7280; }

.task-card h3 {
  font-size: 1.125rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.task-description {
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.meta-item {
  color: #374151;
  font-size: 0.875rem;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-container.large {
  height: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.task-executor {
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #374151;
}

.task-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.action-btn.primary {
  background: #10b981;
  color: white;
  border: none;
}

.action-btn.danger {
  color: #ef4444;
  border-color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-action {
  margin-top: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.notifications-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.clear-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.notif-icon {
  font-size: 1.25rem;
}

.notif-content p {
  color: #374151;
  margin-bottom: 4px;
}

.notif-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.empty-notifications {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.detail-modal {
  max-width: 600px;
}

.detail-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-meta {
  margin-bottom: 20px;
}

.meta-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.meta-label {
  width: 100px;
  color: #6b7280;
}

.meta-value {
  color: #1f2937;
  font-weight: 500;
}

.detail-description {
  margin-bottom: 20px;
}

.detail-description h4 {
  margin-bottom: 8px;
  color: #374151;
}

.detail-description p {
  color: #6b7280;
  line-height: 1.6;
}

.detail-progress {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-progress h4 {
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel, .btn-submit {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel {
  background: white;
  border: 1px solid #d1d5db;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
