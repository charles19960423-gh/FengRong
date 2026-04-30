<template>
  <div class="bounty-page">
    <div class="page-header">
      <h1>赏金榜单</h1>
      <p>领取高额赏金任务，赢取丰厚奖励</p>
    </div>

    <div class="bounty-stats">
      <div class="stat-card">
        <span class="stat-icon">💰</span>
        <div class="stat-info">
          <span class="stat-value">{{ bounties.length }}</span>
          <span class="stat-label">任务总数</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">🎯</span>
        <div class="stat-info">
          <span class="stat-value">{{ claimedCount }}</span>
          <span class="stat-label">已领取</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">🔥</span>
        <div class="stat-info">
          <span class="stat-value">{{ inProgressCount }}</span>
          <span class="stat-label">进行中</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">🏆</span>
        <div class="stat-info">
          <span class="stat-value">2,850</span>
          <span class="stat-label">累计声望</span>
        </div>
      </div>
    </div>

    <div class="bounty-main-layout">
      <aside class="sidebar">
        <div class="sidebar-section">
          <h3>🔍 搜索任务</h3>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="输入任务名称..." 
            class="sidebar-search"
          />
        </div>

        <div class="sidebar-section">
          <h3>⚔️ 品质筛选</h3>
          <div class="filter-options">
            <label 
              v-for="difficulty in difficultyFilters" 
              :key="difficulty.value"
              class="filter-checkbox"
              :class="{ active: selectedDifficulties.includes(difficulty.value) }"
            >
              <input 
                type="checkbox" 
                :value="difficulty.value"
                v-model="selectedDifficulties"
              />
              <span class="checkbox-label">{{ difficulty.label }}</span>
            </label>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>📍 地点筛选</h3>
          <select v-model="selectedLocation" class="sidebar-select">
            <option value="all">全部地点</option>
            <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <div class="sidebar-section">
          <h3>🏷️ 快捷筛选</h3>
          <div class="quick-filters">
            <button 
              v-for="quick in quickFilters" 
              :key="quick.value"
              :class="{ active: activeQuickFilter === quick.value }"
              @click="toggleQuickFilter(quick.value)"
            >
              {{ quick.label }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>📊 排序方式</h3>
          <select v-model="sortBy" class="sidebar-select">
            <option value="default">默认排序</option>
            <option value="prestige-desc">声望 ⬆️</option>
            <option value="prestige-asc">声望 ⬇️</option>
            <option value="difficulty-desc">难度 ⬆️</option>
            <option value="difficulty-asc">难度 ⬇️</option>
            <option value="players-desc">人数 ⬆️</option>
            <option value="players-asc">人数 ⬇️</option>
          </select>
        </div>

        <button class="reset-btn" @click="resetFilters">🔄 重置筛选</button>
      </aside>

      <div class="content-area">
        <div v-if="featuredBounty" class="featured-section">
          <div class="featured-label">🌟 热门推荐</div>
          <div class="featured-card" :class="featuredBounty.difficulty">
            <div class="featured-badge">{{ featuredBounty.rank || '🏅' }}</div>
            <div class="featured-content">
              <div class="featured-icon">{{ featuredBounty.icon }}</div>
              <div class="featured-info">
                <h4>{{ featuredBounty.title }}</h4>
                <p>{{ featuredBounty.description }}</p>
                <div class="featured-meta">
                  <span>📍 {{ featuredBounty.location }}</span>
                  <span>💰 {{ featuredBounty.reward.prestige }} 声望</span>
                  <span>👥 {{ featuredBounty.players }}人</span>
                </div>
              </div>
            </div>
            <button class="featured-claim-btn" @click="claimBounty(featuredBounty)">
              立即领取
            </button>
          </div>
        </div>

        <div class="bounty-list">
          <div 
            v-for="bounty in filteredBounties" 
            :key="bounty.id"
            class="bounty-card"
            :class="[bounty.difficulty, { claimed: claimedTasks.includes(bounty.id) }]"
          >
            <div class="bounty-header">
              <div class="bounty-rank" v-if="bounty.rank">
                {{ bounty.rank }}
              </div>
              <div class="bounty-icon">{{ bounty.icon }}</div>
              <div class="bounty-title-section">
                <h3>{{ bounty.title }}</h3>
                <div class="bounty-meta">
                  <span class="bounty-type">{{ getTypeLabel(bounty.type) }}</span>
                  <span class="bounty-difficulty">{{ getDifficultyLabel(bounty.difficulty) }}</span>
                </div>
              </div>
            </div>
            <p class="bounty-description">{{ bounty.description }}</p>
            <div class="bounty-details">
              <div class="detail-item">
                <span>📍</span>
                <span>{{ bounty.location }}</span>
              </div>
              <div class="detail-item">
                <span>⏰</span>
                <span>{{ bounty.duration }}</span>
              </div>
              <div class="detail-item">
                <span>👥</span>
                <span>{{ bounty.players }}人</span>
              </div>
            </div>
            <div class="bounty-rewards">
              <div class="reward-item">
                <span class="reward-icon">💰</span>
                <span class="reward-value">{{ bounty.reward.prestige }} 声望</span>
              </div>
              <div class="reward-item">
                <span class="reward-icon">🎁</span>
                <span class="reward-value">{{ bounty.reward.item }}</span>
              </div>
            </div>
            <button 
              class="claim-btn" 
              :class="{ claimed: claimedTasks.includes(bounty.id) }"
              @click="toggleClaim(bounty)"
              :disabled="claimedTasks.includes(bounty.id)"
            >
              {{ claimedTasks.includes(bounty.id) ? '已领取' : '领取任务' }}
            </button>
          </div>
        </div>

        <div v-if="filteredBounties.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p>暂无符合条件的赏金任务</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const selectedDifficulties = ref([])
const selectedLocation = ref('all')
const sortBy = ref('default')
const activeQuickFilter = ref(null)
const claimedTasks = ref([])

const difficultyFilters = [
  { value: 'easy', label: '⭐ 简单' },
  { value: 'medium', label: '⭐⭐ 中等' },
  { value: 'hard', label: '⭐⭐⭐ 困难' },
  { value: 'legendary', label: '⭐⭐⭐⭐ 传说' }
]

const quickFilters = [
  { value: 'high-reward', label: '高奖励' },
  { value: 'quick', label: '快速完成' },
  { value: 'solo', label: '单人可做' },
  { value: 'team', label: '需要组队' }
]

const bounties = ref([
  {
    id: 'bounty-001',
    title: '清除山贼据点',
    icon: '⚔️',
    type: 'combat',
    difficulty: 'hard',
    rank: '🏅',
    description: '黑石山道被一伙山贼占据，商队无法通行。请前往清除山贼据点，恢复道路畅通。',
    location: '黑石山道',
    duration: '3天',
    players: '1-3',
    reward: { prestige: 500, item: '精良武器箱' }
  },
  {
    id: 'bounty-002',
    title: '寻找失落的遗迹',
    icon: '🗺️',
    type: 'exploration',
    difficulty: 'legendary',
    rank: '👑',
    description: '传说在迷雾森林深处有一座失落的古代遗迹，据说藏有珍贵的宝藏和古老的知识。',
    location: '迷雾森林深处',
    duration: '5天',
    players: '3-5',
    reward: { prestige: 1500, item: '传奇法器' }
  },
  {
    id: 'bounty-003',
    title: '护送商队',
    icon: '📦',
    type: 'delivery',
    difficulty: 'medium',
    description: '商人需要将一批珍贵货物从晨曦镇护送到边境要塞，路途艰险，请务必小心。',
    location: '晨曦镇 → 边境要塞',
    duration: '2天',
    players: '2',
    reward: { prestige: 300, item: '宝石袋' }
  },
  {
    id: 'bounty-004',
    title: '采集千年灵芝',
    icon: '🌿',
    type: 'gathering',
    difficulty: 'hard',
    description: '药王谷需要一株千年灵芝用于炼制珍贵丹药，请前往雪峰之巅采集。',
    location: '雪峰之巅',
    duration: '3天',
    players: '1-2',
    reward: { prestige: 400, item: '高级药材包' }
  },
  {
    id: 'bounty-005',
    title: '调查神秘事件',
    icon: '🔍',
    type: 'investigation',
    difficulty: 'medium',
    description: '最近村庄发生了多起神秘失踪事件，请前往调查真相，保护村民安全。',
    location: '月影村',
    duration: '2天',
    players: '1-3',
    reward: { prestige: 350, item: '情报卷轴' }
  },
  {
    id: 'bounty-006',
    title: '狩猎狼王',
    icon: '🐺',
    type: 'combat',
    difficulty: 'easy',
    description: '青狼岭出现了一只凶猛的狼王，已经伤害了多位村民，请前去狩猎。',
    location: '青狼岭',
    duration: '1天',
    players: '1',
    reward: { prestige: 150, item: '狼皮披风' }
  },
  {
    id: 'bounty-007',
    title: '护送重要人物',
    icon: '🛡️',
    type: 'delivery',
    difficulty: 'legendary',
    rank: '👑',
    description: '保护一位重要人物穿越危险区域，这是一项极其重要的任务，不容有失。',
    location: '死亡沙漠',
    duration: '7天',
    players: '5-8',
    reward: { prestige: 2000, item: '传说装备' }
  },
  {
    id: 'bounty-008',
    title: '探索废弃矿洞',
    icon: '⛏️',
    type: 'exploration',
    difficulty: 'medium',
    description: '老矿区有一个废弃的矿洞，据说里面藏有丰富的矿藏，但也可能有未知的危险。',
    location: '老矿区',
    duration: '2天',
    players: '2-3',
    reward: { prestige: 280, item: '矿石袋' }
  }
])

const uniqueLocations = computed(() => {
  const locations = new Set()
  bounties.value.forEach(b => {
    if (b.location.includes('→')) {
      b.location.split('→').forEach(loc => locations.add(loc.trim()))
    } else {
      locations.add(b.location)
    }
  })
  return Array.from(locations)
})

const featuredBounty = computed(() => {
  return bounties.value.find(b => b.difficulty === 'legendary') || bounties.value[0]
})

const claimedCount = computed(() => claimedTasks.value.length)
const inProgressCount = computed(() => claimedTasks.value.length)

const filteredBounties = computed(() => {
  let result = [...bounties.value]
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query)
    )
  }
  
  if (selectedDifficulties.value.length > 0) {
    result = result.filter(b => selectedDifficulties.value.includes(b.difficulty))
  }
  
  if (selectedLocation.value !== 'all') {
    result = result.filter(b => b.location.includes(selectedLocation.value))
  }
  
  if (activeQuickFilter.value) {
    switch (activeQuickFilter.value) {
      case 'high-reward':
        result = result.filter(b => b.reward.prestige >= 500)
        break
      case 'quick':
        result = result.filter(b => {
          const days = parseInt(b.duration)
          return days <= 2
        })
        break
      case 'solo':
        result = result.filter(b => {
          const players = b.players.toString()
          return players === '1' || players.startsWith('1-')
        })
        break
      case 'team':
        result = result.filter(b => {
          const players = b.players.toString()
          return !players.startsWith('1-') && !players.startsWith('1,')
        })
        break
    }
  }
  
  switch (sortBy.value) {
    case 'prestige-desc':
      result.sort((a, b) => b.reward.prestige - a.reward.prestige)
      break
    case 'prestige-asc':
      result.sort((a, b) => a.reward.prestige - b.reward.prestige)
      break
    case 'difficulty-desc':
      const difficultyOrder = { legendary: 4, hard: 3, medium: 2, easy: 1 }
      result.sort((a, b) => (difficultyOrder[b.difficulty] || 0) - (difficultyOrder[a.difficulty] || 0))
      break
    case 'difficulty-asc':
      const order = { easy: 1, medium: 2, hard: 3, legendary: 4 }
      result.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0))
      break
    case 'players-desc':
      result.sort((a, b) => parseInt(b.players) - parseInt(a.players))
      break
    case 'players-asc':
      result.sort((a, b) => parseInt(a.players) - parseInt(b.players))
      break
  }
  
  return result
})

function getTypeLabel(type) {
  const labels = {
    combat: '⚔️ 战斗',
    exploration: '🗺️ 探索',
    delivery: '📦 护送',
    gathering: '🌿 采集',
    investigation: '🔍 调查'
  }
  return labels[type] || type
}

function getDifficultyLabel(difficulty) {
  const labels = {
    easy: '⭐ 简单',
    medium: '⭐⭐ 中等',
    hard: '⭐⭐⭐ 困难',
    legendary: '⭐⭐⭐⭐ 传说'
  }
  return labels[difficulty] || difficulty
}

function toggleClaim(bounty) {
  if (claimedTasks.value.includes(bounty.id)) {
    claimedTasks.value = claimedTasks.value.filter(id => id !== bounty.id)
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: `已取消任务「${bounty.title}」`, type: 'info' }
    }))
  } else {
    claimedTasks.value.push(bounty.id)
    saveClaimedTasks()
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: `已领取任务「${bounty.title}」！`, type: 'success' }
    }))
  }
}

function claimBounty(bounty) {
  toggleClaim(bounty)
}

function toggleQuickFilter(value) {
  activeQuickFilter.value = activeQuickFilter.value === value ? null : value
}

function resetFilters() {
  searchQuery.value = ''
  selectedDifficulties.value = []
  selectedLocation.value = 'all'
  sortBy.value = 'default'
  activeQuickFilter.value = null
}

function saveClaimedTasks() {
  localStorage.setItem('claimedTasks', JSON.stringify(claimedTasks.value))
}

function loadClaimedTasks() {
  const stored = localStorage.getItem('claimedTasks')
  if (stored) {
    try {
      claimedTasks.value = JSON.parse(stored)
    } catch {
      claimedTasks.value = []
    }
  }
}

onMounted(() => {
  loadClaimedTasks()
})
</script>

<style scoped>
.bounty-page {
  max-width: 1200px;
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

.bounty-stats {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 30px;
  background: rgba(140,43,27,0.1);
  border-radius: 10px;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  color: #D4AF37;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
}

.bounty-main-layout {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.sidebar-section {
  margin-bottom: 25px;
}

.sidebar-section h3 {
  color: #D4AF37;
  margin: 0 0 12px 0;
  font-size: 1rem;
}

.sidebar-search {
  width: 100%;
  padding: 10px 12px;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  font-size: 0.9rem;
}

.sidebar-search:focus {
  outline: none;
  border-color: #D4AF37;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #1A120B;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-checkbox:hover {
  background: rgba(140,43,27,0.3);
}

.filter-checkbox.active {
  background: rgba(140,43,27,0.5);
}

.filter-checkbox input {
  display: none;
}

.checkbox-label {
  color: #D4C39E;
  font-size: 0.9rem;
}

.sidebar-select {
  width: 100%;
  padding: 10px 12px;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  font-size: 0.9rem;
  cursor: pointer;
}

.quick-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-filters button {
  padding: 10px 12px;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-filters button:hover {
  border-color: #D4AF37;
}

.quick-filters button.active {
  background: rgba(212,175,55,0.2);
  border-color: #D4AF37;
  color: #D4AF37;
}

.reset-btn {
  width: 100%;
  padding: 12px;
  background: #444;
  border: none;
  border-radius: 5px;
  color: #D4C39E;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.reset-btn:hover {
  background: #555;
}

.content-area {
  flex: 1;
  min-width: 0;
}

.featured-section {
  margin-bottom: 30px;
}

.featured-label {
  color: #D4AF37;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.featured-card {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 25px;
  border: 2px solid #D4AF37;
  position: relative;
}

.featured-card.legendary {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255,215,0,0.2);
}

.featured-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #D4AF37;
  color: #1A120B;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
}

.featured-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.featured-icon {
  font-size: 3rem;
}

.featured-info {
  flex: 1;
}

.featured-info h4 {
  color: #D4AF37;
  margin: 0 0 10px 0;
  font-size: 1.3rem;
}

.featured-info p {
  color: #D4C39E;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
}

.featured-meta {
  display: flex;
  gap: 20px;
  color: #888;
  font-size: 0.9rem;
}

.featured-claim-btn {
  margin-top: 15px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #D4AF37, #B89500);
  border: none;
  border-radius: 5px;
  color: #1A120B;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.featured-claim-btn:hover {
  transform: scale(1.02);
}

.bounty-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.bounty-card {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 25px;
  border-left: 4px solid;
  transition: all 0.3s;
}

.bounty-card.easy { border-color: #2ecc71; }
.bounty-card.medium { border-color: #3498db; }
.bounty-card.hard { border-color: #f39c12; }
.bounty-card.legendary { border-color: #ffd700; }

.bounty-card.claimed {
  opacity: 0.7;
}

.bounty-card:hover {
  transform: translateY(-3px);
}

.bounty-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;
}

.bounty-rank {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
}

.bounty-icon {
  font-size: 2rem;
}

.bounty-title-section h3 {
  color: #D4AF37;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.bounty-meta {
  display: flex;
  gap: 10px;
}

.bounty-type,
.bounty-difficulty {
  padding: 3px 8px;
  background: rgba(140,43,27,0.3);
  border-radius: 3px;
  font-size: 0.75rem;
  color: #D4C39E;
}

.bounty-description {
  color: #D4C39E;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.bounty-details {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #888;
  font-size: 0.9rem;
}

.bounty-rewards {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: rgba(212,175,55,0.1);
  border-radius: 5px;
}

.reward-icon {
  font-size: 1rem;
}

.reward-value {
  color: #D4AF37;
  font-size: 0.9rem;
}

.claim-btn {
  width: 100%;
  padding: 12px;
  background: #D4AF37;
  color: #1A120B;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.claim-btn:hover {
  background: #B89500;
}

.claim-btn.claimed {
  background: #444;
  color: #888;
  cursor: not-allowed;
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

@media (max-width: 900px) {
  .bounty-main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    position: static;
  }
}
</style>
