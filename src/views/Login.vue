<script setup lang="ts">
import { shallowRef, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { login } from "@/api"
const router = useRouter()
const userStore = useUserStore()

const formRef = shallowRef<FormInstance>()
const form = reactive({
  username: 'test',
  password: '123456',
  remember: false,
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const loading = shallowRef(false)

async function handleLogin() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true

  login({ account: form.username, password: form.password }).then((res: any) => {
    userStore.setToken(res.token)
    router.push('/')
  }).catch((error) => {
    ElMessage.error(error.message || '登录失败，请检查用户名和密码')
  }).finally(() => {
    loading.value = false
  })

 
}
</script>

<template>
  <div class="login-container">
    <!-- 装饰背景 -->
    <div class="bg-pattern"></div>
    <div class="decoration-orb orb-1"></div>
    <div class="decoration-orb orb-2"></div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="login-header">

        <h1 class="login-title">Admin</h1>
        <p class="login-desc">请登录您的账户以继续</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" class="login-input">
            <template #prefix>
              <el-icon class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" class="login-input"
            show-password>
            <template #prefix>
              <el-icon class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="form.remember" class="remember-checkbox">
            记住登录状态
          </el-checkbox>
          <a href="#" class="forgot-link">忘记密码?</a>
        </div>

        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="submit-btn" @click="handleLogin">
            登录系统
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>© 2024 AdminX Platform. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@300;400;600;700&display=swap');

.login-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', sans-serif;
  background: linear-gradient(135deg, #0a0a0f 0%, #151520 50%, #0d0d12 100%);
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 背景网格 */
.bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 1;
}

/* 装饰球体 */
.decoration-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 1;
  animation: orbFloat 8s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: rgba(139, 92, 246, 0.15);
  top: -150px;
  left: -150px;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: rgba(59, 130, 246, 0.1);
  bottom: -125px;
  right: -125px;
  animation-delay: -4s;
}

@keyframes orbFloat {

  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(30px, 30px);
  }
}

/* 登录卡片 */
.login-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 48px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10;
  animation: cardSlideIn 0.6s ease-out;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Logo */
.logo-mark {
  margin-bottom: 20px;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 48px;
  height: 48px;
  margin: 0 auto;
}

.logo-grid span {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
  animation: gridPulse 2.5s ease-in-out infinite;
}

.logo-grid span:nth-child(1) {
  animation-delay: 0s;
}

.logo-grid span:nth-child(2) {
  animation-delay: 0.1s;
}

.logo-grid span:nth-child(3) {
  animation-delay: 0.2s;
}

.logo-grid span:nth-child(4) {
  animation-delay: 0.3s;
}

.logo-grid span:nth-child(5) {
  animation-delay: 0.4s;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.logo-grid span:nth-child(6) {
  animation-delay: 0.5s;
}

.logo-grid span:nth-child(7) {
  animation-delay: 0.6s;
}

.logo-grid span:nth-child(8) {
  animation-delay: 0.7s;
}

.logo-grid span:nth-child(9) {
  animation-delay: 0.8s;
}

@keyframes gridPulse {

  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.login-title .accent {
  color: #8b5cf6;
  font-family: 'JetBrains Mono', monospace;
}

.login-desc {
  font-size: 14px;
  color: #6b7280;
}

/* Element Plus 表单样式覆盖 */
.login-form {
  --el-form-item-margin-bottom: 20px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-form-item__error) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  padding-top: 4px;
}

/* 输入框样式 */
.login-input :deep(.el-input__wrapper) {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: none;
  padding: 0 16px;
  transition: all 0.2s ease;
}

.login-input :deep(.el-input__wrapper:hover) {
  border-color: #d1d5db;
}

.login-input :deep(.el-input__wrapper.is-focus) {
  border-color: #8b5cf6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.login-input :deep(.el-input__inner) {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  color: #111827;
  height: 44px;
}

.login-input :deep(.el-input__inner::placeholder) {
  color: #9ca3af;
}

.input-icon svg {
  width: 20px;
  height: 20px;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-checkbox :deep(.el-checkbox__label) {
  font-size: 13px;
  color: #6b7280;
  font-family: 'Outfit', sans-serif;
}

.remember-checkbox :deep(.el-checkbox__inner) {
  border-color: #d1d5db;
}

.remember-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.forgot-link {
  font-size: 13px;
  color: #8b5cf6;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #7c3aed;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.35);
}

.submit-btn :deep(.el-loading-spinner .circular) {
  width: 20px;
  height: 20px;
}

/* 页脚 */
.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer p {
  font-size: 12px;
  color: #9ca3af;
  font-family: 'JetBrains Mono', monospace;
}

/* 响应式 */
@media (max-width: 480px) {
  .login-card {
    width: 100%;
    max-width: 380px;
    padding: 32px;
    border-radius: 16px;
  }

  .login-title {
    font-size: 28px;
  }
}
</style>