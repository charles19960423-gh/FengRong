<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h2>欢迎来到枫榕赏金酒馆</h2>
          <p>江湖侠客的聚集地任务与成就的殿堂</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value">{{ achievementStore.stats.total }}</span>
              <span class="stat-label">成就总数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ achievementStore.stats.unlocked }}</span>
              <span class="stat-label">已解锁</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ achievementStore.stats.progress }}%</span>
              <span class="stat-label">完成进度</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="achievement-showcase">
            <div 
              v-for="(achievement, index) in showcaseAchievements" 
              :key="achievement.id"
              class="showcase-item"
              :style="{ animationDelay: `${index * 0.2}s` }"
            >
              <span class="showcase-icon">{{ achievement.icon }}</span>
              <span class="showcase-name">{{ achievement.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="quick-actions">
      <div class="action-cards">
        <router-link to="/achievements" class="action-card">
          <div class="card-icon"></div>
          <h3>成就系统</h3>
          <p>查看你的成就收集进度</p>
        </router-link>
        <router-link to="/tasks" class="action-card">
          <div class="card-icon"></div>
          <h3>任务中心</h3>
          <p>管理你的任务列表</p>
        </router-link>
        <router-link to="/bounty" class="action-card">
          <div class="card-icon"></div>
          <h3>赏金榜单</h3>
          <p>领取高额赏金任务</p>
        </router-link>
        <router-link to="/profile" class="action-card">
          <div class="card-icon"></div>
          <h3>我的江湖</h3>
          <p>查看个人信息</p>
        </router-link>
      </div>
    </section>

    <section class="recent-achievements">
      <h2>近期成就</h2>
      <div class="achievements-grid">
        <div 
          v-for="achievement in recentAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :style="{ '--rarity-color': achievementStore.getRarityColor(achievement.rarity) }"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <h4>{{ achievement.name }}</h4>
            <p class="achievement-category">{{ achievement.category }}</p>
            <p class="achievement-desc">{{ achievement.description }}</p>
          </div>
          <div class="achievement-rarity" :class="achievement.rarity">
            {{ achievement.rarityText }}
          </div>
        </div>
      </div>
    </section>

    <section class="tips-section">
      <h2>江湖小贴士</h2>
      <div class="tips-list">
        <div v-for="(tip, index) in tips" :key="index" class="tip-item">
          <span class="tip-icon">{{ tip.icon }}</span>
          <p>{{ tip.text }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAchievementStore } from '@/stores'
import { useTaskStore } from '@/stores'

const achievementStore = useAchievementStore()
const taskStore = useTaskStore()

const showcaseAchievements = computed(() => {
  return achievementStore.filterByCategory('all')
    .filter(a => a.unlockedAt !== null)
    .slice(0, 6)
})

const recentAchievements = computed(() => {
  return achievementStore.filterByCategory('all')
    .filter(a => a.unlockedAt !== null)
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 4)
})

const tips = [
  { icon: '', text: '每日登录可获得额外声望奖励' },
  { icon: '', text: '完成赏金任务可解锁稀世成就' },
  { icon: '', text: '邀请好友加入可获得丰厚奖励' },
  { icon: '', text: '装备成就徽章可展示你的实力' },
  { icon: '', text: '赛季活动期间奖励翻倍' },
  { icon: '', text: '上传任务素材可获得额外奖励' }
]

onMounted(() => {
  taskStore.loadTasks()
})
</script>

<style scoped>
.home-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  background: linear-gradient(135deg, rgba(140,43,27,0.1) 0%, rgba(212,175,55,0.05) 100%);
  border-radius: 15px;
  padding: 40px;
  margin: 30px 0;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.hero-text h2 {
  color: #D4AF37;
  font-size: 2.2rem;
  margin-bottom: 15px;
}

.hero-text p {
  color: #D4C39E;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.hero-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #D4AF37;
}

.stat-label {
  display: block;
  color: #888;
  font-size: 0.9rem;
}

.achievement-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.showcase-item {
  background: rgba(140,43,27,0.3);
  border-radius: 10px;
  padding: 15px 20px;
  text-align: center;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.showcase-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 5px;
}

.showcase-name {
  display: block;
  color: #D4C39E;
  font-size: 0.85rem;
}

.quick-actions {
  margin: 40px 0;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border: 2px solid #8C2B1B;
  border-radius: 12px;
  padding: 25px;
  text-decoration: none;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  border-color: #D4AF37;
  box-shadow: 0 10px 30px rgba(212,175,55,0.2);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.action-card h3 {
  color: #D4AF37;
  margin: 0 0 10px 0;
}

.action-card p {
  color: #888;
  margin: 0;
}

.recent-achievements {
  margin: 50px 0;
}

.recent-achievements h2 {
  color: #D4AF37;
  margin-bottom: 20px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid var(--rarity-color);
}

.achievement-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.achievement-info h4 {
  color: #D4AF37;
  margin: 0 0 5px 0;
}

.achievement-category {
  color: #888;
  font-size: 0.85rem;
  margin: 0 0 10px 0;
}

.achievement-desc {
  color: #D4C39E;
  margin: 0;
  font-size: 0.9rem;
}

.achievement-rarity {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 0.75rem;
  margin-top: 10px;
}

.achievement-rarity.common { background: #9e9e9e; color: #fff; }
.achievement-rarity.uncommon { background: #2ecc71; color: #fff; }
.achievement-rarity.rare { background: #3498db; color: #fff; }
.achievement-rarity.epic { background: #9b59b6; color: #fff; }
.achievement-rarity.legendary { background: #ffd700; color: #1A120B; }

.tips-section {
  background: rgba(140,43,27,0.1);
  border-radius: 15px;
  padding: 30px;
  margin: 40px 0;
}

.tips-section h2 {
  color: #D4AF37;
  margin-bottom: 20px;
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #D4C39E;
}

.tip-icon {
  font-size: 1.2rem;
}
</style>

