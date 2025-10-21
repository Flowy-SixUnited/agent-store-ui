<template>
  <div class="relative w-80 h-80" ref="container">
    <!-- 四个小圆点 -->
    <div
      v-for="(dot, index) in dots"
      :key="index"
      :id="`dot${index + 1}`"
      :class="['dot', 'dot-animation', `dot-delay-${index + 1}`]"
      :style="{ left: dot.left, top: dot.top }"
    ></div>
  </div>
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
