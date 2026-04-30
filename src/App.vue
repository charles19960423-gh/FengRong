<template>
  <div class="app-container">
    <header-component />
    <nav-component />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer-component />
    <notification-container />
  </div>
</template>

<script setup>
import HeaderComponent from './components/common/HeaderComponent.vue'
import NavComponent from './components/common/NavComponent.vue'
import FooterComponent from './components/common/FooterComponent.vue'
import NotificationContainer from './components/common/NotificationContainer.vue'
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
