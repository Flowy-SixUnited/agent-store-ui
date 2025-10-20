<template>
  <div class="home">
    <div class="header" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="content">
        <img class="icon" src="@/assets/home/icon.png" alt="icon" />
        <span class="title"
          >AI 播客智能体是 AI + 播客新应用，可自动选题 / 脚本 / 语音 / 翻译，凭
          NLP
          与知识图谱快出高质量内容，支持智能剪辑配乐，还能互动收反馈优化，降创作门槛、推行业发展。</span
        >
      </div>
      <div class="select">
        <span class="mr-2">语音模式：</span>
        <div>
          <el-radio-group v-model="type">
            <el-radio value="default">默认模式</el-radio>
            <el-radio value="clone">克隆模式</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div v-if="type === 'clone'" class="tools">
      <div class="tool-item">
        <Audio />
      </div>
      <div class="tool-item">
        <Audio />
      </div>
      <div class="tool-item">
        <Script @update:fileList="handleFileChange" />
      </div>
    </div>
    <div v-else class="tools">
      <div class="tool-item">
        <Figure type="girl" />
      </div>
      <div class="tool-item">
        <Figure type="boy" />
      </div>
      <div class="tool-item">
        <Script @update:fileList="handleFileChange" />
      </div>
    </div>
    <div
      class="generate"
      :class="{ disabled: fileList.length === 0 }"
      @click="handleGenerate"
    >
      生成对话音频
    </div>
    <div v-if="result.fileName">
      <Result />
    </div>
  </div>
</template>
<script setup lang="ts">
import bgUrl from "@/assets/home/header-bg.png";
import Audio from "@/layout/components/lay-home/components/timbre.vue";
import Script from "@/layout/components/lay-home/components/script.vue";
import Figure from "@/layout/components/lay-home/components/figure.vue";
import Result from "@/layout/components/lay-home/components/result.vue";

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
