<template>
  <div class="team-page">
    <div class="page-header">
      <h1> 组队项目</h1>
      <p>传媒行业同行组队制作项目找到志同道合的伙伴</p>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ teamStore.teamStats.total }}</span>
        <span class="stat-label">项目总数</span>
      </div>
      <div class="stat-item recruiting">
        <span class="stat-value">{{ teamStore.teamStats.recruiting }}</span>
        <span class="stat-label">招募中</span>
      </div>
      <div class="stat-item progress">
        <span class="stat-value">{{ teamStore.teamStats.inProgress }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-item completed">
        <span class="stat-value">{{ teamStore.teamStats.completed }}</span>
        <span class="stat-label">已完成</span>
      </div>
    </div>

    <div class="controls">
      <button class="create-btn" @click="showCreateModal = true" v-if="authStore.isLoggedIn && !authStore.isClient">
        + 创建项目
      </button>
    </div>

    <div class="tabs">
      <button :class="{ active: currentTab === 'discover' }" @click="currentTab = 'discover'">
         发现项目
      </button>
      <button :class="{ active: currentTab === 'my-projects' }" @click="currentTab = 'my-projects'" v-if="authStore.isLoggedIn">
         我的项目
      </button>
    </div>

    <div v-if="currentTab === 'discover'" class="projects-section">
      <div class="filter-bar">
        <select v-model="statusFilter" class="filter-select">
          <option value="all">全部状态</option>
          <option value="recruiting">招募中</option>
          <option value="in-progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      <div class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
          :class="project.status"
          @click="viewProject(project)"
        >
          <div class="card-header">
            <span class="status-badge" :style="{ backgroundColor: teamStore.projectStatuses[project.status]?.color }">
              {{ teamStore.projectStatuses[project.status]?.icon }} {{ teamStore.projectStatuses[project.status]?.label }}
            </span>
            <div v-if="authStore.isLoggedIn" class="match-badge" :class="getMatchLevel(project)">
              {{ getMatchScore(project) }}% 匹配
            </div>
          </div>
          <h3>{{ project.title }}</h3>
          <p class="card-description">{{ project.description }}</p>
          <div class="card-meta">
            <span> {{ project.budget }}</span>
            <span> {{ project.location }}</span>
            <span> {{ project.deadline }}</span>
          </div>
          <div class="project-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getProjectProgress(project.id) + '%' }"></div>
            </div>
            <span class="progress-text">招募进度: {{ getProjectProgress(project.id) }}%</span>
          </div>
          <div class="roles-needed">
            <span class="roles-label">需要角色</span>
            <div class="role-tags">
              <span
                v-for="role in project.requiredRoles"
                :key="role.role"
                class="role-tag"
                :class="{ filled: role.filled >= role.count }"
              >
                {{ teamStore.roleCategories[role.role]?.icon || '' }} {{ teamStore.roleCategories[role.role]?.label }}
                ({{ role.filled }}/{{ role.count }})
              </span>
            </div>
          </div>
          <div class="card-footer">
            <span class="creator"> {{ project.creatorName }}</span>
            <span class="members"> {{ project.members.length }}人已加入</span>
          </div>
        </div>
      </div>

      <div v-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无相关项目</p>
      </div>
    </div>

    <div v-if="currentTab === 'my-projects'" class="my-projects-section">
      <div class="my-projects-grid">
        <div
          v-for="project in myProjects"
          :key="project.id"
          class="project-card"
          :class="project.status"
        >
          <div class="card-header">
            <span class="status-badge" :style="{ backgroundColor: teamStore.projectStatuses[project.status]?.color }">
              {{ teamStore.projectStatuses[project.status]?.icon }} {{ teamStore.projectStatuses[project.status]?.label }}
            </span>
          </div>
          <h3>{{ project.title }}</h3>
          <p class="card-description">{{ project.description }}</p>
          <div class="card-actions">
            <button class="action-btn" @click="viewProject(project)">查看详情</button>
            <button v-if="project.creatorId === authStore.currentUser?.phone && project.status === 'recruiting'" class="action-btn primary" @click="showManageModal(project)">
              管理申请
            </button>
          </div>
        </div>
      </div>

      <div v-if="myProjects.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>你还没有参与或创建的项目</p>
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content">
        <h2>创建新项目</h2>
        <form @submit.prevent="createProject">
          <div class="form-group">
            <label>项目名称</label>
            <input v-model="newProject.title" type="text" placeholder="如品牌微电影项目" required />
          </div>
          <div class="form-group">
            <label>项目描述</label>
            <textarea v-model="newProject.description" placeholder="详细描述项目内容..." rows="3" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>预算范围</label>
              <input v-model="newProject.budget" type="text" placeholder="如50,000 - 80,000" />
            </div>
            <div class="form-group">
              <label>项目地点</label>
              <input v-model="newProject.location" type="text" placeholder="如上海/线上" />
            </div>
          </div>
          <div class="form-group">
            <label>截止日期</label>
            <input v-model="newProject.deadline" type="date" required />
          </div>
          <div class="form-group">
            <label>需要的角色</label>
            <div class="roles-checkboxes">
              <label v-for="(cat, key) in teamStore.roleCategories" :key="key" class="checkbox-label">
                <input type="checkbox" :value="key" v-model="selectedRoles" />
                {{ cat.icon }} {{ cat.label }}
              </label>
            </div>
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
        <div v-if="selectedProject">
          <div class="detail-header">
            <span class="status-badge large" :style="{ backgroundColor: teamStore.projectStatuses[selectedProject.status]?.color }">
              {{ teamStore.projectStatuses[selectedProject.status]?.icon }} {{ teamStore.projectStatuses[selectedProject.status]?.label }}
            </span>
          </div>
          <h2>{{ selectedProject.title }}</h2>
          <p class="detail-description">{{ selectedProject.description }}</p>
          <div class="detail-meta">
            <div class="meta-row">
              <span> 预算:</span>
              <span>{{ selectedProject.budget }}</span>
            </div>
            <div class="meta-row">
              <span> 地点:</span>
              <span>{{ selectedProject.location }}</span>
            </div>
            <div class="meta-row">
              <span> 截止:</span>
              <span>{{ selectedProject.deadline }}</span>
            </div>
            <div class="meta-row">
              <span> 创建</span>
              <span>{{ selectedProject.creatorName }}</span>
            </div>
          </div>

          <div class="roles-section">
            <h4>所需角色</h4>
            <div class="roles-list">
              <div v-for="role in selectedProject.requiredRoles" :key="role.role" class="role-item">
                <span class="role-info">
                  {{ teamStore.roleCategories[role.role]?.icon }} {{ teamStore.roleCategories[role.role]?.label }}
                </span>
                <span class="role-count" :class="{ filled: role.filled >= role.count }">
                  {{ role.filled }}/{{ role.count }}
                </span>
              </div>
            </div>
          </div>

          <div class="members-section">
            <h4>团队成员 ({{ selectedProject.members.length }})</h4>
            <div class="members-list">
              <div v-for="member in selectedProject.members" :key="member.userId" class="member-item">
                <span class="member-avatar"></span>
                <span class="member-name">{{ member.nickname }}</span>
                <span class="member-role">{{ teamStore.roleCategories[member.role]?.icon }} {{ teamStore.roleCategories[member.role]?.label }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedProject.applications.length > 0 && selectedProject.creatorId === authStore.currentUser?.phone" class="applications-section">
            <h4>申请列表 ({{ selectedProject.applications.length }})</h4>
            <div class="applications-list">
              <div v-for="app in selectedProject.applications" :key="app.userId" class="application-item">
                <div class="app-info">
                  <span class="app-name">{{ app.nickname }}</span>
                  <span class="app-role">申请: {{ teamStore.roleCategories[app.appliedRole]?.icon }} {{ teamStore.roleCategories[app.appliedRole]?.label }}</span>
                  <span class="app-message">{{ app.message }}</span>
                </div>
                <div class="app-actions">
                  <button class="btn-accept" @click="handleAccept(app.userId)">接受</button>
                  <button class="btn-reject" @click="handleReject(app.userId)">拒绝</button>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-actions">
            <button class="btn-cancel" @click="showDetailModal = false">关闭</button>
            <button
              v-if="selectedProject.status === 'recruiting' && authStore.isLoggedIn && !isProjectMember(selectedProject) && !isProjectCreator(selectedProject)"
              class="btn-apply"
              @click="showApplyModal = true"
            >
              申请加入
            </button>
            <button
              v-if="isProjectMember(selectedProject) && !isProjectCreator(selectedProject)"
              class="btn-leave"
              @click="handleLeave"
            >
              离开项目
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showApplyModal" class="modal-overlay" @click.self="showApplyModal = false">
      <div class="modal-content">
        <h2>申请加入项目</h2>
        <form @submit.prevent="submitApplication">
          <div class="form-group">
            <label>选择角色</label>
            <select v-model="applyForm.role" required>
              <option v-for="role in availableRoles" :key="role.role" :value="role.role">
                {{ teamStore.roleCategories[role.role]?.icon }} {{ teamStore.roleCategories[role.role]?.label }}
                ({{ role.count - role.filled }}个空
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>申请留言</label>
            <textarea v-model="applyForm.message" placeholder="介绍一下自.." rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showApplyModal = false">取消</button>
            <button type="submit" class="btn-submit">提交申请</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeamStore } from '@/stores'
import { useAuthStore } from '@/stores'

const teamStore = useTeamStore()
const authStore = useAuthStore()

const currentTab = ref('discover')
const statusFilter = ref('all')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const showApplyModal = ref(false)
const selectedProject = ref(null)
const selectedRoles = ref([])

const newProject = ref({
  title: '',
  description: '',
  budget: '',
  location: '',
  deadline: ''
})

const applyForm = ref({
  role: '',
  message: ''
})

const filteredProjects = computed(() => {
  let projects = teamStore.teamProjects
  if (statusFilter.value !== 'all') {
    projects = projects.filter(p => p.status === statusFilter.value)
  }
  return projects
})

const myProjects = computed(() => {
  if (!authStore.currentUser?.phone) return []
  const userId = authStore.currentUser.phone
  return teamStore.teamProjects.filter(p =>
    p.creatorId === userId || p.members.some(m => m.userId === userId)
  )
})

const availableRoles = computed(() => {
  if (!selectedProject.value) return []
  return teamStore.getAvailableRoles(selectedProject.value.id)
})

function isProjectMember(project) {
  if (!authStore.currentUser?.phone) return false
  return project.members.some(m => m.userId === authStore.currentUser.phone)
}

function isProjectCreator(project) {
  if (!authStore.currentUser?.phone) return false
  return project.creatorId === authStore.currentUser.phone
}

function viewProject(project) {
  selectedProject.value = project
  showDetailModal.value = true
  showApplyModal.value = false
}

function createProject() {
  if (!authStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  const requiredRoles = selectedRoles.value.map(role => ({
    role,
    count: 1,
    filled: 0
  }))

  teamStore.createTeamProject({
    ...newProject.value,
    creatorId: authStore.currentUser.phone,
    creatorName: authStore.currentUser.nickname,
    requiredRoles
  })

  showCreateModal.value = false
  newProject.value = {
    title: '',
    description: '',
    budget: '',
    location: '',
    deadline: ''
  }
  selectedRoles.value = []
  currentTab.value = 'my-projects'
}

function handleAccept(userId) {
  if (!selectedProject.value) return
  teamStore.acceptApplication(selectedProject.value.id, userId)
  selectedProject.value = teamStore.getTeamProjectById(selectedProject.value.id)
}

function handleReject(userId) {
  if (!selectedProject.value) return
  teamStore.rejectApplication(selectedProject.value.id, userId)
  selectedProject.value = teamStore.getTeamProjectById(selectedProject.value.id)
}

function submitApplication() {
  if (!selectedProject.value || !authStore.currentUser) return

  const result = teamStore.applyForProject(
    selectedProject.value.id,
    authStore.currentUser.phone,
    authStore.currentUser.nickname,
    applyForm.value.role,
    applyForm.value.message
  )

  if (result.success) {
    showApplyModal.value = false
    alert('申请已提交')
    applyForm.value = { role: '', message: '' }
  } else {
    alert(result.message)
  }
}

function handleLeave() {
  if (!selectedProject.value || !authStore.currentUser) return
  if (confirm('确定要离开这个项目吗')) {
    teamStore.leaveProject(selectedProject.value.id, authStore.currentUser.phone)
    showDetailModal.value = false
  }
}

function getProjectProgress(projectId) {
  return teamStore.calculateProjectProgress(projectId)
}

function getMatchScore(project) {
  if (!authStore.isLoggedIn || !authStore.currentUser) return 0
  const userSkills = authStore.currentUser.skills || []
  const match = teamStore.calculateRoleMatch(project, userSkills)
  return match.score
}

function getMatchLevel(project) {
  const score = getMatchScore(project)
  if (score >= 80) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

onMounted(() => {
  teamStore.loadTeamProjects()
})
</script>

<style scoped>
.team-page {
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
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
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
  margin-bottom: 20px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.projects-grid, .my-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
}

.card-header {
  margin-bottom: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  color: white;
  font-size: 0.875rem;
}

.project-card h3 {
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

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 12px;
}

.roles-needed {
  margin-bottom: 12px;
}

.roles-label {
  font-size: 0.875rem;
  color: #6b7280;
  display: block;
  margin-bottom: 8px;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-tag {
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 12px;
  font-size: 0.75rem;
}

.role-tag.filled {
  background: #d1fae5;
  color: #065f46;
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
  background: #3b82f6;
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
  margin-bottom: 16px;
}

.status-badge.large {
  font-size: 1rem;
  padding: 6px 16px;
}

.detail-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

.detail-meta {
  margin-bottom: 20px;
}

.meta-row {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.roles-section, .members-section, .applications-section {
  margin-bottom: 20px;
}

.roles-section h4, .members-section h4, .applications-section h4 {
  margin-bottom: 12px;
  color: #374151;
}

.roles-list, .members-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-item, .member-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.role-count.filled {
  color: #10b981;
}

.member-item {
  align-items: center;
}

.member-avatar {
  font-size: 1.5rem;
  margin-right: 8px;
}

.member-name {
  flex: 1;
}

.member-role {
  color: #6b7280;
  font-size: 0.875rem;
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

.app-role {
  color: #6b7280;
  font-size: 0.875rem;
}

.app-message {
  display: block;
  color: #374151;
  font-size: 0.875rem;
  margin-top: 4px;
}

.app-actions {
  display: flex;
  gap: 8px;
}

.btn-accept, .btn-reject, .btn-apply, .btn-leave {
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
  background: #3b82f6;
  color: white;
}

.btn-leave {
  background: #ef4444;
  color: white;
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

.roles-checkboxes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
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
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
    gap: 20px;
  }

  .roles-checkboxes {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

