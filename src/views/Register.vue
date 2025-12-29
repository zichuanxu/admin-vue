<template>
  <div class="register-wrapper">
    <div class="register-banner">
      <div class="banner-content">
        <h1 class="logo-text">Join Us</h1>
        <p class="slogan">开启您的数字化管理之旅</p>
      </div>
    </div>

    <div class="register-form-container">
      <div class="form-box">
        <div class="header">
          <h2>创建账号</h2>
          <p class="sub-title">填写以下信息完成注册</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="0" size="large" class="custom-form">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
          </el-form-item>

          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱 (选填)" :prefix-icon="Message" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="设置密码" show-password :prefix-icon="Lock" />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" show-password
              :prefix-icon="Lock" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleRegister" :loading="loading" class="submit-btn">
              立即注册
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <span>已有账号？</span>
            <el-link type="primary" @click="$router.push('/login')">
              去登录
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
import { User, Lock, Message } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

// ... (逻辑部分保持不变) ...
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
})

const handleRegister = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const { confirmPassword, ...registerData } = form
        const res = await request.post('/user/register', registerData)
        if (res.code === 200) {
          ElMessage.success('注册成功，请登录')
          router.push('/login')
        } else {
          ElMessage.error(res.msg || '注册失败')
        }
      } catch (error) {
        console.error('注册错误', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
/* 容器与登录页复用 Flex 布局逻辑 */
.register-wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #fff;
}

/* 左侧 Banner：使用不同的渐变色区分 */
.register-banner {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 紫色系渐变 */
  /* background: url('@/assets/register-bg.jpg') no-repeat center center / cover; */
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

/* 右侧表单容器 */
.register-form-container {
  width: 500px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.02);
}

.form-box {
  width: 100%;
  max-width: 380px;
  animation: fadeIn 0.8s ease-out;
}

.header {
  margin-bottom: 30px;
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

/* 样式复用 */
:deep(.el-input__wrapper) {
  background-color: #F5F7FA;
  box-shadow: none !important;
  border-radius: 8px;
  padding: 8px 15px;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 1px #9f7bc3 !important;
  /* 注册页主色调微调 */
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  margin-top: 10px;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #ac89cf 0%, #5668b5 100%);
  /* 注册页按钮渐变 */
  border: none;
  box-shadow: 0 4px 10px rgba(118, 75, 162, 0.3);
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(118, 75, 162, 0.4);
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

/* 动画 */
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

@media (max-width: 900px) {
  .register-banner {
    display: none;
  }

  .register-form-container {
    width: 100%;
  }
}
</style>