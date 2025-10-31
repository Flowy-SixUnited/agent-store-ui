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
      <img class="copy-icon" src="@/assets/home/copy.png" alt="" @click="copyResult"/>
      <div v-if="status === 'loading'" class="loading-container">
        <LoadingView />
      </div>
      <!-- <Result :fileUrl="fileUrl"  /> -->
      <div v-if="status === 'success'" class="result-container">
        <Markdown v-if="curTagId == 1" :content="result" />
        <div v-else-if="curTagId == 2">{{ result }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import LoadingView from "./loading.vue";
// import Result from "./result.vue";
import Markdown from "./markdown.vue";
import { Close } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
defineOptions({
  name: "home"
});
const props = defineProps({
  fileList: {
    type: Array,
    required: true
  },
  fileUrl: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "ready"
  },
  result: {
    type: String,
    default: ""
  }
});
const tagList = ref([
  { id: 1, name: "MMD 渲染", active: true },
  { id: 2, name: "MMD", active: false }
  // { name: "Qwen.html", active: false }
]);
const curTagId = ref(1);
const handleTagClick = (clickIndex: number) => {
  tagList.value.forEach((tag: { active: boolean }) => {
    tag.active = false;
  });
  tagList.value[clickIndex].active = true;
  curTagId.value = tagList.value[clickIndex].id;
};
const emit = defineEmits(["update:status"]);
const copyResult = async () => {
  // 仅在成功状态下允许复制
  if (props.status !== "success") {
    ElMessage.warning("请等待处理完成后再复制");
    return;
  }

  // 确定要复制的内容（根据 curTagId 区分）
  let content = "";
  if (curTagId.value === 1) {
    // 复制 Markdown 内容
    content = props.result;
  } else if (curTagId.value === 2) {
    // 复制普通文本
    content = props.result;
  } else {
    content = props.fileUrl || "暂无可用内容";
  }

  try {
    // 使用浏览器原生 API 复制到剪贴板
    await navigator.clipboard.writeText(content);
    // 复制成功提示
    ElMessage.success("复制成功");
  } catch (err) {
    // 兼容旧浏览器或剪贴板权限被拒绝的情况
    console.error("复制失败", err);
    // 降级方案：创建临时文本框复制
    const textarea = document.createElement("textarea");
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy"); // 旧版 API
    document.body.removeChild(textarea);
    // 提示用户（即使降级成功也建议提示，因为 execCommand 可能失效）
    ElMessage.success("复制成功（兼容模式）");
  }
};
const TOTAL_LOADING_SEC = 60;
const remainingTime = ref(0); // 剩余倒计时（秒）
const progress = ref(0); // 加载进度（0-100%）
const totalLoadingTime = ref(TOTAL_LOADING_SEC); // 总耗时
// let timer: NodeJS.Timeout | null = null; // 定时器实例（用于清除）
const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};
//文件下载
const handleDownload = () => {
  if (!props.fileList.length) return;
  const file = props.fileList[0];
  const fileBlob = file.raw || file.blob;
  if (!fileBlob) {
    console.error("文件数据不存在");
    return;
  }

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
// const TOTAL_LOADING_SEC = 60;
const timer = ref<number | null>(null); // 定时器实例
watch(
  () => props.status,
  (newStatus, oldStatus) => {
    // 清除旧定时器（无论什么状态变化，先清定时器）
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }

    if (newStatus === "loading") {
      // 开始加载：重置时间和进度（从0开始）
      remainingTime.value = 0;
      progress.value = 0;

      // 每秒更新时间和进度（进度最多到99%）
      timer.value = window.setInterval(() => {
        remainingTime.value++; // 时间一直累加

        // 进度计算：最多99%（即使超时也不自动到100%）
        const calculatedProgress = Math.round(
          (remainingTime.value / TOTAL_LOADING_SEC) * 100
        );
        progress.value = calculatedProgress >= 100 ? 99 : calculatedProgress;
      }, 1000);
    } else if (newStatus === "success") {
      // 父组件传入成功状态：强制进度为100%，清除定时器
      totalLoadingTime.value = remainingTime.value;
      progress.value = 100;
    }
    // 其他状态（如error、ready等）：保持当前进度和时间（或根据需求重置）
  },
  { immediate: true }
);
// watch(
//   () => props.status,
//   newStatus => {
//     // 清除旧定时器（避免重复触发）
//     if (timer) clearInterval(timer);

//     if (newStatus === "loading") {
//       remainingTime.value = 0;
//       progress.value = 0;

//       // 每秒更新一次：剩余时间、进度
//       timer = setInterval(() => {
//         remainingTime.value++;
//         // 进度计算：(已用时间 / 总时间) * 100%
//         progress.value = Math.round(
//           (remainingTime.value / TOTAL_LOADING_SEC) * 100
//         );

//         if (remainingTime.value >= TOTAL_LOADING_SEC) {
//           clearInterval(timer); // 清除定时器
//           emit("update:status", "success");
//           totalLoadingTime.value = TOTAL_LOADING_SEC; // 记录总耗时
//         }
//       }, 1000); // 1秒 = 1000毫秒
//     }
//   },
//   { immediate: true } // 初始渲染时就执行一次监听逻辑
// );

// 组件卸载时清除定时器（避免内存泄漏）
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
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
  .file {
    margin-top: 10px;
    padding: 12px;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .file-name,
    .file-size {
      font-family:
        HarmonyOS Sans SC,
        HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 12px;

      line-height: 14px;
    }
    .file-name {
      color: #2173fc;
    }
    .file-size {
      color: #97a0c3;
    }
  }
  .textarea {
    margin-top: 12px;
  }
  .result-content {
    position: relative;
    margin-top: 16px;
    height: 510px;
    background: #f7f7f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    padding: 12px;
    .result-switch {
      width: 140px;
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
    .result-container {
      margin: 10px;
      max-height: 435px;
      overflow-y: auto;
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 15px;
    }
  }
}
:deep(.el-upload) {
  width: 100%;
}
</style>
