<template>
  <div class="login-wrapper">
    <div class="login-banner">
      <div class="banner-content">
        <h1 class="logo-text">Admin Pro</h1>
        <p class="slogan">构建高效、安全的企业级后台管理系统</p>
      </div>
    </div>

    <div class="login-form-container">
      <div class="form-box">
        <div class="header">
          <h2>欢迎回来</h2>
          <p class="sub-title">请输入您的账号信息进行登录</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" size="large" class="custom-form" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password :prefix-icon="Lock" />
          </el-form-item>

          <div class="action-row">
          </div>

          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" class="submit-btn">
              立即登录
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <span>还没有账号？</span>
            <el-link type="primary" :underline="false" @click="$router.push('/register')">
              立即注册
            </el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { jwtDecode } from 'jwt-decode'

// ... (逻辑部分完全保持你原有的代码，不需要变动) ...
const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度不能少于4位', trigger: 'blur' }
  ]
})

const handleLogin = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await request.post('/user/login', form)
        if (res.code === 200) {
          const token = res.data
          userStore.setToken(token)
          try {
            const decoded = jwtDecode(token)
            const userInfo = {
              username: decoded.username,
              id: decoded.aud ? decoded.aud[0] : null,
              admin: decoded.admin
            }
            userStore.setUser(userInfo)
            ElMessage.success('登录成功')
            router.push('/')
          } catch (decodeError) {
            console.error('Token解析失败', decodeError)
            ElMessage.warning('登录成功但获取用户信息失败')
            router.push('/')
          }
        } else {
          ElMessage.error(res.msg || '登录失败')
        }
      } catch (error) {
        console.error('登录接口异常', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #fff;
}

/* 左侧 Banner 样式 */
.login-banner {
  flex: 1;
  background: linear-gradient(135deg, #3A7BD5 0%, #3A6073 100%);
  /* 替换为你的品牌色或背景图 */
  /* 如果有图片，使用下面这行 */
  /* background: url('@/assets/login-bg.jpg') no-repeat center center / cover; */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 80px;
  color: #fff;
}

.banner-content {
  z-index: 2;
  animation: fadeUp 1s ease-out;
}

.logo-text {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.slogan {
  font-size: 20px;
  opacity: 0.8;
  font-weight: 300;
}

/* 右侧表单样式 */
.login-form-container {
  width: 500px;
  /* 固定宽度，显得精致 */
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.02);
  /* 极淡的阴影分割 */
}

.form-box {
  width: 100%;
  max-width: 380px;
  animation: fadeIn 0.8s ease-out;
}

.header {
  margin-bottom: 40px;
}

.header h2 {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.sub-title {
  color: #999;
  font-size: 14px;
}

/* 深度定制 Element Plus 样式 */
:deep(.el-input__wrapper) {
  background-color: #F5F7FA;
  /* 浅灰底色 */
  box-shadow: none !important;
  /* 去除默认边框 */
  border-radius: 8px;
  padding: 8px 15px;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 1px #409EFF !important;
  /* 聚焦时显示主色边框 */
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  margin-top: 10px;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #409EFF 0%, #3a8ee6 100%);
  border: none;
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(64, 158, 255, 0.4);
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

/* 动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 900px) {
  .login-banner {
    display: none;
    /* 小屏幕隐藏左侧 */
  }

  .login-form-container {
    width: 100%;
  }
}
</style>