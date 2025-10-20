<template>
  <div class="home">
    <div class="header" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="content">
        <img class="icon" src="@/assets/home/icon.png" alt="icon" />
        <span class="title"
          >多模态识别 Agent 可处理多类数据，具整合、关联、响应能力，应用于安防、医疗、自动驾驶等场景。</span
        >
      </div>
      <div class="tools">
        <div class="tool-item">
          <Upload />
        </div>
        <div class="tool-item">
          <PromptWord />
        </div>
      </div>
      <div
        class="generate"
        :class="{ disabled: fileList.length === 0 }"
        @click="handleGenerate"
      >
        开始生成
      </div>
      <div v-if="result.fileName">
        <Result />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import bgUrl from "@/assets/home/header-bg.png";
import Audio from "@/layout/components/lay-home/components/timbre.vue";
import Script from "@/layout/components/lay-home/components/script.vue";
import Figure from "@/layout/components/lay-home/components/figure.vue";
import Result from "@/layout/components/lay-home/components/result.vue";
import PromptWord from "@/layout/components/lay-home/components/prompt-word.vue";
import Upload from "@/layout/components/lay-home/components/upload.vue";
import type { UploadRawFile } from "element-plus";
import { ref } from "vue";
defineOptions({
  name: "home"
});
const type = ref("default");
const fileList = ref<UploadRawFile[]>([]);
const result = ref({
  fileName: "",
  fileSize: ""
});
const handleFileChange = (newFileList: UploadRawFile[]) => {
  fileList.value = newFileList;
  console.log(fileList.value.length);
};
const handleGenerate = () => {
  if (fileList.value.length === 0) {
    return;
  }
  result.value.fileName =
    "pdf_parse_jn2Ffcffb1...f_parse_results2F20251017_110929_result.zip";
  result.value.fileSize = "2.4MB";
};
</script>
<style scoped lang="scss">
.home {
  background: #fcfcfc;
  height: 100vh;
  font-family: HarmonyOS Sans SC;
}
.header {
  height: 136px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  .content {
    display: flex;
    align-items: center;
    padding-top: 18px;
    padding-left: 24px;
  }
  .icon {
    width: 40px;
    height: 45px;
    margin-right: 16px;
  }
  .title {
    font-family: HarmonyOS Sans SC;
    font-weight: 500;
    font-size: 13px;
    color: #2e5de0;
    line-height: 18px;
  }
  .select {
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
    border-radius: 8px;
    font-family: HarmonyOS Sans SC;
    font-weight: 500;
    font-size: 13px;
    color: #202a2f;
    line-height: 15px;
    padding: 16px 24px;
    margin: 16px 24px;
    display: flex;
    align-items: center;
  }
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: white;
  border-color: #202a2f;
}

:deep(.el-radio__input.is-checked .el-radio__inner:after) {
  background-color: #202a2f;
}
:deep(.el-radio__inner:hover),
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #ffffff;
  border-color: #202a2f;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #202a2f;
}
:deep(.el-radio__inner) {
  height: 16px;
  width: 16px;
}
:deep(.el-radio__inner:after) {
  height: 8px;
  width: 8px;
}
.tools {
  display: flex;
  margin: 24px;
  gap: 24px;

  .tool-item {
    flex: 1;
  }
  .tool-item > * {
    width: 100%; /* 让子组件继承父元素的等分宽度 */
    min-width: 0; /* 取消最小宽度限制，确保空间不足时能收缩 */
  }
}

.generate {
  margin: 0 24px;
  padding: 9px 0;
  background: #2173fc;
  border-radius: 4px;
  font-family: HarmonyOS Sans SC;
  font-weight: 400;
  font-size: 13px;
  color: #ffffff;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  &.disabled {
    background: #79aafc;
    cursor: not-allowed;
  }
}
</style>
