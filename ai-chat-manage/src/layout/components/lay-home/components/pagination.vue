<template>
  <div class="pagination-container">
    <slot />
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="props.pageSizes"
      :total="total"
      :layout="layout"
      :background="background"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { ElPagination } from "element-plus";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 5
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [5, 10, 20]
  },
  total: {
    type: Number,
    default: 0
  },
  // 布局配置
  layout: {
    type: String,
    default: "prev, pager, next, sizes,jumper"
  },
  // 是否显示背景
  background: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits<{
  (e: "page-change", page: number): void;
  (e: "size-change", size: number): void;
}>();

const handleCurrentChange = (page: number) => {
  // eslint-disable-next-line prettier/prettier
  emit('page-change', page)
};

const handleSizeChange = (size: number) => {
  emit("size-change", size);
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  background-color: #fbfbfb;
}
:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next),
/* :deep(.el-select__wrapper), */
:deep(.el-pagination .el-pager .number) {
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
}

:deep(.el-pagination .el-pager .number.is-active) {
  background-color: #2173fc;
  color: white;
}

:deep(.el-pagination .btn-prev:not([disabled])):hover,
:deep(.el-pagination .btn-next:not([disabled])):hover,
:deep(.el-pagination .more):hover,
:deep(.el-pagination .el-pager .number:hover:not(.is-active)) {
  color: #202a2f;
  border: 1px solid #202a2f;
}
:deep(.el-select__wrapper.is-focused),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 0.5px #202a2f;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #ffffff;
}
</style>
