<template>
  <div class="file-preview">
    <img src="@/assets/home/file/left-icon.png" alt="向左" class="image-left" />
    <!-- PDF 预览 -->
    <template v-if="fileType === 'pdf'">
      <VuePdfEmbed :source="fileUrl" :page="page" @num-pages="setTotalPages" />
      <!-- <div>{{ fileUrl }}</div> -->
      <!-- <div class="pdf-nav">
        <button @click="page = Math.max(1, page - 1)" :disabled="page <= 1">上一页</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button @click="page = Math.min(totalPages, page + 1)" :disabled="page >= totalPages">下一页</button>
      </div> -->
    </template>

    <!-- Word 文档（docx）预览 -->
    <template v-else-if="fileType === 'docx'">
      <Docx :file="fileUrl" />
    </template>

    <!-- Excel 表格（xlsx）预览 -->
    <!-- <template v-else-if="fileType === 'xlsx'">
      <Xlsx :file="fileUrl" />
    </template> -->

    <!-- PPT 演示文稿（ppt）预览 -->
    <!-- <template v-else-if="fileType === 'ppt'">
      <Ppt :file="fileUrl" />
    </template> -->

    <!-- 图片（png/jpg）预览 -->
    <template v-if="['png', 'jpg', 'jpeg'].includes(fileType)">
      <img :src="fileUrl" alt="预览图片" class="image-preview" />
    </template>

    <img src="@/assets/home/file/right-icon.png" alt="向右" class="image-right" />
    <div class="page">2/3</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';


const props = defineProps({
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

// 识别文件类型（通过文件名后缀）
const fileType = computed(() => {
  const ext = props.fileName.split('.').pop()?.toLowerCase() || '';
  return ext;
});

// PDF 分页控制
const page = ref(1);
const totalPages = ref(1);
const setTotalPages = (num) => {
  totalPages.value = num;
};
</script>

<style scoped lang="scss">
.file-preview {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  .image-left {
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
  }
  .image-right {
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 40px;
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
}

.pdf-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.image-preview {
  // max-width: 297px;
  // max-height: 297px;
  width: 210px;
  height: 297px;
  height: auto;
}

.unsupported {
  color: #999;
  text-align: center;
  padding: 40px 0;
}
</style>
