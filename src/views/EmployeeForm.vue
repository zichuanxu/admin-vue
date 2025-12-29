<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 1. 定义表单数据 (确保字段名与后端 Employee 实体一致)
const form = reactive({
  id: null,
  no: '',
  name: '',
  gender: '男',
  departmentId: null, // 存储选中的部门ID
  description: ''
})

// 2. 存储部门列表数据
const deptList = ref([])

// 表单校验
const rules = {
  no: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }]
}

onMounted(async () => {
  // 第一步：先加载部门列表（保证下拉框有数据）
  await loadDepartments()

  // 第二步：判断是否为编辑模式
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
      deptList.value = res.data // 结构为 [{id: 1, name: '开发部', ...}, ...]
    }
  } catch (error) {
    ElMessage.error("获取部门列表失败")
  }
}

// 获取员工详情（回显）
const loadDetail = async (id) => {
  try {
    const res = await request.get(`/employee/${id}`)
    if (res.code === 200) {
      // 使用 Object.assign 将后端返回的数据填充到响应式对象 form 中
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
          router.push('/manager/employee') // 跳转回列表页
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
  <div style="padding: 20px">
    <el-card shadow="never" style="max-width: 800px; margin: 0 auto">
      <template #header>
        <b style="font-size: 18px">{{ form.id ? '编辑员工信息' : '新增员工登记' }}</b>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工号" prop="no">
              <el-input v-model="form.no" placeholder="请输入工号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="departmentId">
              <el-select v-model="form.departmentId" placeholder="请选择部门" style="width: 100%" clearable filterable>
                <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注简介" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入个人简介或备注" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save" size="large">确认提交</el-button>
          <el-button @click="cancel" size="large">返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>