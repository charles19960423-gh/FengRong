import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

import { useTaskStore } from './stores/task'
import { useAuthStore } from './stores/auth'

app.mount('#app')

const taskStore = useTaskStore()
const authStore = useAuthStore()
taskStore.loadTasks()
taskStore.loadDrafts()
authStore.loadUser()
