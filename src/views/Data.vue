<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card card-blue">
          <div class="card-header">
            <span>用户总数</span>
            <el-icon>
              <User />
            </el-icon>
          </div>
          <div class="card-value">{{ stats.totalUsers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card card-green">
          <div class="card-header">
            <span>员工总数</span>
            <el-icon>
              <Avatar />
            </el-icon>
          </div>
          <div class="card-value">{{ stats.totalEmployees }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card card-orange">
          <div class="card-header">
            <span>文章发布</span>
            <el-icon>
              <Document />
            </el-icon>
          </div>
          <div class="card-value">{{ stats.totalArticles }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card card-purple">
          <div class="card-header">
            <span>部门架构</span>
            <el-icon>
              <OfficeBuilding />
            </el-icon>
          </div>
          <div class="card-value">{{ stats.totalDepartments }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <div class="chart-header">
              <span>📊 部门人员分布</span>
            </div>
          </template>
          <div id="barChart" style="height: 400px;"></div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="hover">
          <template #header>
            <div class="chart-header">
              <span>🧩 系统数据占比</span>
            </div>
          </template>
          <div id="pieChart" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { User, Avatar, Document, OfficeBuilding } from '@element-plus/icons-vue';
import request from '@/utils/request';

const stats = ref({
  totalUsers: 0,
  totalEmployees: 0,
  totalArticles: 0,
  totalDepartments: 0,
  employeeInDeptCount: {}
});

// 获取数据
const fetchData = async () => {
  try {
    const res = await request.get('/statistics/dashboard');
    if (res.code === '200' || res.code === 200) { // 根据你的 Result 结构调整
      stats.value = res.data;
      initCharts();
    }
  } catch (error) {
    console.error("获取统计数据失败", error);
  }
};

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 1. 柱状图：部门人数
    const barChartDom = document.getElementById('barChart');
    const myBarChart = echarts.init(barChartDom);

    // 解析 Map 数据到 ECharts 格式
    const deptNames = Object.keys(stats.value.employeeInDeptCount);
    const deptValues = Object.values(stats.value.employeeInDeptCount);

    const barOption = {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: deptNames,
        axisLabel: { interval: 0, rotate: 30 } // 标签防遮挡
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '员工数量',
          type: 'bar',
          data: deptValues,
          itemStyle: { color: '#409EFF', borderRadius: [5, 5, 0, 0] },
          barWidth: '40%'
        }
      ]
    };
    myBarChart.setOption(barOption);

    // 2. 饼图：简单的系统构成示例
    const pieChartDom = document.getElementById('pieChart');
    const myPieChart = echarts.init(pieChartDom);

    const pieOption = {
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center' },
      series: [
        {
          name: '系统统计',
          type: 'pie',
          radius: ['40%', '70%'], // 环形图更现代
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: [
            { value: stats.value.totalUsers, name: '注册用户' },
            { value: stats.value.totalEmployees, name: '在职员工' },
            { value: stats.value.totalArticles, name: '发布文章' },
            { value: stats.value.totalDepartments, name: '运营部门' }
          ]
        }
      ]
    };
    myPieChart.setOption(pieOption);

    // 窗口大小改变时重绘
    window.addEventListener('resize', () => {
      myBarChart.resize();
      myPieChart.resize();
    });
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.data-card {
  color: white;
  border: none;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

/* 卡片背景色设计 - 渐变增加高级感 */
.card-blue {
  background: linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%);
}

.card-green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.card-orange {
  background: linear-gradient(135deg, #FF8008 0%, #FFC837 100%);
}

.card-purple {
  background: linear-gradient(135deg, #834d9b 0%, #d04ed6 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  opacity: 0.9;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  margin-top: 10px;
}

.chart-header {
  font-weight: bold;
  color: #333;
}
</style>