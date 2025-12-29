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
      Object.assign(form, res.data.data)
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
        // 根据是否有 ID 判断是 PUT (修改) 还是 POST (新增)
        const res = form.id
          ? await request.put('/department', form)
          : await request.post('/department', form)

        if (res.data.code === 200) {
          ElMessage.success("保存成功")
          router.push('/manager/department') // 成功后返回列表页
        } else {
          ElMessage.error(res.data.msg || "保存失败")
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
  <div style="padding: 20px">
    <el-card shadow="never" style="max-width: 800px; margin: 0 auto">
      <template #header>
        <div style="display: flex; align-items: center">
          <el-button icon="ArrowLeft" circle size="small" @click="cancel" style="margin-right: 15px" />
          <b style="font-size: 18px">{{ pageTitle }}</b>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：技术部、市场部" />
        </el-form-item>

        <el-form-item label="部门描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请详细描述部门职责或备注信息" />
        </el-form-item>

        <el-divider />

        <el-form-item>
          <el-button type="primary" @click="save" size="large" style="width: 120px">确认保存</el-button>
          <el-button @click="cancel" size="large">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-card__header) {
  background-color: #f8f9fa;
}
</style>