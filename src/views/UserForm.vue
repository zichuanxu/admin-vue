<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
// 1. 新增引入：图标和 UserStore
import { ArrowLeft, Camera } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const userStore = useUserStore() // 2. 初始化 userStore

// 获取业务类型及标题
const isTypeAdmin = computed(() => route.query.type === 'admin')
const pageTitle = computed(() => {
  const role = isTypeAdmin.value ? '管理员' : '用户'
  return `编辑${role}信息`
})

// 3. 定义表单数据 (增加 avatarUrl)
const form = reactive({
  id: null,
  username: '',
  email: '',
  avatarUrl: '', // 新增
  status: 1,
  admin: isTypeAdmin.value ? 1 : 0
})

// 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
}

// --- 4. 新增：上传相关逻辑 (参照范例) ---

// 计算上传Header (用于鉴权)
const uploadHeaders = computed(() => {
  const token = userStore.token || localStorage.getItem('token')
  return {
    Authorization: token
  }
})

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
    // 更新表单视图中的 avatarUrl
    form.avatarUrl = response.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('上传失败: ' + response.msg)
  }
}

// --- 业务逻辑 ---

onMounted(async () => {
  const id = route.query.id
  if (id) {
    await loadDetail(id)
  }
})

// 获取用户详情（回显）
const loadDetail = async (id) => {
  try {
    const res = await request.get(`/user/${id}`)
    if (res.code === 200) {
      // 填充表单 (如果后端返回数据包含 avatarUrl，会自动填充)
      Object.assign(form, res.data)
    }
  } catch (error) {
    ElMessage.error("获取详情失败")
  }
}

// 提交数据
const save = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 提交时会带上最新的 avatarUrl
        const res = await request.put('/user', form)

        if (res.code === 200) {
          ElMessage.success("操作成功")
          const targetPath = isTypeAdmin.value ? '/manager/admin' : '/manager/user'
          router.push(targetPath)
        } else {
          ElMessage.error(res.msg || "提交失败")
        }
      } catch (error) {
        ElMessage.error("系统错误")
      }
    }
  })
}

const cancel = () => router.back()
</script>

<template>
  <div class="page-wrapper">
    <div class="form-container">

      <div class="header-section">
        <div class="title-row">
          <div class="back-btn" @click="cancel">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </div>
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <p class="page-subtitle">请谨慎修改用户的关键信息及权限状态</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="modern-form" size="large">

        <div class="avatar-upload-section">
          <el-upload class="avatar-uploader" action="http://localhost:8080/file/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="uploadHeaders">
            <div class="avatar-wrapper">
              <el-avatar :size="100"
                :src="form.avatarUrl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                class="user-avatar" />
              <div class="upload-mask">
                <el-icon>
                  <Camera />
                </el-icon>
                <span>更换</span>
              </div>
            </div>
          </el-upload>
          <span class="avatar-tip">点击修改头像</span>
        </div>


        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色类型">
              <div class="static-value-box">
                <el-tag :type="form.admin === 1 ? 'danger' : 'info'" size="large" effect="plain">
                  {{ form.admin === 1 ? '系统管理员' : '普通用户' }}
                </el-tag>
                <span class="read-only-tip">（角色类型不可变更）</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="form.email" placeholder="example@google.com" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帐号状态" v-if="form.admin != 1">
              <div class="radio-box">
                <el-radio-group v-model="form.status">
                  <el-radio :label="1" border>正常启用</el-radio>
                  <el-radio :label="0" border>禁用锁定</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-footer">
          <el-button @click="cancel" class="btn-cancel">取消</el-button>
          <el-button type="primary" @click="save" class="btn-save">保存变更</el-button>
        </div>
      </el-form>

    </div>
  </div>
</template>

<style scoped>
/* --- 页面整体布局 --- */
.page-wrapper {
  padding: 40px;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-container {
  background: #ffffff;
  width: 100%;
  max-width: 800px;
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

/* --- 头部样式 --- */
.header-section {
  margin-bottom: 30px;
  /* 增加底部间距，为头像留出空间 */
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f3f5;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f2f3f5;
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e6e8eb;
  color: #303133;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  padding-left: 44px;
  font-size: 14px;
  color: #909399;
}

/* --- 1. 新增：头像区域样式 --- */
.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  /* 与下方表单拉开距离 */
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  /* 增加一点阴影和边框让它更突出 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 3px solid #fff;
  transition: all 0.3s ease;
}

.avatar-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.upload-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  /* 增加毛玻璃效果 */
  backdrop-filter: blur(1px);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-mask .el-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.upload-mask span {
  font-size: 12px;
}

.avatar-wrapper:hover .upload-mask {
  opacity: 1;
}

.avatar-tip {
  margin-top: 12px;
  font-size: 13px;
  color: #909399;
}

/* --- 表单样式微调 --- */
.modern-form {
  margin-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
  padding-bottom: 8px !important;
}

.static-value-box {
  display: flex;
  align-items: center;
  height: 40px;
}

.read-only-tip {
  font-size: 12px;
  color: #c0c4cc;
  margin-left: 10px;
}

.radio-box {
  height: 40px;
  display: flex;
  align-items: center;
}

/* --- 按钮区 --- */
.form-footer {
  margin-top: 20px;
  /* 稍微减小与上方表单项的间距 */
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f2f3f5;
}

.btn-save {
  padding: 10px 28px;
  font-weight: 500;
  border-radius: 8px;
}

.btn-cancel {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: #f5f7fa;
  color: #606266;
}

.btn-cancel:hover {
  background: #e6e8eb;
}
</style>