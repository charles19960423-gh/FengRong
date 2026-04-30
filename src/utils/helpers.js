export function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDaysRemaining(deadline) {
  const today = new Date()
  const endDate = new Date(deadline)
  const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
  return diff > 0 ? `${diff}天` : '已过期'
}

export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

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

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function validateNickname(nickname) {
  if (!nickname || nickname.length < 1) return '请输入新名称'
  if (nickname.length > 20) return '名称不能超过20个字符'
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(nickname)) return '名称只能包含中文、英文和数字'
  return null
}

export function validateUsername(username) {
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return '冒险者ID只能包含字母、数字和下划线'
  return null
}
