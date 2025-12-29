<script setup>
import { ref, reactive, markRaw, onMounted, onUnmounted, nextTick } from 'vue';
import { User, Memo, DataLine, Bell } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'; // 引入 ECharts

const userStore = useUserStore()
const username = userStore.user?.username || '用户';
const currentTime = ref(new Date().toLocaleDateString());

// 统计卡片数据
const stats = reactive([
  { title: '用户总数', value: '1,284', icon: markRaw(User), color: '#409EFF', growth: '+12%' },
  { title: '今日访问', value: '356', icon: markRaw(DataLine), color: '#67C23A', growth: '+5%' },
  { title: '待办任务', value: '12', icon: markRaw(Memo), color: '#E6A23C', growth: '-2' },
  { title: '系统预警', value: '0', icon: markRaw(Bell), color: '#F56C6C', growth: '平稳' }
]);

// 动态列表数据
const activities = ref([
  { content: '新管理员 "Alice" 已通过审核', timestamp: '2025-12-29 09:30', type: 'success' },
  { content: '系统数据库完成例行备份', timestamp: '2025-12-29 04:00', type: 'primary' },
  { content: '检测到异常登录 IP: 192.168.1.1', timestamp: '2025-12-28 22:15', type: 'warning' },
]);

// --- 图表相关逻辑 ---
const chartRef = ref(null); // 图表 DOM 引用
let myChart = null;         // 图表实例

const initChart = () => {
  if (!chartRef.value) return;

  myChart = echarts.init(chartRef.value);

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: [10, 15],
      textStyle: { color: '#333' },
      axisPointer: { type: 'line', lineStyle: { type: 'dashed' } }
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#909399' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } }, // 虚线网格更现代
      axisLabel: { color: '#909399' }
    },
    legend: {
      data: ['访问量', '新增用户'],
      right: 10,
      textStyle: { color: '#909399' }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true, // 平滑曲线
        symbol: 'none', // 去掉折点圆圈，更简洁
        lineStyle: { width: 3, color: '#409EFF' },
        areaStyle: {
          // 线性渐变填充
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.01)' }
          ])
        },
        data: [120, 132, 101, 134, 290, 230, 310]
      },
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3, color: '#67C23A' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.01)' }
          ])
        },
        data: [20, 32, 21, 54, 90, 130, 110]
      }
    ]
  };

  myChart.setOption(option);
};

// 监听窗口大小变化，实现图表自适应
const handleResize = () => {
  myChart && myChart.resize();
};

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (myChart) myChart.dispose();
});
</script>

<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2>你好，{{ username }}！</h2>
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
              <div class="header-left">
                <span><b>系统数据概览</b></span>
              </div>
              <el-tag effect="plain" round>近7日</el-tag>
            </div>
          </template>
          <div ref="chartRef" class="chart-container"></div>
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

/* 修改：为图表容器设置固定高度 */
.chart-container {
  height: 330px;
  width: 100%;
}
</style>