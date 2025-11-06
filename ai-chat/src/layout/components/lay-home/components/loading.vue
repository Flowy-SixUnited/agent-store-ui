<template>
  <!-- 双球加载动画组件 -->
  <div class="loader-container">
    <div class="loader-ball loader-ball--1" />
    <div class="loader-ball loader-ball--2" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "#409eff"
  },
  size: {
    type: String,
    default: "8px" // 小球默认大小
  },
  speed: {
    type: String,
    default: "1.2s" // 动画默认周期
  }
});
</script>

<style scoped lang="scss">
.loader-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px; /* 两个小球间距 */
  padding: 10px;

  /* 动态绑定 props 样式（颜色、大小、速度） */
  --ball-color: v-bind(color);
  --ball-size: v-bind(size);
  --animation-speed: v-bind(speed);
}

.loader-ball {
  width: 8px;
  height: 8px;
  border-radius: 50%; /* 圆形小球 */
  background-color: var(--ball-color);
  animation: ballBounce var(--animation-speed) ease-in-out infinite;
}

/* 第二个小球延迟动画，形成交替效果 */
.loader-ball--2 {
  animation-delay: calc(var(--animation-speed) / 2);
}

/* 核心动画：缩放+轻微位移，模拟弹跳/呼吸效果 */
@keyframes ballBounce {
  0%,
  100% {
    transform: scale(0.8) translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2) translateY(-8px);
    opacity: 1;
  }
}
</style>
