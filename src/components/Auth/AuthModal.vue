<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ isLoginMode ? '冒险者登录' : '冒险者注册' }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div class="auth-tabs">
          <button 
            :class="{ active: isLoginMode }" 
            @click="isLoginMode = true"
          >登录</button>
          <button 
            :class="{ active: !isLoginMode }" 
            @click="isLoginMode = false"
          >注册</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label>手机号码</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="请输入手机号码"
              :disabled="authStore.isLoading"
            />
            <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
          </div>
          
          <div v-if="!isLoginMode" class="form-group">
            <label>昵称</label>
            <input 
              v-model="form.nickname" 
              type="text" 
              placeholder="请输入你的江湖称号"
              :disabled="authStore.isLoading"
            />
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码"
              :disabled="authStore.isLoading"
            />
          </div>
          
          <div v-if="!isLoginMode" class="form-group">
            <label>确认密码</label>
            <input 
              v-model="form.passwordConfirm" 
              type="password" 
              placeholder="请再次输入密码"
              :disabled="authStore.isLoading"
            />
            <span v-if="errors.passwordConfirm" class="error">{{ errors.passwordConfirm }}</span>
          </div>
          
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading">处理中...</span>
            <span v-else>{{ isLoginMode ? '登录' : '注册' }}</span>
          </button>
          
          <span v-if="errors.general" class="error general">{{ errors.general }}</span>
          
          <p v-if="isLoginMode" class="login-hint">
            还没有账号？<button type="button" @click="isLoginMode = false">立即注册</button>
          </p>
          <p v-else class="login-hint">
            已有账号？<button type="button" @click="isLoginMode = true">立即登录</button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const emit = defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(true)

const form = reactive({
  phone: '',
  nickname: '',
  password: '',
  passwordConfirm: ''
})

const errors = reactive({
  phone: '',
  passwordConfirm: '',
  general: ''
})

function validatePhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

function validateForm() {
  errors.phone = ''
  errors.passwordConfirm = ''
  errors.general = ''
  
  if (!form.phone) {
    errors.phone = '请输入手机号码'
    return false
  }
  
  if (!validatePhone(form.phone)) {
    errors.phone = '请输入有效的手机号码'
    return false
  }
  
  if (!form.password) {
    errors.general = '请输入密码'
    return false
  }
  
  if (!isLoginMode.value) {
    if (form.password.length < 6) {
      errors.general = '密码长度不能少于6位'
      return false
    }
    if (form.password !== form.passwordConfirm) {
      errors.passwordConfirm = '两次输入的密码不一致'
      return false
    }
    if (!form.nickname) {
      errors.general = '请输入昵称'
      return false
    }
  }
  
  return true
}

async function handleSubmit() {
  if (!validateForm()) return
  
  let result
  
  if (isLoginMode.value) {
    result = await authStore.login(form.phone, form.password)
  } else {
    result = await authStore.register(form.phone, form.password, form.nickname)
  }
  
  if (result.success) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: {
        message: isLoginMode.value ? '登录成功！' : '注册成功！',
        type: 'success'
      }
    }))
    emit('close')
    router.push('/profile')
  } else {
    errors.general = result.message
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.modal-container {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border: 2px solid #8C2B1B;
  border-radius: 10px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #444;
}

.modal-header h2 {
  color: #D4AF37;
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: white;
}

.modal-body {
  padding: 25px;
}

.auth-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.auth-tabs button {
  flex: 1;
  padding: 10px;
  border: 1px solid #444;
  background: #333;
  color: #ccc;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.2s;
}

.auth-tabs button.active {
  background: #8C2B1B;
  color: white;
  border-color: #8C2B1B;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  color: #D4C39E;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #444;
  border-radius: 5px;
  background: #333;
  color: white;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #D4AF37;
}

.form-group input::placeholder {
  color: #666;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #D4AF37;
  color: #1A120B;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #B89500;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.error.general {
  margin-top: 15px;
  text-align: center;
}

.login-hint {
  text-align: center;
  margin-top: 20px;
  color: #888;
}

.login-hint button {
  background: none;
  border: none;
  color: #D4AF37;
  cursor: pointer;
  text-decoration: underline;
}
</style>
