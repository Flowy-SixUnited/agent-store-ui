<template>
  <div class="audio w-124">
    <el-upload class="upload-demo" drag action="#">
      <img class="icon" src="@/assets/home/audio.png" alt="icon" />
      <div class="el-upload__text">
        <span class="text"
          >拖拽音频至此 <span class="tips">（100MB以内）</span></span
        >
        <div class="button">选择文件</div>
      </div>
    </el-upload>
    <div class="recording">
      <img src="@/assets/home/recording.png" />
    </div>
    <div class="content">
      <span class="tips">音频1文本</span>
      <el-input
        v-model="referenceText"
        :autosize="{ minRows: 7, maxRows: 14 }"
        type="textarea"
        placeholder="音频1的参考文案"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const referenceText = ref("");
</script>
<style scoped lang="scss">
.audio {
  // width: 448px;
  height: 505px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 40px 16px;
  // margin-top: 24px;
  // margin-left: 24px;
  .upload-demo {
    .icon {
      width: 32px;
      height: 30px;
    }
  }
  :deep(.el-upload-dragger) {
    background-color: #f9fcff;
  }
  .el-upload__text {
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .text {
      margin-top: 13px;
      color: #0e1934;
    }
    .tips {
      color: #999999;
    }
    .button {
      margin-top: 8px;
      width: 90px;
      height: 26px;
      background-color: #2e5de0;
      padding: 3px 20px;
      border-radius: 4px;
      font-weight: 400;
      font-size: 12px;
      color: #ffffff;
    }
  }
  .recording {
    background: #f9fcff;
    border: 1px dashed #d8d8d8;
    display: flex;
    border-radius: 4px;
    padding: 8px 0;
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
      margin: 0 auto;
    }
  }
  .content {
    margin-top: 24px;
    font-weight: 400;
    font-size: 12px;
    color: #202a2f;
    line-height: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    .el-textarea {
      width: 100%;
      --el-input-bg-color: #f7f7f7;
      font-weight: 400;
      font-size: 13px;
      line-height: 15px;
    }
  }
}
</style>
