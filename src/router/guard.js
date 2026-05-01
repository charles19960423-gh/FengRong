import { useAuthStore } from '../stores'

export function setupRouterGuard(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    if (to.meta.title) {
      document.title = `${to.meta.title} - 凤荣酒馆`
    }

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      next('/')
    } else {
      next()
    }
  })

  router.afterEach((to, from) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
