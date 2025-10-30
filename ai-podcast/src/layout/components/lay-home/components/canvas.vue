<template>
  <div class="canvas-container">
    <canvas ref="waveformCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

// 配置参数
const config = ref({
  animationSpeed: 0.8, // 动画速度（秒）
  waveformColor: "#3B82F6", // 波形颜色（蓝色）
  bgColor: "#f9fcff", // 背景颜色（白色）
  amplitude: 60, // 振幅（%）
  density: 55, // 密度
});

const waveformCanvas = ref(null);
let ctx = null;
let animationId = null;

// 设置 Canvas 尺寸
function resizeCanvas() {
  if (!waveformCanvas.value) return;

  const canvas = waveformCanvas.value;
  const container = canvas.parentElement;

  // 设置画布尺寸以匹配显示尺寸（考虑设备像素比）
  const dpr = window.devicePixelRatio || 1;
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;

  // 调整绘图上下文缩放
  ctx.scale(dpr, dpr);

  // 设置显示尺寸
  canvas.style.width = `${container.clientWidth}px`;
  canvas.style.height = `${container.clientHeight}px`;
}

// 辅助函数：加深颜色
function darkenColor(color, factor) {
  if (color.startsWith("#")) {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.floor(r * (1 - factor));
    g = Math.floor(g * (1 - factor));
    b = Math.floor(b * (1 - factor));

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  return color;
}

// 绘制条形波形
function drawBarWaveform() {
  if (!ctx || !waveformCanvas.value) return;

  const canvas = waveformCanvas.value;
  const container = canvas.parentElement;

  // 清除画布
  ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);

  const barWidth = container.clientWidth / config.value.density;
  const centerY = container.clientHeight / 2;
  const maxBarHeight =
    (container.clientHeight / 2) * (config.value.amplitude / 100);

  ctx.fillStyle = config.value.waveformColor;

  for (let i = 0; i < config.value.density; i++) {
    const time = Date.now() * 0.001 * (1 / config.value.animationSpeed);
    const wave1 = Math.sin(time + i * 0.1) * 0.5 + 0.5;
    const wave2 = Math.sin(time * 1.5 + i * 0.2) * 0.3 + 0.5;
    const wave3 = Math.random() * 0.2 + 0.8;
    const height = maxBarHeight * wave1 * wave2 * wave3;

    const x = i * barWidth;
    const y = centerY - height / 2;

    // 创建渐变
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, config.value.waveformColor);
    gradient.addColorStop(1, darkenColor(config.value.waveformColor, 0.5));
    ctx.fillStyle = gradient;

    // 绘制条形
    ctx.fillRect(x + 1, y, barWidth - 2, height);
  }

  animationId = requestAnimationFrame(drawBarWaveform);
}

// 初始化
onMounted(() => {
  if (waveformCanvas.value) {
    ctx = waveformCanvas.value.getContext("2d");
    resizeCanvas();
    drawBarWaveform();

    // 监听窗口大小变化
    window.addEventListener("resize", resizeCanvas);
  }
});

// 组件卸载时清理
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener("resize", resizeCanvas);
});

// 监听配置变化，重新绘制
watch(
  config,
  () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    drawBarWaveform();
  },
  { deep: true }
);
</script>

<style scoped>
.canvas-container {
  width: 100%;
  /* max-width: 300px; */
  height: 24px;
  background-color: #f9fcff;
  overflow: hidden;
}

/* 确保canvas填充容器 */
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>