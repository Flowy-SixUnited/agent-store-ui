<template>
  <div class="result">
    <div class="flex justify-between items-center">
      <div class="tips">示例（可点击下方示例体验文档解析流程）</div>
    </div>
    <div class="tags">
      <div v-for="item in tagList" :key="item.name" class="tag-item">
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const tagList = ref([
  { name: "手写.png" },
  { name: "英文论文.png" },
  { name: "有机化学知识归纳.png" },
  { name: "文档解析操作指南.pdf" }
]);
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
  }
  .tags {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .tag-item {
      background: #eef5ff;
      border-radius: 4px;
      padding: 4px 8px;
      font-family: HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 12px;
      color: #202b2f;
      line-height: 18px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
