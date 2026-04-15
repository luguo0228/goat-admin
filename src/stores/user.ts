import { defineStore } from 'pinia'
import { shallowRef, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = shallowRef<string | null>(localStorage.getItem('token'))
  const userInfo = shallowRef<{ id: number; name: string; role: string } | null>(null)

  const isLoggedIn = computed(() => token.value !== null && userInfo.value !== null)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUserInfo(info: { id: number; name: string; role: string }) {
    userInfo.value = info
  }

  function logout() {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout,
  }
})