<template>
  <div class="app-container">
    <header-component />
    <nav-component />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </main>
    <footer-component />
    <notification-container />
    <toast-notification />
    <global-loading />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderComponent from './components/common/HeaderComponent.vue'
import NavComponent from './components/common/NavComponent.vue'
import FooterComponent from './components/common/FooterComponent.vue'
import NotificationContainer from './components/common/NotificationContainer.vue'
import ToastNotification from './components/common/ToastNotification.vue'
import GlobalLoading from './components/common/GlobalLoading.vue'

// 需要缓存的页面（白名单）
const cachedViews = ref(['Home', 'Tasks', 'Equipment', 'Resources', 'Events'])
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
