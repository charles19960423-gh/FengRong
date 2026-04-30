<template>
  <div class="profile-page">
    <div v-if="authStore.isLoggedIn" class="profile-content">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar">
            <span>{{ getAvatarIcon() }}</span>
          </div>
          <div class="edit-avatar-btn">
            <span>📷</span>
          </div>
        </div>
        <div class="user-info">
          <h1>{{ authStore.currentUser?.nickname }}</h1>
          <p class="username">Lv.{{ authStore.currentUser?.level }} · @{{ authStore.currentUser?.phone }}</p>
          <div class="user-stats">
            <span class="stat coins">💰 {{ formatNumber(authStore.currentUser?.coins || 0) }}</span>
            <span class="stat prestige">⭐ {{ authStore.currentUser?.prestige || 0 }}</span>
            <span class="stat pearls">💎 {{ authStore.currentUser?.pearls || 0 }}</span>
          </div>
          <router-link to="/wallet" class="wallet-link">
            查看资产详情 →
          </router-link>
        </div>
      </div>

      <div class="quick-links">
        <router-link to="/coupons" class="quick-link">
          <span class="link-icon">🎫</span>
          <span class="link-name">优惠券</span>
        </router-link>
        <router-link to="/notifications" class="quick-link">
          <span class="link-icon">🔔</span>
          <span class="link-name">消息</span>
        </router-link>
        <router-link to="/orders" class="quick-link">
          <span class="link-icon">📋</span>
          <span class="link-name">订单</span>
        </router-link>
        <router-link to="/favorites" class="quick-link">
          <span class="link-icon">⭐</span>
          <span class="link-name">收藏</span>
        </router-link>
        <router-link to="/settings" class="quick-link">
          <span class="link-icon">⚙️</span>
          <span class="link-name">设置</span>
        </router-link>
        <router-link to="/support" class="quick-link">
          <span class="link-icon">💬</span>
          <span class="link-name">客服</span>
        </router-link>
      </div>

      <div class="tabs-container">
        <div class="tabs">
          <button :class="{ active: activeTab === 'achievements' }" @click="activeTab = 'achievements'">装备成就</button>
          <button :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">个人信息</button>
          <button :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">安全设置</button>
        </div>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'achievements'" class="achievements-tab">
          <h2>装备成就徽章</h2>
          <p>最多可装备3个成就徽章</p>
          <div class="equip-slots">
            <div 
              v-for="(slot, index) in achievementStore.getEquippedData()" 
              :key="index"
              class="equip-slot"
            >
              <div v-if="slot" class="slot-content" :style="{ '--rarity-color': achievementStore.getRarityColor(slot.rarity) }">
                <span class="slot-icon">{{ slot.icon }}</span>
                <span class="slot-name">{{ slot.name }}</span>
                <button class="unequip-btn" @click="achievementStore.unequip(index)">卸下</button>
              </div>
              <div v-else class="slot-empty" @click="openEquipModal(index)">
                <span>+ 装备成就</span>
              </div>
            </div>
          </div>
          <div v-if="showEquipModal" class="equip-modal-overlay" @click.self="showEquipModal = false">
            <div class="equip-modal">
              <button class="close-btn" @click="showEquipModal = false">×</button>
              <h3>选择要装备的成就</h3>
              <div class="modal-achievements">
                <div 
                  v-for="achievement in unlockedAchievements" 
                  :key="achievement.id"
                  class="modal-achievement"
                  :class="{ selected: selectedAchievement?.id === achievement.id }"
                  :style="{ '--rarity-color': achievementStore.getRarityColor(achievement.rarity) }"
                  @click="selectedAchievement = achievement"
                >
                  <span>{{ achievement.icon }}</span>
                  <span>{{ achievement.name }}</span>
                </div>
              </div>
              <button class="confirm-btn" @click="confirmEquip">装备</button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'info'" class="info-tab">
          <h2>个人信息</h2>
          <form @submit.prevent="saveInfo" class="info-form">
            <div class="form-row">
              <div class="form-group">
                <label>昵称</label>
                <input v-model="userForm.nickname" type="text" />
                <span v-if="errors.nickname" class="error">{{ errors.nickname }}</span>
              </div>
              <div class="form-group">
                <label>冒险者ID</label>
                <input :value="authStore.currentUser?.username" disabled />
              </div>
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input v-model="userForm.email" type="email" />
            </div>
            <button type="submit" class="submit-btn">保存修改</button>
          </form>
        </div>

        <div v-if="activeTab === 'security'" class="security-tab">
          <h2>安全设置</h2>
          <form @submit.prevent="changePassword" class="security-form">
            <div class="form-group">
              <label>当前密码</label>
              <input v-model="passwordForm.current" type="password" />
            </div>
            <div class="form-group">
              <label>新密码</label>
              <input v-model="passwordForm.new" type="password" />
            </div>
            <div class="form-group">
              <label>确认新密码</label>
              <input v-model="passwordForm.confirm" type="password" />
              <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>
            <button type="submit" class="submit-btn">修改密码</button>
          </form>
          <div class="security-tips">
            <h3>安全小贴士</h3>
            <ul>
              <li>使用复杂密码，包含字母、数字和特殊字符</li>
              <li>定期更换密码，建议每3个月更换一次</li>
              <li>不要在公共设备上保存登录信息</li>
              <li>开启双重验证（如果支持）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-logged-in">
      <div class="empty-icon">👤</div>
      <h2>请先登录</h2>
      <p>登录后可查看个人信息和管理成就</p>
      <button class="login-btn" @click="openAuthModal">立即登录</button>
    </div>
    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAchievementStore } from '../stores/achievement'
import { useTaskStore } from '../stores/task'
import AuthModal from '../components/Auth/AuthModal.vue'

const authStore = useAuthStore()
const achievementStore = useAchievementStore()
const taskStore = useTaskStore()

const activeTab = ref('achievements')
const showEquipModal = ref(false)
const selectedSlotIndex = ref(0)
const selectedAchievement = ref(null)
const showAuthModal = ref(false)

const userForm = reactive({
  nickname: '',
  email: ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const errors = reactive({
  nickname: '',
  password: ''
})

const unlockedAchievements = computed(() => {
  return achievementStore.filterByCategory('all').filter(a => a.unlockedAt !== null)
})

function getAvatarIcon() {
  const user = authStore.currentUser
  if (!user) return '👤'
  
  const icons = {
    '13800138001': '👑',
    '13800138002': '🗡️',
    '13800138003': '🏹'
  }
  return icons[user.phone] || '👤'
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

function openEquipModal(index) {
  selectedSlotIndex.value = index
  showEquipModal.value = true
}

function confirmEquip() {
  if (selectedAchievement.value) {
    achievementStore.equip(selectedAchievement.value.id, selectedSlotIndex.value)
    showEquipModal.value = false
    selectedAchievement.value = null
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '成就装备成功！', type: 'success' }
    }))
  }
}

function saveInfo() {
  errors.nickname = ''
  
  if (!userForm.nickname) {
    errors.nickname = '请输入昵称'
    return
  }
  
  authStore.updateUserNav({
    ...authStore.currentUser,
    nickname: userForm.nickname,
    email: userForm.email
  })
  
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '信息保存成功！', type: 'success' }
  }))
}

function changePassword() {
  errors.password = ''
  
  if (!passwordForm.current) {
    errors.password = '请输入当前密码'
    return
  }
  if (!passwordForm.new || passwordForm.new.length < 6) {
    errors.password = '新密码长度不能少于6位'
    return
  }
  if (passwordForm.new !== passwordForm.confirm) {
    errors.password = '两次输入的密码不一致'
    return
  }
  
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '密码修改成功！', type: 'success' }
  }))
  
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

function openAuthModal() {
  showAuthModal.value = true
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-content {
  margin-top: 30px;
}

.profile-header {
  display: flex;
  gap: 30px;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, rgba(140,43,27,0.1) 0%, rgba(212,175,55,0.05) 100%);
  border-radius: 15px;
  margin-bottom: 30px;
}

.avatar-section {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8C2B1B 0%, #D4AF37 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 35px;
  height: 35px;
  background: #D4AF37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-info h1 {
  color: #D4AF37;
  margin: 0 0 5px 0;
  font-size: 2rem;
}

.username {
  color: #888;
  margin: 0 0 15px 0;
}

.user-stats {
  display: flex;
  gap: 25px;
}

.user-stats .stat {
  color: #D4C39E;
  font-size: 0.95rem;
}

.user-stats .stat.coins { color: #D4AF37; }
.user-stats .stat.prestige { color: #f39c12; }
.user-stats .stat.pearls { color: #00bcd4; }

.wallet-link {
  display: inline-block;
  margin-top: 15px;
  color: #D4AF37;
  text-decoration: none;
  font-size: 0.95rem;
}

.wallet-link:hover {
  text-decoration: underline;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(140,43,27,0.1) 0%, rgba(212,175,55,0.05) 100%);
  border-radius: 12px;
  color: #D4C39E;
  text-decoration: none;
  transition: all 0.3s;
}

.quick-link:hover {
  background: linear-gradient(135deg, rgba(140,43,27,0.2) 0%, rgba(212,175,55,0.1) 100%);
  color: #D4AF37;
}

.link-icon {
  font-size: 1.5rem;
}

.link-name {
  font-size: 0.9rem;
}

.tabs-container {
  margin-bottom: 30px;
}

.tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #444;
}

.tabs button {
  padding: 12px 25px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 1rem;
  position: relative;
  transition: color 0.2s;
}

.tabs button.active {
  color: #D4AF37;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #D4AF37;
}

.tab-content {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
  padding: 30px;
}

.tab-content h2 {
  color: #D4AF37;
  margin: 0 0 10px 0;
}

.tab-content > p {
  color: #888;
  margin: 0 0 25px 0;
}

.equip-slots {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.equip-slot {
  width: 180px;
  height: 180px;
  border: 2px dashed #444;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-content {
  width: 100%;
  height: 100%;
  background: rgba(140,43,27,0.3);
  border-radius: 10px;
  border: 2px solid var(--rarity-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.slot-icon {
  font-size: 3rem;
}

.slot-name {
  color: #D4C39E;
  font-size: 0.9rem;
  text-align: center;
}

.unequip-btn {
  padding: 5px 15px;
  background: #444;
  border: none;
  border-radius: 3px;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
}

.slot-empty {
  color: #666;
  text-align: center;
  cursor: pointer;
  padding: 20px;
}

.slot-empty:hover {
  color: #D4AF37;
}

.equip-modal-overlay {
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

.equip-modal {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border: 2px solid #8C2B1B;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 30px;
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
}

.equip-modal h3 {
  color: #D4AF37;
  margin: 0 0 20px 0;
}

.modal-achievements {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.modal-achievement {
  padding: 15px;
  background: rgba(140,43,27,0.2);
  border: 2px solid transparent;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-achievement:hover,
.modal-achievement.selected {
  border-color: var(--rarity-color);
}

.modal-achievement span:first-child {
  font-size: 2rem;
}

.modal-achievement span:last-child {
  color: #D4C39E;
  font-size: 0.9rem;
}

.confirm-btn {
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #D4C39E;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: #333;
  border: 1px solid #444;
  border-radius: 5px;
  color: white;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #D4AF37;
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  padding: 12px 30px;
  background: #D4AF37;
  color: #1A120B;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.submit-btn:hover {
  background: #B89500;
}

.error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.security-tips {
  margin-top: 30px;
  padding: 20px;
  background: rgba(140,43,27,0.1);
  border-radius: 10px;
}

.security-tips h3 {
  color: #D4AF37;
  margin: 0 0 15px 0;
}

.security-tips ul {
  color: #888;
  margin: 0;
  padding-left: 20px;
}

.security-tips li {
  margin-bottom: 8px;
}

.not-logged-in {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.not-logged-in h2 {
  color: #D4AF37;
  margin: 0 0 10px 0;
  font-size: 1.8rem;
}

.not-logged-in p {
  color: #888;
  margin: 0 0 25px 0;
}

.login-btn {
  padding: 12px 30px;
  background: #8C2B1B;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.login-btn:hover {
  background: #A03320;
}
</style>
