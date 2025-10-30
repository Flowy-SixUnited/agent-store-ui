<template>
  <div class="home">
    <div class="header" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="content">
        <img class="icon" src="@/assets/home/icon.png" alt="icon" />
        <span class="title"
          >集图像与文本于一体的智能分析专家，能综合多种信息源进行深度理解与洞察，适用于报告分析、舆情研究与复杂图像数据解读。</span
        >
      </div>
      <div class="tools">
        <div class="tool-item">
          <Upload @update:fileList="handleFileChange" />
        </div>
        <div class="tool-item">
          <PromptWord @update:text="handleTextChange" />
        </div>
      </div>
      <div
        class="generate"
        :class="{ disabled: fileList.length === 0 || promptText === '' }"
        @click="handleGenerate"
      >
        开始生成
      </div>
      <div
        v-if="result.fileName && result.scriptText"
        class="pb-3 bg-[#fcfcfc]"
      >
        <Result :status="status" :content="content" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import bgUrl from "@/assets/home/header-bg.png";
import Result from "@/layout/components/lay-home/components/result.vue";
import PromptWord from "@/layout/components/lay-home/components/prompt-word.vue";
import Upload from "@/layout/components/lay-home/components/upload.vue";
import { useMultimodalStoreHook } from "@/store/modules/multimodal";
import type { UploadRawFile } from "element-plus";
import { ref } from "vue";
defineOptions({
  name: "home",
});
const fileList = ref<UploadRawFile[]>([]);
const result = ref({
  fileName: "",
  fileSize: "",
  scriptText: "",
});
const content = ref("");
const status = ref("ready");
const promptText = ref("");
const imageBase64 = ref("");
const handleFileChange = (newFileList: UploadRawFile[]) => {
  fileList.value = newFileList;
  const file = newFileList[0].raw;
  if (!file) {
    // 若未选择文件，清空相关值
    imageBase64.value = "";
    return;
  }

  const reader = new FileReader();
  // 读取完成后触发（异步）
  reader.onload = () => {
    if (typeof reader.result === "string") {
      // 提取 base64 数据（去掉前缀）
      imageBase64.value = reader.result.split(",")[1] || "";
    }
  };

  // 处理读取失败的情况
  reader.onerror = () => {
    console.error("文件读取失败", reader.error);
    imageBase64.value = "";
  };

  // 开始异步读取文件
  reader.readAsDataURL(file);
};
const handleTextChange = (newText: string) => {
  promptText.value = newText;
};
const handleGenerate = () => {
  result.value.fileName =
    "pdf_parse_jn2Ffcffb1...f_parse_results2F20251017_110929_result.zip";
  result.value.fileSize = "2.4MB";
  result.value.scriptText = promptText.value;
  const data = {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: promptText.value,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${imageBase64.value}`,
            },
          },
        ],
      },
    ],
    stream: false,
    reasoning_format: "auto",
    temperature: 0.8,
    max_tokens: -1,
    dynatemp_range: 0,
    dynatemp_exponent: 1,
    top_k: 40,
    top_p: 0.95,
    min_p: 0.05,
    xtc_probability: 0,
    xtc_threshold: 0.1,
    typ_p: 1,
    repeat_last_n: 64,
    repeat_penalty: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    dry_multiplier: 0,
    dry_base: 1.75,
    dry_allowed_length: 2,
    dry_penalty_last_n: -1,
    samplers: ["top_k", "typ_p", "top_p", "min_p", "temperature"],
    timings_per_token: true,
  };
  status.value = "loading";
  useMultimodalStoreHook()
    .generate(data)
    .then((res) => {
      console.log(res);
      content.value = res.choices[0].message.content;
      status.value = "success";
    });
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
