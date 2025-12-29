<template>
  <div class="page-container">
    <div class="form-card" v-loading="loading">

      <div class="profile-layout">

        <div class="aside-section">
          <div class="avatar-container">
            <el-upload class="avatar-uploader" action="http://localhost:8080/file/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="uploadHeaders">
              <div class="avatar-wrapper">
                <el-avatar :size="120"
                  :src="form.avatarUrl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                  class="user-avatar" />
                <div class="upload-mask">
                  <el-icon>
                    <Camera />
                  </el-icon>
                  <span>更换头像</span>
                </div>
              </div>
            </el-upload>
            <p class="avatar-hint">支持 JPG/PNG，小于 2MB</p>
          </div>
        </div>

        <div class="main-section">
          <div class="section-header">
            <h2>编辑个人资料</h2>
            <p class="subtitle">管理您的用户档案与联系方式</p>
          </div>

          <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="modern-form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入您的昵称" size="large" :prefix-icon="User" />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="example@domain.com" size="large" :prefix-icon="Message" />
            </el-form-item>

            <div class="form-footer">
              <el-button size="large" @click="router.back()" class="btn-cancel">取消</el-button>
              <el-button type="primary" size="large" @click="submitForm" :loading="submitting" class="btn-save">
                保存更改
              </el-button>
            </div>
          </el-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Camera, User, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const loading = ref(false)
const submitting = ref(false)
const formRef = ref(null)

// 表单数据初始化
const form = ref({
  id: null,
  username: '',
  email: '',
  avatarUrl: '',
  bio: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
}

// 计算上传Header
const uploadHeaders = computed(() => {
  const userStore = useUserStore()
  const token = userStore.token || localStorage.getItem('token')
  return {
    Authorization: token
  }
})

// 加载当前用户信息
const loadInfo = async () => {
  loading.value = true
  try {
    const res = await request.get('/user/me')
    if (res.code === 200) {
      form.value = { ...res.data }
    }
  } catch (error) {
    console.error('获取用户信息失败', error)
  } finally {
    loading.value = false
  }
}

// 上传前校验
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像必须是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传成功回调
const handleAvatarSuccess = (response) => {
  if (response.code === 200) {
    form.value.avatarUrl = response.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('上传失败: ' + response.msg)
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await request.put('/user', form.value)

        if (res.code === 200) {
          ElMessage.success('资料更新成功')
          router.push('/manager/info')
        } else {
          ElMessage.error(res.msg || '更新失败')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('系统错误')
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  loadInfo()
})
</script>

<style scoped>
/* 页面背景 */
.page-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  /* 更柔和的灰 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 垂直居中 */
  padding: 40px;
}

/* 主卡片：增加宽度，使其更像 PC 界面 */
.form-card {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  /* 保证圆角 */
  display: flex;
  /* 开启 Flex 布局 */
}

/* 内部布局：左右分栏 */
.profile-layout {
  display: flex;
  width: 100%;
  min-height: 400px;
}

/* 左侧边栏：头像区 */
.aside-section {
  width: 320px;
  background: linear-gradient(180deg, #f9fafc 0%, #f4f6f8 100%);
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* 右侧主体：表单区 */
.main-section {
  flex: 1;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 标题样式 */
.section-header {
  margin-bottom: 35px;
}

.section-header h2 {
  font-size: 26px;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #858b9c;
  font-size: 14px;
  margin: 0;
}

/* 头像交互优化 */
.avatar-container {
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  border: 4px solid #fff;
}

.avatar-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  width: 100%;
  height: 100%;
  display: block;
}

/* 上传遮罩：使用 Backdrop Filter 增加现代感 */
.upload-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-wrapper:hover .upload-mask {
  opacity: 1;
}

.upload-mask .el-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.upload-mask span {
  font-size: 13px;
  font-weight: 500;
}

.avatar-hint {
  margin-top: 16px;
  font-size: 12px;
  color: #909399;
}

/* 表单样式微调 */
.modern-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
  padding-bottom: 8px;
}

.modern-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 10px 15px;
  /* 增加输入框高度 */
}

.modern-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
}

/* 底部按钮：右对齐 */
.form-footer {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  /* PC端习惯右对齐 */
  gap: 15px;
}

.btn-cancel {
  width: 100px;
}

.btn-save {
  min-width: 120px;
  font-weight: 600;
}

/* 响应式适配：移动端自动变回单列 */
@media (max-width: 768px) {
  .form-card {
    flex-direction: column;
    max-width: 400px;
  }

  .aside-section {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ebeef5;
    padding: 30px 20px;
  }

  .main-section {
    padding: 30px 25px;
  }

  .form-footer {
    justify-content: stretch;
  }

  .form-footer .el-button {
    flex: 1;
  }
}
</style>