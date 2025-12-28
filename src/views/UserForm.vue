<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
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
  password: '',
  email: '',
  status: 1,      // 默认正常
  admin: isTypeAdmin.value ? 1 : 0 // 根据入口自动设置权限位
})

// 3. 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  // 如果是新增模式，密码必填；如果是编辑模式，密码可选（不填则不修改）
  password: [{ required: !route.query.id, message: '请输入密码', trigger: 'blur' }],
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
    const res = await axios.get(`/api/user/${id}`)
    if (res.data.code === 200) {
      // 填充表单
      Object.assign(form, res.data.data)
      // 回显时清空密码字段，防止误操作或泄露，不填则后端不做修改
      form.password = ''
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
        await axios.put('/api/user', form)


        if (res.data.code === 200) {
          ElMessage.success("操作成功")
          // 根据当前类型跳回对应的列表页
          const targetPath = isTypeAdmin.value ? '/manager/admin' : '/manager/user'
          router.push(targetPath)
        } else {
          ElMessage.error(res.data.msg || "提交失败")
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色类型">
              <el-tag :type="form.admin === 1 ? 'danger' : 'info'">
                {{ form.admin === 1 ? '系统管理员' : '普通用户' }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="form.email" placeholder="example@google.com" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帐号状态" v-if="form.admin != 1">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>


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