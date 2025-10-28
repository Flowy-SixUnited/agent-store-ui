<template>
  <div class="prompt-word w-124">
    <span class="tips">对话脚本</span>
    <el-input
      v-model="scriptText"
      class="textarea"
      :autosize="{ minRows: 8, maxRows: 8 }"
      type="textarea"
      placeholder="可在此处填写提示词，点击 “开始生成”，即可结合左侧上传内容进行智能创作

示例：
请帮我将左侧商业停车场出入口及内部通道​视频画面中实时拍摄车辆外观 / 行驶路线，关联车牌识别模块提取车牌信息，同时对驾驶位进行人脸捕捉；​
当车牌匹配 “黑名单车辆”（如涉案、欠费逃缴），或人脸与 “可疑人员库” 匹配时，自动在视频中标记出来"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import type { UploadInstance, UploadRawFile } from "element-plus";
const upload = ref<UploadInstance>();
defineOptions({
  name: "home"
});

const scriptText = ref("");

const emit = defineEmits(["update:text"]);
watch(
  () => scriptText.value,
  (newVal) => {
    console.log(scriptText.value);
    emit("update:text", newVal);
  }
);
</script>
<style scoped lang="scss">
.prompt-word {
  height: 240px;
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
