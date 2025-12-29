<template>
  <div class="settings-container">
    <div class="content-block">
      <div class="page-header">
        <h2 class="title">修改密码</h2>
        <span class="subtitle">为了您的账户安全，建议定期更换密码</span>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="120px"
        class="setting-form" status-icon>
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" placeholder="请输入当前使用的密码" show-password
            class="custom-input" />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <div class="input-wrapper">
            <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码（6-20位字符）" show-password
              class="custom-input" @input="checkStrength" />
            <div class="strength-meter" v-if="form.newPassword">
              <span class="label">强度</span>
              <div class="bar-bg">
                <div class="bar-fill" :class="strengthClass" :style="{ width: strengthWidth }"></div>
              </div>
              <span class="text" :class="strengthClass">{{ strengthText }}</span>
            </div>
            <div class="form-tip">建议使用字母、数字和符号的组合</div>
          </div>
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" show-password
            class="custom-input" />
        </el-form-item>

        <el-form-item>
          <div class="btn-group">
            <el-button type="primary" :loading="loading" @click="onSubmit" class="save-btn">
              保存更改
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// === 密码强度逻辑 (UX 优化) ===
const strengthScore = ref(0)
const checkStrength = (val) => {
  let score = 0
  if (!val) { strengthScore.value = 0; return }
  if (val.length > 5) score += 1
  if (val.length > 10) score += 1
  if (/[A-Z]/.test(val)) score += 1
  if (/[0-9]/.test(val)) score += 1
  if (/[^A-Za-z0-9]/.test(val)) score += 1
  strengthScore.value = score
}

const strengthClass = computed(() => {
  if (strengthScore.value <= 2) return 'weak'
  if (strengthScore.value <= 3) return 'medium'
  return 'strong'
})

const strengthWidth = computed(() => {
  if (strengthScore.value <= 2) return '33%'
  if (strengthScore.value <= 3) return '66%'
  return '100%'
})

const strengthText = computed(() => {
  if (strengthScore.value <= 2) return '弱'
  if (strengthScore.value <= 3) return '中'
  return '强'
})

// === 验证逻辑 ===
const validateConfirm = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirm, trigger: 'blur' }]
}

const resetForm = () => {
  formRef.value.resetFields()
  strengthScore.value = 0
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await request.post('/user/password', form)
        if (res.code === 200) {
          ElMessageBox.alert('密码修改成功，请重新登录', '提示', {
            confirmButtonText: '去登录',
            type: 'success',
            callback: () => {
              localStorage.removeItem('token')
              router.push('/login')
            },
          })
        } else {
          ElMessage.error(res.msg || '修改失败')
        }
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
/* 容器：白色背景，更加通透，贴合后台风格 */
.settings-container {
  background: #fff;
  padding: 40px;
  min-height: 100%;
  box-sizing: border-box;
}

.content-block {
  max-width: 800px;
  /* 限制内容最大宽度，防止在大屏上过于分散 */
}

/* 头部样式 */
.page-header {
  margin-bottom: 40px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 20px;
}

.title {
  font-size: 24px;
  color: #303133;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}

/* 表单样式 */
.setting-form {
  margin-top: 20px;
}

/* 输入框宽度限制，PC端输入框不宜过长 */
.custom-input {
  width: 380px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}

/* 按钮组 */
.btn-group {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.save-btn {
  padding: 10px 30px;
  font-weight: 500;
}

/* === 密码强度条样式 (Micro-interaction) === */
.strength-meter {
  display: flex;
  align-items: center;
  margin-top: 8px;
  width: 380px;
  /* 与输入框等宽 */
  gap: 12px;
}

.strength-meter .label {
  font-size: 12px;
  color: #606266;
}

.strength-meter .bar-bg {
  flex: 1;
  height: 4px;
  background: #ebeef5;
  border-radius: 2px;
  overflow: hidden;
}

.strength-meter .bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.strength-meter .text {
  font-size: 12px;
  width: 20px;
  text-align: right;
}

/* 强度颜色状态 */
.weak {
  background-color: #f56c6c;
  color: #f56c6c;
}

/* 红 */
.medium {
  background-color: #e6a23c;
  color: #e6a23c;
}

/* 橙 */
.strong {
  background-color: #67c23a;
  color: #67c23a;
}

/* 绿 */

/* 响应式适配 */
@media (max-width: 768px) {
  .settings-container {
    padding: 20px;
  }

  .custom-input,
  .strength-meter {
    width: 100%;
  }

  /* 在手机上强制换行 */
  .setting-form :deep(.el-form-item__label) {
    float: none;
    display: block;
    text-align: left;
    margin-bottom: 8px;
  }

  .setting-form :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}
</style>