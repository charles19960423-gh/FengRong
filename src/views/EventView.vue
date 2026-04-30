<template>
  <div class="event-page">
    <div class="page-header">
      <h1>🎪 线下聚会</h1>
      <p>传媒行业线下活动，同行聚会、经验分享、工作坊等</p>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ eventStore.eventStats.total }}</span>
        <span class="stat-label">活动总数</span>
      </div>
      <div class="stat-item upcoming">
        <span class="stat-value">{{ eventStore.eventStats.upcoming }}</span>
        <span class="stat-label">即将开始</span>
      </div>
      <div class="stat-item registration">
        <span class="stat-value">{{ eventStore.eventStats.registration }}</span>
        <span class="stat-label">报名中</span>
      </div>
      <div class="stat-item completed">
        <span class="stat-value">{{ eventStore.eventStats.completed }}</span>
        <span class="stat-label">已结束</span>
      </div>
    </div>

    <div class="controls">
      <button class="create-btn" @click="showCreateModal = true" v-if="authStore.isLoggedIn && !authStore.isClient">
        + 创建活动
      </button>
    </div>

    <div class="tabs">
      <button :class="{ active: currentTab === 'discover' }" @click="currentTab = 'discover'">
        🔍 发现活动
      </button>
      <button :class="{ active: currentTab === 'my-events' }" @click="currentTab = 'my-events'" v-if="authStore.isLoggedIn">
        📋 我的活动
      </button>
    </div>

    <div v-if="currentTab === 'discover'" class="events-section">
      <div class="filter-bar">
        <select v-model="statusFilter" class="filter-select">
          <option value="all">全部状态</option>
          <option value="upcoming">即将开始</option>
          <option value="registration">报名中</option>
          <option value="completed">已结束</option>
        </select>
        <select v-model="typeFilter" class="filter-select">
          <option value="all">全部类型</option>
          <option v-for="(type, key) in eventStore.eventTypes" :key="key" :value="key">
            {{ type.icon }} {{ type.label }}
          </option>
        </select>
      </div>

      <div class="events-grid">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-card"
          :class="event.status"
          @click="viewEvent(event)"
        >
          <div class="card-header">
            <span class="type-badge">
              {{ eventStore.eventTypes[event.type]?.icon }} {{ eventStore.eventTypes[event.type]?.label }}
            </span>
            <span class="status-badge" :style="{ backgroundColor: eventStore.eventStatuses[event.status]?.color }">
              {{ eventStore.eventStatuses[event.status]?.icon }} {{ eventStore.eventStatuses[event.status]?.label }}
            </span>
          </div>
          <h3>{{ event.title }}</h3>
          <p class="card-description">{{ event.description }}</p>
          <div class="card-info">
            <div class="info-item">
              <span class="info-icon">📅</span>
              <span>{{ event.eventDate }} {{ event.eventTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">📍</span>
              <span>{{ event.venue }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">💰</span>
              <span>{{ event.ticketPrice === 0 ? '免费' : '¥' + event.ticketPrice }}</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="host">👤 {{ event.hostName }}</span>
            <span class="attendees">👥 {{ event.attendees.length }}{{ event.capacity ? '/' + event.capacity : '' }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredEvents.length === 0" class="empty-state">
        <div class="empty-icon">🎪</div>
        <p>暂无相关活动</p>
        <button class="empty-action" @click="showCreateModal = true" v-if="authStore.isLoggedIn">创建第一个活动</button>
      </div>
    </div>

    <div v-if="currentTab === 'my-events'" class="my-events-section">
      <div class="my-events-grid">
        <div
          v-for="event in myEvents"
          :key="event.id"
          class="event-card"
          :class="event.status"
        >
          <div class="card-header">
            <span class="type-badge">
              {{ eventStore.eventTypes[event.type]?.icon }} {{ eventStore.eventTypes[event.type]?.label }}
            </span>
            <span class="status-badge" :style="{ backgroundColor: eventStore.eventStatuses[event.status]?.color }">
              {{ eventStore.eventStatuses[event.status]?.icon }} {{ eventStore.eventStatuses[event.status]?.label }}
            </span>
          </div>
          <h3>{{ event.title }}</h3>
          <p class="card-description">{{ event.description }}</p>
          <div class="card-actions">
            <button class="action-btn" @click="viewEvent(event)">查看详情</button>
            <button v-if="event.hostId === authStore.currentUser?.phone" class="action-btn primary" @click="showManageModal(event)">
              管理报名
            </button>
          </div>
        </div>
      </div>

      <div v-if="myEvents.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <p>你还没有参加或创建的活动</p>
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content">
        <h2>创建新活动</h2>
        <form @submit.prevent="createEvent">
          <div class="form-group">
            <label>活动名称</label>
            <input v-model="newEvent.title" type="text" placeholder="如：枫榕赏金酒馆线下聚会" required />
          </div>
          <div class="form-group">
            <label>活动类型</label>
            <select v-model="newEvent.type" required>
              <option v-for="(type, key) in eventStore.eventTypes" :key="key" :value="key">
                {{ type.icon }} {{ type.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>活动描述</label>
            <textarea v-model="newEvent.description" placeholder="详细描述活动内容..." rows="3" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>活动日期</label>
              <input v-model="newEvent.eventDate" type="date" required />
            </div>
            <div class="form-group">
              <label>开始时间</label>
              <input v-model="newEvent.eventTime" type="time" required />
            </div>
          </div>
          <div class="form-group">
            <label>活动时长</label>
            <input v-model="newEvent.duration" type="text" placeholder="如：3小时" />
          </div>
          <div class="form-group">
            <label>活动地点</label>
            <input v-model="newEvent.venue" type="text" placeholder="如：上海市静安区某某酒吧" required />
          </div>
          <div class="form-group">
            <label>详细地址</label>
            <input v-model="newEvent.address" type="text" placeholder="详细地址" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>人数上限</label>
              <input v-model="newEvent.capacity" type="number" placeholder="不填表示不限" />
            </div>
            <div class="form-group">
              <label>门票价格</label>
              <input v-model="newEvent.ticketPrice" type="number" placeholder="0表示免费" />
            </div>
          </div>
          <div class="form-group">
            <label>标签 (用逗号分隔)</label>
            <input v-model="tagsInput" type="text" placeholder="如：社交,行业交流,同行聚会" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showCreateModal = false">取消</button>
            <button type="submit" class="btn-submit">创建</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content detail-modal">
        <div v-if="selectedEvent">
          <div class="detail-header">
            <span class="type-badge">
              {{ eventStore.eventTypes[selectedEvent.type]?.icon }} {{ eventStore.eventTypes[selectedEvent.type]?.label }}
            </span>
            <span class="status-badge" :style="{ backgroundColor: eventStore.eventStatuses[selectedEvent.status]?.color }">
              {{ eventStore.eventStatuses[selectedEvent.status]?.icon }} {{ eventStore.eventStatuses[selectedEvent.status]?.label }}
            </span>
          </div>
          <h2>{{ selectedEvent.title }}</h2>
          <p class="detail-description">{{ selectedEvent.description }}</p>
          <div class="detail-info">
            <div class="info-row">
              <span class="info-label">📅 日期时间</span>
              <span>{{ selectedEvent.eventDate }} {{ selectedEvent.eventTime }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">⏱️ 活动时长</span>
              <span>{{ selectedEvent.duration }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 活动地点</span>
              <span>{{ selectedEvent.venue }}</span>
            </div>
            <div v-if="selectedEvent.address" class="info-row">
              <span class="info-label">🏠 详细地址</span>
              <span>{{ selectedEvent.address }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">👤 主办方</span>
              <span>{{ selectedEvent.hostName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">💰 门票价格</span>
              <span>{{ selectedEvent.ticketPrice === 0 ? '免费' : '¥' + selectedEvent.ticketPrice }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">👥 报名人数</span>
              <span>{{ selectedEvent.attendees.length }}{{ selectedEvent.capacity ? '/' + selectedEvent.capacity : '' }}人</span>
            </div>
          </div>
          <div class="detail-tags">
            <span v-for="tag in selectedEvent.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>

          <div v-if="selectedEvent.pendingApplications.length > 0 && selectedEvent.hostId === authStore.currentUser?.phone" class="applications-section">
            <h4>报名申请 ({{ selectedEvent.pendingApplications.length }})</h4>
            <div class="applications-list">
              <div v-for="app in selectedEvent.pendingApplications" :key="app.userId" class="application-item">
                <div class="app-info">
                  <span class="app-name">{{ app.nickname }}</span>
                  <span class="app-message">{{ app.message || '无留言' }}</span>
                  <span class="app-time">{{ app.applyTime }}</span>
                </div>
                <div class="app-actions">
                  <button class="btn-accept" @click="handleConfirm(app.userId)">确认</button>
                  <button class="btn-reject" @click="handleReject(app.userId)">拒绝</button>
                </div>
              </div>
            </div>
          </div>

          <div class="attendees-section">
            <h4>已报名 ({{ selectedEvent.attendees.length }})</h4>
            <div class="attendees-list">
              <div v-for="attendee in selectedEvent.attendees.slice(0, 10)" :key="attendee.userId" class="attendee-item">
                <span class="attendee-avatar">👤</span>
                <span class="attendee-name">{{ attendee.nickname }}</span>
              </div>
              <div v-if="selectedEvent.attendees.length > 10" class="more-attendees">
                还有 {{ selectedEvent.attendees.length - 10 }} 人
              </div>
            </div>
          </div>

          <div class="detail-actions">
            <button class="btn-cancel" @click="showDetailModal = false">关闭</button>
            <button
              v-if="canApply(selectedEvent)"
              class="btn-apply"
              @click="showApplyModal = true"
            >
              报名参加
            </button>
            <button
              v-if="isAttending(selectedEvent)"
              class="btn-cancel-attend"
              @click="handleCancelAttendance"
            >
              取消报名
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showApplyModal" class="modal-overlay" @click.self="showApplyModal = false">
      <div class="modal-content">
        <h2>报名参加活动</h2>
        <form @submit.prevent="submitApplication">
          <div class="form-group">
            <label>留言 (可选)</label>
            <textarea v-model="applyForm.message" placeholder="说点什么..." rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showApplyModal = false">取消</button>
            <button type="submit" class="btn-submit">提交报名</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventStore } from '../stores/event'
import { useAuthStore } from '../stores/auth'

const eventStore = useEventStore()
const authStore = useAuthStore()

const currentTab = ref('discover')
const statusFilter = ref('all')
const typeFilter = ref('all')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const showApplyModal = ref(false)
const showManageModal = ref(false)
const selectedEvent = ref(null)
const tagsInput = ref('')

const newEvent = ref({
  title: '',
  type: 'gathering',
  description: '',
  eventDate: '',
  eventTime: '',
  duration: '',
  venue: '',
  address: '',
  capacity: null,
  ticketPrice: 0
})

const applyForm = ref({
  message: ''
})

const filteredEvents = computed(() => {
  let events = eventStore.events

  if (statusFilter.value !== 'all') {
    events = events.filter(e => e.status === statusFilter.value)
  }

  if (typeFilter.value !== 'all') {
    events = events.filter(e => e.type === typeFilter.value)
  }

  return events
})

const myEvents = computed(() => {
  if (!authStore.currentUser?.phone) return []
  const userId = authStore.currentUser.phone
  return eventStore.events.filter(e =>
    e.hostId === userId || e.attendees.some(a => a.userId === userId)
  )
})

function canApply(event) {
  if (!authStore.isLoggedIn || event.status === 'completed' || event.status === 'cancelled') return false
  if (event.hostId === authStore.currentUser?.phone) return false
  if (event.attendees.some(a => a.userId === authStore.currentUser?.phone)) return false
  if (event.pendingApplications.some(a => a.userId === authStore.currentUser?.phone)) return false
  return true
}

function isAttending(event) {
  if (!authStore.currentUser?.phone) return false
  return event.attendees.some(a => a.userId === authStore.currentUser.phone)
}

function isHost(event) {
  if (!authStore.currentUser?.phone) return false
  return event.hostId === authStore.currentUser.phone
}

function viewEvent(event) {
  selectedEvent.value = event
  showDetailModal.value = true
  showApplyModal.value = false
}

function createEvent() {
  if (!authStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t)

  eventStore.createEvent({
    ...newEvent.value,
    hostId: authStore.currentUser.phone,
    hostName: authStore.currentUser.nickname,
    tags
  })

  showCreateModal.value = false
  newEvent.value = {
    title: '',
    type: 'gathering',
    description: '',
    eventDate: '',
    eventTime: '',
    duration: '',
    venue: '',
    address: '',
    capacity: null,
    ticketPrice: 0
  }
  tagsInput.value = ''
  currentTab.value = 'my-events'
}

function handleConfirm(userId) {
  if (!selectedEvent.value) return
  eventStore.confirmAttendance(selectedEvent.value.id, userId)
  selectedEvent.value = eventStore.getEventById(selectedEvent.value.id)
}

function handleReject(userId) {
  if (!selectedEvent.value) return
  eventStore.rejectApplication(selectedEvent.value.id, userId)
  selectedEvent.value = eventStore.getEventById(selectedEvent.value.id)
}

function submitApplication() {
  if (!selectedEvent.value || !authStore.currentUser) return

  const result = eventStore.applyForEvent(
    selectedEvent.value.id,
    authStore.currentUser.phone,
    authStore.currentUser.nickname,
    applyForm.value.message
  )

  if (result.success) {
    showApplyModal.value = false
    alert('报名申请已提交！')
    selectedEvent.value = eventStore.getEventById(selectedEvent.value.id)
    applyForm.value = { message: '' }
  } else {
    alert(result.message)
  }
}

function handleCancelAttendance() {
  if (!selectedEvent.value || !authStore.currentUser) return
  if (confirm('确定要取消报名吗？')) {
    eventStore.cancelAttendance(selectedEvent.value.id, authStore.currentUser.phone)
    selectedEvent.value = eventStore.getEventById(selectedEvent.value.id)
  }
}

onMounted(() => {
  eventStore.loadEvents()
})
</script>

<style scoped>
.event-page {
  max-width: 1200px;
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

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.controls {
  margin-bottom: 20px;
}

.create-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.tabs button.active {
  background: #1f2937;
  color: white;
  border-color: #1f2937;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.events-grid, .my-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.event-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.type-badge {
  font-size: 0.875rem;
  color: #6b7280;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  color: white;
  font-size: 0.875rem;
}

.event-card h3 {
  font-size: 1.125rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.card-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #374151;
}

.info-icon {
  font-size: 1rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #9ca3af;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.action-btn.primary {
  background: #f59e0b;
  color: white;
  border: none;
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
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
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

.detail-modal {
  max-width: 600px;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.detail-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

.detail-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-label {
  color: #6b7280;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  padding: 4px 12px;
  background: #f3f4f6;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #6b7280;
}

.applications-section, .attendees-section {
  margin-bottom: 20px;
}

.applications-section h4, .attendees-section h4 {
  margin-bottom: 12px;
  color: #374151;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.application-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.app-info {
  margin-bottom: 12px;
}

.app-name {
  font-weight: 500;
  display: block;
}

.app-message {
  display: block;
  color: #374151;
  font-size: 0.875rem;
  margin-top: 4px;
}

.app-time {
  display: block;
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 4px;
}

.app-actions {
  display: flex;
  gap: 8px;
}

.btn-accept, .btn-reject, .btn-apply, .btn-cancel-attend {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-accept {
  background: #10b981;
  color: white;
}

.btn-reject {
  background: #6b7280;
  color: white;
}

.btn-apply {
  background: #f59e0b;
  color: white;
}

.btn-cancel-attend {
  background: #ef4444;
  color: white;
}

.attendees-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.attendee-item {
  text-align: center;
}

.attendee-avatar {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.attendee-name {
  font-size: 0.75rem;
  color: #6b7280;
}

.more-attendees {
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
  padding-top: 8px;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
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
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
    gap: 20px;
  }

  .filter-bar {
    flex-direction: column;
  }

  .attendees-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
