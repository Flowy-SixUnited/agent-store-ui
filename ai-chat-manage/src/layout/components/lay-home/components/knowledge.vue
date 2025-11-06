<template>
  <div class="main p-6">
    <div class="flex items-center justify-between mb-6">
      <el-input
        v-model="input"
        style="width: 260px"
        :placeholder="$t('manage.knowledge.searchPlaceholder')"
        :suffix-icon="Search"
        @change="handleSearch"
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
    <div v-if="knowledgeFileList.length == 0" class="empty-class">
      <img class="w-35 h-35" src="@/assets/home/manage/empty.png" />
      <span>暂无数据哦～点击右上角上传文档吧</span>
    </div>
    <div v-else class="table">
      <el-table :data="knowledgeFileList" style="width: 100%" :row-hover="true">
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
              <img class="w-7 h-7" :src="getFileIcon(scope.row.filename)" />
              <span>{{ scope.row.filename }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileType"
          :label="$t('manage.knowledge.fileType')"
          align="left"
          width="180"
        >
          <template #default="scope">
            <span>{{ getFileType(scope.row.filename) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="biz_type"
          :label="$t('manage.knowledge.businessType')"
          align="left"
        >
          <template #default="scope">
            <el-tag type="warning">{{
              getBusinessTypeName(scope.row.biz_type)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="file_size"
          :label="$t('manage.knowledge.fileSize')"
          align="left"
        />
        <el-table-column
          prop="uploadTime"
          :label="$t('manage.knowledge.uploadTime')"
          sortable
          align="left"
        >
          <template #default="scope">
            {{ formatDateTime(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="parse_status"
          :label="$t('manage.knowledge.status')"
          align="center"
        >
          <template #default="scope">
            <el-tag
              :type="
                scope.row.parse_status == '2'
                  ? 'success'
                  : scope.row.parse_status == '1'
                    ? 'primary'
                    : 'danger'
              "
              >{{
                scope.row.parse_status == "1"
                  ? $t("manage.knowledge.parsing")
                  : scope.row.parse_status == "2"
                    ? $t("manage.knowledge.parsingCompleted")
                    : $t("manage.knowledge.parsingFail")
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('manage.knowledge.operate')" align="right">
          <template #default="scope">
            <div class="flex items-center gap-4 justify-end">
              <img
                class="w-4 h-4 cursor-pointer"
                src="@/assets/home/manage/view.png"
                @click="handlePreview(scope.row)"
              />
              <img
                class="w-4 h-4 cursor-pointer"
                src="@/assets/home/manage/download.png"
                @click="handleDownload(scope.row)"
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
        :total="knowledgeFileList.length"
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
          <el-button type="primary" @click="deleteKnowledge">
            {{ $t("manage.user.sure") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="previewDialogVisible"
      width="800"
      style="height: 700px"
      class="preview-class"
      @close="handleDialogClose"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <img class="w-5 h-5" :src="pdfIcon" />
          <span class="title">{{ curFilename }}</span>
          <img
            class="w-4 h-4 cursor-pointer"
            src="@/assets/home/manage/download-blue.png"
            @click="downloadByUrl"
          />
        </div>
      </template>
      <Preview :file-url="previewFileUrl" />
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
          v-for="item in typeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div
        v-if="fileList.length > 0 && isDetail"
        class="file-list h-50 bg-[#F9FCFF] mt-3 py-3 flex flex-col items-center justify-center"
      >
        <el-icon class="close-icon" @click="isDetail = !isDetail"
          ><Close
        /></el-icon>
        <div class="mb-1">{{ $t("manage.knowledge.waitTips") }}</div>
        <el-progress
          :percentage="totalPercentage"
          :status="totalStatus"
          :show-text="true"
        />
        <div class="tips">
          <template v-if="totalStatus === ''">
            {{ $t("manage.knowledge.waitingTips") }}（{{
              $t("manage.knowledge.total")
            }}
            {{ fileList.length }} {{ $t("manage.knowledge.count") }}），
          </template>
          <template v-else-if="totalStatus === 'success'">
            {{ $t("manage.knowledge.successTips") }}（{{
              $t("manage.knowledge.total")
            }}
            {{ fileList.length }} {{ $t("manage.knowledge.count") }}），
          </template>
          <template v-else> {{ $t("manage.knowledge.failTips") }}， </template>
          <span @click.stop="innerVisible = true">{{
            $t("manage.knowledge.clickView")
          }}</span>
        </div>
      </div>
      <el-upload
        v-else
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
      </el-upload>
      <el-dialog
        v-model="innerVisible"
        width="400"
        append-to-body
        class="upload-class"
      >
        <template #header>
          <div class="title">{{ $t("manage.knowledge.uploadDetail") }}</div>
        </template>
        <div v-for="(item, index) in fileList" :key="index" class="mb-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5">
              <img class="w-4 h-4" src="@/assets/home/file/link.png" />
              <span>{{ item.name }}</span>
            </div>
            <el-icon class="cursor-pointer"><Close /></el-icon>
          </div>
          <el-progress
            :percentage="item.percentage"
            :status="
              item.status === 'fail'
                ? 'exception'
                : item.status === 'success'
                  ? 'success'
                  : ''
            "
            :show-text="item.status !== 'success'"
            :stroke-width="2"
            style="width: 100%"
          />
        </div>
      </el-dialog>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">{{
            $t("manage.user.cancel")
          }}</el-button>
          <el-button type="primary" @click="onSubmit">
            {{ $t("manage.user.sure") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { debounce, replace } from "lodash-es";
import Pagination from "./pagination.vue";
import Drawer from "./drawer.vue";
import { useI18n } from "vue-i18n";
import { ElMessage, type DrawerProps } from "element-plus";
import { Search, WarningFilled, Close, Message } from "@element-plus/icons-vue";
import pdfIcon from "@/assets/home/file/pdf.png";
import docxIcon from "@/assets/home/file/docx.png";
import pngIcon from "@/assets/home/file/png.png";
import xlsxIcon from "@/assets/home/file/xlsx.png";
import Preview from "./preview.vue";
import { useManageStoreHook } from "@/store/modules/manage";
import axios from "axios";
const iconMap = ref({
  ".pdf": pdfIcon,
  ".docx": docxIcon,
  ".png": pngIcon,
  ".xlsx": xlsxIcon,
  ".jpg": pngIcon,
  ".jpeg": pngIcon,
  ".txt": docxIcon
});

const deleteDialogVisible = ref(false);
const previewDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const innerVisible = ref(false);
const curFilename = ref("");
const previewFileUrl = ref("");
const { t } = useI18n();
const input = ref("");
const currentPage = ref(1);
const pageSize = ref(10); // 默认20
const drawer = ref(false);
const businessType = ref("");
const knowledgeFileList = ref([]);
const typeOptions = ref([]);
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
const curKnowledge = ref({});
const handleDelete = (item: any) => {
  deleteDialogVisible.value = true;
  curKnowledge.value = item;
};
const downloadByUrl = () => {
  const link = document.createElement("a");
  link.href = previewFileUrl.value;
  link.download = curFilename.value; // 文件名
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(previewFileUrl.value); // 释放 blob URL
  }, 100);
};
const handlePreview = (item: any) => {
  curKnowledge.value = item;
  curFilename.value = item.filename;
  axios
    .get(`/download/v1/files/retrieve?file_id=${item.minio_id}`, {
      headers: {
        Authorization: `Bearer pat_250803ff0d28f62881a866e0c630b0fd8338663448d449bf76dd2a98ddbbe039`
      }
    })
    .then(response => {
      console.log(response);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream"
      });
      const blobUrl = URL.createObjectURL(blob);
      previewDialogVisible.value = true;
      previewFileUrl.value = response.data.file.url;
    })
    .catch(err => {
      ElMessage.error("下载失败，请重试");
    });
};

async function downloadFile(url, fileName = "") {
  try {
    const res = await axios.get(url, {
      responseType: "blob"
    });

    const name =
      fileName ||
      res.headers["content-disposition"]?.match(/filename="?(.+)"?/i)?.[1] ||
      "download";

    const blob = new Blob([res.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error(e);
  }
}

const handleDownload = (item: any) => {
  axios
    .get(`/download/v1/files/retrieve?file_id=${item.minio_id}`, {
      headers: {
        Authorization: `Bearer pat_250803ff0d28f62881a866e0c630b0fd8338663448d449bf76dd2a98ddbbe039`
      }
    })
    .then(res => {
      downloadFile(res.data.file.url, item.filename);
      // const name = item.filename ||
      //   res.headers["content-disposition"]?.match(/filename="?(.+)"?/i)?.[1] ||
      // 'download';

      // const blob = new Blob([res.data]);
      // const link = document.createElement('a');
      // link.href = URL.createObjectURL(blob);
      // link.download = name;            // 关键 3：指定下载文件名
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(link.href);
      // if (contentDisposition) {
      //   // 解析后端返回的文件名（处理编码问题）
      //   const match = contentDisposition.match(/filename="?(.+?)"?$/);
      //   if (match && match[1]) {
      //     filename = decodeURIComponent(escape(match[1])); // 解码特殊字符
      //   }
      // }
      // const blob = new Blob([response.data], {
      //   type: response.headers["content-type"] || "application/octet-stream"
      // });
      // const blobUrl = URL.createObjectURL(blob);

      // // const downloadUrl = response.data.file.url;

      // const link = document.createElement("a");
      // link.href = blobUrl;
      // link.download = filename; // 文件名
      // document.body.appendChild(link);
      // link.click();

      // setTimeout(() => {
      //   document.body.removeChild(link);
      //   URL.revokeObjectURL(blobUrl); // 释放 blob URL
      // }, 100);
    })
    .catch(err => {
      console.error("下载失败详情:", {
        status: err.response?.status, // 接口状态码
        statusText: err.response?.statusText, // 状态描述
        data: err.response?.data, // 错误响应数据
        message: err.message // 错误信息
      });
      ElMessage.error("下载失败，请重试");
    });
};
// const handleDownload = (item: any) => {
//   useManageStoreHook()
//     .downloadFile(item.minio_id)
//     .then(res => {
//       console.log(res);
//       const originalUrl = res.file?.url;
//       if (!originalUrl) {
//         ElMessage.error("获取下载地址失败");
//         return;
//       }
//       // 替换本地 IP 为目标 IP（确保 URL 可访问）
//       const downloadUrl = originalUrl.replace("127.0.0.1", "192.168.31.167");

//       // 2. 创建 a 标签触发下载
//       const link = document.createElement("a");
//       link.href = downloadUrl; // 下载地址
//       // 设置文件名（可选，若接口返回文件名可从 item 中获取）
//       link.download = item.filename || "download_file";
//       document.body.appendChild(link);
//       link.click(); // 模拟点击下载

//       // 3. 清理 DOM 元素
//       setTimeout(() => {
//         document.body.removeChild(link);
//       }, 100);

//       // ElMessage.success("开始下载");
//     });
// };
// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置到第一页
  refresh();
};

// 处理页码变更
const handlePageChange = (page: number) => {
  currentPage.value = page;
  refresh();
};

// 处理每页条数变更
const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  refresh();
};
const fileList = ref<
  {
    name: string;
    percentage: number; // 文件进度（0-100）
    status: "waiting" | "uploading" | "success" | "fail"; // 状态：等待/成功/失败
    raw: File; // 原始文件对象
    size: number;
  }[]
>([]);
const isDetail = ref(false);
const totalPercentage = computed(() => {
  if (fileList.value.length === 0) return 0;
  const sumProgress = fileList.value.reduce(
    (sum, file) => sum + file.percentage,
    0
  );
  return Math.round(sumProgress / fileList.value.length);
});
const totalStatus = computed(() => {
  const hasFail = fileList.value.some(file => file.status === "fail");
  const allSuccess = fileList.value.every(file => file.status === "success");
  if (hasFail) return "exception"; // 有失败→红色
  if (allSuccess) return "success"; // 全成功→绿色
  return ""; // 上传中→默认蓝色
});
const formatDateTime = timeStr => {
  if (!timeStr) return ""; // 处理空值
  const date = new Date(timeStr); // 解析时间字符串为 Date 对象
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 补零（如 3 → "03"）
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  // 拼接为 "YYYY-MM-DD HH:MM:SS" 格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const getFileType = (filename: string) => {
  if (!filename) return ""; // 文件名为空时返回空
  const lastDotIndex = filename.lastIndexOf("."); // 找到最后一个 "." 的位置
  if (lastDotIndex === -1) return t("manage.knowledge.noExtension"); // 无后缀时返回“无扩展名”
  return filename.slice(lastDotIndex); // 截取从 "." 到结尾的部分（如 .pdf）
};
const getFileIcon = (filename: string) => {
  const fileType = getFileType(filename);
  // 有匹配的图标则返回，无匹配则默认用一个“通用文件图标”（可自行添加通用图标）
  return iconMap.value[fileType] || docxIcon; // 这里默认用 docxIcon，建议替换为专门的通用图标
};
const getBusinessTypeName = id => {
  // 找到 typeOptions 中 id 匹配的项
  const matched = typeOptions.value.find(item => item.id == id);
  // 若找到则返回 name，否则返回默认文本（如 "未知类型"）
  return matched ? matched.name : t("manage.knowledge.unknownType");
};

const fileUpload = (uploadFile, uploadFiles) => {
  if (!uploadFiles || uploadFiles.length === 0) return;
  // 初始化文件列表：每个文件默认“等待”状态，进度0%
  fileList.value = uploadFiles.map(file => ({
    name: file.name,
    percentage: 0,
    status: "waiting",
    raw: file.raw,
    size: file.raw.size
  }));
  isDetail.value = true; // 显示上传详情区
  // 模拟每个文件的上传进度（实际项目中替换为接口回调）
  // fileList.value.forEach((file, index) => {
  //   // 模拟进度递增（每500ms增加20%，直到100%）
  //   const timer = setInterval(() => {
  //     if (file.percentage >= 100) {
  //       clearInterval(timer);
  //       file.status = "success"; // 标记为成功
  //       return;
  //     }

  //     // 模拟随机失败（第2个文件强制失败，用于测试）
  //     if (index === 1 && file.percentage === 50) {
  //       clearInterval(timer);
  //       file.status = "fail"; // 标记为失败
  //       return;
  //     }

  //     file.percentage += 20;
  //   }, 500);
  // });
};
const deleteKnowledge = () => {
  useManageStoreHook()
    .deleteKnowledgeInfo({ id: curKnowledge.value.id })
    .then(res => {
      ElMessage.success(t("manage.user.deleteSuccess"));
      refresh();
    });
  deleteDialogVisible.value = false;
};
const refresh = () => {
  useManageStoreHook()
    .getKnowledgeFileList(currentPage.value, pageSize.value, input.value)
    .then(res => {
      knowledgeFileList.value = res.data;
    });
};
const progressTimers = ref<number[]>([]);
const onSubmit = () => {
  // 校验业务类型和文件
  if (!businessType.value) {
    ElMessage.warning(t("manage.knowledge.warn")); // 提示“请选择业务类型”
    return;
  }
  if (fileList.value.length === 0) {
    ElMessage.warning("请选择文件");
    return;
  }

  // 构建FormData
  const formdata = new FormData();
  formdata.append("biz_type", businessType.value);
  fileList.value.forEach(file => {
    formdata.append("files", file.raw);
  });

  // 开始模拟进度
  fileList.value.forEach((file, index) => {
    file.status = "uploading";
    // 每个文件启动定时器，每秒增长10%进度
    const timer = window.setInterval(() => {
      if (file.percentage < 90) {
        // 留10%，等接口返回后再补满
        file.percentage += 10;
      }
    }, 500);
    progressTimers.value.push(timer);
  });

  // 调用真实接口
  useManageStoreHook()
    .uploadKnowledge(formdata)
    .then(res => {
      // 接口成功：补满进度，标记成功
      fileList.value.forEach(file => {
        file.percentage = 100;
        file.status = "success";
      });
      ElMessage.success(t("manage.user.uploadSuccess"));
      // 延迟关闭弹窗，让用户看到成功状态
      setTimeout(() => {
        // uploadDialogVisible.value = false;
        fileList.value = [];
        refresh();
      }, 1000);
    })
    .catch(err => {
      // 接口失败：标记失败状态
      fileList.value.forEach(file => {
        file.status = "fail";
      });
      ElMessage.error(t("manage.knowledge.failTips"));
    })
    .finally(() => {
      fileList.value = [];
      // 清除所有进度定时器（无论成功失败都停止模拟）
      progressTimers.value.forEach(timer => clearInterval(timer));
      progressTimers.value = [];
    });
};

// const onSubmit = () => {
//   if (!businessType.value) {
//     ElMessage.error(t("manage.knowledge.warn"));
//     return;
//   }
//   const formdata = new FormData();
//   formdata.append("biz_type", businessType.value);
//   fileList.value.forEach(file => {
//     formdata.append("files", file.raw);
//   });
//   useManageStoreHook()
//     .uploadKnowledge(formdata)
//     .then(res => {
//       console.log(res);
//       ElMessage.success(t("manage.user.uploadSuccess"));
//       uploadDialogVisible.value = false;
//       refresh();
//     })
//     .finally(() => {
//       // 无论成功/失败，最终都清除文件列表
//       if (fileList.value) {
//         // fileList.value.clearFiles(); // 调用组件的clearFiles方法清空列表
//       }
//     });
// };
onMounted(() => {
  useManageStoreHook()
    .getTypeList()
    .then(res => {
      typeOptions.value = res.data;
    });
  refresh();
});
const handleDialogClose = () => {
  previewDialogVisible.value = false;
  previewFileUrl.value = ""; // 清空子组件的 fileUrl  props
};
</script>

<style lang="scss" scoped>
.main,
.table {
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(13, 10, 44, 0.08);
  border-radius: 12px;
  font-family:
    HarmonyOS Sans SC,
    HarmonyOS Sans SC;
}
.main {
  height: 100%;
  overflow-y: auto;
}
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
  position: relative;
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
  .el-progress {
    max-width: 300px;
    width: 100%;
  }
  .close-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
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
