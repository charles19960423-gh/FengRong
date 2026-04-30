<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>⚙️ 设置中心</h1>
      <p>管理您的账户和偏好设置</p>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
        👤 个人信息
      </button>
      <button :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
        🔐 安全设置
      </button>
      <button :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">
        🔔 通知设置
      </button>
      <button :class="{ active: activeTab === 'privacy' }" @click="activeTab = 'privacy'">
        🔒 隐私设置
      </button>
    </div>

    <div v-if="activeTab === 'profile'" class="settings-section">
      <div class="section-title">基本信息</div>
      <div class="form-group">
        <label>头像</label>
        <div class="avatar-upload">
          <div class="avatar-preview">{{ authStore.currentUser?.avatar || '👤' }}</div>
          <button class="upload-btn">更换头像</button>
        </div>
      </div>
      <div class="form-group">
        <label>昵称</label>
        <input v-model="profileForm.nickname" type="text" placeholder="请输入昵称" />
      </div>
      <div class="form-group">
        <label>邮箱</label>
        <input v-model="profileForm.email" type="email" placeholder="请输入邮箱" />
      </div>
      <div class="form-group">
        <label>手机号</label>
        <input :value="authStore.currentUser?.phone" type="text" disabled />
        <span class="disabled-hint">手机号不可修改</span>
      </div>
      <div class="form-group">
        <label>职业</label>
        <select v-model="profileForm.job">
          <option value="">请选择职业</option>
          <option value="photographer">摄影师</option>
          <option value="editor">剪辑师</option>
          <option value="director">导演</option>
          <option value="producer">制片人</option>
          <option value="writer">编剧</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div class="form-group">
        <label>简介</label>
        <textarea v-model="profileForm.bio" placeholder="介绍一下自己"></textarea>
      </div>
      <button class="save-btn" @click="saveProfile">保存修改</button>
    </div>

    <div v-if="activeTab === 'security'" class="settings-section">
      <div class="section-title">安全设置</div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-icon">🔑</div>
          <div class="setting-text">
            <span class="setting-name">修改密码</span>
            <span class="setting-desc">定期更换密码，保护账户安全</span>
          </div>
        </div>
        <button class="setting-action" @click="showChangePassword = true">修改</button>
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-icon">📱</div>
          <div class="setting-text">
            <span class="setting-name">绑定手机号</span>
            <span class="setting-desc">{{ authStore.currentUser?.phone || '未绑定' }}</span>
          </div>
        </div>
        <span class="setting-status" v-if="authStore.currentUser?.phone">已绑定</span>
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-icon">🔄</div>
          <div class="setting-text">
            <span class="setting-name">账号安全等级</span>
            <span class="setting-desc">当前安全等级: {{ securityLevel }}</span>
          </div>
        </div>
        <div class="security-bar">
          <div class="security-progress" :style="{ width: securityProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'notifications'" class="settings-section">
      <div class="section-title">通知设置</div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">🔔</div>
          <div class="setting-text">
            <span class="setting-name">系统通知</span>
            <span class="setting-desc">接收平台系统消息</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="notificationSettings.system" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">📋</div>
          <div class="setting-text">
            <span class="setting-name">任务通知</span>
            <span class="setting-desc">接收任务相关消息</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="notificationSettings.task" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">👥</div>
          <div class="setting-text">
            <span class="setting-name">组队邀请</span>
            <span class="setting-desc">接收组队邀请通知</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="notificationSettings.team" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">🎪</div>
          <div class="setting-text">
            <span class="setting-name">活动提醒</span>
            <span class="setting-desc">接收活动相关消息</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="notificationSettings.event" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">💬</div>
          <div class="setting-text">
            <span class="setting-name">私信通知</span>
            <span class="setting-desc">接收私信消息</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="notificationSettings.private" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <button class="save-btn" @click="saveNotificationSettings">保存设置</button>
    </div>

    <div v-if="activeTab === 'privacy'" class="settings-section">
      <div class="section-title">隐私设置</div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">👁️</div>
          <div class="setting-text">
            <span class="setting-name">公开资料</span>
            <span class="setting-desc">允许其他用户查看您的个人资料</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="privacySettings.publicProfile" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">🔍</div>
          <div class="setting-text">
            <span class="setting-name">允许被搜索</span>
            <span class="setting-desc">允许其他用户通过手机号或昵称找到您</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="privacySettings.allowSearch" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item toggle-item">
        <div class="setting-info">
          <div class="setting-icon">🔔</div>
          <div class="setting-text">
            <span class="setting-name">允许陌生人私信</span>
            <span class="setting-desc">允许非好友用户向您发送私信</span>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="privacySettings.allowStrangerMessage" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-icon">🗑️</div>
          <div class="setting-text">
            <span class="setting-name">清除缓存</span>
            <span class="setting-desc">清除本地缓存数据</span>
          </div>
        </div>
        <button class="setting-action danger" @click="clearCache">清除</button>
      </div>
      <button class="save-btn" @click="savePrivacySettings">保存设置</button>
    </div>

    <div v-if="showChangePassword" class="modal-overlay" @click.self="showChangePassword = false">
      <div class="modal-content">
        <button class="close-btn" @click="showChangePassword = false">×</button>
        <h3>修改密码</h3>
        <div class="form-group">
          <label>原密码</label>
          <input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
        </div>
        <div class="form-group">
          <label>新密码</label>
          <input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
        </div>
        <div class="form-group">
          <label>确认新密码</label>
          <input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </div>
        <button class="save-btn" @click="changePassword">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const activeTab = ref('profile')
const showChangePassword = ref(false)

const profileForm = reactive({
  nickname: '',
  email: '',
  job: '',
  bio: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationSettings = reactive({
  system: true,
  task: true,
  team: true,
  event: true,
  private: true
})

const privacySettings = reactive({
  publicProfile: true,
  allowSearch: true,
  allowStrangerMessage: true
})

onMounted(() => {
  if (authStore.currentUser) {
    profileForm.nickname = authStore.currentUser.nickname || ''
    profileForm.email = authStore.currentUser.email || ''
    profileForm.job = authStore.currentUser.job || ''
    profileForm.bio = authStore.currentUser.bio || ''
  }
})

const securityLevel = computed(() => {
  let level = 0
  if (authStore.currentUser?.phone) level++
  if (authStore.currentUser?.email) level++
  if (authStore.currentUser?.vipLevel > 1) level++
  
  if (level >= 3) return '高'
  if (level >= 2) return '中'
  return '低'
})

const securityProgress = computed(() => {
  let level = 0
  if (authStore.currentUser?.phone) level++
  if (authStore.currentUser?.email) level++
  if (authStore.currentUser?.vipLevel > 1) level++
  return (level / 3) * 100
})

function saveProfile() {
  if (!authStore.currentUser) return
  
  authStore.updateUser({
    ...authStore.currentUser,
    nickname: profileForm.nickname,
    email: profileForm.email,
    job: profileForm.job,
    bio: profileForm.bio
  })
  
  alert('个人信息已更新')
}

function changePassword() {
  if (!passwordForm.oldPassword) {
    alert('请输入原密码')
    return
  }
  if (!passwordForm.newPassword) {
    alert('请输入新密码')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  alert('密码修改成功')
  showChangePassword.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

function saveNotificationSettings() {
  alert('通知设置已保存')
}

function savePrivacySettings() {
  alert('隐私设置已保存')
}

function clearCache() {
  if (confirm('确定要清除缓存吗？')) {
    localStorage.clear()
    alert('缓存已清除')
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 600px;
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
  background: #6b7280;
  color: white;
  border-color: #6b7280;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-group input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
}

.disabled-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.upload-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  gap: 12px;
}

.setting-icon {
  font-size: 1.25rem;
}

.setting-text {
  display: flex;
  flex-direction: column;
}

.setting-name {
  font-weight: 500;
  color: #1f2937;
}

.setting-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 2px;
}

.setting-action {
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.setting-action.danger {
  background: #fee2e2;
  color: #ef4444;
}

.setting-status {
  font-size: 0.875rem;
  color: #10b981;
}

.security-bar {
  width: 100px;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.security-progress {
  height: 100%;
  background: #10b981;
  border-radius: 3px;
  transition: width 0.3s;
}

.toggle {
  position: relative;
  width: 48px;
  height: 26px;
  cursor: pointer;
}

.toggle input {
  display: none;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #d1d5db;
  border-radius: 13px;
  transition: background 0.3s;
}

.toggle-slider::before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: #3b82f6;
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(22px);
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
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: #1f2937;
}

@media (max-width: 640px) {
  .setting-item {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
