<template>
  <div class="body">
    <div class="document">
      <span class="tips">请上传 PDF 或图像文件（最多转换 20 页）</span>
      <el-upload
        v-if="audioFileList.length === 0"
        class="upload-demo"
        drag
        action="#"
        :auto-upload="false"
        :accept="'.pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg'"
        :limit="1"
        :on-exceed="handleExceed"
        :on-change="handleFileChange"
        :show-file-list="false"
      >
        <img class="icon" src="@/assets/home/upload.png" alt="icon" />
        <div class="el-upload__text">
          <span class="text"
            >拖拽文件/图片至此 <span class="tip">（100MB以内）</span></span
          >
          <div class="button">选择文件</div>
        </div>
      </el-upload>
      <div v-if="audioFileList.length > 0" class="file">
        <div class="flex items-center gap-2">
          <img class="w-7 h-7" :src="getFileIcon(audioFileList[0])" />
          <span class="file-name">{{ audioFileList[0].name }}</span>
          <span class="file-size">{{ formatFileSize(audioFileList[0].size) }}</span>
        </div>
        <el-icon :size="12" class="cursor-pointer ml-2" @click="removeFile(audioFileList[0])"
          ><Close
        /></el-icon>
      </div>
      <div class="flex justify-between gap-8 mt-2">
        <div class="start-button">开始转换</div>
        <div class="clear-button">清除内容</div>
      </div>
      <div class="content">
        <span class="tips">上传文件/图片效果预览</span>
        <div v-if="!fileInfo.filePath" class="preview"></div>
        <Preview v-else :fileUrl="fileInfo.filePath" :fileName="fileInfo.fileName" class="file-preview" />
        <!-- <FilePreview style="height: 100%" /> -->
        <!-- <MultiPagePreview fileUrl="/file/1.docx" /> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Recording from "./recording.vue";
import FilePreview from "./file-preview.vue";
import MultiPagePreview from "./multi-page-preview.vue";
import Preview from "./preview.vue";
import type { UploadRawFile } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import docxIcon from "@/assets/home/file/docx.png";
import xlsxIcon from "@/assets/home/file/xlsx.png";
import pdfIcon from "@/assets/home/file/pdf.png";
import pngIcon from "@/assets/home/file/png.png";
const referenceText = ref("");
const fileInfo = ref({
  filePath: "",
  fileType: "pdf",
  fileName: "faacd3fa-73a5-4527-9b8c-01add8c9b7b9.pdf",
  fileSize: 0
});
const fileUrl = ref("/file/tx.png");
// 音频文件列表（上传组件用）
const audioFileList = ref<UploadRawFile[]>([]);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const playingFileName = ref("");
const handlePlayAudio = (file: UploadRawFile) => {
  // 1. 若还未创建音频实例，初始化一个
  if (!audioPlayer.value) {
    audioPlayer.value = new Audio();
    // 监听音频播放结束，重置状态
    audioPlayer.value.onended = () => {
      playingFileName.value = "";
    };
  }

  const currentPlayer = audioPlayer.value;
  const targetUrl = URL.createObjectURL(file.raw as Blob); // 获取文件的临时URL

  // 2. 判断当前是否正在播放该音频
  if (playingFileName.value === file.name) {
    // 正在播放 → 暂停
    currentPlayer.pause();
    playingFileName.value = "";
  } else {
    // 未播放 → 切换到该音频并播放
    currentPlayer.src = targetUrl; // 加载目标音频
    currentPlayer.play(); // 开始播放
    playingFileName.value = file.name; // 记录当前播放的文件名
  }
};
// 当前选中/录制的音频（用于预览）
const currentAudio = ref<{ url: string; name: string; size: number } | null>(
  null
);
// 上传错误信息
const uploadError = ref("");

const handleFileChange = (
  file: UploadRawFile,
  compFileList: UploadRawFile[]
) => {
  uploadError.value = ""; // 清空错误信息

  // 验证文件大小（100MB = 100 * 1024 * 1024 字节）
  if (file.size > 100 * 1024 * 1024) {
    uploadError.value = "文件大小不能超过100MB";
    audioFileList.value = []; // 清空无效文件
    return;
  }

  // 验证文件格式（虽然upload已限制，但二次验证更安全）
  const validFormats = [".pdf", ".xlsx", ".xls", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
  const fileExt = file.name.slice(file.name.lastIndexOf("."));
  if (!validFormats.includes(fileExt)) {
    uploadError.value = "仅支持pdf、xlsx、xls、doc、docx、png、jpg、jpeg格式";
  }
  if (!validFormats.includes(fileExt)) {
    uploadError.value = "仅支持pdf、xlsx、xls、doc、docx、png、jpg、jpeg格式";
    audioFileList.value = [];
    return;
  }
  // 更新音频文件列表
  audioFileList.value = compFileList;

  // 生成预览URL（本地临时URL）
  const fileUrl = URL.createObjectURL(file.raw as Blob);
  currentAudio.value = {
    url: fileUrl,
    name: file.name,
    size: file.size
  };
  // 更新文件信息
  fileInfo.value = {
    filePath: fileUrl,
    fileType: fileExt.slice(1),
    fileName: file.name,
    fileSize: file.size
  };
};

const handleExceed = () => {
  uploadError.value = "最多只能上传1个音频文件";
};
const removeFile = () => {
  audioFileList.value = [];
  fileInfo.value = {};
};
const getFileIcon = (file: UploadRawFile): string => {
  const fileExt = file.name.slice(file.name.lastIndexOf("."));
  console.log(fileExt);
  switch (fileExt) {
    case ".docx":
    case ".doc":
      return docxIcon;
    case ".xlsx":
    case ".xls":
      return xlsxIcon;
    case ".pdf":
      return pdfIcon;
    case ".png":
    case ".jpg":
    case ".jpeg":
      return pngIcon;
    default:
      return pngIcon;
  }
};

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

</script>
<style scoped lang="scss">
.body {
  position: relative;
  .tips {
    font-family: Roboto, Roboto;
    font-weight: 500;
    font-size: 12px;
    color: #2d5bff;
    line-height: 16px;
    padding-left: 10px;
    border-left: 4px solid #2d5bff;
  }
}
.document {
  // width: 448px;
  height: 588px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .upload-demo {
    .icon {
      width: 32px;
      height: 32px;
    }
  }
  :deep(.el-upload-dragger) {
    margin-top: 5px;
    height: 160px;
    background-color: #f9fcff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
  .recording {
    background: #f9fcff;
    border: 1px dashed #d8d8d8;
    display: flex;
    border-radius: 4px;
    padding: 8px 0;
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
      margin: 0 auto;
    }
  }
  .content {
    margin-top: 24px;
    font-weight: 400;
    font-size: 12px;
    color: #202a2f;
    line-height: 16px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    .el-textarea {
      width: 100%;
      --el-input-bg-color: #f7f7f7;
      font-weight: 400;
      font-size: 13px;
      line-height: 15px;
    }
    .preview {
      height: 256px;
      background: #f7f7f7;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ffffff;
    }
    .file-preview {
      height: 356px;
      background: #f7f7f7;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .file {
    margin-top: 10px;
    padding: 12px;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .file-name,
    .file-size {
      font-family:
        HarmonyOS Sans SC,
        HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 12px;

      line-height: 14px;
    }
    .file-name {
      color: #2173fc;
    }
    .file-size {
      color: #97a0c3;
    }
  }
  .start-button,
  .clear-button {
    width: 100%;
    font-family: HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
  }
  .start-button {
    color: #ffffff;
    background: #7aabfd;
    border-radius: 4px;
    padding: 8px 0;
  }
  .clear-button {
    color: #202a2f;
    background: #fafafa;
    border-radius: 4px;
    padding: 8px 0;
  }
}
</style>
