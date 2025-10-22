<template>
  <div class="loader-container">
    <div class="loader"></div>
    <p class="loading-text">加载中，请稍等...</p>
  </div>
  <!-- <div class="relative w-80 h-80" ref="container">
    <div
      v-for="(dot, index) in dots"
      :key="index"
      :id="`dot${index + 1}`"
      :class="['dot', 'dot-animation', `dot-delay-${index + 1}`]"
      :style="{ left: dot.left, top: dot.top }"
    ></div>
  </div> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // 只导入 Vue 实际存在的 API

const container = ref(null);
const dots = ref([
  { left: '0px', top: '0px' },
  { left: '0px', top: '0px' },
  { left: '0px', top: '0px' },
  { left: '0px', top: '0px' }
]);

// 设置初始位置
function setupDots() {
  if (!container.value) return;

  const containerWidth = container.value.offsetWidth;
  const containerHeight = container.value.offsetHeight;
  const dotSize = 32; // 8rem = 32px

  // 计算中心位置
  const centerX = containerWidth / 2 - dotSize / 2;
  const centerY = containerHeight / 2 - dotSize / 2;

  // 设置四个点的初始位置（形成一个正方形）
  dots.value = [
    { left: `${centerX - 50}px`, top: `${centerY - 50}px` },  // 左上
    { left: `${centerX + 50}px`, top: `${centerY - 50}px` },   // 右上
    { left: `${centerX - 50}px`, top: `${centerY + 50}px` },   // 左下
    { left: `${centerX + 50}px`, top: `${centerY + 50}px` }    // 右下
  ];
}

// 初始化
onMounted(() => {
  setupDots();
  // 监听窗口大小变化（使用原生事件）
  window.addEventListener('resize', setupDots);
  console.log('动画已准备就绪');
});

// 组件卸载时移除事件监听（避免内存泄漏）
onUnmounted(() => {
  window.removeEventListener('resize', setupDots);
});
</script>

<style scoped>
/* 页面基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

/* 加载容器 */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 加载动画圆环 */
.loader {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #FF718B;
  border-right-color: #FBB4C1;
  border-bottom-color: #FFD971;
  border-left-color: #FBE8B4;
  animation: spin 1.5s linear infinite;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

/* 加载文字 */
.loading-text {
  font-family: HarmonyOS Sans SC, HarmonyOS Sans SC;
  font-weight: 400;
  font-size: 13px;
  color: #A8B1B7;
  line-height: 19px;
}

/* 旋转动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 文字脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
}
.dot {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  position: absolute;
  box-shadow: 0 0 15px rgba(0, 204, 255, 0.8);
}

@keyframes move {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
    box-shadow: 0 0 15px rgba(0, 204, 255, 0.8);
  }
  25% {
    transform: translate(15px, -15px) scale(1.3);
    opacity: 1;
    box-shadow: 0 0 25px rgba(0, 204, 255, 1);
  }
  50% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
    box-shadow: 0 0 15px rgba(0, 204, 255, 0.8);
  }
  75% {
    transform: translate(-15px, 15px) scale(0.9);
    opacity: 0.7;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.6);
  }
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
    box-shadow: 0 0 15px rgba(0, 204, 255, 0.8);
  }
}

.dot-animation {
  animation: move 3s ease-in-out infinite;
}

.dot-delay-1 {
  animation-delay: 0s;
}

.dot-delay-2 {
  animation-delay: 0.75s;
}

.dot-delay-3 {
  animation-delay: 1.5s;
}

.dot-delay-4 {
  animation-delay: 2.25s;
}
</style>
