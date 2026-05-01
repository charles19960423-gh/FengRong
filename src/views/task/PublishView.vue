<template>
  <div class="publish-page">
    <div v-if="authStore.isClient" class="client-redirect">
      <div class="redirect-card">
        <div class="redirect-icon"></div>
        <h2>欢迎{{ authStore.currentUser?.companyName }}</h2>
        <p>客户用户请点击下方按钮进入任务发布页面</p>
        <button class="redirect-btn" @click="goToClientConsole">
           进入客户控制台
        </button>
      </div>
    </div>

    <template v-else>
    <div class="page-header" :class="{ 'edit-mode': isEditMode }">
      <div class="header-row">
        <div>
          <h1>
            {{ isEditMode ? ' 编辑任务委托' : ' 发布新任务委托' }}
          </h1>
          <p>
            {{ isEditMode ? '修改任务信息注意有人报名后会限制可编辑字段' : '填写任务信息发布你的悬赏委托' }}
          </p>
        </div>
        <button v-if="isEditMode" class="exit-edit-btn" @click="exitEditMode">
          ← 返回
        </button>
      </div>
      <div v-if="isEditMode && editPermission.reason" class="edit-permission-tip">
         {{ editPermission.reason }}
      </div>
    </div>

    <div class="publish-form-container">
      <div class="form-tabs">
        <button 
          v-for="tab in publishTabs" 
          :key="tab.value"
          class="tab-btn"
          :class="{ active: form.publishType === tab.value }"
          @click="form.publishType = tab.value"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <form @submit.prevent="submitForm" class="publish-form">
        <div class="form-section">
          <h2 class="section-title"> 基本信息</h2>
          
          <div class="form-group">
            <label>任务标题 / Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="如产品发布会活动执行"
              @blur="validateTitle"
            />
            <span v-if="errors.title" class="error-text"> {{ errors.title }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>悬赏奖励方式</label>
              <select v-model="form.rewardType" @change="calculateTotalCost">
                <option value="gold"> 金币</option>
                <option value="pearl"> 淡水珍珠</option>
              </select>
            </div>
            <div class="form-group">
              <label>奖励金额/数量</label>
              <input 
                v-model="form.rewardAmount" 
                type="number" 
                placeholder="输入奖励数量"
                @input="calculateTotalCost"
              />
              <span v-if="errors.rewardAmount" class="error-text"> {{ errors.rewardAmount }}</span>
            </div>
          </div>

          <div class="cost-preview">
            <div class="cost-row">
              <span>基础奖励</span>
              <span>{{ getRewardText(form.rewardAmount) }}</span>
            </div>
            <div v-if="form.isUrgent" class="cost-row urgent">
              <span>加急费用(+20%)</span>
              <span>+{{ getRewardText(Math.floor(parseInt(form.rewardAmount) * 0.2)) }}</span>
            </div>
            <div class="cost-row total">
              <span>总费用</span>
              <span class="total-amount">{{ getRewardText(totalCost) }}</span>
            </div>
            <div class="balance-info">
              <span v-if="form.rewardType === 'gold'">当前金币: {{ authStore.currentUser?.coins || 0 }}</span>
              <span v-else>当前珍珠: {{ authStore.currentUser?.pearls || 0 }}</span>
              <span :class="{ warning: !canAfford }">
                {{ canAfford ? '?余额充足' : '?余额不足' }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>任务难度等级</label>
            <select v-model="form.difficulty">
              <option value="normal">普通 - 入门任务</option>
              <option value="good">精良 - 标准任务</option>
              <option value="epic">史诗 - 高级任务</option>
              <option value="legendary">传说 - 史诗级挑战</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title"> 任务详情</h2>
          
          <div class="form-group">
            <label>任务描述 / Details</label>
            <textarea 
              v-model="form.description" 
              placeholder="请描述任务内容要求时间需.."
              rows="6"
              @blur="validateDescription"
            ></textarea>
            <span v-if="errors.description" class="error-text"> {{ errors.description }}</span>
            <span class="char-count">{{ form.description.length }}/500</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>任务地点</label>
              <input 
                v-model="form.location" 
                type="text" 
                placeholder="如迷雾森林 / 线上远程"
                @blur="validateLocation"
              />
              <span v-if="errors.location" class="error-text"> {{ errors.location }}</span>
            </div>
            <div class="form-group">
              <label>截止日期</label>
              <input 
                v-model="form.deadline" 
                type="date" 
                @blur="validateDeadline"
              />
              <span v-if="errors.deadline" class="error-text"> {{ errors.deadline }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>合作方式</label>
            <select v-model="form.cooperationType">
              <option value="project"> 3天项目制 (推荐)</option>
              <option value="long-term"> 长期合作</option>
              <option value="specified"> 指定对接</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">?高级选项</h2>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.isUrgent" @change="calculateTotalCost" />
              <span class="checkbox-icon"></span>
              <span>加急 4h 优先处理</span>
              <span class="fee-hint">(+20%费用)</span>
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.allowShare" />
              <span class="checkbox-icon"></span>
              <span>允许分享此任务</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <template v-if="!isEditMode">
            <button type="button" class="action-btn secondary" @click="showPreview = true">
              ?预览
            </button>
            <button type="button" class="action-btn secondary" @click="resetForm">
              ?重置
            </button>
            <button type="submit" class="action-btn primary" :disabled="isSubmitting || !canAfford || !isFormValid">
              {{ isSubmitting ? '?发布..' : ' 发布任务' }}
            </button>
          </template>
          <template v-else>
            <button type="button" class="action-btn secondary" @click="exitEditMode">
               取消
            </button>
            <button type="button" class="action-btn primary" @click="submitEdit" :disabled="!editPermission.canEdit">
               保存修改
            </button>
          </template>
        </div>
      </form>
    </div>

    <div class="tips-section">
      <h3>发布小贴士</h3>
      <ul class="tips-list">
        <li>任务标题要清晰明确便于冒险者快速理解</li>
        <li>合理的奖励能吸引更多优秀的冒险者</li>
        <li>详细的任务描述能减少沟通成本</li>
        <li>加急服务需要额外支付20%的费用</li>
      </ul>
    </div>

    <!-- 预览弹窗 -->
    <div v-if="showPreview" class="modal-overlay" @click.self="showPreview = false">
      <div class="modal-content preview-modal">
        <div class="modal-header">
          <h3>任务预览</h3>
          <button class="close-btn" @click="showPreview = false">×</button>
        </div>
        <div class="preview-body">
          <div class="preview-title">{{ form.title || '未填写标题' }}</div>
          <div class="preview-meta">
            <span>{{ getDifficultyText() }}</span>
            <span>{{ form.location || '未填写' }}</span>
            <span>📅 {{ form.deadline || '未设置' }}</span>
          </div>
          <div class="preview-reward">
             奖励: {{ getRewardText(totalCost) }}
          </div>
          <div class="preview-description">
            {{ form.description || '未填写描述' }}
          </div>
          <div class="preview-tags">
            <span v-if="form.isUrgent" class="tag urgent">⚡ 加急</span>
            <span v-if="form.allowShare" class="tag share">可分享</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn secondary" @click="showPreview = false">返回编辑</button>
          <button class="action-btn primary" @click="submitFormFromPreview">确认发布</button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores'
import { useTaskStore } from '@/stores'
import { useTransactionStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const transactionStore = useTransactionStore()

onMounted(() => {
  if (route.query.edit) {
    initEditMode(route.query.edit)
  }
})

const isSubmitting = ref(false)
const showPreview = ref(false)
const totalCost = ref(0)

const errors = reactive({
  title: '',
  rewardAmount: '',
  description: '',
  location: '',
  deadline: ''
})

const publishTabs = [
  { value: 'task', label: '任务委托', icon: '' },
  { value: 'team', label: '组队招募', icon: '' },
  { value: 'trade', label: '物品交易', icon: '' }
]

const form = reactive({
  publishType: 'task',
  title: '',
  rewardType: 'gold',
  rewardAmount: '',
  difficulty: 'normal',
  description: '',
  location: '',
  deadline: '',
  cooperationType: 'project',
  isUrgent: false,
  allowShare: true
})

const isEditMode = ref(false)
const editingTaskId = ref(null)
const editPermission = ref({ canEdit: false, editableFields: [] })

const canAfford = computed(() => {
  if (!form.rewardAmount || totalCost.value <= 0) return true
  if (form.rewardType === 'gold') {
    return totalCost.value <= (authStore.currentUser?.coins || 0)
  } else {
    return totalCost.value <= (authStore.currentUser?.pearls || 0)
  }
})

const isFormValid = computed(() => {
  return form.title.trim() && 
         form.rewardAmount && 
         parseInt(form.rewardAmount) > 0 && 
         form.description.trim() && 
         form.location.trim() && 
         form.deadline
})

watch(form, () => {
  saveDraft()
}, { deep: true })

function saveDraft() {
  const draft = { ...form, savedAt: new Date().toISOString() }
  localStorage.setItem('publish_draft', JSON.stringify(draft))
}

function loadDraft() {
  const draft = localStorage.getItem('publish_draft')
  if (draft) {
    const saved = JSON.parse(draft)
    Object.assign(form, saved)
  }
}

loadDraft()

function calculateTotalCost() {
  const baseAmount = parseInt(form.rewardAmount) || 0
  let cost = baseAmount
  
  if (form.isUrgent) {
    cost = Math.floor(baseAmount * 1.2)
  }
  
  totalCost.value = cost
}

function getRewardText(amount) {
  const num = parseInt(amount) || 0
  const types = {
    gold: ` ${num.toLocaleString()} 金币`,
    pearl: ` ${num} 珍珠`
  }
  return types[form.rewardType] || ''
}

function getDifficultyText() {
  const diffs = {
    normal: '普通',
    good: '精良',
    epic: '史诗',
    legendary: '传说'
  }
  return diffs[form.difficulty] || ''
}

function validateTitle() {
  if (!form.title.trim()) {
    errors.title = '请输入任务标题'
  } else if (form.title.length < 5) {
    errors.title = '标题至少需要5个字符'
  } else {
    errors.title = ''
  }
}

function validateDescription() {
  if (!form.description.trim()) {
    errors.description = '请输入任务描述'
  } else if (form.description.length < 20) {
    errors.description = '描述至少需要20个字符'
  } else {
    errors.description = ''
  }
}

function validateLocation() {
  if (!form.location.trim()) {
    errors.location = '请输入任务地点'
  } else {
    errors.location = ''
  }
}

function validateDeadline() {
  if (!form.deadline) {
    errors.deadline = '请选择截止日期'
  } else {
    const today = new Date().toISOString().split('T')[0]
    if (form.deadline < today) {
      errors.deadline = '截止日期不能早于今天'
    } else {
      errors.deadline = ''
    }
  }
}

function deductAssets() {
  if (form.rewardType === 'gold') {
    return authStore.deductCoins(totalCost.value)
  } else {
    return authStore.deductPearls(totalCost.value)
  }
}

function addTransactionRecord(taskTitle) {
  transactionStore.addTransaction(
    'task',
    `发布任务: ${taskTitle}`,
    -totalCost.value,
    form.rewardType === 'gold' ? 'gold' : 'pearl'
  )
}

async function submitForm() {
  validateTitle()
  validateDescription()
  validateLocation()
  validateDeadline()

  if (!isFormValid.value) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请填写完整的任务信息', type: 'warning' }
    }))
    return
  }

  if (!canAfford.value) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: `${form.rewardType === 'gold' ? '金币' : '珍珠'}不足无法发布任务`, type: 'warning' }
    }))
    return
  }

  await doSubmit()
}

async function submitFormFromPreview() {
  showPreview.value = false
  await doSubmit()
}

function initEditMode(taskId) {
  const task = taskStore.getTaskById(taskId)
  if (!task) return
  
  editingTaskId.value = taskId
  isEditMode.value = true
  
  editPermission.value = taskStore.canEditTask(task, authStore.currentUser)
  
  if (!editPermission.value.canEdit) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: editPermission.value.reason, type: 'warning' }
    }))
    return
  }
  
  form.title = task.title || ''
  form.description = task.description || ''
  form.location = task.location || ''
  form.deadline = task.deadline || ''
  form.rewardType = task.rewardType || 'gold'
  form.rewardAmount = task.rewardAmount || ''
  form.difficulty = task.difficulty || 'normal'
  form.isUrgent = task.isUrgent || false
  form.requiredIdentity = task.requiredIdentity || ''
}

function exitEditMode() {
  isEditMode.value = false
  editingTaskId.value = null
  resetForm()
}

async function submitEdit() {
  if (!authStore.isLoggedIn || !editingTaskId.value) return
  
  const updates = {}
  
  if (editPermission.value.editableFields.includes('all')) {
    Object.assign(updates, {
      title: form.title,
      description: form.description,
      location: form.location,
      deadline: form.deadline,
      rewardType: form.rewardType,
      rewardAmount: form.rewardAmount,
      difficulty: form.difficulty,
      requiredIdentity: form.requiredIdentity
    })
  } else {
    if (editPermission.value.editableFields.includes('description')) {
      updates.description = form.description
    }
    if (editPermission.value.editableFields.includes('isUrgent')) {
      updates.isUrgent = form.isUrgent
    }
  }
  
  const result = taskStore.updateTask(editingTaskId.value, updates, authStore.currentUser)
  
  if (result.success) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'success' }
    }))
    exitEditMode()
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'error' }
    }))
  }
}

async function doSubmit() {
  if (!authStore.isLoggedIn) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请先登录再发布任务', type: 'warning' }
    }))
    return
  }

  isSubmitting.value = true

  try {
    if (!deductAssets()) {
      throw new Error('资产扣除失败')
    }

    const newTask = {
      title: form.title,
      reward: getRewardText(totalCost.value),
      rewardType: form.rewardType,
      rewardAmount: totalCost.value,
      deadline: form.deadline,
      description: form.description,
      location: form.location,
      difficulty: form.difficulty,
      difficultyText: getDifficultyText(),
      cooperationType: form.cooperationType,
      isUrgent: form.isUrgent,
      allowShare: form.allowShare,
      publisherId: authStore.currentUser.phone,
      publisherName: authStore.currentUser.nickname
    }

    taskStore.addTask(newTask)
    addTransactionRecord(form.title)

    localStorage.removeItem('publish_draft')

    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '任务发布成功', type: 'success' }
    }))

    router.push('/tasks')
  } catch (error) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '发布失败请重试', type: 'error' }
    }))
  } finally {
    isSubmitting.value = false
  }
}

function goToClientConsole() {
  router.push('/client-console')
}

function resetForm() {
  form.publishType = 'task'
  form.title = ''
  form.rewardType = 'gold'
  form.rewardAmount = ''
  form.difficulty = 'normal'
  form.description = ''
  form.location = ''
  form.deadline = ''
  form.cooperationType = 'project'
  form.isUrgent = false
  form.allowShare = true
  totalCost.value = 0
  Object.keys(errors).forEach(key => errors[key] = '')
  localStorage.removeItem('publish_draft')
}
</script>

<style scoped>
.publish-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.client-redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.redirect-card {
  background: white;
  border-radius: 20px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.redirect-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.redirect-card h2 {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.redirect-card p {
  color: #6b7280;
  margin-bottom: 24px;
}

.redirect-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.redirect-btn:hover {
  transform: translateY(-2px);
}

.page-header {
  text-align: center;
  margin: 30px 0;
}

.page-header.edit-mode {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 10px;
  padding: 20px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.exit-edit-btn {
  background: #444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.exit-edit-btn:hover {
  background: #555;
}

.edit-permission-tip {
  margin-top: 15px;
  padding: 12px;
  background: rgba(255, 165, 0, 0.15);
  border: 1px solid rgba(255, 165, 0, 0.4);
  border-radius: 8px;
  color: #ffd700;
  font-size: 14px;
}

.page-header h1 {
  color: #D4AF37;
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.page-header p {
  color: #888;
}

.publish-form-container {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 15px;
  padding: 30px;
  border: 2px solid #8C2B1B;
}

.form-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #444;
}

.tab-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #444;
  border-radius: 8px;
  color: #D4C39E;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #D4AF37;
}

.tab-btn.active {
  background: #D4AF37;
  color: #1A120B;
  border-color: #D4AF37;
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  padding-bottom: 25px;
  border-bottom: 1px solid #444;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  color: #D4AF37;
  font-size: 1.3rem;
  margin: 0 0 20px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  color: #D4C39E;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 8px;
  color: #D4C39E;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #D4AF37;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.error-text {
  display: block;
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 5px;
}

.char-count {
  display: block;
  text-align: right;
  color: #666;
  font-size: 0.85rem;
  margin-top: 5px;
}

.cost-preview {
  background: rgba(0,0,0,0.3);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #D4C39E;
}

.cost-row.urgent {
  color: #ff9f43;
}

.cost-row.total {
  border-top: 1px dashed #444;
  margin-top: 5px;
  padding-top: 12px;
}

.total-amount {
  font-size: 1.2rem;
  font-weight: bold;
  color: #D4AF37;
}

.balance-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #444;
  font-size: 0.9rem;
}

.balance-info .warning {
  color: #ff6b6b;
}

.checkbox-group {
  margin-bottom: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  color: #D4C39E;
}

.checkbox-label:hover {
  background: rgba(140,43,27,0.3);
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-icon {
  font-size: 1.2rem;
}

.fee-hint {
  margin-left: auto;
  color: #ff9f43;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.primary {
  background: #D4AF37;
  color: #1A120B;
}

.action-btn.primary:hover:not(:disabled) {
  background: #B89500;
}

.action-btn.secondary {
  background: #444;
  color: #D4C39E;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #555;
}

.tips-section {
  margin-top: 30px;
  padding: 25px;
  background: rgba(140,43,27,0.1);
  border-radius: 12px;
}

.tips-section h3 {
  color: #D4AF37;
  margin: 0 0 15px 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tips-list li {
  color: #888;
  padding: 8px 0;
  border-bottom: 1px dashed #444;
}

.tips-list li:last-child {
  border-bottom: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 15px;
  border: 2px solid #8C2B1B;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #444;
}

.modal-header h3 {
  color: #D4AF37;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #D4AF37;
}

.preview-body {
  padding: 25px;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #D4AF37;
  margin-bottom: 15px;
}

.preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  color: #888;
}

.preview-reward {
  background: rgba(212,175,55,0.1);
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #D4AF37;
}

.preview-description {
  color: #D4C39E;
  line-height: 1.6;
  margin-bottom: 20px;
}

.preview-tags {
  display: flex;
  gap: 10px;
}

.tag {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.tag.urgent {
  background: rgba(255,159,67,0.2);
  color: #ff9f43;
}

.tag.share {
  background: rgba(72,187,120,0.2);
  color: #48bb78;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 25px;
  border-top: 1px solid #444;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .preview-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>


