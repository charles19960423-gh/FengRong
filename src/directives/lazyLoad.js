import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 图片懒加载 composable
 * @param {string} src - 图片 src
 * @param {string} placeholder - 占位图
 */
export function useLazyImage(src, placeholder = '') {
  const imageSrc = ref(placeholder)
  const isLoaded = ref(false)
  const isVisible = ref(false)
  const error = ref(false)

  const loadImage = () => {
    if (!src) return
    
    const img = new Image()
    img.onload = () => {
      imageSrc.value = src
      isLoaded.value = true
    }
    img.onerror = () => {
      error.value = true
      console.warn('图片加载失败:', src)
    }
    img.src = src
  }

  const observe = (el) => {
    if (!el) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            loadImage()
            observer.unobserve(el)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )
    
    observer.observe(el)
    return observer
  }

  return {
    imageSrc,
    isLoaded,
    isVisible,
    error,
    loadImage,
    observe
  }
}

/**
 * 图片懒加载指令
 * v-lazy="src" 或 v-lazy="{ src: 'url', placeholder: 'placeholder' }"
 */
export const lazyImage = {
  mounted(el, binding) {
    const src = typeof binding.value === 'object' ? binding.value.src : binding.value
    const placeholder = typeof binding.value === 'object' ? binding.value.placeholder : ''
    
    // 设置占位图
    el.dataset.src = src
    if (placeholder) {
      el.style.backgroundImage = `url(${placeholder})`
      el.style.backgroundSize = 'cover'
      el.style.backgroundPosition = 'center'
    }
    
    // 使用 IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.onload = () => {
              el.src = img.src
              el.classList.add('lazy-loaded')
            }
            img.onerror = () => {
              el.classList.add('lazy-error')
            }
            img.src = src
            observer.unobserve(el)
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0
      }
    )
    
    el._lazyObserver = observer
    observer.observe(el)
  },
  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      delete el._lazyObserver
    }
  }
}

/**
 * 背景图懒加载指令
 * v-lazy-bg="'url'"
 */
export const lazyBackground = {
  mounted(el, binding) {
    const src = binding.value
    
    el.dataset.bgSrc = src
    el.style.backgroundImage = 'none'
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.onload = () => {
              el.style.backgroundImage = `url(${src})`
              el.classList.add('lazy-bg-loaded')
            }
            img.src = src
            observer.unobserve(el)
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0
      }
    )
    
    el._lazyBgObserver = observer
    observer.observe(el)
  },
  unmounted(el) {
    if (el._lazyBgObserver) {
      el._lazyBgObserver.disconnect()
      delete el._lazyBgObserver
    }
  }
}

export default {
  install(app) {
    app.directive('lazy', lazyImage)
    app.directive('lazy-bg', lazyBackground)
  }
}