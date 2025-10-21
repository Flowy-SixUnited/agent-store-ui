<template>
  <div class="multi-page-preview">
    <!-- 分页控制按钮 -->
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="currentPage--"
    >
      <!-- <img src="@/assets/icons/arrow-left.png" alt="上一页" /> -->
    </button>

    <!-- PDF 预览区域（直接使用全局组件） -->
    <vue-office-pdf
      :src="fileUrl"
      :page="currentPage"
      style="width: 100%; height: 600px"
      @rendered="onRendered"
      @error="onError"
    />

    <!-- 分页控制按钮 -->
    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="currentPage++"
    >
      <!-- <img src="@/assets/icons/arrow-right.png" alt="下一页" /> -->
    </button>

    <!-- 页码提示 -->
    <div class="page-info">
      {{ currentPage }}/{{ totalPages }}
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { VueOfficePdf } from '@vue-office/pdf';
// 从 window 全局对象获取 pdfjsLib（无需 import）
// const pdfjsLib = window.pdfjsLib;

const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  }
});

const currentPage = ref(1); // 当前页码
const totalPages = ref(0); // 总页数

// 加载 PDF 并获取总页数
// const loadPdfTotalPages = async () => {
//   if (!props.fileUrl) return;
//   try {
//     const loadingTask = pdfjsLib.getDocument(props.fileUrl);
//     const pdf = await loadingTask.promise;
//     totalPages.value = pdf.numPages;
//   } catch (err) {
//     console.error('获取总页数失败：', err);
//   }
// };

// onMounted(() => {
//   nextTick(() => {
//     loadPdfTotalPages();
//   });
// });

// 监听文件 URL 变化，重新加载总页数
// watch(() => props.fileUrl, () => {
//   currentPage.value = 1;
//   nextTick(() => {
//     loadPdfTotalPages();
//   });
// });

// 渲染完成回调
const onRendered = () => {
  console.log('PDF 渲染完成');
};

// 错误回调
const onError = (err) => {
  console.error('PDF 加载失败：', err);
};
</script>

<style scoped>
.multi-page-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn img {
  width: 20px;
  height: 20px;
}

.page-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #666;
}
</style>
