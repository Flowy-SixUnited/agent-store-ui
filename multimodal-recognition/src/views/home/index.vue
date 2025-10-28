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
      <div v-if="result.fileName && result.scriptText">
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
import { useMultimodalStoreHook } from "@/store/modules/multimodal";
import type { UploadRawFile } from "element-plus";
import { ref } from "vue";
defineOptions({
  name: "home"
});
const type = ref("default");
const fileList = ref<UploadRawFile[]>([]);
const result = ref({
  fileName: "",
  fileSize: "",
  scriptText: ""
});
const promptText = ref("");
const imageBase64 = ref("");
const handleFileChange = (newFileList: UploadRawFile[]) => {
  fileList.value = newFileList;
  console.log(fileList.value.length);
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
// const handleFileChange = (newFileList: UploadRawFile[]) => {
//   fileList.value = newFileList;
//   console.log(fileList.value.length);
//   const file = newFileList[0];
//   if (!file) return;
//   const reader = new FileReader();
//   reader.onload = () => {
//     // 去掉 data:image/xxx;base64, 前缀，只留纯数据
//     imageBase64.value = reader.result.split(",")[1];
//   };
//   reader.readAsDataURL(file);
//   promptText.value = imageBase64.value;
// };
// async function ask = () => {
//   // loading.value = true
//   // answer.value = ''
//   try {
//     const res = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         /* !!! 不要直接暴露 Key，此处仅演示 !!! */
//         Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'gpt-4o',
//         messages: [
//           {
//             role: 'user',
//             content: [
//               { type: 'text', text: question.value },
//               {
//                 type: 'image_url',
//                 image_url: { url: `data:image/jpeg;base64,${imageBase64.value}` }
//               }
//             ]
//           }
//         ],
//         max_tokens: 400
//       })
//     })

//     const data = await res.json()
//     if (!res.ok) throw new Error(data.error?.message || '请求失败')
//     answer.value = data.choices[0].message.content
//   } catch (e) {
//     answer.value = '出错：' + e.message
//   } finally {
//     loading.value = false
//   }
// }

const handleTextChange = (newText: string) => {
  promptText.value = newText;
  console.log(promptText.value);
};
const handleGenerate = () => {
  // if (fileList.value.length === 0) {
  //   return;
  // }
  // result.value.fileName =
  //   "pdf_parse_jn2Ffcffb1...f_parse_results2F20251017_110929_result.zip";
  // result.value.fileSize = "2.4MB";
  // result.value.scriptText = promptText.value;
  const data = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: promptText.value },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64.value}` }
          }
        ]
      }
    ],
    max_tokens: 400
  };
  useMultimodalStoreHook()
    .generate(data)
    .then(res => {});
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
