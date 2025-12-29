<script setup>
import { ref, reactive, shallowRef, onBeforeUnmount, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const router = useRouter()
const route = useRoute()

// 1. 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 2. 表单数据
const form = reactive({
  id: null,
  title: '',
  summary: '', // 摘要
  author: '',
  content: ''  // 富文本内容
})

// 3. 编辑器配置
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    // 这里可以配置图片上传，默认是 base64，生产环境建议配置上传接口
    // uploadImage: { server: '/api/upload', ... }
  }
}

// 4. 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例
}

// 5. 提交逻辑
const save = async () => {
  if (!form.title) {
    ElMessage.warning('请输入标题')
    return
  }

  // 校验纯文本内容是否为空（可选）
  // const text = editorRef.value.getText()

  try {
    const url = form.id ? '/article/update' : '/article/add'
    const method = form.id ? 'put' : 'post'

    const res = await request[method](url, form)
    if (res.code === '200' || res.code === 200) {
      ElMessage.success('保存成功')
      router.push('/manager/article') // 保存后跳回列表页
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (error) {
    ElMessage.error('系统错误')
  }
}

// 6. 返回列表
const cancel = () => {
  router.back()
}

// 7. 加载详情（如果是编辑模式）
const loadDetail = async (id) => {
  try {
    // 假设后端有个详情接口 GET /article/{id}，如果没有，可以用 page 接口查或者让后端加一个
    // 这里演示直接复用逻辑，通常你需要一个 detail 接口
    // 为了简单演示，这里假设你点击编辑时，路由传参带了id，我们去请求详情
    const res = await request.get(`/article/${id}`) // 需后端支持 getById
    if (res.code === '200' || res.code === 200) {
      Object.assign(form, res.data)
    }
  } catch (e) {
    console.error(e)
  }
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

onMounted(() => {
  // 如果路由参数中有 id，说明是编辑模式
  const id = route.query.id
  if (id) {
    loadDetail(id)
  }
})
</script>

<template>
  <div style="padding: 20px">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ form.id ? '编辑文章' : '发布文章' }}</span>
        </div>
      </template>

      <el-form :model="form" label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item label="作者">
          <el-input v-model="form.author" placeholder="请输入作者"></el-input>
        </el-form-item>

        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="请输入简短摘要"></el-input>
        </el-form-item>

        <el-form-item label="内容">
          <div style="border: 1px solid #ccc; width: 100%">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 500px; overflow-y: hidden;" v-model="form.content" :defaultConfig="editorConfig"
              mode="default" @onCreated="handleCreated" />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>