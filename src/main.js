import { createApp } from 'vue'
import { pinia, useTaskStore, useAuthStore, useCouponStore, useFavoriteStore, useEquipmentStore } from './stores'
import router from './router'
import App from './App.vue'
import './styles/main.css'
import lazyLoad from './directives/lazyLoad'
import useTheme from './composables/useTheme'

const app = createApp(App)

app.use(pinia)
app.use(router)

// 注册懒加载指令
app.use(lazyLoad)

// 初始化主题
useTheme()

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  // 可以在这里发送错误报告到监控系统
  window.dispatchEvent(new CustomEvent('showToast', { 
    detail: { message: '发生了一些错误，请刷新页面重试', type: 'error' } 
  }))
}

app.mount('#app')

// 初始化数据（使用 Promise.all 并行加载，带错误处理）
const initStores = async () => {
  const stores = [
    { name: 'task', load: () => { try { useTaskStore().loadTasks() } catch(e) {} } },
    { name: 'auth', load: () => { try { useAuthStore().autoLogin() } catch(e) {} } },
    { name: 'coupon', load: () => { try { useCouponStore().loadUserCoupons() } catch(e) {} } },
    { name: 'favorite', load: () => { try { useFavoriteStore().loadFavorites() } catch(e) {} } },
    { name: 'equipment', load: () => { try { useEquipmentStore().loadRentals() } catch(e) {} } }
  ]

  // 并行加载所有 store 数据
  const loadPromises = stores.map(({ name, load }) => {
    try {
      return Promise.resolve(load()).catch(err => {
        console.warn(`${name} store 加载失败:`, err)
        return null
      })
    } catch (err) {
      console.warn(`${name} store 初始化失败:`, err)
      return Promise.resolve(null)
    }
  })

  // 等待所有加载完成（不阻塞 UI）
  Promise.allSettled(loadPromises).then(() => {
    console.log('所有数据加载完成')
  })
}

// 延迟初始化，让 UI 先渲染
setTimeout(() => {
  initStores()
}, 100)
