<template>
  <div class="achievements-page">
    <div class="page-header">
      <h1>成就系统</h1>
      <p>收集成就展示你的江湖风采</p>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ achievementStore.stats.total }}</span>
        <span class="stat-label">成就总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ achievementStore.stats.unlocked }}</span>
        <span class="stat-label">已解锁</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ achievementStore.stats.legendary }}</span>
        <span class="stat-label">传说成就</span>
      </div>
      <div class="stat-item">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: achievementStore.stats.progress + '%' }"></div>
        </div>
        <span class="stat-label">{{ achievementStore.stats.progress }}% 完成</span>
      </div>
    </div>

    <div class="search-section">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜索成就名称或描述..." 
        class="search-input"
        @input="handleSearch"
      />
      <button v-if="searchQuery" class="clear-search" @click="clearSearch"></button>
    </div>

    <div class="category-tabs">
      <button 
        v-for="category in achievementStore.categories" 
        :key="category.id"
        :class="{ active: selectedCategory === category.id }"
        @click="selectedCategory = category.id"
      >
        <span>{{ category.icon }}</span>
        <span>{{ category.name }}</span>
      </button>
    </div>

    <div class="achievements-grid">
      <div 
        v-for="achievement in filteredAchievements" 
        :key="achievement.id"
        class="achievement-card"
        :class="[achievementStore.getStatus(achievement)]"
        :style="{ '--rarity-color': achievementStore.getRarityColor(achievement.rarity) }"
        @click="selectAchievement(achievement)"
      >
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <div class="achievement-info">
          <h4>{{ achievement.name }}</h4>
          <div class="achievement-meta">
            <span class="rarity-badge" :class="achievement.rarity">{{ achievement.rarityText }}</span>
            <span class="category-tag">{{ achievement.category }}</span>
          </div>
          <div v-if="achievement.progress < 100 && achievement.progress > 0" class="progress-container">
            <div class="progress-bar-small">
              <div class="progress-fill" :style="{ width: achievement.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ achievement.progress }}%</span>
          </div>
        </div>
        <div class="achievement-status">
          <span v-if="achievement.unlockedAt" class="unlock-date">{{ achievement.unlockedAt }}</span>
          <span v-else-if="achievement.progress > 0" class="in-progress">进行中</span>
          <span v-else class="locked"></span>
        </div>
      </div>
    </div>

    <div v-if="filteredAchievements.length === 0" class="empty-state">
      <div class="empty-icon"></div>
      <p>没有找到匹配的成就</p>
    </div>

    <div v-if="selectedAchievement" class="achievement-detail-overlay" @click="selectedAchievement = null; showShareModal = false; showPosterModal = false">
      <div class="detail-modal" @click.stop>
        <button class="close-btn" @click="selectedAchievement = null; showShareModal = false; showPosterModal = false"></button>
        <div class="detail-header">
          <span class="detail-icon">{{ selectedAchievement.icon }}</span>
          <div class="detail-title">
            <h2>{{ selectedAchievement.name }}</h2>
            <span class="detail-rarity" :class="selectedAchievement.rarity">{{ selectedAchievement.rarityText }}</span>
          </div>
        </div>
        <div class="detail-body">
          <p class="detail-description">{{ selectedAchievement.description }}</p>
          <p class="detail-story">{{ selectedAchievement.story }}</p>
          
          <div v-if="!selectedAchievement.unlockedAt && selectedAchievement.progress > 0" class="detail-section target-progress-panel">
            <h3> 目标进度追踪</h3>
            <div class="progress-circle-container">
              <div class="progress-circle" :style="{ '--progress': selectedAchievement.progress + '%' }">
                <span class="progress-value">{{ selectedAchievement.progress }}%</span>
              </div>
              <div class="progress-labels">
                <div class="progress-label">当前进度</div>
                <div class="progress-detail">{{ selectedAchievement.requirements?.current || 0 }} / {{ selectedAchievement.requirements?.target || 100 }}</div>
              </div>
            </div>
            <div class="milestone-section" v-if="getMilestones(selectedAchievement).length > 0">
              <div class="milestone-title">里程碑</div>
              <div class="milestone-list">
                <div 
                  v-for="(milestone, index) in getMilestones(selectedAchievement)" 
                  :key="index"
                  class="milestone-item"
                  :class="{ completed: isMilestoneCompleted(milestone, selectedAchievement) }"
                >
                  <span class="milestone-check">{{ isMilestoneCompleted(milestone, selectedAchievement) ? '' : '' }}</span>
                  <span>{{ milestone }}</span>
                </div>
              </div>
            </div>
            <div class="suggestion-section" v-if="getSuggestion(selectedAchievement)">
              <div class="suggestion-title"> 行动建议</div>
              <div class="suggestion-content">{{ getSuggestion(selectedAchievement) }}</div>
            </div>
          </div>

          <div class="detail-section">
            <h3>完成进度</h3>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: selectedAchievement.progress + '%' }"></div>
            </div>
            <p>{{ selectedAchievement.progress }}%</p>
          </div>
          <div class="detail-section">
            <h3>解锁奖励</h3>
            <div class="rewards-list">
              <span v-if="selectedAchievement.rewards?.prestige"> 声望 +{{ selectedAchievement.rewards.prestige }}</span>
              <span v-if="selectedAchievement.rewards?.title"> 称号: {{ selectedAchievement.rewards.title }}</span>
            </div>
          </div>
          <div class="detail-actions">
            <button 
              v-if="!selectedAchievement.unlockedAt" 
              class="action-btn target-btn"
              @click="setTargetAchievement(selectedAchievement)"
            >
               {{ targetAchievement?.id === selectedAchievement.id ? '取消目标' : '设为目标' }}
            </button>
            <button 
              v-if="selectedAchievement.unlockedAt" 
              class="action-btn share-btn"
              @click="showShareModal = true"
            >
               分享
            </button>
            <button 
              v-if="selectedAchievement.unlockedAt" 
              class="action-btn equip-btn"
              @click="toggleEquip(selectedAchievement.id)"
            >
              {{ achievementStore.isEquipped(selectedAchievement.id) ? '卸下徽章' : '装备徽章' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showShareModal" class="share-modal-overlay" @click="showShareModal = false">
      <div class="share-modal-content" @click.stop>
        <button class="close-btn" @click="showShareModal = false"></button>
        <div class="share-modal-header">
          <span style="font-size: 1.5rem;"></span>
          <div>
            <div class="modal-name">分享成就</div>
          </div>
        </div>
        <div class="share-options">
          <div class="share-option" @click="shareToWeChatFriend">
            <div class="share-icon"></div>
            <div class="share-text">微信好友</div>
          </div>
          <div class="share-option" @click="shareToWeChatTimeline">
            <div class="share-icon"></div>
            <div class="share-text">朋友圈</div>
          </div>
          <div class="share-option" @click="generatePoster">
            <div class="share-icon"></div>
            <div class="share-text">生成海报</div>
          </div>
          <div class="share-option" @click="copyAchievementLink">
            <div class="share-icon"></div>
            <div class="share-text">复制链接</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPosterModal" class="poster-modal-overlay" @click="showPosterModal = false">
      <div class="poster-modal-content" @click.stop>
        <button class="close-btn" @click="showPosterModal = false"></button>
        <div class="poster-modal-header">
          <span style="font-size: 1.5rem;"></span>
          <div>
            <div class="modal-name">成就海报</div>
          </div>
        </div>
        <div class="poster-preview">
          <canvas ref="posterCanvas" class="poster-canvas"></canvas>
          <button class="download-btn" @click="downloadPoster"> 保存海报</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAchievementStore } from '@/stores'

const achievementStore = useAchievementStore()
const selectedCategory = ref('all')
const selectedAchievement = ref(null)
const searchQuery = ref('')
const showShareModal = ref(false)
const showPosterModal = ref(false)
const posterCanvas = ref(null)
const targetAchievement = ref(null)

const filteredAchievements = computed(() => {
  let achievements = achievementStore.filterByCategory(selectedCategory.value)
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    achievements = achievements.filter(a => 
      a.name.toLowerCase().includes(query) || 
      a.description.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
    )
  }
  
  return achievements
})

function handleSearch() {
  // 搜索时会自动通过 computed 更新
}

function clearSearch() {
  searchQuery.value = ''
}

function selectAchievement(achievement) {
  selectedAchievement.value = achievement
  showShareModal.value = false
  showPosterModal.value = false
  loadTargetAchievement()
}

function toggleEquip(achievementId) {
  const isEquipped = achievementStore.isEquipped(achievementId)
  if (isEquipped) {
    achievementStore.unequip(0)
  } else {
    achievementStore.equip(achievementId, 0)
  }
  window.dispatchEvent(new CustomEvent('notification', {
    detail: {
      message: isEquipped ? '已卸下徽章' : '已装备徽章',
      type: 'success'
    }
  }))
}

function loadTargetAchievement() {
  const stored = localStorage.getItem('targetAchievement')
  if (stored) {
    try {
      targetAchievement.value = JSON.parse(stored)
    } catch {
      targetAchievement.value = null
    }
  } else {
    targetAchievement.value = null
  }
}

function setTargetAchievement(achievement) {
  if (targetAchievement.value?.id === achievement.id) {
    localStorage.removeItem('targetAchievement')
    targetAchievement.value = null
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '已取消目标', type: 'info' }
    }))
  } else {
    const data = {
      id: achievement.id,
      setAt: new Date().toISOString().split('T')[0]
    }
    localStorage.setItem('targetAchievement', JSON.stringify(data))
    targetAchievement.value = data
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '已设为目标成就', type: 'success' }
    }))
  }
}

function getMilestones(achievement) {
  if (!achievement.requirements) return []
  const target = achievement.requirements.target || 100
  return [
    `${Math.floor(target * 0.25)} 进度`,
    `${Math.floor(target * 0.5)} 进度`,
    `${Math.floor(target * 0.75)} 进度`,
    `${target} 满进度`
  ]
}

function isMilestoneCompleted(milestone, achievement) {
  if (!achievement.requirements) return false
  const current = achievement.requirements.current || 0
  const match = milestone.match(/(\d+)/)
  if (match) {
    return current >= parseInt(match[1])
  }
  return false
}

function getSuggestion(achievement) {
  const suggestions = {
    'task': '多接取赏金任务完成后可获得进度',
    'login': '保持每日登录连续登录可加速进度',
    'prestige': '多完成任务和成就获取声望',
    'collect': '收集更多法器可解锁成就',
    'invite': '邀请好友加入可获得进度',
    'perfect': '高质量完成任务可获得完美评价',
    'night': '尝试在深夜时段登录',
    'season': '关注赛季活动参与可获得进度',
    'total-prestige': '累计获取声望达到目标即可解锁'
  }
  const type = achievement.requirements?.type || ''
  return suggestions[type] || '继续努力完成更多任务'
}

function shareToWeChatFriend() {
  if (!selectedAchievement.value) return
  const text = formatShareText(selectedAchievement.value)
  copyToClipboard(text)
  showShareModal.value = false
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '成就信息已复制到剪贴板', type: 'success' }
  }))
}

function shareToWeChatTimeline() {
  shareToWeChatFriend()
}

function copyAchievementLink() {
  if (!selectedAchievement.value) return
  const url = `${window.location.origin}/achievements?achievement=${selectedAchievement.value.id}`
  copyToClipboard(url)
  showShareModal.value = false
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '链接已复制到剪贴板', type: 'success' }
  }))
}

function formatShareText(achievement) {
  return `我在枫榕赏金酒馆获得了成就${achievement.icon} ${achievement.name}?{achievement.description}`
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

function generatePoster() {
  if (!selectedAchievement.value) return
  showShareModal.value = false
  showPosterModal.value = true
  
  setTimeout(() => {
    if (posterCanvas.value) {
      renderPoster(posterCanvas.value, selectedAchievement.value)
    }
  }, 100)
}

function renderPoster(canvas, achievement) {
  canvas.width = 400
  canvas.height = 500
  const ctx = canvas.getContext('2d')
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 500)
  gradient.addColorStop(0, '#2D1E17')
  gradient.addColorStop(1, '#1A120B')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 400, 500)
  
  ctx.strokeStyle = '#D4AF37'
  ctx.lineWidth = 4
  ctx.strokeRect(10, 10, 380, 480)
  
  ctx.font = '80px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(achievement.icon, 200, 120)
  
  ctx.font = 'bold 24px Microsoft YaHei'
  ctx.fillStyle = '#D4AF37'
  ctx.textAlign = 'center'
  const nameLines = wrapText(ctx, achievement.name, 360)
  nameLines.forEach((line, index) => {
    ctx.fillText(line, 200, 200 + index * 30)
  })
  
  const rarityY = 200 + nameLines.length * 30 + 15
  ctx.font = '16px Microsoft YaHei'
  ctx.fillStyle = getRarityColor(achievement.rarity)
  ctx.fillText(achievement.rarityText, 200, rarityY)
  
  ctx.font = '14px Microsoft YaHei'
  ctx.fillStyle = '#E8DCC8'
  const descY = rarityY + 35
  const descLines = wrapText(ctx, achievement.description, 360)
  descLines.forEach((line, index) => {
    ctx.fillText(line, 200, descY + index * 22)
  })
  
  ctx.font = 'italic 12px Microsoft YaHei'
  ctx.fillStyle = '#8B7355'
  let storyY = descY + descLines.length * 22 + 20
  const story = `"${achievement.story}"`
  const truncatedStory = story.length > 80 ? story.substring(0, 80) + '...' : story
  const storyLines = wrapText(ctx, truncatedStory, 340)
  storyLines.forEach((line, index) => {
    ctx.fillText(line, 200, storyY + index * 18)
  })
  
  if (achievement.rewards) {
    ctx.font = '14px Microsoft YaHei'
    ctx.fillStyle = '#D4AF37'
    let rewardsY = storyY + storyLines.length * 18 + 20
    ctx.fillText('奖励:', 200, rewardsY)
    
    let rewardsText = ''
    if (achievement.rewards.prestige) {
      rewardsText += `声望 +${achievement.rewards.prestige} `
    }
    if (achievement.rewards.title) {
      rewardsText += `称号: ${achievement.rewards.title}`
    }
    
    ctx.font = '12px Microsoft YaHei'
    ctx.fillStyle = '#E8DCC8'
    const rewardsLines = wrapText(ctx, rewardsText, 340)
    rewardsLines.forEach((line, index) => {
      ctx.fillText(line, 200, rewardsY + 22 + index * 18)
    })
  }
  
  ctx.font = '14px Microsoft YaHei'
  ctx.fillStyle = '#D4AF37'
  ctx.textAlign = 'center'
  ctx.fillText(' 枫榕赏金酒馆', 200, 475)
}

function wrapText(ctx, text, maxWidth) {
  const lines = []
  let currentLine = ''
  const chars = text.split('')
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

function getRarityColor(rarity) {
  const colors = {
    'common': '#9CA3AF',
    'uncommon': '#22C55E',
    'rare': '#3B82F6',
    'epic': '#A855F7',
    'legendary': '#F59E0B'
  }
  return colors[rarity] || '#9CA3AF'
}

function downloadPoster() {
  if (!posterCanvas.value) return
  const link = document.createElement('a')
  link.download = `achievement-${selectedAchievement.value.id}.png`
  link.href = posterCanvas.value.toDataURL('image/png')
  link.click()
  showPosterModal.value = false
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '海报保存成功', type: 'success' }
  }))
}

onMounted(() => {
  loadTargetAchievement()
})
</script>

<style scoped>
.achievements-page {
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

.stats-bar {
  display: flex;
  gap: 30px;
  justify-content: center;
  padding: 20px;
  background: rgba(140,43,27,0.1);
  border-radius: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #D4AF37;
}

.stat-label {
  display: block;
  color: #888;
  font-size: 0.9rem;
}

.progress-bar-container {
  width: 100px;
  height: 10px;
  background: #333;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 auto 5px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #D4AF37, #8C2B1B);
  transition: width 0.3s;
}

.search-section {
  position: relative;
  max-width: 500px;
  margin: 0 auto 25px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  background: #2D1E17;
  border: 1px solid #444;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #D4AF37;
}

.search-input::placeholder {
  color: #666;
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 1rem;
}

.category-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.category-tabs button {
  padding: 10px 20px;
  background: #2D1E17;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.category-tabs button.active {
  background: #8C2B1B;
  border-color: #8C2B1B;
}

.category-tabs button:hover:not(.active) {
  border-color: #8C2B1B;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid var(--rarity-color);
}

.achievement-card:hover {
  transform: translateY(-3px);
}

.achievement-card.locked {
  opacity: 0.5;
  filter: grayscale(50%);
}

.achievement-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.achievement-info h4 {
  color: #D4AF37;
  margin: 0 0 10px 0;
}

.achievement-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.rarity-badge {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.75rem;
}

.rarity-badge.common { background: #9e9e9e; color: #fff; }
.rarity-badge.uncommon { background: #2ecc71; color: #fff; }
.rarity-badge.rare { background: #3498db; color: #fff; }
.rarity-badge.epic { background: #9b59b6; color: #fff; }
.rarity-badge.legendary { background: #ffd700; color: #1A120B; }

.category-tag {
  color: #888;
  font-size: 0.8rem;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar-small {
  flex: 1;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #D4AF37;
}

.progress-text {
  font-size: 0.85rem;
  color: #D4AF37;
}

.achievement-status {
  margin-top: 10px;
  text-align: right;
}

.unlock-date {
  color: #2ecc71;
  font-size: 0.85rem;
}

.in-progress {
  color: #f39c12;
  font-size: 0.85rem;
}

.locked {
  font-size: 1rem;
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
}

.achievement-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.detail-modal {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border: 2px solid #8C2B1B;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.close-btn:hover {
  color: white;
}

.detail-header {
  padding: 30px;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  gap: 20px;
}

.detail-icon {
  font-size: 3.5rem;
}

.detail-title h2 {
  color: #D4AF37;
  margin: 0 0 10px 0;
}

.detail-rarity {
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 0.85rem;
}

.detail-body {
  padding: 25px 30px;
}

.detail-description {
  color: #D4C39E;
  margin: 0 0 20px 0;
  font-size: 1.1rem;
}

.detail-story {
  color: #888;
  margin: 0 0 25px 0;
  font-style: italic;
  line-height: 1.6;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  color: #D4AF37;
  margin: 0 0 10px 0;
}

.target-progress-panel {
  background: rgba(140,43,27,0.2);
  border-radius: 10px;
  padding: 20px;
}

.progress-circle-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 15px 0;
}

.progress-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(#D4AF37 var(--progress), #333 var(--progress));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: #1A120B;
  border-radius: 50%;
}

.progress-value {
  position: relative;
  z-index: 1;
  font-weight: bold;
  color: #D4AF37;
}

.progress-labels {
  flex: 1;
}

.progress-label {
  color: #888;
  font-size: 0.9rem;
}

.progress-detail {
  color: #D4C39E;
  font-size: 1.1rem;
  margin-top: 5px;
}

.milestone-section {
  margin-top: 20px;
}

.milestone-title {
  color: #D4AF37;
  margin-bottom: 10px;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #888;
  font-size: 0.9rem;
}

.milestone-item.completed {
  color: #2ecc71;
}

.suggestion-section {
  margin-top: 20px;
  background: rgba(212,175,55,0.1);
  padding: 15px;
  border-radius: 8px;
}

.suggestion-title {
  color: #D4AF37;
  margin-bottom: 8px;
}

.suggestion-content {
  color: #D4C39E;
  font-size: 0.9rem;
}

.rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.rewards-list span {
  background: rgba(212,175,55,0.2);
  padding: 8px 15px;
  border-radius: 5px;
  color: #D4AF37;
}

.detail-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.target-btn {
  background: #3498db;
  color: white;
}

.target-btn:hover {
  background: #2980b9;
}

.share-btn {
  background: #2ecc71;
  color: white;
}

.share-btn:hover {
  background: #27ae60;
}

.equip-btn {
  background: #D4AF37;
  color: #1A120B;
  font-weight: bold;
}

.equip-btn:hover {
  background: #B89500;
}

.share-modal-overlay,
.poster-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  padding: 20px;
}

.share-modal-content,
.poster-modal-content {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border: 2px solid #8C2B1B;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  position: relative;
}

.share-modal-header,
.poster-modal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.share-modal-header .modal-name,
.poster-modal-header .modal-name {
  color: #D4AF37;
  font-size: 1.2rem;
  font-weight: bold;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.share-option {
  padding: 20px;
  background: rgba(140,43,27,0.2);
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.share-option:hover {
  background: rgba(140,43,27,0.4);
}

.share-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.share-text {
  color: #D4C39E;
  font-size: 0.9rem;
}

.poster-preview {
  text-align: center;
}

.poster-canvas {
  background: #1A120B;
  border-radius: 10px;
  margin-bottom: 15px;
  max-width: 100%;
}

.download-btn {
  width: 100%;
  padding: 12px;
  background: #D4AF37;
  color: #1A120B;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.download-btn:hover {
  background: #B89500;
}
</style>

