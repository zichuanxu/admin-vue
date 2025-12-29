<script setup>
import { ref, reactive, onMounted } from 'vue';
import { User, Memo, DataLine, Bell, Timer } from '@element-plus/icons-vue';

// 模拟当前用户信息和统计数据
const username = ref("管理员");
const currentTime = ref(new Date().toLocaleDateString());

const stats = reactive([
  { title: '用户总数', value: '1,284', icon: User, color: '#409EFF', growth: '+12%' },
  { title: '今日访问', value: '356', icon: DataLine, color: '#67C23A', growth: '+5%' },
  { title: '待办任务', value: '12', icon: Memo, color: '#E6A23C', growth: '-2' },
  { title: '系统预警', value: '0', icon: Bell, color: '#F56C6C', growth: '平稳' }
]);

const activities = ref([
  { content: '新管理员 "Alice" 已通过审核', timestamp: '2025-12-29 09:30', type: 'success' },
  { content: '系统数据库完成例行备份', timestamp: '2025-12-29 04:00', type: 'primary' },
  { content: '检测到异常登录 IP: 192.168.1.1', timestamp: '2025-12-28 22:15', type: 'warning' },
]);
</script>

<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2>早安，{{ username }}！☕</h2>
          <p>今天是 {{ currentTime }}，欢迎回到后台管理系统。系统目前运行状态极佳，一切尽在掌握。</p>
        </div>
        <img src="https://img.icons8.com/fluency/144/checked-user-male.png" class="welcome-img" />
      </div>
    </el-card>

    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="item in stats" :key="item.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-body">
            <div class="stat-icon" :style="{ backgroundColor: item.color + '15', color: item.color }">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-footer">
                <span class="growth">{{ item.growth }}</span> 较上周同期
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :span="16">
        <el-card shadow="never" class="main-chart-card">
          <template #header>
            <div class="card-header">
              <span><b>系统数据概览</b></span>
              <el-tag type="info">近7日</el-tag>
            </div>
          </template>
          <div class="placeholder-chart">
            <el-empty description="图表加载中..." :image-size="100" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" class="log-card">
          <template #header>
            <div class="card-header">
              <span><b>最新动态</b></span>
              <el-button link type="primary">查看更多</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :type="activity.type"
              :timestamp="activity.timestamp">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-container {
  padding: 8px;
  /* 增加呼吸感 */
}

/* 欢迎卡片样式 */
.welcome-card {
  border: none;
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  border-radius: 12px;
  margin-bottom: 20px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  margin: 0 0 10px 0;
  color: #1f2f3d;
  font-weight: 600;
}

.welcome-text p {
  color: #909399;
  margin: 0;
}

.welcome-img {
  width: 80px;
  height: 80px;
  opacity: 0.8;
}

/* 统计卡片样式 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}

.stat-body {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-footer {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 4px;
}

.growth {
  color: #67C23A;
  font-weight: bold;
}

/* 内容区域样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-chart-card,
.log-card {
  border-radius: 12px;
  border: none;
  min-height: 400px;
}

.placeholder-chart {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fcfcfc;
  border: 1px dashed #e6e6e6;
  border-radius: 8px;
}
</style>