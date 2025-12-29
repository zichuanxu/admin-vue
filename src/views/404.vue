<template>
  <div class="not-found-container">
    <div class="content">
      <img src="https://illustrations.popsy.co/amber/crashed-error.svg" alt="404 Illustration" class="illustration" />

      <h1 class="title">404</h1>
      <p class="subtitle">哎呀，页面好像去火星探险了...</p>

      <div class="actions">
        <el-button type="primary" size="large" round @click="goHome">
          返回首页
        </el-button>
        <el-button size="large" round @click="goBack">
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => router.push('/')
const goBack = () => router.back()
</script>

<style scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  /* 极淡的灰背景，比纯白更护眼 */
}

.content {
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

.illustration {
  width: 300px;
  /* 适当的大小 */
  height: auto;
  margin-bottom: 20px;
}

.title {
  font-size: 6rem;
  font-weight: 800;
  color: #e5e7eb;
  /* 很淡的颜色作为背景数字 */
  margin: 0;
  line-height: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.5);
  z-index: -1;
  /* 放在插画后面作为装饰 */
  opacity: 0.5;
}

/* 如果不想用背景大数字，可以改用这个常规标题样式 */
/* .title {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 10px;
} */

.subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 30px;
  font-weight: 400;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 简单的淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>