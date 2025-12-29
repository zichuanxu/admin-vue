<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue' // 引入图标
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 1. 定义表单数据
const form = reactive({
  id: null,
  no: '',
  name: '',
  gender: '男',
  departmentId: null,
  description: ''
})

// 计算标题（保持风格统一）
const pageTitle = computed(() => form.id ? '编辑员工信息' : '新增员工登记')

// 2. 存储部门列表数据
const deptList = ref([])

// 表单校验
const rules = {
  no: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }]
}

onMounted(async () => {
  await loadDepartments()
  const id = route.query.id
  if (id) {
    await loadDetail(id)
  }
})

// 获取所有部门
const loadDepartments = async () => {
  try {
    const res = await request.get('/department/all')
    if (res.code === 200) {
      deptList.value = res.data
    }
  } catch (error) {
    ElMessage.error("获取部门列表失败")
  }
}

// 获取员工详情
const loadDetail = async (id) => {
  try {
    const res = await request.get(`/employee/${id}`)
    if (res.code === 200) {
      Object.assign(form, res.data)
    }
  } catch (error) {
    ElMessage.error("获取详情失败")
  }
}

// 提交
const save = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = form.id
          ? await request.put('/employee/update', form)
          : await request.post('/employee/add', form)

        if (res.code === 200) {
          ElMessage.success("操作成功")
          router.push('/manager/employee')
        }
      } catch (error) {
        ElMessage.error("提交失败")
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
        <p class="page-subtitle">完善员工基础档案，标 * 为必填项</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" size="large" class="modern-form">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="工号" prop="no">
              <el-input v-model="form.no" placeholder="例如：EMP-2024001" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="departmentId">
              <el-select v-model="form.departmentId" placeholder="请选择部门" style="width: 100%" clearable filterable>
                <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <div class="radio-box">
                <el-radio-group v-model="form.gender">
                  <el-radio label="男" border>男</el-radio>
                  <el-radio label="女" border>女</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注简介" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入个人简介、入职备注或其他说明"
            resize="none" />
        </el-form-item>

        <div class="form-footer">
          <el-button @click="cancel" class="btn-cancel">取消</el-button>
          <el-button type="primary" @click="save" class="btn-save">确认提交</el-button>
        </div>
      </el-form>

    </div>
  </div>
</template>

<style scoped>
/* --- 页面容器 (保持全局统一) --- */
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

/* --- 头部 --- */
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

/* --- 表单 --- */
.modern-form {
  margin-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
  padding-bottom: 8px !important;
}

/* 修复单选框高度对齐问题 */
.radio-box {
  height: 40px;
  /* 对应 large input 的高度 */
  display: flex;
  align-items: center;
}

/* --- 底部按钮 --- */
.form-footer {
  margin-top: 40px;
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