/**
 * 安全工具模块
 * @module utils/security
 */
import DOMPurify from 'dompurify'

/**
 * HTML 安全化 - 防止 XSS 攻击
 * @param {string} html - HTML 字符串
 * @returns {string} 安全化后的 HTML
 * @example
 * sanitizeHTML('<script>alert(1)</script>') // ''
 */
export function sanitizeHTML(html) {
  return DOMPurify.sanitize(html)
}

/**
 * 输入安全化 - 移除所有 HTML 标签
 * @param {string} input - 用户输入
 * @returns {string} 安全化后的文本
 * @example
 * sanitizeInput('<script>alert(1)</script>test') // 'test'
 */
export function sanitizeInput(input) {
  if (!input) return ''
  const sanitized = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return sanitized.replace(/<[^>]*>/g, '')
}

/**
 * 生成安全令牌
 * @returns {string} 32 位随机十六进制字符串
 * @example
 * generateSecureToken() // 'a1b2c3d4e5f6...'
 */
export function generateSecureToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 数据加密
 * @param {object} data - 要加密的数据
 * @returns {string} 加密后的 Base64 字符串
 * @example
 * encryptData({ secret: 'xxx' }) // 'base64...'
 */
export function encryptData(data) {
  try {
    const json = JSON.stringify(data)
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(json)
    const key = crypto.subtle.importKey(
      'raw',
      encoder.encode('fr_tavern_secret_key_2024'),
      { name: 'AES-GCM', length: 128 },
      false,
      ['encrypt']
    )
    return crypto.subtle.encrypt({ name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) }, key, dataBytes)
      .then(encrypted => btoa(String.fromCharCode(...new Uint8Array(encrypted))))
  } catch {
    return Promise.resolve(btoa(JSON.stringify(data)))
  }
}

export function decryptData(encrypted) {
  try {
    const decoder = new TextDecoder()
    const encryptedBytes = new Uint8Array(atob(encrypted).split('').map(c => c.charCodeAt(0)))
    const key = crypto.subtle.importKey(
      'raw',
      decoder.encode('fr_tavern_secret_key_2024'),
      { name: 'AES-GCM', length: 128 },
      false,
      ['decrypt']
    )
    const iv = encryptedBytes.slice(0, 12)
    const data = encryptedBytes.slice(12)
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
      .then(decrypted => JSON.parse(decoder.decode(decrypted)))
  } catch {
    try {
      return Promise.resolve(JSON.parse(atob(encrypted)))
    } catch {
      return Promise.resolve(null)
    }
  }
}
