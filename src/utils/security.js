import DOMPurify from 'dompurify'

export function sanitizeHTML(html) {
  return DOMPurify.sanitize(html)
}

export function sanitizeInput(input) {
  if (!input) return ''
  const sanitized = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return sanitized.replace(/<[^>]*>/g, '')
}

export function generateSecureToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

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
