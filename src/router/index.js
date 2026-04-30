import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('../views/AchievementsView.vue')
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/TasksView.vue')
  },
  {
    path: '/workbench',
    name: 'Workbench',
    component: () => import('../views/TaskWorkbench.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/bounty',
    name: 'Bounty',
    component: () => import('../views/BountyView.vue')
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('../views/PublishView.vue')
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('../views/SocialView.vue')
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('../views/WalletView.vue')
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('../views/EquipmentView.vue')
  },
  {
    path: '/milestone',
    name: 'Milestone',
    component: () => import('../views/MilestoneView.vue')
  },
  {
    path: '/client-console',
    name: 'ClientConsole',
    component: () => import('../views/ClientConsole.vue')
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('../views/ResourceView.vue')
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/TeamProjectView.vue')
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/EventView.vue')
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: () => import('../views/CouponView.vue')
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/NotificationView.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/OrderView.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoriteView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  },
  {
    path: '/support',
    name: 'Support',
    component: () => import('../views/SupportView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
