<template>
  <div class="result">
    <div class="flex justify-between items-center">
      <div class="tips">生成结果</div>
      <div v-if="status === 'success'" class="time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/success.png"
          alt="success"
        />生成完成，共用时：{{ formatTime(currentTime) }}
      </div>
      <div v-else-if="status === 'loading'" class="wait-time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/ing.png"
          alt="success"
        />加载中，当前用时：{{ formatTime(currentTime) }} | 当前进度：{{
          progress
        }}%
      </div>
    </div>
    <div v-if="status === 'success'" class="content">
      <Markdown :content="content" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import Markdown from "./markdown.vue";
const props = defineProps({
  content: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "ready"
  }
});
const emit = defineEmits(["update:status"]);

// 加载配置：总加载时间60秒
const TOTAL_LOADING_SEC = 20;
// 当前用时（秒，从0递增到10）
const currentTime = ref(0);
// 加载进度（0-100%）
const progress = ref(0);
// 定时器实例（用于清除，避免内存泄漏）
let timer: NodeJS.Timeout | null = null;
const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};
//  监听 status 变化：status 为 loading 时启动倒计时
watch(
  () => props.status,
  newStatus => {
    // 清除旧定时器（避免重复触发）
    if (timer) clearInterval(timer);

    // 当 status 切换为 loading 时，初始化并启动倒计时
    if (newStatus === "loading") {
      currentTime.value = 0; // 重置当前用时为0
      progress.value = 0; // 重置进度为0

      timer = setInterval(() => {
        currentTime.value++; // 时间一直累加，不限制上限
        if (currentTime.value < TOTAL_LOADING_SEC) {
          progress.value = Math.round(
            (currentTime.value / TOTAL_LOADING_SEC) * 100
          );
        } else {
          progress.value = 99; // 超过总时间后卡在99%
        }
      }, 1000); // 1秒更新一次
    }

    if (newStatus === "success") {
      if (timer) {
        clearInterval(timer); // 停止计时
      }
      progress.value = 100; // 进度条完成
      // currentTime.value = TOTAL_LOADING_SEC;
    }
  },
  { immediate: true } // 初始渲染时执行一次
);
</script>
<style scoped lang="scss">
.result {
  margin: 24px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  .tips {
    font-family: Roboto, Roboto;
    font-weight: 500;
    font-size: 12px;
    color: #2d5bff;
    line-height: 16px;
    padding-left: 10px;
    border-left: 4px solid #2d5bff;
  }
  .time {
    background: #e8fbde;
    border-radius: 4px;
    padding: 4px 8px;
    font-family:
      HarmonyOS Sans SC,
      HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 12px;
    color: #61c72e;
    display: flex;
    align-items: center;
  }
  .wait-time {
    background: #deedfb;
    border-radius: 4px;
    padding: 4px 8px;
    font-family:
      HarmonyOS Sans SC,
      HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 12px;
    color: #2173fc;
    display: flex;
    align-items: center;
  }
  .return-file {
    background: #f7f7f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    .file-name,
    .file-size {
      font-family:
        HarmonyOS Sans SC,
        HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 12px;
    }
    .file-name {
      color: #2173fc;
    }
    .file-size {
      color: #97a0c3;
      margin-left: 8px;
    }
  }
  .content {
    margin-top: 20px;
    font-family: HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 13px;
    color: #202a2f;
    line-height: 18px;
  }
}
</style>
