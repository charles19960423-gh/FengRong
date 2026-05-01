import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  }
})

setupRouterGuard(router)

export default router
