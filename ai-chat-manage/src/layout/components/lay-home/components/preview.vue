<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
defineOptions({
  name: "Pdf"
});
const props = defineProps({
  fileUrl: {
    type: String,
    required: true
    // required: true
  }
  // fileName: {
  //   type: String,
  //   required: true
  // }
});
// const { t } = useI18n();
const pdfRef = ref<any>();
const pageCount = ref(1);
const loading = ref(true);
const currentPage = ref(1);
const currentRotation = ref(0);
const showAllPages = ref(false);
const rotations = [0, 90, 180, 270];
const source =
  "https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf";

const handleDocumentRender = () => {
  loading.value = false;
  // console.log(pdfRef.value.doc._pdfInfo.numPages);
  pageCount.value =
    pdfRef.value?.pageCount || pdfRef.value.doc._pdfInfo.numPages;
};
const handlePdfError = (err: any) => {
  loading.value = false;
  // ElMessage.error("PDF 解析失败，请尝试下载查看");
  console.error("PDF 预览错误：", err);
};

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 右图标点击：页码加1（限制最大为总页数）
const handleNextPage = () => {
  if (currentPage.value < pageCount.value) {
    currentPage.value++;
  }
};
watch(
  () => props.fileUrl,
  newUrl => {
    if (newUrl && pdfRef.value) {
      loading.value = true; // 重新加载时显示加载态
      pdfRef.value.load(newUrl); // 调用组件内置方法重新加载 URL
    }
  },
  { immediate: true }
);
</script>

<template>
  <!--  class="flex justify-center h-110" -->
  <el-card shadow="never">
    <img
      src="@/assets/home/file/left-icon.png"
      alt="向左"
      class="image-left"
      @click="handlePrevPage"
    />
    <div class="h-[calc(100vh-335px)]">
      <el-scrollbar>
        <vue-pdf-embed
          ref="pdfRef"
          class="h-full container overflow-auto"
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="fileUrl"
          @rendered="handleDocumentRender"
          @error="handlePdfError"
        />
      </el-scrollbar>
    </div>
    <img
      src="@/assets/home/file/right-icon.png"
      alt="向右"
      class="image-right"
      @click="handleNextPage"
    />
    <div class="page">{{ currentPage }} / {{ pageCount }}</div>
  </el-card>
</template>

<style scoped lang="scss">
// :deep(.el-card) {
//   background-color: #f7f7f7;
//   --el-card-border-color: #f7f7f7;
//   --el-card-bg-color: #f7f7f7;
// }
:deep(.el-card__body) {
  // width: 260px;
  // padding: 20px 100px;
  // background: #f7f7f7;
  // display: flex;
  // justify-content: center;
}
.image-left {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  z-index: 1;
}
.image-right {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
  z-index: 1;
}
.page {
  position: absolute;
  top: 95%;
  left: 50%;
  transform: translate(-95%, -50%);
  font-family: HarmonyOS Sans SC;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #97a0c3;
}
</style>
