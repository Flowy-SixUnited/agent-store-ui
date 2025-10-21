<template>
  <div class="result">
    <div class="flex justify-between items-center">
      <div class="tips">生成结果</div>
      <!-- <div class="time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/success.png"
          alt="success"
        />生成完成，共用时：2分03秒
      </div> -->
      <div class="wait-time">
        <img
          class="w-4 h-4 mr-2"
          src="@/assets/home/ing.png"
          alt="success"
        />加载中，当前用时：00:36 | 当前进度：80%
      </div>
    </div>
    <div class="content">多模态识别 Agent，操作超简单！先上传音频、视频或图片，再输入提示词，点击生成按钮就能出结果。比如上传：《多模态识别 Agent 介绍》.mov 视频，提示词输入 “视频里讲了什么？”，点 “开始生成”，直接拿到文字总结～</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const result = ref({
  fileName:
    "pdf_parse_jn2Ffcffb1...f_parse_results2F20251017_110929_result.zip",
  fileSize: "2.4MB"
});
</script>
<style scoped lang="scss">
.result {
  margin: 24px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
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
  .return-file {
    background: #f7f7f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    .file-name,
    .file-size {
      font-family:
        HarmonyOS Sans SC,
        HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 12px;
    }
    .file-name {
      color: #2173fc;
    }
    .file-size {
      color: #97a0c3;
      margin-left: 8px;
    }
  }
  .content {
    margin-top: 20px;
    font-family: HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 13px;
    color: #202A2F;
    line-height: 18px;
  }
}
</style>
