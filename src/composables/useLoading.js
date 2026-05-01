import { ref, computed } from 'vue'

/**
 * 加载状态管理 composable
 * @param {string} key - 唯一标识
 * @param {object} options - 配置选项
 */
export function useLoading(key = 'default', options = {}) {
  const { initialState = false } = options
  
  const loadingStates = ref({})
  
  // 初始化状态
  if (!loadingStates.value[key]) {
    loadingStates.value[key] = initialState
  }
  
  const isLoading = computed(() => !!loadingStates.value[key])
  
  const startLoading = () => {
    loadingStates.value[key] = true
  }
  
  const stopLoading = () => {
    loadingStates.value[key] = false
  }
  
  const toggleLoading = () => {
    loadingStates.value[key] = !loadingStates.value[key]
  }
  
  /**
   * 包装异步函数，自动管理加载状态
   * @param {Function} asyncFn - 异步函数
   * @returns {Function} - 包装后的函数
   */
  const withLoading = async (asyncFn) => {
    return async (...args) => {
      startLoading()
      try {
        const result = await asyncFn(...args)
        return result
      } catch (error) {
        throw error
      } finally {
        stopLoading()
      }
    }
  }
  
  /**
   * 包装 Promise，自动管理加载状态
   * @param {Promise} promise - Promise 对象
   * @returns {Promise} - 包装后的 Promise
   */
  const wrapPromise = (promise) => {
    startLoading()
    return promise
      .finally(() => {
        stopLoading()
      })
  }
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading,
    wrapPromise
  }
}

/**
 * 全局加载状态管理
 */
const globalLoading = ref({})

export const globalLoadingApi = {
  /**
   * 设置全局加载状态
   * @param {string} key - 状态 key
   * @param {boolean} value - 是否加载中
   */
  set(key, value) {
    globalLoading.value[key] = value
  },
  
  /**
   * 获取全局加载状态
   * @param {string} key - 状态 key
   * @returns {boolean}
   */
  get(key) {
    return !!globalLoading.value[key]
  },
  
  /**
   * 检查是否有任何加载状态
   * @returns {boolean}
   */
  hasAny() {
    return Object.values(globalLoading.value).some(v => v)
  },
  
  /**
   * 清除所有加载状态
   */
  clear() {
    globalLoading.value = {}
  }
}

export default useLoading