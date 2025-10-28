<template>
  <div class="upload w-124">
    <div class="tips">请上文件（仅支持图片）</div>
    <el-upload
      v-if="fileList.length === 0"
      class="upload-demo"
      drag
      action="#"
      :auto-upload="false"
      :accept="'.jpg,.jpeg,.png'"
      :limit="1"
      :show-file-list="false"
      :on-change="handleFileChange"
    >
      <img class="w-8 h-8" src="@/assets/home/upload.png" alt="icon" />
      <div class="el-upload__text">
        <span class="text"
          >支持jpg/png/jpeg格式<span class="tip">（100MB以内）</span></span
        >
        <div class="button">选择文件</div>
      </div>
    </el-upload>
    <div v-if="fileList.length > 0" class="file">
      <el-icon
        :size="12"
        class="close cursor-pointer ml-2"
        @click="fileList = []"
        ><Close
      /></el-icon>
      <div class="flex flex-col gap-3 items-center">
        <img
          class="w-8 h-8"
          :src="
            fileList[0].raw.type.includes('video')
              ? MOV
              : fileList[0].raw.type.includes('image')
                ? PNG
                : MP4
          "
        />
        <div class="flex items-center gap-2">
          <span class="file-name cursor-pointer">{{ fileList[0].name }}</span>
          <span class="file-size">{{ formatFileSize(fileList[0].size) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { UploadInstance, UploadRawFile } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import PNG from "@/assets/home/png.png";
import MOV from "@/assets/home/mov.png";
import MP4 from "@/assets/home/mp4.png";
const upload = ref<UploadInstance>();
defineOptions({
  name: "home"
});

const fileList = ref<UploadRawFile[]>([]);
const emit = defineEmits(["update:fileList"]);
const handleFileChange = (
  file: UploadRawFile,
  compFileList: UploadRawFile[]
) => {
  fileList.value = compFileList;
  emit("update:fileList", fileList.value);
};
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};
</script>
<style scoped lang="scss">
.upload {
  height: 240px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 16px;
  .tips {
    font-family: Roboto, Roboto;
    font-weight: 500;
    font-size: 12px;
    color: #2d5bff;
    line-height: 16px;
    padding-left: 10px;
    border-left: 4px solid #2d5bff;
  }
  .upload-demo {
    margin-top: 20px;
  }
  :deep(.el-upload-dragger) {
    height: 170px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f9fcff;
  }
  .el-upload__text {
    font-family: HarmonyOS Sans SC;
    font-weight: 500;
    font-size: 13px;
    color: #0e1934;
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
  .textarea {
    margin-top: 12px;
  }

  .el-textarea {
    width: 100%;
    --el-input-bg-color: #f7f7f7;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
  }
  .file {
    position: relative;
    height: 170px;
    margin-top: 16px;
    padding: 12px;
    background: #f7f7f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    .close {
      position: absolute;
      top: 6%;
      right: 2%;
      transform: translate(-6%, -2%);
    }
  }
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
:deep(.el-upload) {
  width: 100%;
}
</style>
