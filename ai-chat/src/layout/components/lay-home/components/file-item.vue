<template>
  <div v-for="(item, index) in files" :key="index">
    <div class="item" @click.stop="handlePreview(item)">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="icon"><img :src="pdfIcon" /></div>
          <span class="filename">{{ item.filename }}</span>
        </div>
        <img
          class="w-5 h-5 cursor-pointer"
          src="@/assets/home/file/download.png"
          @click.stop="download(item)"
        />
      </div>
      <span class="desc">{{ item.desc }}</span>
    </div>
  </div>
  <el-dialog
    v-model="previewDialogVisible"
    width="800"
    style="height: 700px"
    class="preview-class"
    @close="handleDialogClose"
  >
    <Preview :file-url="previewFileUrl" :page="page" />
  </el-dialog>
</template>
<script setup lang="ts">
import pdfIcon from "@/assets/home/file/pdf.png";
import { ref, onMounted, watch } from "vue";
import { useChatStoreHook } from "@/store/modules/chat";
import Preview from "./preview.vue";
import axios from "axios";
import { id } from "element-plus/es/locale/index.mjs";
const props = defineProps({
  fileList: {
    type: Array,
    default: () => []
  }
});
const previewDialogVisible = ref(false);
const previewFileUrl = ref("");
const page = ref(1);
const files = ref([]);
onMounted(() => {
  props.fileList.forEach(item => {
    useChatStoreHook()
      .downloadChatFile(item.coze_file_id)
      .then(res => {
        console.log(res);
        files.value.push({
          filename: res.file.name,
          url: res.file.url,
          desc: item.content,
          id: item.coze_file_id,
          page: item.page
        });
      });
  });
});
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
const download = (item: any) => {
  downloadFile(item.url, item.filename);
  // const link = document.createElement("a");
  // link.href = item.url;
  // link.download = item.filename; // 文件名
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};
const handlePreview = (item: any) => {
  axios
    .get(`/download/v1/files/retrieve?file_id=${item.id}`, {
      headers: {
        Authorization: `Bearer pat_250803ff0d28f62881a866e0c630b0fd8338663448d449bf76dd2a98ddbbe039`
      }
    })
    .then(response => {
      console.log(response);
      previewDialogVisible.value = true;
      previewFileUrl.value = response.data.file.url;
      page.value = item.page;
    });
};
const handleDialogClose = () => {
  previewDialogVisible.value = false;
  previewFileUrl.value = ""; // 清空子组件的 fileUrl  props
};
watch(
  () => props.fileList,
  newUrl => {},
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.item {
  cursor: pointer;
  padding: 12px;
  margin-top: 8px;
  &:hover,
  &:active {
    background: #f6f6f6;
    border-radius: 5px 5px 5px 5px;
  }
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
    width: 14px;
    height: 14px;
  }
}
.filename {
  font-family: HarmonyOS Sans SC;
  font-weight: 500;
  font-size: 14px;
  color: #202b2f;
}
.desc {
  font-family: HarmonyOS Sans SC;
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  display: -webkit-box; /* 触发弹性盒模型 */
  -webkit-line-clamp: 2; /* 限制显示行数 */
  -webkit-box-orient: vertical; /* 垂直排列 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  line-height: 1.5; /* 行高，根据需求调整 */
}
</style>
