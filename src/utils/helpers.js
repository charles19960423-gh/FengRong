/**
 * 工具函数模块
 * @module utils/helpers
 */

/**
 * 格式化日期
 * @param {string|Date} dateStr - 日期字符串或 Date 对象
 * @returns {string} 格式化后的日期字符串 (YYYY-MM-DD)
 * @example
 * formatDate('2024-12-20') // '2024-12-20'
 * formatDate(new Date()) // '2024-12-20'
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取距离截止日期的剩余天数
 * @param {string|Date} deadline - 截止日期
 * @returns {string} 剩余天数描述
 * @example
 * getDaysRemaining('2024-12-25') // '3天' 或 '已过期'
 */
export function getDaysRemaining(deadline) {
  const today = new Date()
  const endDate = new Date(deadline)
  const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
  return diff > 0 ? `${diff}天` : '已过期'
}

/**
 * 防抖函数 - 限制函数执行频率
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒），默认 300ms
 * @returns {Function} 防抖后的函数
 * @example
 * const debouncedSearch = debounce(search, 500)
 * input.addEventListener('input', debouncedSearch)
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * 节流函数 - 限制函数执行频率
 * @param {Function} fn - 要节流的函数
 * @param {number} limit - 间隔时间（毫秒），默认 100ms
 * @returns {Function} 节流后的函数
 * @example
 * const throttledScroll = throttle(handleScroll, 200)
 * window.addEventListener('scroll', throttledScroll)
 */
export function throttle(fn, limit = 100) {
  let inThrottle = false
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 生成唯一 ID
 * @param {string} prefix - ID 前缀，默认 'id'
 * @returns {string} 唯一 ID 字符串
 * @example
 * generateId('task') // 'task-170123456789-abc123def'
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 验证昵称
 * @param {string} nickname - 昵称字符串
 * @returns {string|null} 验证错误信息，null 表示验证通过
 * @example
 * validateNickname('江湖侠客') // null
 * validateNickname('') // '请输入新名称'
 */
export function validateNickname(nickname) {
  if (!nickname || nickname.length < 1) return '请输入新名称'
  if (nickname.length > 20) return '名称不能超过20个字符'
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(nickname)) return '名称只能包含中文、英文和数字'
  return null
}

/**
 * 验证用户名（冒险者ID）
 * @param {string} username - 用户名
 * @returns {string|null} 验证错误信息，null 表示验证通过
 * @example
 * validateUsername('hero123') // null
 * validateUsername('hero-123') // '冒险者ID只能包含字母、数字和下划线'
 */
export function validateUsername(username) {
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return '冒险者ID只能包含字母、数字和下划线'
  return null
}
