<template>
  <div class="milestone-page">
    <div class="page-header">
      <h1>📊 里程碑中心</h1>
      <p>追踪年度、季度、月度任务进度</p>
    </div>

    <div class="progress-overview">
      <div class="progress-card annual">
        <div class="progress-icon">📅</div>
        <div class="progress-info">
          <h3>年度目标</h3>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: taskStore.annualProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ taskStore.annualProgress }}%</span>
        </div>
      </div>
      <div class="progress-card quarterly">
        <div class="progress-icon">🗓️</div>
        <div class="progress-info">
          <h3>Q{{ currentQuarter }} 季度目标</h3>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: taskStore.quarterlyProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ taskStore.quarterlyProgress }}%</span>
        </div>
      </div>
      <div class="progress-card monthly">
        <div class="progress-icon">📆</div>
        <div class="progress-info">
          <h3>{{ currentMonth }} 月目标</h3>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: taskStore.monthlyProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ taskStore.monthlyProgress }}%</span>
        </div>
      </div>
    </div>

    <div class="cycle-tabs">
      <button
        v-for="tab in cycleTabs"
        :key="tab.value"
        :class="{ active: currentCycle === tab.value }"
        @click="currentCycle = tab.value"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <div class="milestone-controls">
      <select v-model="selectedYear" class="year-select">
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}年</option>
      </select>
      <button v-if="currentCycle === 'quarterly'" class="quarter-select" @click="showQuarterPicker = !showQuarterPicker">
        Q{{ selectedQuarter }} ▼
      </button>
      <button v-if="currentCycle === 'monthly'" class="month-select" @click="showMonthPicker = !showMonthPicker">
        {{ selectedMonth }}月 ▼
      </button>
      <button class="create-btn" @click="showCreateModal = true">+ 创建里程碑</button>
    </div>

    <div v-if="showQuarterPicker" class="picker-dropdown">
      <button v-for="q in 4" :key="q" @click="selectedQuarter = q; showQuarterPicker = false">Q{{ q }}</button>
    </div>

    <div v-if="showMonthPicker" class="picker-dropdown">
      <button v-for="m in 12" :key="m" @click="selectedMonth = m; showMonthPicker = false">{{ m }}月</button>
    </div>

    <div class="milestone-list">
      <div
        v-for="milestone in filteredMilestones"
        :key="milestone.id"
        class="milestone-card"
        :class="milestone.cycle"
      >
        <div class="milestone-header">
          <span class="cycle-badge" :style="{ backgroundColor: getCycleColor(milestone.cycle) }">
            {{ getCycleLabel(milestone.cycle) }}
          </span>
          <h3>{{ milestone.title }}</h3>
        </div>
        <p class="milestone-description">{{ milestone.description }}</p>
        <div class="milestone-meta">
          <span v-if="milestone.cycle === 'quarterly'">📅 {{ milestone.year }}年 Q{{ milestone.quarter }}</span>
          <span v-else-if="milestone.cycle === 'monthly'">📅 {{ milestone.year }}年 {{ milestone.month }}月</span>
          <span v-else>📅 {{ milestone.year }}年</span>
          <span>📋 {{ getSubTasksCount(milestone.id) }} 个子任务</span>
        </div>
        <div class="milestone-progress">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: milestone.progress + '%' }"></div>
          </div>
          <span>{{ milestone.progress }}%</span>
        </div>
        <div class="milestone-actions">
          <button class="action-btn" @click="expandMilestone(milestone)">
            {{ expandedMilestone === milestone.id ? '收起' : '查看详情' }}
          </button>
          <button class="action-btn" @click="generateSubTasks(milestone)">生成子任务</button>
        </div>

        <div v-if="expandedMilestone === milestone.id" class="subtasks-section">
          <h4>子任务列表</h4>
          <div class="subtasks-list">
            <div
              v-for="subtask in getSubTasks(milestone.id)"
              :key="subtask.id"
              class="subtask-item"
              :class="subtask.status"
            >
              <span class="subtask-status">
                {{ subtask.status === 'completed' ? '✅' : subtask.status === 'in-progress' ? '🔄' : '⏳' }}
              </span>
              <span class="subtask-title">{{ subtask.title }}</span>
              <span class="subtask-deadline">{{ subtask.deadline }}</span>
            </div>
            <div v-if="getSubTasks(milestone.id).length === 0" class="empty-subtasks">
              暂无子任务，点击「生成子任务」自动创建
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredMilestones.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无里程碑</p>
        <button class="empty-action" @click="showCreateModal = true">创建第一个里程碑</button>
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content">
        <h2>创建里程碑</h2>
        <form @submit.prevent="createMilestone">
          <div class="form-group">
            <label>里程碑名称</label>
            <input v-model="newMilestone.title" type="text" placeholder="如：2024年度核心目标" required />
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="newMilestone.description" placeholder="描述里程碑的具体内容..." rows="3"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>周期</label>
              <select v-model="newMilestone.cycle">
                <option value="annual">📅 年度</option>
                <option value="quarterly">🗓️ 季度</option>
                <option value="monthly">📆 月度</option>
              </select>
            </div>
            <div class="form-group">
              <label>年份</label>
              <select v-model="newMilestone.year">
                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}年</option>
              </select>
            </div>
          </div>
          <div v-if="newMilestone.cycle === 'quarterly'" class="form-group">
            <label>季度</label>
            <select v-model="newMilestone.quarter">
              <option v-for="q in 4" :key="q" :value="q">Q{{ q }}</option>
            </select>
          </div>
          <div v-if="newMilestone.cycle === 'monthly'" class="form-group">
            <label>月份</label>
            <select v-model="newMilestone.month">
              <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showCreateModal = false">取消</button>
            <button type="submit" class="btn-submit">创建</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'
import { useAuthStore } from '../stores/auth'

const taskStore = useTaskStore()
const authStore = useAuthStore()

const currentCycle = ref('annual')
const selectedYear = ref(new Date().getFullYear())
const selectedQuarter = ref(Math.floor((new Date().getMonth() + 3) / 3))
const selectedMonth = ref(new Date().getMonth() + 1)
const showCreateModal = ref(false)
const showQuarterPicker = ref(false)
const showMonthPicker = ref(false)
const expandedMilestone = ref(null)

const currentYear = new Date().getFullYear()
const currentQuarter = computed(() => Math.floor((new Date().getMonth() + 3) / 3))
const currentMonth = computed(() => new Date().getMonth() + 1)

const availableYears = computed(() => {
  const years = []
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    years.push(y)
  }
  return years
})

const cycleTabs = [
  { value: 'annual', label: '年度', icon: '📅' },
  { value: 'quarterly', label: '季度', icon: '🗓️' },
  { value: 'monthly', label: '月度', icon: '📆' }
]

const newMilestone = ref({
  title: '',
  description: '',
  cycle: 'annual',
  year: currentYear,
  quarter: currentQuarter.value,
  month: currentMonth.value
})

const filteredMilestones = computed(() => {
  const milestones = taskStore.getMilestones()
  return milestones.filter(m => {
    if (m.cycle !== currentCycle.value) return false
    if (currentCycle.value === 'annual') {
      return m.year === selectedYear.value
    } else if (currentCycle.value === 'quarterly') {
      return m.year === selectedYear.value && m.quarter === selectedQuarter.value
    } else if (currentCycle.value === 'monthly') {
      return m.year === selectedYear.value && m.month === selectedMonth.value
    }
    return true
  })
})

function getCycleLabel(cycle) {
  return taskStore.taskCycles[cycle]?.label || cycle
}

function getCycleColor(cycle) {
  return taskStore.taskCycles[cycle]?.color || '#8b5cf6'
}

function getSubTasks(parentId) {
  return taskStore.getSubTasks(parentId)
}

function getSubTasksCount(parentId) {
  return taskStore.getSubTasks(parentId).length
}

function expandMilestone(milestone) {
  expandedMilestone.value = expandedMilestone.value === milestone.id ? null : milestone.id
}

function createMilestone() {
  const data = {
    title: newMilestone.value.title,
    description: newMilestone.value.description,
    cycle: newMilestone.value.cycle,
    year: newMilestone.value.year,
    quarter: newMilestone.value.cycle === 'quarterly' ? newMilestone.value.quarter : undefined,
    month: newMilestone.value.cycle === 'monthly' ? newMilestone.value.month : undefined,
    createdBy: authStore.currentUser?.phone,
    publisherName: authStore.currentUser?.nickname
  }
  taskStore.createMilestone(data)
  showCreateModal.value = false
  newMilestone.value = {
    title: '',
    description: '',
    cycle: 'annual',
    year: currentYear,
    quarter: currentQuarter.value,
    month: currentMonth.value
  }
}

function generateSubTasks(milestone) {
  const cycle = milestone.cycle === 'annual' ? 'quarterly' : 'monthly'
  const subtasks = taskStore.createSubTasksFromMilestone(milestone.id, cycle)
  if (subtasks.length > 0) {
    alert(`成功生成 ${subtasks.length} 个子任务！`)
  }
}

onMounted(() => {
  taskStore.loadTasks()
})
</script>

<style scoped>
.milestone-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  color: #6b7280;
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.progress-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.progress-card.annual { border-left: 4px solid #f59e0b; }
.progress-card.quarterly { border-left: 4px solid #3b82f6; }
.progress-card.monthly { border-left: 4px solid #10b981; }

.progress-icon {
  font-size: 2.5rem;
}

.progress-info {
  flex: 1;
}

.progress-info h3 {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 12px;
}

.progress-bar-container {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-card.annual .progress-bar { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.progress-card.quarterly .progress-bar { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.progress-card.monthly .progress-bar { background: linear-gradient(90deg, #10b981, #34d399); }

.progress-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
}

.cycle-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  background: #f3f4f6;
  padding: 8px;
  border-radius: 12px;
}

.cycle-tabs button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.cycle-tabs button.active {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.milestone-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  position: relative;
}

.year-select, .quarter-select, .month-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.create-btn {
  margin-left: auto;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.picker-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.picker-dropdown button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.picker-dropdown button:hover {
  background: #f3f4f6;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.milestone-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.milestone-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.cycle-badge {
  padding: 4px 10px;
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
}

.milestone-description {
  color: #6b7280;
  margin-bottom: 12px;
}

.milestone-meta {
  display: flex;
  gap: 20px;
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 12px;
}

.milestone-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.milestone-progress .progress-bar-container {
  flex: 1;
}

.milestone-actions {
  display: flex;
  gap: 12px;
}

.milestone-actions .action-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.subtasks-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.subtasks-section h4 {
  margin-bottom: 12px;
  color: #374151;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.subtask-status {
  font-size: 1.25rem;
}

.subtask-title {
  flex: 1;
  color: #374151;
}

.subtask-deadline {
  color: #9ca3af;
  font-size: 0.875rem;
}

.empty-subtasks {
  text-align: center;
  color: #9ca3af;
  padding: 20px;
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
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .progress-overview {
    grid-template-columns: 1fr;
  }

  .cycle-tabs {
    flex-direction: column;
  }

  .milestone-controls {
    flex-wrap: wrap;
  }
}
</style>
