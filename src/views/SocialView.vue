<template>
  <div class="social-page">
    <div class="page-header">
      <h1>🍻 社交酒馆</h1>
      <p>结识同行伙伴，通过任务建立深厚友谊</p>
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

    <div v-if="currentView === 'feed'" class="feed-view">
      <div class="activity-list">
        <div 
          v-for="activity in socialStore.socialActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-avatar">{{ activity.user.avatar }}</div>
          <div class="activity-content">
            <div class="activity-header">
              <span class="activity-user">{{ activity.user.nickname }}</span>
              <span class="activity-action">{{ activity.action }}</span>
              <span class="activity-target">{{ activity.target }}</span>
            </div>
            <div class="activity-time">{{ activity.time }}</div>
            <div v-if="activity.reward" class="activity-reward">{{ activity.reward }}</div>
            <div v-if="activity.members" class="activity-members">👥 {{ activity.members }}人组队</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'friends'" class="friends-view">
      <div class="friends-tabs">
        <button 
          :class="{ active: friendsTab === 'all' }" 
          @click="friendsTab = 'all'"
        >
          全部 ({{ socialStore.friends.length }})
        </button>
        <button 
          :class="{ active: friendsTab === 'online' }" 
          @click="friendsTab = 'online'"
        >
          在线 ({{ socialStore.onlineFriends.length }})
        </button>
        <button 
          :class="{ active: friendsTab === 'offline' }" 
          @click="friendsTab = 'offline'"
        >
          离线 ({{ socialStore.offlineFriends.length }})
        </button>
      </div>

      <div class="friends-list">
        <div 
          v-for="friend in filteredFriends" 
          :key="friend.id"
          class="friend-card"
        >
          <div class="friend-avatar">
            {{ friend.avatar }}
            <span class="status-dot" :class="friend.status"></span>
          </div>
          <div class="friend-info">
            <div class="friend-name">
              <span>{{ friend.nickname }}</span>
              <span class="friend-level">Lv.{{ friend.level }}</span>
            </div>
            <div class="friend-title">{{ friend.title }}</div>
            <div class="friend-meta">
              <span v-if="friend.commonTasks > 0">共同任务 {{ friend.commonTasks }}个</span>
              <span v-if="friend.mutualFriends > 0">· 共同好友 {{ friend.mutualFriends }}人</span>
            </div>
          </div>
          <div class="friend-status">
            <span v-if="friend.status === 'online'" class="online-text">在线</span>
            <span v-else class="offline-text">{{ friend.lastActive }}</span>
          </div>
          <div class="friend-actions">
            <button class="action-btn" @click="openChat(friend)">💬 聊天</button>
            <button class="action-btn" @click="inviteToTeam(friend)">👥 组队</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'requests'" class="requests-view">
      <div v-if="socialStore.friendRequests.length > 0" class="requests-section">
        <h3>📩 好友请求 ({{ socialStore.friendRequests.length }})</h3>
        <div class="requests-list">
          <div 
            v-for="request in socialStore.friendRequests" 
            :key="request.id"
            class="request-card"
          >
            <div class="request-avatar">{{ request.from.avatar }}</div>
            <div class="request-info">
              <div class="request-name">
                <span>{{ request.from.nickname }}</span>
                <span class="request-level">Lv.{{ request.from.level }}</span>
              </div>
              <div class="request-title">{{ request.from.title }}</div>
              <div v-if="request.message" class="request-message">💬 {{ request.message }}</div>
              <div class="request-time">{{ request.time }}</div>
            </div>
            <div class="request-actions">
              <button class="btn-accept" @click="acceptRequest(request.id)">✅ 接受</button>
              <button class="btn-reject" @click="rejectRequest(request.id)">❌ 拒绝</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="socialStore.pendingRequests.length > 0" class="pending-section">
        <h3>📤 待确认请求 ({{ socialStore.pendingRequests.length }})</h3>
        <div class="pending-list">
          <div 
            v-for="pending in socialStore.pendingRequests" 
            :key="pending.id"
            class="pending-card"
          >
            <div class="pending-avatar">{{ pending.to.avatar || '👤' }}</div>
            <div class="pending-info">
              <div class="pending-name">{{ pending.to.nickname || '未知用户' }}</div>
              <div class="pending-status">等待对方确认 · {{ pending.time }}</div>
            </div>
            <button class="btn-cancel" @click="cancelRequest(pending.id)">取消</button>
          </div>
        </div>
      </div>

      <div v-if="socialStore.friendRequests.length === 0 && socialStore.pendingRequests.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无好友请求</p>
        <button class="empty-action" @click="currentView = 'discover'">去发现新朋友</button>
      </div>
    </div>

    <div v-if="currentView === 'discover'" class="discover-view">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索冒险者..."
        />
        <button class="search-btn">🔍</button>
      </div>

      <h3>✨ 推荐冒险者</h3>
      <div class="discover-list">
        <div 
          v-for="user in recommendations" 
          :key="user.id"
          class="discover-card"
        >
          <div class="discover-avatar">{{ user.avatar }}</div>
          <div class="discover-info">
            <div class="discover-name">
              <span>{{ user.nickname }}</span>
              <span class="discover-level">Lv.{{ user.level }}</span>
            </div>
            <div class="discover-title">{{ user.title }}</div>
            <div class="discover-reason">💡 {{ user.reason }}</div>
            <div class="discover-meta">
              <span v-if="user.commonTasks">共同任务 {{ user.commonTasks }}个</span>
              <span v-if="user.mutualFriends">· 共同好友 {{ user.mutualFriends }}人</span>
              <span v-if="user.commonAchievements">· 共同成就 {{ user.commonAchievements }}个</span>
            </div>
          </div>
          <button class="add-friend-btn" @click="sendRequest(user.id)">➕ 加好友</button>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'team'" class="team-view">
      <div class="team-header">
        <h3>👥 我的队伍</h3>
        <button class="create-team-btn" @click="showCreateTeam = true">创建队伍</button>
      </div>

      <div v-if="socialStore.teamMembers.length > 0" class="team-members">
        <div 
          v-for="member in socialStore.teamMembers" 
          :key="member.id"
          class="team-member-card"
        >
          <div class="member-avatar">
            {{ member.avatar }}
            <span class="member-role">{{ member.role }}</span>
          </div>
          <div class="member-info">
            <div class="member-name">
              <span>{{ member.nickname }}</span>
              <span class="member-level">Lv.{{ member.level }}</span>
            </div>
            <span class="member-status" :class="member.status">
              {{ member.status === 'online' ? '🟢 在线' : '⚫ 离线' }}
            </span>
          </div>
          <div class="member-actions">
            <button class="action-btn" @click="openChat(member)">💬</button>
            <button v-if="member.role !== '队长'" class="action-btn" @click="removeFromTeam(member.id)">👋</button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">👥</div>
        <p>还没有队伍</p>
        <button class="empty-action" @click="showCreateTeam = true">创建队伍</button>
      </div>

      <div class="team-activity">
        <h3>📋 队伍任务</h3>
        <div class="team-tasks">
          <div class="team-task-item">
            <span class="task-icon">📋</span>
            <span class="task-name">清除山贼据点</span>
            <span class="task-progress">40%</span>
          </div>
          <div class="team-task-item completed">
            <span class="task-icon">✅</span>
            <span class="task-name">护送商人</span>
            <span class="task-progress">已完成</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSocialStore } from '../stores/social'

const socialStore = useSocialStore()

const currentView = ref('feed')
const friendsTab = ref('all')
const searchQuery = ref('')
const showCreateTeam = ref(false)

const viewModes = [
  { label: '动态', value: 'feed', icon: '📖' },
  { label: '好友', value: 'friends', icon: '👥' },
  { label: '请求', value: 'requests', icon: '📩' },
  { label: '发现', value: 'discover', icon: '🔍' },
  { label: '队伍', value: 'team', icon: '⚔️' }
]

const filteredFriends = computed(() => {
  if (friendsTab.value === 'online') {
    return socialStore.onlineFriends
  } else if (friendsTab.value === 'offline') {
    return socialStore.offlineFriends
  }
  return socialStore.friends
})

const recommendations = computed(() => {
  return socialStore.getRecommendations()
})

function acceptRequest(requestId) {
  if (socialStore.acceptFriendRequest(requestId)) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '🎉 已添加好友', type: 'success' }
    }))
  }
}

function rejectRequest(requestId) {
  if (socialStore.rejectFriendRequest(requestId)) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '已拒绝请求', type: 'info' }
    }))
  }
}

function cancelRequest(requestId) {
  const index = socialStore.pendingRequests.findIndex(r => r.id === requestId)
  if (index !== -1) {
    socialStore.pendingRequests.splice(index, 1)
    socialStore.saveSocialData()
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '已取消请求', type: 'info' }
    }))
  }
}

function sendRequest(userId) {
  if (socialStore.sendFriendRequest(userId)) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '📤 好友请求已发送', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '已发送过请求', type: 'warning' }
    }))
  }
}

function openChat(friend) {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: `💬 打开与 ${friend.nickname} 的聊天`, type: 'info' }
  }))
}

function inviteToTeam(friend) {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: `📨 已邀请 ${friend.nickname} 加入队伍`, type: 'success' }
  }))
}

function removeFromTeam(memberId) {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: '已移除队员', type: 'info' }
  }))
}

onMounted(() => {
  socialStore.loadSocialData()
})
</script>

<style scoped>
.social-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin: 30px 0;
}

.page-header h1 {
  color: #D4AF37;
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.page-header p {
  color: #888;
}

.view-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
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

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
}

.activity-avatar {
  font-size: 2.5rem;
}

.activity-content {
  flex: 1;
}

.activity-header {
  margin-bottom: 8px;
}

.activity-user {
  color: #D4AF37;
  font-weight: bold;
  margin-right: 8px;
}

.activity-action {
  color: #D4C39E;
  margin-right: 8px;
}

.activity-target {
  color: #888;
}

.activity-time {
  color: #666;
  font-size: 0.9rem;
}

.activity-reward {
  color: #2ecc71;
  margin-top: 5px;
}

.activity-members {
  color: #3498db;
  margin-top: 5px;
}

.friends-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 25px;
}

.friends-tabs button {
  padding: 10px 20px;
  background: #2D1E17;
  border: 1px solid #444;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
}

.friends-tabs button.active {
  background: #8C2B1B;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
}

.friend-avatar {
  font-size: 2.5rem;
  position: relative;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: -5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #1A120B;
}

.status-dot.online {
  background: #2ecc71;
}

.status-dot.offline {
  background: #666;
}

.friend-info {
  flex: 1;
}

.friend-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.friend-name span:first-child {
  color: #D4AF37;
  font-weight: bold;
}

.friend-level {
  color: #3498db;
  font-size: 0.9rem;
}

.friend-title {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.friend-meta {
  color: #666;
  font-size: 0.85rem;
}

.friend-status {
  min-width: 80px;
  text-align: right;
}

.online-text {
  color: #2ecc71;
}

.offline-text {
  color: #666;
}

.friend-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 12px;
  background: rgba(140,43,27,0.3);
  border: none;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: rgba(140,43,27,0.5);
}

.requests-section,
.pending-section {
  margin-bottom: 30px;
}

.requests-section h3,
.pending-section h3 {
  color: #D4AF37;
  margin: 0 0 20px 0;
}

.requests-list,
.pending-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.request-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
}

.request-avatar {
  font-size: 2.5rem;
}

.request-info {
  flex: 1;
}

.request-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.request-name span:first-child {
  color: #D4AF37;
  font-weight: bold;
}

.request-level {
  color: #3498db;
  font-size: 0.9rem;
}

.request-title {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.request-message {
  color: #D4C39E;
  margin-bottom: 5px;
}

.request-time {
  color: #666;
  font-size: 0.85rem;
}

.request-actions {
  display: flex;
  gap: 10px;
}

.btn-accept {
  padding: 10px 20px;
  background: #2ecc71;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.btn-reject {
  padding: 10px 20px;
  background: #444;
  border: none;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
}

.pending-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.pending-avatar {
  font-size: 2rem;
}

.pending-info {
  flex: 1;
}

.pending-name {
  color: #D4AF37;
  font-weight: bold;
}

.pending-status {
  color: #666;
  font-size: 0.9rem;
}

.btn-cancel {
  padding: 8px 15px;
  background: #444;
  border: none;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
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
  color: white;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.search-bar input {
  flex: 1;
  padding: 12px 15px;
  background: #2D1E17;
  border: 1px solid #444;
  border-radius: 8px;
  color: #D4C39E;
}

.search-btn {
  padding: 12px 20px;
  background: #8C2B1B;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
}

.discover-view h3 {
  color: #D4AF37;
  margin: 0 0 20px 0;
}

.discover-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.discover-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
}

.discover-avatar {
  font-size: 2.5rem;
}

.discover-info {
  flex: 1;
}

.discover-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.discover-name span:first-child {
  color: #D4AF37;
  font-weight: bold;
}

.discover-level {
  color: #3498db;
  font-size: 0.9rem;
}

.discover-title {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.discover-reason {
  color: #f39c12;
  margin-bottom: 5px;
}

.discover-meta {
  color: #666;
  font-size: 0.85rem;
}

.add-friend-btn {
  padding: 10px 20px;
  background: #D4AF37;
  border: none;
  border-radius: 5px;
  color: #1A120B;
  font-weight: bold;
  cursor: pointer;
}

.add-friend-btn:hover {
  background: #B89500;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.team-header h3 {
  color: #D4AF37;
  margin: 0;
}

.create-team-btn {
  padding: 10px 20px;
  background: #8C2B1B;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.team-members {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.team-member-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 12px;
}

.member-avatar {
  font-size: 2.5rem;
  position: relative;
}

.member-role {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #8C2B1B;
  color: white;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 3px;
}

.member-info {
  flex: 1;
}

.member-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.member-name span:first-child {
  color: #D4AF37;
  font-weight: bold;
}

.member-level {
  color: #3498db;
  font-size: 0.9rem;
}

.member-status {
  font-size: 0.9rem;
}

.member-status.online {
  color: #2ecc71;
}

.member-status.offline {
  color: #666;
}

.team-activity {
  background: rgba(140,43,27,0.1);
  padding: 20px;
  border-radius: 12px;
}

.team-activity h3 {
  color: #D4AF37;
  margin: 0 0 15px 0;
}

.team-tasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-task-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.team-task-item.completed {
  opacity: 0.6;
}

.task-icon {
  font-size: 1.2rem;
}

.task-name {
  flex: 1;
  color: #D4C39E;
}

.task-progress {
  color: #D4AF37;
}

@media (max-width: 600px) {
  .friend-card,
  .request-card,
  .discover-card,
  .team-member-card {
    flex-direction: column;
    text-align: center;
  }
  
  .friend-info,
  .request-info,
  .discover-info,
  .member-info {
    margin: 10px 0;
  }
  
  .friend-status {
    text-align: center;
  }
  
  .friend-actions,
  .request-actions {
    margin-top: 10px;
  }
}
</style>