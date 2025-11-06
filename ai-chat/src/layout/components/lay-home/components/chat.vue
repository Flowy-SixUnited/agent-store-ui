<template>
  <div class="conversation">
    <div class="user">
      {{ content }}
    </div>
    <div class="message">
      <Loading v-if="message == '内容加载中...'" />
      <Markdown v-else :content="message" />
      <div v-if="fileList.length > 0" class="flex items-center justify-between">
        <div class="origin" @click="openOrigin">
          <div v-for="(item, index) in fileList" :key="index" class="icon">
            <img :src="pdfIcon" />
          </div>
          <!-- <div class="icon"><img :src="pdfIcon" /></div> -->
          <span>{{ fileList.length }}个{{ $t("chat.citationSources") }}</span>
          <el-icon :size="12" color="#a8b1b7"><ArrowRight /></el-icon>
        </div>
        <div class="flex items-center gap-3">
          <img
            class="w-4 h-4 cursor-pointer"
            src="@/assets/home/chat/like.png"
          />
          <div
            class="border-left border-[1px] h-3 border-solid border-[#BFC7E0]"
          />
          <img
            class="w-4 h-4 cursor-pointer"
            src="@/assets/home/chat/copy.png"
            alt="复制"
            @click.stop="copyContent"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import Markdown from "./markdown.vue";
import Loading from "./Loading.vue";
import docxIcon from "@/assets/home/file/docx.png";
import xlsxIcon from "@/assets/home/file/xlsx.png";
import pdfIcon from "@/assets/home/file/pdf.png";
import pngIcon from "@/assets/home/file/png.png";
import { ArrowRight } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { t } = useI18n();
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isStreaming: {
    type: Boolean,
    default: false
  },
  fileList: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["openOrigin"]);
// const message = ref(
//   "您好！我们的笔记本产品线非常丰富，主要包括以下几个系列： 39系OLED双SSD笔记本 - 这类笔记本配备了高质量的OLED显示屏和双SSD存储，适合需要高性能和出色显示效果的用户。 轻薄系列 - 专为追求便携性和时尚设计的用户设计，轻便且性能不俗。 游戏系列 - 针对游戏爱好者，提供强大的图形处理能力和高刷新率屏幕。 商务系列 - 强调安全性和耐用性，适合商务人士使用。 二合一笔记本 - 结合笔记本和平板的功能，提供灵活的使用方式。 每个系列都有其独特的特点和适用场景，您可以根据自己的需求选择合适的系列。如果您对某个特定系列感兴趣，或者需要更详细的规格信息，请随时告诉我！"
// );

const openOrigin = () => {
  emit("openOrigin", true);
};
const copyContent = async () => {
  try {
    // 复制 message 的内容到剪贴板
    await navigator.clipboard.writeText(props.message);
    ElMessage.success(t("chat.copySuccess"));
  } catch (err) {
    console.error("复制失败:", err);
    ElMessage.error(t("chat.copyFail"));
  }
};
</script>
<style scoped lang="scss">
.conversation {
  display: flex;
  width: 800px;
  flex-direction: column;
  gap: 24px;
  .user {
    background: #eaf0f7;
    border: 1px solid #f2f0ef;
    padding: 12px;
    max-width: 200px;
    margin-left: auto;
    border-radius: 10px 10px 0 10px;
    font-family:
      HarmonyOS Sans SC,
      HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 14px;
    color: #0e1934;
    line-height: 22px;
  }
  .origin {
    margin-top: 5px;
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
