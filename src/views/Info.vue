<template>
  <div class="info-container">
    <el-card class="info-card" :body-style="{ padding: '0px' }" v-loading="loading">
      <div class="card-header-bg">
        <h3 class="header-title">个人中心</h3>
      </div>

      <div class="avatar-wrapper">
        <el-avatar :size="100" class="user-avatar"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div class="avatar-edit-mask">
          <el-icon>
            <Camera />
          </el-icon>
        </div>
      </div>

      <div class="card-body">
        <h2 class="username">{{ userInfo.username || '未设置昵称' }}</h2>
        <p class="user-bio">这个人很懒，什么也没留下。</p> <el-divider border-style="dashed" />

        <el-descriptions :column="1" size="large" class="info-list">
          <el-descriptions-item label="用户 ID">
            <span class="info-text">#{{ userInfo.id }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="电子邮箱">
            <div class="info-item-content">
              <el-icon class="mr-2">
                <Message />
              </el-icon>
              <span>{{ userInfo.email || '暂未绑定邮箱' }}</span>
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="注册时间">
            <div class="info-item-content">
              <el-icon class="mr-2">
                <Calendar />
              </el-icon>
              <span>{{ formatTime(userInfo.createdAt) }}</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <div class="card-footer">
          <el-button type="primary" plain round icon="Edit">编辑资料</el-button>
          <el-button type="warning" plain round icon="Lock">修改密码</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { Message, Calendar, Camera, Edit, Lock } from '@element-plus/icons-vue'

const loading = ref(false)
const userInfo = ref({})

// 获取个人信息
const loadInfo = async () => {
  loading.value = true
  try {
    const res = await request.get('/user/me')
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 简单的时间格式化工具
const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  return timeStr.replace('T', ' ').substring(0, 19)
}

onMounted(() => {
  loadInfo()
})
</script>

<style scoped>
/* 容器布局 */
.info-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* 靠上对齐，避免在大屏垂直居中显得空旷 */
  min-height: 80vh;
}

/* 卡片主体 */
.info-card {
  width: 100%;
  max-width: 500px;
  /* 限制最大宽度，保持精致感 */
  border-radius: 16px;
  /* 大圆角 */
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  /* 柔和的长阴影 */
  overflow: visible;
  /* 允许头像溢出背景区（如果需要那种风格），这里目前是包含在内的 */
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* 顶部装饰背景 */
.card-header-bg {
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 漂亮的蓝紫渐变 */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  letter-spacing: 2px;
  position: absolute;
  top: 20px;
}

/* 头像区域 */
.avatar-wrapper {
  width: 100px;
  height: 100px;
  margin: -50px auto 0;
  /* 负边距实现向上重叠效果 */
  position: relative;
  border-radius: 50%;
  padding: 4px;
  background: #fff;
  /* 头像白边 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.user-avatar {
  background-color: #f0f2f5;
}

/* 头像悬停遮罩（预留交互） */
.avatar-edit-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-edit-mask {
  opacity: 1;
}

/* 内容区域 */
.card-body {
  padding: 20px 40px 40px;
  /* 左右留宽一点，显得大气 */
  text-align: center;
}

.username {
  margin: 10px 0 5px;
  font-size: 24px;
  color: #303133;
  font-weight: 600;
}

.user-bio {
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
}

/* 列表样式微调 */
.info-list :deep(.el-descriptions__label) {
  font-weight: bold;
  color: #606266;
  width: 80px;
  text-align: right;
}

.info-item-content {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: 8px;
}

/* 底部按钮 */
.card-footer {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>