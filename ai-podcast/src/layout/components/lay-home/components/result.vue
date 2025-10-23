<template>
  <div class="result">
    <div class="flex justify-between items-center">
      <div class="tips">生成结果</div>
      <div v-if="status === 'success'" class="time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/success.png"
          alt="success"
        />生成完成，共用时：{{ formatTime(TOTAL_LOADING_SEC) }}
      </div>
      <div v-else-if="status === 'loading'" class="wait-time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/ing.png"
          alt="loading"
        />加载中，当前用时：{{ formatTime(currentTime) }} | 当前进度：{{ progress }}%
      </div>
    </div>
    <div class="return-file" v-if="status === 'success'">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="file-name">{{ result.fileName }}</span>
          <span class="file-size">{{ result.fileSize }}</span>
        </div>
        <img
          class="w-6 h-6 cursor-pointer"
          src="@/assets/home/download.png"
          alt="download"
          @click="handleDownload"
        />
      </div>
      <Player :audioUrl="audioInfo.url" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import Player from "./player.vue";
const result = ref({
  fileName:
    "pdf_parse_jn2Ffcffb1...f_parse_results2F20251017_110929_result.zip",
  fileSize: "2.4MB"
});
const props = defineProps({
  audioInfo: {
    type: Object,
    default: () => ({
      url: "",
      name: "",
      size: 0
    })
  },
  status: {
    type: String,
    default: "ready"
  }
});
const emit = defineEmits(["update:status"]);

// 加载配置：总加载时间10秒
const TOTAL_LOADING_SEC = 10;
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
const handleDownload = () => {
  if (!props.audioInfo.url) return;
  const file = props.audioInfo;
  const fileBlob = file.url || file.blob;
  if (!fileBlob) {
    console.error("文件数据不存在");
    return;
  }
  console.log(fileBlob);
  // 创建下载链接
  const url = URL.createObjectURL(fileBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name; // 下载文件名
  document.body.appendChild(a);
  a.click(); // 触发下载

  // 清理资源，避免内存泄漏
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

      // 每秒更新一次：当前用时、进度
      timer = setInterval(() => {
        // 用时递增（不超过总时间）
        if (currentTime.value < TOTAL_LOADING_SEC) {
          currentTime.value++;
          // 进度计算：(当前用时 / 总时间) * 100%，取整数避免小数
          progress.value = Math.round(
            (currentTime.value / TOTAL_LOADING_SEC) * 100
          );
        }

        // 10秒倒计时结束：切换为 success
        if (currentTime.value >= TOTAL_LOADING_SEC) {
          clearInterval(timer); // 清除定时器
          emit("update:status", "success"); // 通知父组件更新 status
        }
      }, 1000); // 1秒 = 1000毫秒，每秒更新一次
    }
  },
  { immediate: true } // 初始渲染时执行一次监听（处理初始为 loading 的情况）
);

// 组件卸载时清除定时器（避免内存泄漏）
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
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
    background: #DEEDFB;
    border-radius: 4px;
    padding: 4px 8px;
    font-family:
      HarmonyOS Sans SC,
      HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 12px;
    color: #2173FC;
    display: flex;
    align-items: center;
  }
  .return-file {
    background: #f7f7f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    padding: 14px 16px;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
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
}
</style>
