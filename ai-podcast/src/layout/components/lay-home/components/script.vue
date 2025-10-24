<template>
  <div class="script w-124">
    <span class="tips">对话脚本</span>
    <el-input
      v-model="scriptText"
      class="textarea"
      :autosize="{ minRows: 18, maxRows: 18 }"
      type="textarea"
      placeholder="可在此处填写对话脚本或上传附件，点击 “生成对话音频”，即可结合左侧选择进行智能创作
    示例：
    说话人1：呜…… 小枫小枫，兔子钥匙扣的线又缠在一起啦，手指都被绕住啦！​
    说话人2：别急呀小桃！我帮你解 —— 你看，要先把线头轻轻拉出来，像拆礼物丝带一样慢～​
    说话人1：哇！小枫好厉害！那我们能在兔子耳朵上缝星星纽扣吗？我带了粉色的！​
    说话人2：当然可以！等下我还能帮你画腮红，这样兔子就更可爱啦～"
      @change="handleTextChange"
    />

    <el-upload
      v-if="fileList.length === 0"
      ref="upload"
      class="upload-demo"
      action="#"
      :limit="1"
      :on-change="handleFileChange"
      :auto-upload="false"
      :show-file-list="false"
    >
      <div class="add">
        <el-icon :size="9"><Plus /></el-icon>
      </div>
    </el-upload>
    <div v-if="fileList.length > 0" class="file">
      <div class="flex items-center gap-2">
        <img class="w-4 h-4" src="@/assets/home/file.png" />
        <span class="file-name">{{ fileList[0].name }}</span>
        <span class="file-size">{{ formatFileSize(fileList[0].size) }}</span>
      </div>
      <el-icon :size="12" class="cursor-pointer ml-2" @click="fileList = []"
        ><Close
      /></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Plus, Close } from "@element-plus/icons-vue";
import type { UploadInstance, UploadRawFile } from "element-plus";
const upload = ref<UploadInstance>();
defineOptions({
  name: "home"
});
const emit = defineEmits(["update:fileList", "update:text"]);
const scriptText = ref("");
const handleTextChange = () => {
  const text = scriptText.value;
  // 正则匹配：以「说话人1：」或「说话人2：」开头，直到下一个说话人开头或文本结束
  const regex = /(说话人1：|说话人2：)([\s\S]*?)(?=说话人1：|说话人2：|$)/g;
  const result = [];
  let match;

  // 遍历所有匹配项
  while ((match = regex.exec(text)) !== null) {
    const [, speaker, content] = match;
    // 替换说话人为[S1]/[S2]，并拼接内容（trim去除首尾空白）
    const item = `${speaker === "说话人1：" ? "[S1]" : "[S2]"}${content.trim()}`;
    result.push(item);
  }
  console.log(result);
  emit("update:text", result);
};
const fileList = ref<UploadRawFile[]>([]);

const handleFileChange = (
  file: UploadRawFile,
  compFileList: UploadRawFile[]
) => {
  fileList.value = compFileList;
  const reader = new FileReader();
  reader.readAsText(file.raw); // file.raw 是原生 File 对象
  reader.onload = e => {
    scriptText.value = e.target.result; // 文件内容
  };
  handleTextChange();
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
  height: 505px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 16px;
  .tips {
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 12px;
    color: #202a2f;
    line-height: 16px;
  }
  .textarea {
    margin-top: 12px;
  }

  .el-textarea {
    width: 100%;
    --el-input-bg-color: #f7f7f7;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
  }
  .file {
    margin-top: 16px;
    padding: 12px;
    background: #f7f7f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
:deep(.el-upload) {
  width: 100%;
}
.add {
  background: #f7f7f7;
  border: 1px dashed #d8d8d8;
  display: flex;
  border-radius: 4px;
  padding: 12px 0;
  cursor: pointer;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
}
</style>
