import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import request from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUser(newUser) {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  async function logout() {
    // 1. 尝试请求后端登出接口
    try {
      await request.post('/user/logout')
    } catch (error) {
      console.warn('后端登出失败或Token已失效，前端强制登出', error)
    } finally {
      // 2. 无论后端成功与否，前端必须执行清除逻辑 (finally块)
      token.value = ''
      user.value = {}
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // 3. 跳转回登录页
      router.push('/login')
    }
  }
  // 判断是否是管理员
  const isAdmin = () => user.value.admin === 1

  return { token, user, setToken, setUser, logout, isAdmin }
})