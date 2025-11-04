<template>
  <div class="main p-6">
    <div class="flex items-center justify-between mb-6">
      <el-input
        v-model="input"
        style="width: 260px"
        :placeholder="$t('manage.knowledge.searchPlaceholder')"
        :suffix-icon="Search"
      />
      <div>
        <el-button
          type="primary"
          round
          color="#2173FC"
          @click="uploadDialogVisible = true"
          >{{ $t("manage.knowledge.upload") }}
        </el-button>
      </div>
    </div>
    <div v-if="paginatedList.length == 0" class="empty-class">
      <img class="w-35 h-35" src="@/assets/home/manage/empty.png" />
      <span>暂无数据哦～点击右上角上传文档吧</span>
    </div>
    <div v-else class="table">
      <el-table :data="paginatedList" style="width: 100%" :row-hover="true">
        <el-table-column
          prop="id"
          :label="$t('manage.knowledge.index')"
          align="left"
          width="80"
        />
        <el-table-column
          prop="filename"
          :label="$t('manage.knowledge.filename')"
          align="left"
        >
          <template #default="scope">
            <div class="flex items-center gap-2">
              <img class="w-7 h-7" :src="pdfIcon" />
              <span>{{ scope.row.filename }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileType"
          :label="$t('manage.knowledge.fileType')"
          align="left"
          width="180"
        />
        <el-table-column
          prop="businessType"
          :label="$t('manage.knowledge.businessType')"
          align="left"
        >
          <template #default="scope">
            <el-tag type="warning">{{ scope.row.businessType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileSize"
          :label="$t('manage.knowledge.fileSize')"
          align="left"
        />
        <el-table-column
          prop="uploadTime"
          :label="$t('manage.knowledge.uploadTime')"
          sortable
          align="left"
        />
        <el-table-column
          prop="status"
          :label="$t('manage.knowledge.status')"
          align="center"
        >
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status == '解析完成'
                  ? 'success'
                  : scope.row.status == '解析中'
                    ? 'primary'
                    : 'danger'
              "
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('manage.knowledge.operate')" align="right">
          <template #default="scope">
            <div class="flex items-center gap-4 justify-end">
              <img
                class="w-4 h-4 cursor-pointer"
                src="@/assets/home/manage/view.png"
                @click="
                  ((previewDialogVisible = true),
                  (curFilename = scope.row.filename))
                "
              />
              <img
                class="w-4 h-4 cursor-pointer"
                src="@/assets/home/manage/download.png"
              />
              <img
                class="w-4 h-4 cursor-pointer"
                src="@/assets/home/manage/delete.png"
                @click="handleDelete(scope.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="paginatedList.length"
        :background="true"
        @page-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </div>
    <el-dialog
      v-model="deleteDialogVisible"
      title="Warning"
      width="360"
      align-center
      class="delete-class"
    >
      <template #header>
        <div class="title">
          <el-icon color="#FAAD14"><WarningFilled /></el-icon>
          <span>删除文档信息确认</span>
        </div>
      </template>
      <span>您确定要删除当前文档信息吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">{{
            $t("manage.user.cancel")
          }}</el-button>
          <el-button type="primary" @click="deleteDialogVisible = false">
            {{ $t("manage.user.sure") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="previewDialogVisible" width="800" class="preview-class">
      <template #header>
        <div class="flex items-center gap-2">
          <img class="w-5 h-5" :src="pdfIcon" />
          <span class="title">{{ curFilename }}</span>
          <img class="w-4 h-4" src="@/assets/home/manage/download-blue.png" />
        </div>
      </template>
      <Preview />
    </el-dialog>
    <el-dialog
      v-model="uploadDialogVisible"
      :title="$t('manage.knowledge.upload')"
      width="516"
      class="upload-class"
    >
      <template #header>
        <div class="title">{{ $t("manage.knowledge.upload") }}</div>
      </template>
      <el-select
        v-model="businessType"
        :placeholder="$t('manage.knowledge.selectPlaceholder')"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div
        class="file-list h-50 bg-[#F9FCFF] mt-3 flex flex-col items-center justify-center"
      >
        <!--  flex items-center justify-center -->
        <!-- <el-progress :percentage="50" style="max-width: 320px" /> -->
        <div class="tips">
          请耐心等候，文件上传中（共50份），<span @click="innerVisible = true"
            >点击查看</span
          >
        </div>
      </div>
      <el-dialog
        v-model="innerVisible"
        width="500"
        title="Inner Dialog"
        append-to-body
      >
        <span>This is the inner Dialog</span>
      </el-dialog>
      <!-- <el-upload
        class="upload-demo mt-3"
        drag
        action="#"
        :auto-upload="false"
        :accept="'.pdf'"
        :show-file-list="false"
        :limit="10"
        multiple
        :on-change="fileUpload"
      >
        <img class="icon" src="@/assets/home/upload.png" alt="icon" />
        <div class="el-upload__text">
          <span class="text"
            >{{ $t("manage.knowledge.tips1") }}
            <span class="tip"
              >（{{ $t("manage.knowledge.tips2") }}）</span
            ></span
          >
          <div class="button">{{ $t("manage.knowledge.selectFile") }}</div>
        </div>
        <div class="tips">{{ $t("manage.knowledge.supportTips") }}</div>
      </el-upload> -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">{{
            $t("manage.user.cancel")
          }}</el-button>
          <el-button type="primary" @click="uploadDialogVisible = false">
            {{ $t("manage.user.sure") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { debounce } from "lodash-es";
import Pagination from "./Pagination.vue";
import Drawer from "./drawer.vue";
import { useI18n } from "vue-i18n";
import { ElMessage, type DrawerProps } from "element-plus";
import { Search, WarningFilled } from "@element-plus/icons-vue";
import pdfIcon from "@/assets/home/file/pdf.png";
import Preview from "./preview.vue";
import { tr } from "element-plus/es/locale/index.mjs";
const deleteDialogVisible = ref(false);
const previewDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const innerVisible = ref(false);
const curFilename = ref("");
const direction = ref<DrawerProps["direction"]>();
const { t } = useI18n();
const input = ref("");
const currentPage = ref(1);
const pageSize = ref(20); // 默认20
const drawer = ref(false);
const businessType = ref("");
// 分页后的列表
// const paginatedList = computed<any[]>(() => {
//   // const startIndex = (currentPage.value - 1) * pageSize.value
//   // const endIndex = startIndex + pageSize.value
//   // return filteredList.value.slice(startIndex, endIndex)
// })
// const paginatedList = [];
const paginatedList = ref([
  {
    id: 1,
    filename: "666.pdf",
    fileType: "PDF",
    businessType: "产品",
    fileSize: "10M",
    uploadTime: "2025/07/31",
    status: "解析完成"
  },
  {
    id: 2,
    filename: "777.docx",
    fileType: "Word",
    businessType: "技术",
    fileSize: "5M",
    uploadTime: "2025/08/02",
    status: "解析中"
  },
  {
    id: 3,
    filename: "888.xlsx",
    fileType: "Excel",
    businessType: "销售",
    fileSize: "8M",
    uploadTime: "2025/08/05",
    status: "解析完成"
  },
  {
    id: 4,
    filename: "999.pptx",
    fileType: "PPT",
    businessType: "市场",
    fileSize: "15M",
    uploadTime: "2025/08/10",
    status: "解析失败"
  },
  {
    id: 5,
    filename: "1010.pdf",
    fileType: "PDF",
    businessType: "产品",
    fileSize: "12M",
    uploadTime: "2025/08/15",
    status: "解析完成"
  },
  {
    id: 6,
    filename: "1111.docx",
    fileType: "Word",
    businessType: "运营",
    fileSize: "3M",
    uploadTime: "2025/08/20",
    status: "解析中"
  },
  {
    id: 7,
    filename: "1212.xlsx",
    fileType: "Excel",
    businessType: "财务",
    fileSize: "6M",
    uploadTime: "2025/08/25",
    status: "解析完成"
  },
  {
    id: 8,
    filename: "1313.pdf",
    fileType: "PDF",
    businessType: "技术",
    fileSize: "9M",
    uploadTime: "2025/09/01",
    status: "解析失败"
  },
  {
    id: 9,
    filename: "1414.pptx",
    fileType: "PPT",
    businessType: "销售",
    fileSize: "20M",
    uploadTime: "2025/09/05",
    status: "解析中"
  },
  {
    id: 10,
    filename: "1515.docx",
    fileType: "Word",
    businessType: "产品",
    fileSize: "4M",
    uploadTime: "2025/09/10",
    status: "解析完成"
  }
]);
const options = ref([
  {
    value: "Option1",
    label: "Option1"
  },
  {
    value: "Option2",
    label: "Option2"
  },
  {
    value: "Option3",
    label: "Option3"
  }
]);
const curType = ref("new");
const curForm = ref({});
const handleNew = (item: any) => {
  curType.value = "new";
  curForm.value = {};
  drawer.value = true;
  console.log(item);
};
const handleEdit = (item: any) => {
  curType.value = "edit";
  curForm.value = item;
  drawer.value = true;
  console.log(item);
};
const handleDelete = (item: any) => {
  deleteDialogVisible.value = true;
  console.log(item);
};
// 处理搜索
const handleSearch = debounce(() => {
  // currentPage.value = 1 // 搜索时重置到第一页
}, 300);

// 处理页码变更
const handlePageChange = (page: number) => {
  // currentPage.value = page
  // // 更新store中的页码
  // visitorDetails.value.currentPage = page
};

// 处理每页条数变更
const handlePageSizeChange = (size: number) => {
  // pageSize.value = size
  // currentPage.value = 1 // 改变每页条数时重置到第一页
  // visitorDetails.value.currentPage = 1
};

const fileUpload = (uploadFile, uploadFiles) => {
  if (!uploadFiles || uploadFiles.length === 0) return;
  console.log(uploadFiles);
};
</script>

<style lang="scss" scoped>
.main,
.table {
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(13, 10, 44, 0.08);
  border-radius: 12px;
  overflow: hidden;
  font-family:
    HarmonyOS Sans SC,
    HarmonyOS Sans SC;
}
// .main {
//   height: 100%;
// }
.table {
  width: 100%;
}
.empty-class {
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-weight: 400;
    font-size: 13px;
    color: #afafaf;
  }
}
.preview-class {
  .title {
    font-weight: 400;
    font-size: 13px;
    color: #2173fc;
  }
}
.file-list {
  .tips {
    font-weight: 400;
    font-size: 12px;
    color: #97a0c3;
    span {
      color: #2173fc;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.upload-class {
  .title {
    font-weight: 700;
    font-size: 16px;
    color: #202a2f;
  }
  .tips {
    font-weight: 400;
    font-size: 11px;
    color: #97a0c3;
    margin-top: 16px;
  }
  .el-upload__text {
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .text {
      margin-top: 13px;
      color: #0e1934;
      .tip {
        color: #999999;
      }
    }
    .button {
      margin-top: 8px;
      width: 90px;
      height: 26px;
      background-color: #2e5de0;
      padding: 3px 20px;
      border-radius: 4px;
      font-weight: 400;
      font-size: 12px;
      color: #ffffff;
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button--primary {
      --el-button-bg-color: #2173fc;
      --el-button-border-color: #2173fc;
    }
  }
}
:deep(.el-input__inner),
:deep(.el-select__selected-item) {
  font-size: 13px;
  font-weight: 400;
}
:deep(.el-table tr) {
  height: 56px;
  background-color: #ffffff;
  color: #202a2f;
  font-weight: 400;
  font-size: 13px;
}
:deep(.el-table .cell) {
  padding: 0 20px;
  .el-button {
    padding: 0;
    font-weight: 400;
    font-size: 13px;
  }
}
:deep(.el-table__header .cell) {
  // background-color: #fbfbfb;
  font-weight: 400;
  font-size: 14px;
  color: #80868f;
}

:deep(.el-tag.el-tag--warning) {
  --el-tag-text-color: #fd7310;
  --el-tag-bg-color: #ffefd3;
  --el-tag-border-color: #ffefd3;
}
:deep(.el-tag.el-tag--success) {
  --el-tag-text-color: #18c20f;
  --el-tag-bg-color: #e9ffec;
  --el-tag-border-color: #e9ffec;
}
:deep(.el-tag.el-tag--primary) {
  --el-tag-text-color: #104ffd;
  --el-tag-bg-color: #d3ddff;
  --el-tag-border-color: #d3ddff;
}
:deep(.el-tag.el-tag--danger) {
  --el-tag-text-color: #fd1010;
  --el-tag-bg-color: #ffe1d3;
  --el-tag-border-color: #ffe1d3;
}
.delete-class {
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
}
.dialog-footer {
  text-align: center;
}
</style>
