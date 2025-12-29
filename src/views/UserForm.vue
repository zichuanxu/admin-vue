<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 1. 获取业务类型：是管理员还是普通用户
const isTypeAdmin = computed(() => route.query.type === 'admin')
const pageTitle = computed(() => {
  const role = isTypeAdmin.value ? '管理员' : '用户'
  return `编辑${role}信息`
})

// 2. 定义表单数据 (与 User 实体类对应)
const form = reactive({
  id: null,
  username: '',
  email: '',
  status: 1,      // 默认正常
  admin: isTypeAdmin.value ? 1 : 0 // 根据入口自动设置权限位
})

// 3. 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

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
      // 填充表单
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
        const res = await request.put('/user', form)

        if (res.code === 200) {
          ElMessage.success("操作成功")
          // 根据当前类型跳回对应的列表页
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
/* --- 页面整体布局 (复用 Department 页样式，保持统一) --- */
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
  /* 稍微宽一点，因为是双栏布局 */
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

/* --- 头部样式 --- */
.header-section {
  margin-bottom: 30px;
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

/* --- 表单样式微调 --- */
.modern-form {
  margin-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
  padding-bottom: 8px !important;
}

/* 静态值显示框（用于Tag） */
.static-value-box {
  display: flex;
  align-items: center;
  height: 40px;
  /* 与 Input 高度一致 */
}

.read-only-tip {
  font-size: 12px;
  color: #c0c4cc;
  margin-left: 10px;
}

/* Radio 样式优化 */
.radio-box {
  height: 40px;
  display: flex;
  align-items: center;
}

/* --- 按钮区 --- */
.form-footer {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f2f3f5;
  /* 增加一条极淡的分割线 */
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