<template>
  <div class="conversation">
    <div class="user">
      {{ content }}
    </div>
    <div class="message">
      <Markdown :content="message" />
    </div>
    <div class="origin" @click="openOrigin">
      <div class="icon"><img :src="pdfIcon" /></div>
      <div class="icon"><img :src="pdfIcon" /></div>
      <span>2个引用来源</span>
      <el-icon :size="12" color="#a8b1b7"><ArrowRight /></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import Markdown from "./markdown.vue";
import docxIcon from "@/assets/home/file/docx.png";
import xlsxIcon from "@/assets/home/file/xlsx.png";
import pdfIcon from "@/assets/home/file/pdf.png";
import pngIcon from "@/assets/home/file/png.png";
import { ArrowRight } from "@element-plus/icons-vue";
const props = defineProps({
  content: {
    type: String,
    required: true
  }
});
const emit = defineEmits(["openOrigin"]);
const message = ref(
  "您好！我们的笔记本产品线非常丰富，主要包括以下几个系列： 39系OLED双SSD笔记本 - 这类笔记本配备了高质量的OLED显示屏和双SSD存储，适合需要高性能和出色显示效果的用户。 轻薄系列 - 专为追求便携性和时尚设计的用户设计，轻便且性能不俗。 游戏系列 - 针对游戏爱好者，提供强大的图形处理能力和高刷新率屏幕。 商务系列 - 强调安全性和耐用性，适合商务人士使用。 二合一笔记本 - 结合笔记本和平板的功能，提供灵活的使用方式。 每个系列都有其独特的特点和适用场景，您可以根据自己的需求选择合适的系列。如果您对某个特定系列感兴趣，或者需要更详细的规格信息，请随时告诉我！"
);

const openOrigin = () => {
  emit("openOrigin", true);
};
</script>
<style scoped lang="scss">
.conversation {
  display: flex;
  width: 800px;
  flex-direction: column;
  padding-top: 88px;
  gap: 24px;
  .user {
    background: #f0f0f0;
    border: 1px solid #f2f0ef;
    padding: 12px;
    max-width: 200px;
    margin-left: auto;
    border-radius: 10px 10px 0 10px;
  }
  .origin {
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #f0f0f0;
    padding: 9px;
    display: flex;
    align-items: center;
    gap: 4px;
    width: auto;
    inline-size: fit-content;
    cursor: pointer;
    &:hover {
      background: #fdfdfd;
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
        width: 11px;
        height: 11px;
      }
    }
    span {
      font-family: HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 12px;
      color: #a8b1b7;
    }
  }
}
</style>
