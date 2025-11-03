<template>
  <div class="item">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="icon"><img :src="pdfIcon" /></div>
        <span class="filename">产品介绍.pdf</span>
      </div>
      <img class="w-5 h-5" src="@/assets/home/file/download.png" />
    </div>
    <span class="desc">探讨当前AI技术的发展情况及未来可能的发展方向...</span>
  </div>
</template>
<script setup lang="ts">
import pdfIcon from "@/assets/home/file/pdf.png";
</script>
<style lang="scss" scoped>
.item {
  cursor: pointer;
  padding: 12px;
  margin-top: 8px;
  &:hover,
  &:active {
    background: #f6f6f6;
    border-radius: 5px 5px 5px 5px;
  }
}
.icon {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 14px;
    height: 14px;
  }
}
.filename {
  font-family: HarmonyOS Sans SC;
  font-weight: 500;
  font-size: 14px;
  color: #202b2f;
}
.desc {
  font-family: HarmonyOS Sans SC;
  font-weight: 400;
  font-size: 12px;
  color: #999999;
}
</style>
