<template>
  <div class="main-container">
    <el-header class="main-header">
      <div class="logo-box">
        <img src="/admin-panel.png" class="logo-img" />
        <span class="logo-text">后台管理系统</span>
      </div>

      <div class="header-right">
        <el-dropdown trigger="click">
          <div class="user-info">
            <el-avatar :size="35"
              :src="userStore.user?.avatarUrl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
            <span class="username">{{ userStore.user?.username || '用户' }}</span>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/manager/info')">个人信息</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <div class=" content-wrapper">
      <aside class="main-sidebar">
        <el-menu router :default-active="router.currentRoute.value.path" class="el-menu-vertical"
          :default-openeds="['1']">
          <el-menu-item index="/manager/home">
            <el-icon>
              <House />
            </el-icon>
            <span>系统首页</span>
          </el-menu-item>

          <el-menu-item index="/manager/data">
            <el-icon>
              <DataBoard />
            </el-icon>
            <span>数据统计</span>
          </el-menu-item>


          <el-menu-item index="/manager/department" v-if="userStore.user?.admin === 1">
            <el-icon>
              <School />
            </el-icon>
            <span>部门管理</span>
          </el-menu-item>

          <el-menu-item index="/manager/article" ">
            <el-icon>
              <Document />
            </el-icon>
            <span>文章管理</span>
          </el-menu-item>


          <el-sub-menu index=" 1" v-if="userStore.user?.admin === 1">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/manager/admin"><el-icon>
                <User />
              </el-icon>管理员信息</el-menu-item>
            <el-menu-item index="/manager/user"><el-icon>
                <User />
              </el-icon>用户信息</el-menu-item>
            <el-menu-item index="/manager/employee"><el-icon>
                <User />
              </el-icon>员工信息</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/manager/info">
              <el-icon>
                <UserFilled />
              </el-icon>
              <span>个人信息</span>
            </el-menu-item>


            <el-menu-item index="/manager/password">
              <el-icon>
                <Edit />
              </el-icon>
              <span>修改密码</span>
            </el-menu-item>

        </el-menu>
      </aside>

      <main class="main-content">
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/manager/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="router-view-box">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import router from "@/router";
import { RouterView } from "vue-router";
import { ArrowDown, House, DataBoard, User, UserFilled, SwitchButton } from "@element-plus/icons-vue";
import { useUserStore } from '@/stores/user'
import { ElMessageBox, ElMessage } from 'element-plus'


// 动态获取当前路由名称用于面包屑展示
const currentRouteName = computed(() => {
  const path = router.currentRoute.value.path;
  if (path.includes('admin')) return '管理员管理';
  if (path.includes('user')) return '用户管理';
  if (path.includes('employee')) return '员工管理';
  if (path.includes('data')) return '数据统计';
  if (path.includes('department')) return '部门管理';
  if (path.includes('article')) return '文章管理';
  if (path.includes('info')) return '个人信息';
  if (path.includes('password')) return '修改密码';
  return '系统主页';
});

const userStore = useUserStore()

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 调用我们在 Pinia 里写好的 logout 方法
    await userStore.logout()
    ElMessage.success('退出成功')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
/* 整体布局容器 */
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
}

/* 头部样式：改为白色背景，增加精致阴影 */
.main-header {
  height: 64px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1f2f3d;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #606266;
}

/* 主内容包裹器 */
.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: #f0f2f5;
}

/* 侧边栏样式 */
.main-sidebar {
  width: 220px;
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
  transition: all 0.3s;
}

.el-menu-vertical {
  border: none !important;
}

/* 菜单激活态样式优化 */
:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff !important;
  border-right: 3px solid #409eff;
}

/* 内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px;
}

.breadcrumb-container {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
}

.router-view-box {
  flex: 1;
  /* 确保子组件填满 */
}

/* 退出登录项特别颜色 */
.exit-item:hover {
  color: #f56c6c !important;
}
</style>