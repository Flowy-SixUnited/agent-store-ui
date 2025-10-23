<script setup lang="ts">
import { ref, computed } from "vue";
import VuePdfEmbed from "vue-pdf-embed";

defineOptions({
  name: "Pdf"
});
const pdfRef = ref<any>();
const pageCount = ref(1);
const loading = ref(true);
const currentPage = ref(null);
const currentRotation = ref(0);
const rotations = [0, 90, 180, 270];
// const fileType = computed(() => {
//   const ext = props.fileName.split(".").pop()?.toLowerCase() || "";
//   return ext;
// });
const source =
  "https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf";

const handleDocumentRender = () => {
  loading.value = false;
  console.log(pdfRef.value);
  pageCount.value = pdfRef.value?.pageCount;
};
</script>

<template>
  <el-card shadow="never" class="mt-[12px]">
    <div class="h-[calc(100vh-420px)]">
      <el-scrollbar>
        <vue-pdf-embed
          ref="pdfRef"
          class="h-full container overflow-auto"
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="source"
          @rendered="handleDocumentRender"
        />
      </el-scrollbar>
    </div>
  </el-card>
</template>
