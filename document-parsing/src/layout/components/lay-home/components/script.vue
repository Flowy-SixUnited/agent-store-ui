<template>
  <div class="script w-124">
    <div class="flex justify-between items-center">
      <span class="tips">转化结果</span>
      <!-- <div class="time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/success.png"
          alt="success"
        />转化完成，共用时：2分03秒
      </div> -->
      <div class="wait-time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/ing.png"
          alt="success"
        />加载中，当前用时：00:36 | 当前进度：80%
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
      <div class="loading-container">
        <LoadingView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { UploadInstance, UploadRawFile } from "element-plus";
import LoadingView from "./loading.vue";
const upload = ref<UploadInstance>();
defineOptions({
  name: "home"
});
const scriptText = ref("");
const tagList = ref([
  { name: "MMD 渲染", active: false },
  { name: "MMD", active: true },
  { name: "Qwen.html", active: false }
]);
const handleTagClick = (clickIndex: number) => {
  // 1. 先把所有标签的 active 设为 false
  tagList.value.forEach((tag: { active: boolean }) => {
    tag.active = false;
  });
  // 2. 再把当前点击标签的 active 设为 true
  tagList.value[clickIndex].active = true;
};
const fileList = ref<UploadRawFile[]>([]);
const emit = defineEmits(["update:fileList"]);
const handleFileChange = (
  file: UploadRawFile,
  compFileList: UploadRawFile[]
) => {
  fileList.value = compFileList;
  emit("update:fileList", fileList.value);
};
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};
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
  .textarea {
    margin-top: 12px;
  }
  .result-content {
    position: relative;
    margin-top: 20px;
    height: 508px;
    background: #F7F7F7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #FFFFFF;
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
