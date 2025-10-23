<script setup lang="ts">
import { ref, computed } from "vue";
import VuePdfEmbed from "vue-pdf-embed";

defineOptions({
  name: "Pdf"
});
const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  }
});
// const { t } = useI18n();
const pdfRef = ref<any>();
const pageCount = ref(1);
const loading = ref(true);
const currentPage = ref(1);
const currentRotation = ref(0);
const showAllPages = ref(false);
const rotations = [0, 90, 180, 270];
const fileType = computed(() => {
  const ext = props.fileName.split(".").pop()?.toLowerCase() || "";
  return ext;
});
const source =
  "https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf";

const handleDocumentRender = () => {
  loading.value = false;
  console.log(pdfRef.value);
  pageCount.value = pdfRef.value?.pageCount;
};

const showAllPagesChange = () => {
  currentPage.value = showAllPages.value ? null : 1;
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
</script>

<template>
  <el-card shadow="never">
    <img
      src="@/assets/home/file/left-icon.png"
      alt="向左"
      class="image-left"
      @click="handlePrevPage"
    />
    <div
      v-loading="loading"
      v-if="fileType === 'pdf'"
      class="h-[calc(100vh-505px)]"
      element-loading-text="加载中"
    >
      <el-scrollbar>
        <vue-pdf-embed
          ref="pdfRef"
          class="h-full container overflow-auto"
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="fileUrl"
          @rendered="handleDocumentRender"
        />
      </el-scrollbar>
    </div>
    <div v-else>
      <img :src="fileUrl" alt="预览图片" class="image-preview" />
    </div>
    <img
      src="@/assets/home/file/right-icon.png"
      alt="向右"
      class="image-right"
      @click="handleNextPage"
    />
    <div class="page">
      {{ currentPage }} / {{ pageCount }}
      <!-- <div>
        <el-pagination
          v-model:current-page="currentPage"
          background
          layout="prev, slot, next"
          :page-size="1"
          :total="pageCount"
        >
          {{ currentPage }} / {{ pageCount }}
        </el-pagination>
      </div> -->
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.image-left {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
}
.image-right {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
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
.image-preview {
  width: 210px;
  height: 297px;
  height: auto;
}
</style>
