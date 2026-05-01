<template>
  <nav class="main-nav">
    <div class="nav-container">
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.path">
          <router-link 
            :to="item.path" 
            :class="{ active: $route.path === item.path }"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
      <div id="authNav" class="auth-nav">
        <template v-if="authStore.isLoggedIn">
          <template v-if="authStore.isClient">
            <router-link to="/client" class="nav-btn primary">
               {{ authStore.currentUser?.companyName }}
            </router-link>
          </template>
          <template v-else>
            <router-link to="/profile" class="nav-btn primary">
               {{ authStore.currentUser?.nickname }}
            </router-link>
          </template>
          <button class="nav-btn secondary" @click="handleLogout">
            登出
          </button>
        </template>
        <template v-else>
          <button class="nav-btn primary" @click="openAuthModal">
             登录/注册
          </button>
        </template>
      </div>
    </div>
    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import AuthModal from '../Auth/AuthModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const showAuthModal = ref(false)

const navItems = computed(() => {
  const items = [
    { path: '/', name: '首页', icon: '' },
    { path: '/achievements', name: '成就', icon: '' },
    { path: '/tasks', name: '任务', icon: '' },
    { path: '/milestone', name: '里程碑', icon: '' },
    { path: '/workbench', name: '工作台', icon: '' },
    { path: '/resources', name: '江湖秘典', icon: '' },
    { path: '/team', name: '组队', icon: '' },
    { path: '/events', name: '聚会', icon: '' },
    { path: '/publish', name: '发布', icon: '' },
    { path: '/social', name: '社交', icon: '' },
    { path: '/coupons', name: '优惠券', icon: '' },
    { path: '/notifications', name: '消息', icon: '' },
    { path: '/profile', name: '我的', icon: '' }
  ]

  if (authStore.isClient) {
    return [
      { path: '/', name: '首页', icon: '' },
      { path: '/client', name: '控制台', icon: '' },
      { path: '/resources', name: '江湖秘典', icon: '' },
      { path: '/team', name: '组队', icon: '' },
      { path: '/events', name: '聚会', icon: '' }
    ]
  }

  return items
})

function openAuthModal() {
  showAuthModal.value = true
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  authStore.autoLogin()
})
</script>

<style scoped>
.main-nav {
  position: sticky;
  top: 34px;
  background: rgba(26,18,11,0.95);
  border-bottom: 2px solid #8C2B1B;
  padding: 15px 0;
  z-index: 1200;
  backdrop-filter: blur(5px);
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.nav-list {
  display: flex;
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.nav-list a {
  color: #D4C39E;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 3px;
  transition: all 0.3s;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.nav-list a:hover,
.nav-list a.active {
  background: #8C2B1B;
  color: white;
}

.auth-nav {
  display: flex;
  gap: 10px;
}

.nav-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.nav-btn.primary {
  background: #D4AF37;
  color: #1A120B;
  font-weight: bold;
}

.nav-btn.primary:hover {
  background: #B89500;
}

.nav-btn.secondary {
  background: #666;
  color: white;
}

.nav-btn.secondary:hover {
  background: #555;
}
</style>

