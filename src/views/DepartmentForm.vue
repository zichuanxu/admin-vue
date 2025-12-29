<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 1. 动态设置页面标题
const pageTitle = computed(() => {
  return form.id ? '编辑部门信息' : '新增部门登记'
})

// 2. 定义表单数据 (对应 Department 实体)
const form = reactive({
  id: null,
  name: '',
  description: ''
})

// 3. 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入部门描述', trigger: 'blur' }]
}

onMounted(async () => {
  const id = route.query.id
  if (id) {
    await loadDetail(id)
  }
})

// 获取部门详情（用于编辑回显）
const loadDetail = async (id) => {
  try {
    const res = await request.get(`/department/${id}`)
    if (res.code === 200) {
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
        const res = form.id
          ? await request.put('/department', form)
          : await request.post('/department', form)

        if (res.code === 200) {
          ElMessage.success("保存成功")
          router.push('/manager/department')
        } else {
          ElMessage.error(res.msg || "保存失败")
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
        <p class="page-subtitle">请填写下方信息以完成部门配置</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="modern-form" size="large">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：技术部、市场部" class="input-width" />
        </el-form-item>

        <el-form-item label="部门描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="6" placeholder="请详细描述部门职责或备注信息" resize="none" />
        </el-form-item>

        <div class="form-footer">
          <el-button @click="cancel" class="btn-cancel">取消</el-button>
          <el-button type="primary" @click="save" class="btn-save">保存变更</el-button>
        </div>
      </el-form>

    </div>
  </div>
</template>

<style scoped>
/* 页面背景 */
.page-wrapper {
  padding: 40px;
  background-color: #f5f7fa;
  /* 浅灰底色衬托白卡片 */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* 主容器：模拟纸张质感，去除 heavy border */
.form-container {
  background: #ffffff;
  width: 100%;
  max-width: 640px;
  /* 限制宽度，PC端阅读体验最佳 */
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  /* 极柔和的阴影 */
}

/* 头部样式 */
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
  /* 对齐标题文字 */
  font-size: 14px;
  color: #909399;
}

/* 表单微调 */
.modern-form {
  margin-top: 20px;
}

/* 标签文字加深，提升可读性 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
  padding-bottom: 8px !important;
}

/* 按钮区 */
.form-footer {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  /* 按钮右对齐 */
  gap: 12px;
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