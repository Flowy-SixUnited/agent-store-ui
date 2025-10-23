<template>
  <div class="script w-124">
    <div class="flex justify-between items-center">
      <span class="tips">转化结果</span>
      <div v-if="status === 'loading'" class="wait-time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/ing.png"
          alt="loading"
        />加载中，当前用时：{{ formatTime(remainingTime) }} | 当前进度：{{ progress }}%
      </div>
      <div v-else-if="status === 'success'" class="time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/success.png"
          alt="success"
        />转化完成，共用时：{{ formatTime(totalLoadingTime) }}
      </div>
    </div>
    <div class="result-content">
      <div class="result-switch">
        <div
          class="item"
          v-for="(tag, index) in tagList"
          :key="index"
          @click="handleTagClick(index)"
          :class="{ active: tag.active }"
        >
          {{ tag.name }}
        </div>
      </div>
      <img class="copy-icon" src="@/assets/home/copy.png" alt="" />
      <div v-if="status === 'loading'" class="loading-container">
        <LoadingView />
      </div>
      <Result v-if="status === 'success'" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import LoadingView from "./loading.vue";
import Result from "./result.vue";
defineOptions({
  name: "home"
});
const props = defineProps({
  fileList: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    default: "ready"
  }
});
const tagList = ref([
  { name: "MMD 渲染", active: false },
  { name: "MMD", active: true },
  { name: "Qwen.html", active: false }
]);
const handleTagClick = (clickIndex: number) => {
  tagList.value.forEach((tag: { active: boolean }) => {
    tag.active = false;
  });
  tagList.value[clickIndex].active = true;
};
const emit = defineEmits(["update:status"]);

const TOTAL_LOADING_SEC = 10;
const remainingTime = ref(0); // 剩余倒计时（秒）
const progress = ref(0); // 加载进度（0-100%）
const totalLoadingTime = ref(TOTAL_LOADING_SEC); // 总耗时
let timer: NodeJS.Timeout | null = null; // 定时器实例（用于清除）
const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};

watch(
  () => props.status,
  newStatus => {
    // 清除旧定时器（避免重复触发）
    if (timer) clearInterval(timer);

    if (newStatus === "loading") {
      remainingTime.value = 0;
      progress.value = 0;

      // 每秒更新一次：剩余时间、进度
      timer = setInterval(() => {
        remainingTime.value++;
        // 进度计算：(已用时间 / 总时间) * 100%
        progress.value = Math.round(
          (remainingTime.value / TOTAL_LOADING_SEC) * 100
        );

        if (remainingTime.value >= TOTAL_LOADING_SEC) {
          clearInterval(timer); // 清除定时器
          emit("update:status", "success");
          totalLoadingTime.value = TOTAL_LOADING_SEC; // 记录总耗时
        }
      }, 1000); // 1秒 = 1000毫秒
    }
  },
  { immediate: true } // 初始渲染时就执行一次监听逻辑
);

// 组件卸载时清除定时器（避免内存泄漏）
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
<style scoped lang="scss">
.script {
  height: 588px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 16px;
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
  .textarea {
    margin-top: 12px;
  }
  .result-content {
    position: relative;
    margin-top: 20px;
    height: 508px;
    background: #f7f7f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    padding: 12px;
    .result-switch {
      width: 230px;
      background: #FFFFFF;
      border-radius: 8px 8px 8px 8px;
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 12px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      .item {
        padding: 4px 12px;
        cursor: pointer;
        &.active {
          background: #202A2F;
          color: #FFFFFF;
          border-radius: 8px 8px 8px 8px;
        }
      }
    }
    .copy-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .loading-container {
      margin-top: 88px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
:deep(.el-upload) {
  width: 100%;
}
</style>
