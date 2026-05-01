<template>
  <div class="support-page">
    <div class="page-header">
      <h1> 客服中心</h1>
      <p>获取帮助和支持</p>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'faq' }" @click="activeTab = 'faq'">
         帮助中心
      </button>
      <button :class="{ active: activeTab === 'contact' }" @click="activeTab = 'contact'">
         联系客服
      </button>
      <button :class="{ active: activeTab === 'feedback' }" @click="activeTab = 'feedback'">
         意见反馈
      </button>
    </div>

    <div v-if="activeTab === 'faq'" class="faq-section">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索帮助文档..."
          @keyup.enter="searchFAQ"
        />
        <button class="search-btn" @click="searchFAQ">搜索</button>
      </div>

      <div class="category-filter">
        <button 
          :class="{ active: selectedCategory === 'all' }" 
          @click="selectedCategory = 'all'"
        >
          全部
        </button>
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <div class="faq-list">
        <div
          v-for="item in filteredFAQ"
          :key="item.id"
          class="faq-item"
          @click="toggleFAQ(item.id)"
        >
          <div class="faq-header">
            <span class="faq-icon">{{ getCategoryIcon(item.category) }}</span>
            <span class="faq-title">{{ item.question }}</span>
            <span class="faq-arrow" :class="{ expanded: expandedFAQ === item.id }">></span>
          </div>
          <div v-if="expandedFAQ === item.id" class="faq-content">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'contact'" class="contact-section">
      <div class="contact-card">
        <div class="contact-icon"></div>
        <div class="contact-info">
          <div class="contact-title">在线客服</div>
          <div class="contact-desc">工作9:00 - 21:00</div>
        </div>
        <button class="contact-btn" @click="startChat">开始对话</button>
      </div>

      <div class="contact-card">
        <div class="contact-icon"></div>
        <div class="contact-info">
          <div class="contact-title">邮箱</div>
          <div class="contact-desc">support@fengrong.com</div>
        </div>
      </div>

      <div class="contact-card">
        <div class="contact-icon"></div>
        <div class="contact-info">
          <div class="contact-title">电话</div>
          <div class="contact-desc">400-888-8888</div>
        </div>
      </div>

      <div class="contact-card">
        <div class="contact-icon"></div>
        <div class="contact-info">
          <div class="contact-title">服务时间</div>
          <div class="contact-desc">周一至周9:00 - 22:00</div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'feedback'" class="feedback-section">
      <div class="feedback-form">
        <div class="form-group">
          <label>反馈类型</label>
          <select v-model="feedbackForm.type">
            <option value="">请选择反馈类型</option>
            <option value="bug"> 问题反馈</option>
            <option value="feature">功能建议</option>
            <option value="complaint"> 投诉</option>
            <option value="other"> 其他</option>
          </select>
        </div>
        <div class="form-group">
          <label>标题</label>
          <input v-model="feedbackForm.title" type="text" placeholder="请输入反馈标题" />
        </div>
        <div class="form-group">
          <label>详细描述</label>
          <textarea v-model="feedbackForm.content" placeholder="请详细描述您的问题或建议"></textarea>
        </div>
        <div class="form-group">
          <label>联系方式</label>
          <input v-model="feedbackForm.contact" type="text" placeholder="请输入您的联系方式（选填）" />
        </div>
        <button class="submit-btn" @click="submitFeedback">提交反馈</button>
      </div>
    </div>

    <div v-if="showChatModal" class="modal-overlay" @click.self="showChatModal = false">
      <div class="modal-content chat-modal">
        <div class="chat-header">
          <div class="chat-title">在线客服</div>
          <button class="close-btn" @click="showChatModal = false"></button>
        </div>
        <div class="chat-messages">
          <div class="system-message">客服小美已上线请问有什么可以帮助您的</div>
          <div
            v-for="msg in chatMessages"
            :key="msg.id"
            class="chat-message"
            :class="{ mine: msg.isMine }"
          >
            <div class="message-content">{{ msg.content }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <input
            v-model="chatInput"
            type="text"
            placeholder="输入消息..."
            @keyup.enter="sendChatMessage"
          />
          <button class="send-btn" @click="sendChatMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const activeTab = ref('faq')
const searchQuery = ref('')
const selectedCategory = ref('all')
const expandedFAQ = ref(null)
const showChatModal = ref(false)
const chatInput = ref('')
const chatMessages = ref([])

const feedbackForm = reactive({
  type: '',
  title: '',
  content: '',
  contact: ''
})

const categories = [
  { id: 'account', name: '账号相关', icon: '' },
  { id: 'task', name: '任务相关', icon: '' },
  { id: 'payment', name: '支付相关', icon: '' },
  { id: 'coupon', name: '优惠券', icon: '' },
  { id: 'event', name: '活动相关', icon: '' }
]

const faqItems = [
  {
    id: 'faq-001',
    category: 'account',
    question: '如何修改密码',
    answer: '您可以进入我的设置安全设置页面点击修改密码按钮按照提示输入原密码和新密码即可完成修改'
  },
  {
    id: 'faq-002',
    category: 'account',
    question: '忘记密码怎么办',
    answer: '在登录页面点击忘记密码输入您的手机号系统会发送验证码到您的手机通过验证码验证后即可重置密码'
  },
  {
    id: 'faq-003',
    category: 'task',
    question: '如何发布任务',
    answer: '进入发布页面选择任务类型填写任务详情预算截止时间等信息点击发布即可任务会在审核通过后显示在任务列表中'
  },
  {
    id: 'faq-004',
    category: 'task',
    question: '任务完成后如何结算',
    answer: '任务完成并验收通过后赏金会自动转入您的账户余额中您可以在钱包页面查看余额并进行提现操作'
  },
  {
    id: 'faq-005',
    category: 'payment',
    question: '支持哪些支付方式',
    answer: '目前支持微信支付和支付宝两种支付方式充值时选择您偏好的支付方式即可完成支付'
  },
  {
    id: 'faq-006',
    category: 'payment',
    question: '如何申请提现',
    answer: '进入钱包页面点击提现按钮选择提现方式微信或支付宝输入提现金额和收款账户信息提交后等待审核即可'
  },
  {
    id: 'faq-007',
    category: 'coupon',
    question: '优惠券如何使用',
    answer: '在结算订单时系统会自动显示可用的优惠券您可以选择使用优惠券抵扣部分金额优惠券有使用门槛和有效期限制请在有效期内使用'
  },
  {
    id: 'faq-008',
    category: 'coupon',
    question: '如何获取优惠券',
    answer: '您可以通过完成任务达成成就参与活动等方式获取优惠券也可以在优惠券中心领取平台发放的优惠券'
  },
  {
    id: 'faq-009',
    category: 'event',
    question: '如何报名参加活动',
    answer: '进入聚会页面选择您感兴趣的活动点击立即报名按钮按照提示完成报名流程即可部分活动需要支付费用'
  },
  {
    id: 'faq-010',
    category: 'event',
    question: '活动取消后如何退款',
    answer: '如果您报名的活动被取消系统会自动将费用退还至您的账户余额中您可以在钱包页面查看退款记录'
  }
]

const autoReplies = [
  '好的我已收到您的问题正在为您查询相关信息...',
  '感谢您的反馈我们会尽快处理您的问题',
  '您可以在帮助中心查找更多相关信息',
  '请详细描述您的问题以便我更好地帮助您',
  '您的问题已记录我们会在1-3个工作日内回复您'
]

function getCategoryIcon(category) {
  const cat = categories.find(c => c.id === category)
  return cat?.icon || ''
}

const filteredFAQ = computed(() => {
  let result = faqItems

  if (selectedCategory.value !== 'all') {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    )
  }

  return result
})

function searchFAQ() {
}

function toggleFAQ(id) {
  expandedFAQ.value = expandedFAQ.value === id ? null : id
}

function startChat() {
  showChatModal.value = true
  chatMessages.value = []
}

function sendChatMessage() {
  if (!chatInput.value.trim()) return

  chatMessages.value.push({
    id: 'msg-' + Date.now(),
    content: chatInput.value,
    isMine: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })

  chatInput.value = ''

  setTimeout(() => {
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)]
    chatMessages.value.push({
      id: 'msg-' + Date.now(),
      content: reply,
      isMine: false,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
  }, 1000)
}

function submitFeedback() {
  if (!feedbackForm.type) {
    alert('请选择反馈类型')
    return
  }
  if (!feedbackForm.title) {
    alert('请输入反馈标题')
    return
  }
  if (!feedbackForm.content) {
    alert('请输入详细描述')
    return
  }

  alert('反馈提交成功感谢您的宝贵意见我们会尽快处理')
  
  feedbackForm.type = ''
  feedbackForm.title = ''
  feedbackForm.content = ''
  feedbackForm.contact = ''
}
</script>

<style scoped>
.support-page {
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
}

.tabs button {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.search-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.category-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.category-filter button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
}

.category-filter button.active {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #3b82f6;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.faq-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
}

.faq-icon {
  font-size: 1rem;
}

.faq-title {
  flex: 1;
  font-weight: 500;
  color: #1f2937;
}

.faq-arrow {
  font-size: 0.75rem;
  color: #9ca3af;
  transition: transform 0.3s;
}

.faq-arrow.expanded {
  transform: rotate(90deg);
}

.faq-content {
  padding: 0 16px 16px;
  color: #6b7280;
  line-height: 1.6;
}

.contact-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.contact-icon {
  font-size: 1.5rem;
}

.contact-info {
  flex: 1;
}

.contact-title {
  font-weight: 500;
  color: #1f2937;
}

.contact-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.contact-btn {
  padding: 8px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.feedback-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
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
  overflow: hidden;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #3b82f6;
  color: white;
}

.chat-title {
  font-weight: 500;
}

.close-btn {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

.chat-messages {
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.system-message {
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 12px;
}

.chat-message {
  margin-bottom: 12px;
}

.chat-message.mine {
  text-align: right;
}

.message-content {
  display: inline-block;
  padding: 10px 14px;
  background: #f3f4f6;
  border-radius: 16px;
  max-width: 70%;
}

.chat-message.mine .message-content {
  background: #3b82f6;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
}

.send-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .contact-card {
    flex-wrap: wrap;
  }
  
  .contact-btn {
    flex: 1;
  }
}
</style>

