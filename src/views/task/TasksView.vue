<template>
  <div class="tasks-page">
    <div class="page-header">
      <h1>任务中心</h1>
      <p>管理你的任务列表追踪进度</p>
    </div>

    <div class="stats-card">
      <div class="stat-item">
        <span class="stat-value">{{ taskStore.taskStats.total }}</span>
        <span class="stat-label">任务总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value in-progress">{{ taskStore.taskStats.inProgress }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-item">
        <span class="stat-value completed">{{ taskStore.taskStats.completed }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="stat-item">
        <span class="stat-value cancelled">{{ taskStore.taskStats.cancelled }}</span>
        <span class="stat-label">已取消</span>
      </div>
      <div class="stat-item streak" v-if="streakDays > 0">
        <span class="stat-value streak-value"> {{ streakDays }}</span>
        <span class="stat-label">连续完成</span>
      </div>
    </div>

    <div class="view-tabs">
      <button 
        v-for="view in viewModes" 
        :key="view.value"
        :class="{ active: currentView === view.value }"
        @click="currentView = view.value"
      >
        {{ view.icon }} {{ view.label }}
      </button>
    </div>

    <div v-if="currentView === 'list'" class="list-view">
      <div class="filter-tabs">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="{ active: selectedFilter === filter.value }"
          @click="selectedFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="tasks-list">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="task-card"
          :class="task.status"
        >
          <div class="task-header">
            <div class="task-status-badge" :class="task.status">
              {{ task.statusText }}
            </div>
            <h3>{{ task.title }}</h3>
            <div class="task-actions-header">
              <button class="icon-btn" @click="showLogModal(task)" title="日志"></button>
              <button class="icon-btn" @click="showShareModal(task)" title="分享"></button>
              <button class="icon-btn" @click="showReminderModal(task)" title="提醒"></button>
            </div>
          </div>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-meta">
            <div class="meta-item">
              <span></span>
              <span>{{ task.location }}</span>
            </div>
            <div class="meta-item">
              <span></span>
              <span>{{ task.reward }}</span>
            </div>
            <div class="meta-item" v-if="task.deadline">
              <span>📅</span>
              <span>{{ task.deadline }} ({{ getDaysRemaining(task.deadline) }})</span>
            </div>
            <div class="meta-item" v-if="task.requiredIdentity">
              <span>🏷️</span>
              <span>{{ getIdentityName(task.requiredIdentity) }}</span>
            </div>
          </div>
          <div v-if="task.progress < 100 && task.status === 'in-progress'" class="task-progress">
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: task.progress + '%' }"></div>
            </div>
            <span>{{ task.progress }}%</span>
          </div>
          <div class="task-actions">
            <button 
              v-if="task.status === 'pending'" 
              class="action-btn primary"
              @click="acceptTask(task.id)"
            >
               接取任务
            </button>
            <button 
              v-if="task.status === 'in-progress' && task.assignee === authStore.currentUser?.phone" 
              class="action-btn primary"
              @click="completeTask(task.id)"
            >
              完成任务
            </button>
            <button 
              v-if="task.status === 'in-progress' && task.assignee === authStore.currentUser?.phone" 
              class="action-btn secondary"
              @click="cancelAcceptTask(task.id)"
            >
               取消接取
            </button>
            <button 
              v-if="task.status === 'in-progress' && task.publisherId === authStore.currentUser?.phone" 
              class="action-btn secondary"
              @click="cancelTask(task.id)"
            >
              取消任务
            </button>
            <span v-if="task.completedAt" class="completed-date">
              {{ task.completedAt }} 完成
            </span>
            <span v-if="task.cancelledAt" class="cancelled-date">
              {{ task.cancelledAt }} {{ task.reason }}
            </span>
          </div>
          <div v-if="task.publisherName" class="task-publisher">
            <span class="publisher-label">发布</span>
            <span class="publisher-name">{{ task.publisherName }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredTasks.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无任务</p>
        <router-link to="/bounty" class="empty-action">去领取赏金任务</router-link>
      </div>
    </div>

    <div v-if="currentView === 'calendar'" class="calendar-view">
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth"></button>
        <h3>{{ currentMonthLabel }}</h3>
        <button class="nav-btn" @click="nextMonth">›</button>
      </div>
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      <div class="calendar-grid">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="calendar-day"
          :class="{ 
            'other-month': !day.isCurrentMonth,
            'has-task': day.hasTask,
            'is-today': day.isToday,
            'selected': selectedDate === day.date
          }"
          @click="selectCalendarDate(day)"
        >
          <span class="day-number">{{ day.day }}</span>
          <span v-if="day.hasTask" class="task-dot"></span>
        </div>
      </div>
      <div class="calendar-task-list" v-if="selectedDateTasks.length > 0">
        <h4>{{ selectedDate }} 的任务 ({{ selectedDateTasks.length }})</h4>
        <div class="task-items">
          <div 
            v-for="task in selectedDateTasks" 
            :key="task.id"
            class="calendar-task-item"
            @click="selectTask(task)"
          >
            <span class="task-icon">{{ task.status === 'completed' ? '✓' : '' }}</span>
            <span class="task-title">{{ task.title }}</span>
            <span class="task-reward">{{ task.reward }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="selectedDate" class="calendar-task-list empty">
        <p>{{ selectedDate }} 没有任务</p>
      </div>
    </div>

    <div v-if="currentView === 'timeline'" class="timeline-view">
      <div class="timeline-header">
        <select v-model="timelineGroupBy" class="group-select">
          <option value="day">按日</option>
          <option value="week">按周</option>
          <option value="month">按月</option>
          <option value="quarter">按季度</option>
          <option value="year">按年</option>
        </select>
      </div>
      <div class="timeline-container">
        <div 
          v-for="(group, index) in timelineGroups" 
          :key="index"
          class="timeline-group"
        >
          <div class="timeline-date">
            <div class="timeline-marker"></div>
            <div class="timeline-date-info">
              <div class="timeline-date-label">{{ group.label }}</div>
              <div class="timeline-date-count">{{ group.count }}个任务</div>
            </div>
          </div>
          <div class="timeline-tasks">
            <div 
              v-for="task in group.tasks" 
              :key="task.id"
              class="timeline-task"
              @click="selectTask(task)"
            >
              <span class="task-badge" :class="task.status">{{ getStatusIcon(task.status) }}</span>
              <span class="task-name">{{ task.title }}</span>
              <span class="task-location"> {{ task.location }}</span>
              <span class="task-reward">{{ task.reward }}</span>
            </div>
          </div>
        </div>
        <div v-if="timelineGroups.length === 0" class="empty-state">
          <div class="empty-icon"></div>
          <p>暂无完成的任务记录</p>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'dashboard'" class="dashboard-view">
      <div class="dashboard-stats">
        <div class="dashboard-stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <span class="stat-number">{{ streakDays }}</span>
            <span class="stat-name">连续完成天数</span>
          </div>
        </div>
        <div class="dashboard-stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <span class="stat-number">{{ todayCompleted }}</span>
            <span class="stat-name">今日完成</span>
          </div>
        </div>
        <div class="dashboard-stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <span class="stat-number">{{ weekCompleted }}</span>
            <span class="stat-name">本周完成</span>
          </div>
        </div>
        <div class="dashboard-stat-card">
          <div class="stat-icon"></div>
          <div class="stat-content">
            <span class="stat-number">{{ monthCompleted }}</span>
            <span class="stat-name">本月完成</span>
          </div>
        </div>
      </div>
      <div class="dashboard-chart">
        <h3>7天完成任务趋势</h3>
        <div class="trend-chart">
          <div 
            v-for="(day, index) in weeklyTrend" 
            :key="index"
            class="trend-bar"
            :style="{ height: (day.count / maxTrendCount * 100) + '%' }"
          >
            <span class="trend-count">{{ day.count }}</span>
            <span class="trend-label">{{ day.label }}</span>
          </div>
        </div>
      </div>
      <div class="category-stats">
        <h3> 任务类型分布</h3>
        <div class="category-list">
          <div 
            v-for="(cat, index) in categoryStats" 
            :key="index"
            class="category-item"
          >
            <span class="category-icon">{{ cat.icon }}</span>
            <span class="category-name">{{ cat.name }}</span>
            <span class="category-count">{{ cat.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedTask && showTaskDetail" class="task-detail-overlay" @click="closeTaskDetail">
      <div class="task-detail-modal" @click.stop>
        <button class="close-btn" @click="closeTaskDetail"></button>
        <div class="detail-header">
          <span class="detail-icon">{{ selectedTask.icon || '' }}</span>
          <div class="detail-title">
            <h2>{{ selectedTask.title }}</h2>
            <span class="detail-status" :class="selectedTask.status">{{ selectedTask.statusText }}</span>
          </div>
        </div>
        <div class="detail-body">
          <p class="detail-description">{{ selectedTask.description }}</p>
          <div class="detail-meta">
            <div class="meta-row">
              <span> 地点:</span>
              <span>{{ selectedTask.location }}</span>
            </div>
            <div class="meta-row">
              <span> 奖励:</span>
              <span>{{ selectedTask.reward }}</span>
            </div>
            <div class="meta-row" v-if="selectedTask.deadline">
              <span>截止:</span>
              <span>{{ selectedTask.deadline }}</span>
            </div>
          </div>
          <div class="detail-actions">
            <button v-if="selectedTask.status === 'in-progress'" class="action-btn primary" @click="completeTask(selectedTask.id); closeTaskDetail()">完成任务</button>
            <button v-if="selectedTask.status === 'in-progress'" class="action-btn secondary" @click="cancelTask(selectedTask.id); closeTaskDetail()">取消任务</button>
            <button class="action-btn info" @click="showLogModal(selectedTask)"> 查看日志</button>
            <button class="action-btn info" @click="showShareModal(selectedTask)"> 分享任务</button>
            <button class="action-btn info" @click="showReminderModal(selectedTask)">设置提醒</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showLog" class="modal-overlay" @click="showLog = false">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="showLog = false"></button>
        <div class="modal-header">
          <span> 任务日志</span>
        </div>
        <div class="log-timeline">
          <div v-if="currentTaskLogs.length === 0" class="empty-log">
            <p>暂无日志记录</p>
          </div>
          <div v-else>
            <div v-for="(log, index) in currentTaskLogs" :key="index" class="log-item">
              <div class="log-dot"></div>
              <div class="log-content">
                <div class="log-time"> {{ log.time }}</div>
                <div class="log-action">{{ log.action }}</div>
                <div class="log-detail">{{ log.detail }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showShare" class="modal-overlay" @click="showShare = false">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="showShare = false"></button>
        <div class="modal-header">
          <span> 分享任务</span>
        </div>
        <div class="share-task-title">{{ currentShareTask?.title }}</div>
        <textarea class="share-text" v-model="shareText" readonly></textarea>
        <div class="share-options">
          <button class="share-btn" @click="shareToWeChat"> 微信</button>
          <button class="share-btn" @click="shareToQQ"> QQ</button>
          <button class="share-btn" @click="shareToWeibo"> 微博</button>
          <button class="share-btn" @click="copyShareLink"> 复制链接</button>
        </div>
      </div>
    </div>

    <div v-if="showReminder" class="modal-overlay" @click="showReminder = false">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="showReminder = false"></button>
        <div class="modal-header">
          <span>🔔 提醒设置</span>
        </div>
        <div class="reminder-task-title">{{ currentShareTask?.title }}</div>
        <div class="reminder-options">
          <label class="reminder-checkbox">
            <input type="checkbox" value="1day" v-model="reminderSelections" />
            <span>截止1天提醒</span>
          </label>
          <label class="reminder-checkbox">
            <input type="checkbox" value="3day" v-model="reminderSelections" />
            <span>截止3天提醒</span>
          </label>
          <label class="reminder-checkbox">
            <input type="checkbox" value="1week" v-model="reminderSelections" />
            <span>截止1周提醒</span>
          </label>
        </div>
        <button class="save-btn" @click="saveReminder">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../../stores/modules/task'
import { useAuthStore } from '../../stores/modules/auth'
import { useAchievementStore } from '../../stores/modules/achievement'

const taskStore = useTaskStore()
const authStore = useAuthStore()
const achievementStore = useAchievementStore()
const selectedFilter = ref('all')
const currentView = ref('list')
const selectedTask = ref(null)
const showTaskDetail = ref(false)
const showLog = ref(false)
const showShare = ref(false)
const showReminder = ref(false)
const currentShareTask = ref(null)
const shareText = ref('')
const reminderSelections = ref([])
const currentTaskLogs = ref([])
const selectedDate = ref('')
const timelineGroupBy = ref('month')

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const viewModes = [
  { label: '列表', value: 'list', icon: '' },
  { label: '日历', value: 'calendar', icon: '' },
  { label: '时间线', value: 'timeline', icon: '' },
  { label: '统计', value: 'dashboard', icon: '' }
]

const filters = [
  { label: '全部', value: 'all' },
  { label: '待接取', value: 'pending' },
  { label: '进行中', value: 'in-progress' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
  { label: '我领取的', value: 'my-accepted' },
  { label: '我发布的', value: 'my-published' }
]

const streakDays = computed(() => {
  return taskStore.getStreakDays()
})

const todayCompleted = computed(() => {
  return taskStore.getTodayCompletedCount()
})

const weekCompleted = computed(() => {
  return taskStore.getWeekCompletedCount()
})

const monthCompleted = computed(() => {
  return taskStore.getMonthCompletedCount()
})

const filteredTasks = computed(() => {
  let tasks = []
  
  if (selectedFilter.value === 'all') {
    tasks = taskStore.getAllTasks()
  } else if (selectedFilter.value === 'my-accepted') {
    if (!authStore.isLoggedIn) return []
    return taskStore.getAcceptedTasks(authStore.currentUser.phone)
  } else if (selectedFilter.value === 'my-published') {
    if (!authStore.isLoggedIn) return []
    return taskStore.getMyPublishedTasks(authStore.currentUser.phone)
  } else {
    tasks = taskStore.getAllTasks().filter(t => t.status === selectedFilter.value)
  }
  
  if (authStore.isLoggedIn && selectedFilter.value !== 'my-published') {
    tasks = tasks.filter(t => t.publisherId !== authStore.currentUser.phone)
  }
  
  return tasks
})

const currentMonthLabel = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}${date.getMonth() + 1}月`
})

const calendarDays = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPadding = firstDay.getDay()
  const days = []
  
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({
      day: d.getDate(),
      date: taskStore.formatDate(d),
      isCurrentMonth: false,
      isToday: false,
      hasTask: false
    })
  }
  
  const today = taskStore.formatDate(new Date())
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i)
    const dateStr = taskStore.formatDate(d)
    days.push({
      day: i,
      date: dateStr,
      isCurrentMonth: true,
      isToday: dateStr === today,
      hasTask: taskStore.getAllTasks().some(t => (t.completedAt || t.createdAt) === dateStr && t.status === 'completed')
    })
  }
  
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    days.push({
      day: i,
      date: taskStore.formatDate(d),
      isCurrentMonth: false,
      isToday: false,
      hasTask: false
    })
  }
  
  return days
})

const selectedDateTasks = computed(() => {
  if (!selectedDate.value) return []
  return taskStore.getAllTasks().filter(t => 
    (t.completedAt || t.createdAt) === selectedDate.value && t.status === 'completed'
  )
})

const timelineGroups = computed(() => {
  const completedTasks = taskStore.getAllTasks().filter(t => t.status === 'completed')
  const groups = {}
  
  completedTasks.forEach(task => {
    const date = task.completedAt || task.createdAt
    let key = date
    let label = date
    
    if (timelineGroupBy.value === 'day') {
      key = date
      label = date
    } else if (timelineGroupBy.value === 'week') {
      const d = new Date(date)
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      key = taskStore.formatDate(weekStart)
      label = `${weekStart.getMonth() + 1}${weekStart.getDate()} - ${weekEnd.getMonth() + 1}${weekEnd.getDate()}日`
    } else if (timelineGroupBy.value === 'month') {
      key = date.substring(0, 7)
      label = `${date.substring(0, 4)}${date.substring(5, 7)}月`
    } else if (timelineGroupBy.value === 'quarter') {
      const month = parseInt(date.substring(5, 7))
      const quarter = Math.ceil(month / 3)
      key = `${date.substring(0, 4)}-Q${quarter}`
      label = `${date.substring(0, 4)}${quarter}季度`
    } else if (timelineGroupBy.value === 'year') {
      key = date.substring(0, 4)
      label = `${date.substring(0, 4)}年`
    }
    
    if (!groups[key]) {
      groups[key] = { label, count: 0, tasks: [] }
    }
    groups[key].tasks.push(task)
    groups[key].count++
  })
  
  return Object.values(groups).reverse()
})

const weeklyTrend = computed(() => {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const result = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = taskStore.formatDate(d)
    const count = taskStore.getAllTasks().filter(t => t.completedAt === dateStr && t.status === 'completed').length
    result.push({
      label: days[d.getDay()],
      count
    })
  }
  
  return result
})

const maxTrendCount = computed(() => {
  return Math.max(...weeklyTrend.value.map(d => d.count), 1)
})

const categoryStats = computed(() => {
  const cats = {}
  const allTasks = taskStore.getAllTasks()
  
  allTasks.forEach(task => {
    const type = task.type || 'other'
    if (!cats[type]) {
      cats[type] = { icon: '', name: type, count: 0 }
    }
    cats[type].count++
  })
  
  return Object.values(cats)
})

function getDaysRemaining(deadline) {
  return taskStore.getDaysRemaining(deadline)
}

function getIdentityName(identityId) {
  const identity = authStore.getIdentityInfo(identityId)
  return identity ? `${identity.icon} ${identity.name}` : identityId
}

function getStatusIcon(status) {
  const icons = {
    'pending': '',
    'in-progress': '',
    'completed': '',
    'cancelled': ''
  }
  return icons[status] || ''
}

function acceptTask(taskId) {
  if (!authStore.isLoggedIn) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请先登录再接取任务', type: 'warning' }
    }))
    return
  }
  
  const task = taskStore.getTaskById(taskId)
  if (!task) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '任务不存在', type: 'error' }
    }))
    return
  }
  
  if (task.publisherId === authStore.currentUser.phone) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '不能接取自己发布的任务', type: 'warning' }
    }))
    return
  }
  
  if (task.assignee === authStore.currentUser.phone) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '您已接取此任务', type: 'warning' }
    }))
    return
  }
  
  const cooldownRemaining = authStore.getAcceptCooldownRemaining()
  if (cooldownRemaining > 0) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: `冷却中，${cooldownRemaining}秒后再试`, type: 'warning' }
    }))
    return
  }
  
  const identityCheck = authStore.checkIdentityMatch(task.requiredIdentity)
  if (!identityCheck.valid) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: identityCheck.message, type: 'warning' }
    }))
    return
  }
  
  const successRate = task.successRate || 0.8
  const success = taskStore.rollDice(successRate)
  
  authStore.updateAcceptTime()
  
  if (!success) {
    authStore.incrementFailCount()
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: ` 接取失败成功率 ${Math.round(successRate * 100)}%再接再厉`, type: 'error' }
    }))
    return
  }
  
  authStore.resetFailCount()
  
  const result = taskStore.acceptTask(taskId, authStore.currentUser.phone)
  if (result.success) {
    addLog(taskId, '接取任务', `${authStore.currentUser.nickname} 接取了任务`)
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '任务接取成功', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message || '任务接取失败', type: 'error' }
    }))
  }
}

function completeTask(taskId) {
  taskStore.completeTask(taskId)
  addLog(taskId, '完成任务', '任务已完成')
  
  const task = taskStore.getTaskById(taskId)
  if (task && task.rewardType && task.rewardAmount) {
    if (task.rewardType === 'gold') {
      authStore.addCoins(task.rewardAmount)
    } else if (task.rewardType === 'pearl') {
      authStore.addPearls(task.rewardAmount)
    }
  }

  const unlockedAchievements = achievementStore.checkProgress('task_completed')
  if (unlockedAchievements.length > 0) {
    unlockedAchievements.forEach(achievement => {
      authStore.addPrestige(achievement.rewards.prestige || 0)
      achievementStore.checkProgress('prestige_change', { prestige: authStore.currentUser?.prestige || 0 })
      achievementStore.checkProgress('prestige_added', { total: authStore.currentUser?.totalPrestige || 0 })
    })
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: `解锁成就: ${unlockedAchievements.map(a => a.name).join('、')}`, type: 'success' }
    }))
  }
  
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '任务完成奖励已发放', type: 'success' }
  }))
}

function cancelTask(taskId) {
  taskStore.updateTask(taskId, {
    status: 'cancelled',
    statusText: '已取消',
    cancelledAt: new Date().toISOString().split('T')[0],
    reason: '主动取消'
  })
  addLog(taskId, '取消任务', '用户主动取消')
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '任务已取消', type: 'warning' }
  }))
}

function cancelAcceptTask(taskId) {
  if (!authStore.isLoggedIn) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请先登录', type: 'warning' }
    }))
    return
  }
  
  const result = taskStore.cancelAccept(taskId, authStore.currentUser.phone)
  if (result.success) {
    addLog(taskId, '取消接取', `${authStore.currentUser.nickname} 取消接取任务`)
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message || '取消接取失败', type: 'error' }
    }))
  }
}

function addLog(taskId, action, detail) {
  const task = taskStore.getAllTasks().find(t => t.id === taskId)
  if (task) {
    if (!task.logs) task.logs = []
    task.logs.push({
      time: new Date().toISOString().split('T')[0],
      action,
      detail
    })
  }
}

function selectTask(task) {
  selectedTask.value = task
  showTaskDetail.value = true
}

function closeTaskDetail() {
  showTaskDetail.value = false
  selectedTask.value = null
}

function showLogModal(task) {
  selectedTask.value = task
  currentTaskLogs.value = task.logs || []
  showLog.value = true
  showTaskDetail.value = false
}

function showShareModal(task) {
  selectedTask.value = task
  currentShareTask.value = task
  shareText.value = `我正在枫榕赏金酒馆完成任务{task.title}\n ${task.location}\n 奖励: ${task.reward}\n快来一起冒险吧`
  showShare.value = true
  showTaskDetail.value = false
}

function showReminderModal(task) {
  selectedTask.value = task
  currentShareTask.value = task
  reminderSelections.value = task.reminders || []
  showLog.value = false
  showShare.value = false
  showReminder.value = true
}

function shareToWeChat() {
  copyToClipboard(shareText.value)
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '分享内容已复制到剪贴板', type: 'success' }
  }))
  showShare.value = false
}

function shareToQQ() {
  shareToWeChat()
}

function shareToWeibo() {
  shareToWeChat()
}

function copyShareLink() {
  copyToClipboard(window.location.href)
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '链接已复制到剪贴板', type: 'success' }
  }))
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

function saveReminder() {
  if (currentShareTask.value) {
    currentShareTask.value.reminders = [...reminderSelections.value]
    localStorage.setItem('tasks', JSON.stringify(taskStore.getAllTasks()))
    const reminderText = reminderSelections.value.length > 0 
      ? `提醒已设置${reminderSelections.value.map(r => r === '1day' ? '截止1天' : r === '3day' ? '截止3天' : '截止1周').join('、')}`
      : '已取消所有提醒'
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: reminderText, type: 'success' }
    }))
  }
  showReminder.value = false
}

function selectCalendarDate(day) {
  selectedDate.value = day.date
}

function prevMonth() {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '已是最早月份', type: 'info' }
  }))
}

function nextMonth() {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '已是最晚月份', type: 'info' }
  }))
}

onMounted(() => {
  taskStore.loadTasks()
})
</script>

<style scoped>
.tasks-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin: 30px 0;
}

.page-header h1 {
  color: #D4AF37;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.page-header p {
  color: #888;
}

.stats-card {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 25px;
  background: rgba(140,43,27,0.1);
  border-radius: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  min-width: 100px;
}

.stat-value {
  display: block;
  font-size: 2.2rem;
  font-weight: bold;
  color: #D4AF37;
}

.stat-value.in-progress { color: #3498db; }
.stat-value.completed { color: #2ecc71; }
.stat-value.cancelled { color: #e74c3c; }
.stat-value.streak-value { color: #f39c12; }

.stat-label {
  display: block;
  color: #888;
  font-size: 0.9rem;
}

.view-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.view-tabs button {
  padding: 10px 20px;
  background: #2D1E17;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
  transition: all 0.2s;
}

.view-tabs button.active {
  background: #8C2B1B;
  border-color: #8C2B1B;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-tabs button {
  padding: 10px 25px;
  background: #2D1E17;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tabs button.active {
  background: #8C2B1B;
  border-color: #8C2B1B;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-card {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 25px;
  border-left: 4px solid;
}

.task-card.pending { border-color: #f39c12; }
.task-card.in-progress { border-color: #3498db; }
.task-card.completed { border-color: #2ecc71; }
.task-card.cancelled { border-color: #e74c3c; }

.task-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.task-status-badge {
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: bold;
}

.task-status-badge.pending { background: rgba(243,156,18,0.2); color: #f39c12; }
.task-status-badge.in-progress { background: rgba(52,152,219,0.2); color: #3498db; }
.task-status-badge.completed { background: rgba(46,204,113,0.2); color: #2ecc71; }
.task-status-badge.cancelled { background: rgba(231,76,60,0.2); color: #e74c3c; }

.task-header h3 {
  flex: 1;
  color: #D4AF37;
  margin: 0;
  font-size: 1.2rem;
}

.task-actions-header {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px 10px;
  background: rgba(140,43,27,0.3);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: rgba(140,43,27,0.5);
}

.task-description {
  color: #D4C39E;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #888;
  font-size: 0.9rem;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.progress-bar-container {
  flex: 1;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.5s;
}

.task-progress span {
  color: #D4AF37;
  font-weight: bold;
}

.task-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #D4AF37;
  color: #1A120B;
  font-weight: bold;
}

.action-btn.primary:hover {
  background: #B89500;
}

.action-btn.secondary {
  background: #444;
  color: #D4C39E;
}

.action-btn.secondary:hover {
  background: #555;
}

.action-btn.info {
  background: rgba(140,43,27,0.3);
  color: #D4C39E;
}

.action-btn.info:hover {
  background: rgba(140,43,27,0.5);
}

.completed-date {
  color: #2ecc71;
}

.cancelled-date {
  color: #e74c3c;
}

.task-publisher {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #444;
  color: #888;
  font-size: 0.9rem;
}

.publisher-label {
  color: #666;
}

.publisher-name {
  color: #D4AF37;
  font-weight: bold;
}

.calendar-view {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 25px;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.calendar-header h3 {
  color: #D4AF37;
  margin: 0;
  min-width: 150px;
  text-align: center;
}

.nav-btn {
  padding: 8px 15px;
  background: rgba(140,43,27,0.3);
  border: none;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.2);
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.calendar-day:hover {
  background: rgba(140,43,27,0.3);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.is-today {
  border: 2px solid #D4AF37;
}

.calendar-day.selected {
  background: rgba(140,43,27,0.5);
}

.calendar-day.has-task .task-dot {
  position: absolute;
  bottom: 3px;
  width: 5px;
  height: 5px;
  background: #2ecc71;
  border-radius: 50%;
}

.day-number {
  color: #D4C39E;
}

.calendar-task-list {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.calendar-task-list h4 {
  color: #D4AF37;
  margin: 0 0 15px 0;
}

.calendar-task-list.empty {
  text-align: center;
  color: #888;
}

.task-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calendar-task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(140,43,27,0.2);
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

.calendar-task-item:hover {
  background: rgba(140,43,27,0.4);
}

.calendar-task-item .task-icon {
  font-size: 1.2rem;
}

.calendar-task-item .task-title {
  flex: 1;
  color: #D4C39E;
}

.calendar-task-item .task-reward {
  color: #D4AF37;
  font-size: 0.9rem;
}

.timeline-view {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 25px;
}

.timeline-header {
  margin-bottom: 20px;
}

.group-select {
  padding: 10px 15px;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.timeline-group {
  display: flex;
  gap: 20px;
}

.timeline-date {
  display: flex;
  gap: 15px;
  min-width: 180px;
}

.timeline-marker {
  width: 12px;
  height: 12px;
  background: #D4AF37;
  border-radius: 50%;
  margin-top: 5px;
}

.timeline-date-label {
  color: #D4AF37;
  font-weight: bold;
}

.timeline-date-count {
  color: #888;
  font-size: 0.9rem;
}

.timeline-tasks {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.timeline-task {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.timeline-task:hover {
  background: rgba(140,43,27,0.3);
}

.task-badge {
  font-size: 1.2rem;
}

.task-name {
  flex: 1;
  color: #D4C39E;
}

.task-location {
  color: #888;
  font-size: 0.9rem;
}

.task-reward {
  color: #D4AF37;
}

.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.dashboard-stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 25px;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
}

.dashboard-stat-card .stat-icon {
  font-size: 2.5rem;
}

.dashboard-stat-card .stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #D4AF37;
}

.dashboard-stat-card .stat-name {
  color: #888;
  font-size: 0.9rem;
}

.dashboard-chart {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 25px;
}

.dashboard-chart h3 {
  color: #D4AF37;
  margin: 0 0 20px 0;
  text-align: center;
}

.trend-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 150px;
  gap: 15px;
}

.trend-bar {
  flex: 1;
  max-width: 60px;
  background: linear-gradient(to top, #8C2B1B, #D4AF37);
  border-radius: 5px 5px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  min-height: 30px;
}

.trend-count {
  position: absolute;
  top: -25px;
  color: #D4AF37;
  font-weight: bold;
}

.trend-label {
  position: absolute;
  bottom: -25px;
  color: #888;
  font-size: 0.8rem;
}

.category-stats {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 25px;
}

.category-stats h3 {
  color: #D4AF37;
  margin: 0 0 20px 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  flex: 1;
  color: #D4C39E;
}

.category-count {
  color: #D4AF37;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state p {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.empty-action {
  display: inline-block;
  padding: 12px 30px;
  background: #8C2B1B;
}
</style>

