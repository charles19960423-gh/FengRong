import { ref, watch } from 'vue'

/**
 * 主题管理 composable
 * 支持亮色/暗色主题切换
 */
export function useTheme() {
  const THEME_KEY = 'fr_theme'
  
  // 主题状态
  const isDark = ref(false)
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 检测系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    applyTheme()
  }
  
  // 应用主题到 DOM
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.classList.remove('dark-mode')
    }
  }
  
  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
    applyTheme()
  }
  
  // 设置主题
  const setTheme = (theme) => {
    isDark.value = theme === 'dark'
    localStorage.setItem(THEME_KEY, theme)
    applyTheme()
  }
  
  // 监听系统主题变化
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  }
  
  // 初始化
  initTheme()
  watchSystemTheme()
  
  // 监听变化
  watch(isDark, () => {
    applyTheme()
  })
  
  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme
  }
}

export default useTheme