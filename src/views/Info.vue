<template>
  <div class="page-container">
    <div class="content-wrapper" v-loading="loading">

      <div class="banner-section">
        <div class="banner-overlay"></div>
      </div>

      <div class="profile-header">
        <div class="header-left">
          <div class="avatar-container">
            <el-avatar :size="120" class="user-avatar"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div class="avatar-edit-mask">
              <el-icon>
                <Camera />
              </el-icon>
            </div>
          </div>

          <div class="user-identity">
            <div class="name-row">
              <h1 class="username">{{ userInfo.username || '未设置昵称' }}</h1>
              <el-tag size="small" effect="dark" round class="role-tag">普通用户</el-tag>
            </div>
            <p class="user-bio">{{ userInfo.bio || '这个人很懒，什么也没留下。' }}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button type="primary" plain icon="Edit" round>编辑资料</el-button>
          <el-button type="warning" plain icon="Lock" @click="router.push('/manager/password')" round>修改密码</el-button>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="icon-box bg-blue">
            <el-icon>
              <User />
            </el-icon>
          </div>
          <div class="info-content">
            <span class="label">用户 ID</span>
            <span class="value">#{{ userInfo.id || '---' }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="icon-box bg-purple">
            <el-icon>
              <Message />
            </el-icon>
          </div>
          <div class="info-content">
            <span class="label">电子邮箱</span>
            <span class="value">{{ userInfo.email || '暂未绑定' }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="icon-box bg-green">
            <el-icon>
              <Calendar />
            </el-icon>
          </div>
          <div class="info-content">
            <span class="label">注册时间</span>
            <span class="value">{{ formatTime(userInfo.createdAt) }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { Message, Calendar, Camera, User } from '@element-plus/icons-vue'
import router from '@/router'

const loading = ref(false)
const userInfo = ref({})

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

const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  return timeStr.replace('T', ' ').substring(0, 10) // PC端一般不需要显示到秒，显示日期更简洁
}

onMounted(() => {
  loadInfo()
})
</script>

<style scoped>
/* 设计理念：
  1. 使用 CSS Grid 和 Flexbox 结合，保证在大屏上的延展性
  2. 增加“呼吸感”（Whitespace），避免元素过于拥挤
  3. 采用微交互和柔和的阴影
*/

.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  /* 浅灰底色衬托白卡片 */
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 900px;
  /* 增加最大宽度，适配 PC */
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;
  height: fit-content;
}

/* --- Banner 区域 --- */
.banner-section {
  height: 200px;
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  /* 清新极光色 */
  /* 或者使用图片背景：
  background-image: url('...');
  background-size: cover;
  */
  position: relative;
}

/* --- 头部主体 (头像+名字+按钮) --- */
.profile-header {
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  /* 底部对齐，让按钮和名字在同一水平线 */
  margin-top: -40px;
  /* 关键：负边距实现头像上浮 */
  margin-bottom: 40px;
  position: relative;
}

.header-left {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

/* 头像容器 */
.avatar-container {
  position: relative;
  padding: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.avatar-edit-mask {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.3s ease;
  font-size: 24px;
}

.avatar-container:hover .avatar-edit-mask {
  opacity: 1;
}

/* 文本信息 */
.user-identity {
  padding-bottom: 10px;
  /* 微调对齐 */
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.username {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.2;
}

.role-tag {
  border: none;
  background: #2c3e50;
}

.user-bio {
  color: #909399;
  font-size: 14px;
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
}

/* --- 信息 Grid 区域 --- */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 均分三列 */
  gap: 24px;
  padding: 0 40px 60px;
}

/* 单个信息块样式 */
.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.info-item:hover {
  background: #fff;
  border-color: #ebeef5;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}

.bg-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-purple {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
}

.bg-green {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.info-content {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* --- 响应式适配 --- */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -60px;
  }

  .header-left {
    flex-direction: column;
    align-items: center;
  }

  .header-actions {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
    /* 手机端切回单列 */
  }

  .user-bio {
    margin: 0 auto;
  }
}
</style>