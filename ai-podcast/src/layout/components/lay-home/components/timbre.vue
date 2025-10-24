<template>
  <div class="body">
    <div class="mark">音色{{ title }}</div>
    <div class="audio">
      <el-upload
        v-if="audioFileList.length === 0"
        class="upload-demo"
        drag
        action="#"
        :auto-upload="false"
        :accept="'.mp3,.wav,.ogg,.webm,.m4a'"
        :limit="1"
        :on-exceed="handleExceed"
        :on-change="handleFileChange"
        :show-file-list="false"
      >
        <img class="icon" src="@/assets/home/audio.png" alt="icon" />
        <div class="el-upload__text">
          <span class="text"
            >拖拽音频至此 <span class="tips">（100MB以内）</span></span
          >
          <div class="button">选择文件</div>
        </div>
      </el-upload>
      <div class="file" v-if="audioFileList.length > 0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img class="w-4 h-4" src="@/assets/home/file.png" />
            <span
              class="file-name cursor-pointer"
              @click="handlePlayAudio(audioFileList[0])"
              >{{ audioFileList[0].name }}</span
            >
            <span class="file-size">{{
              formatFileSize(audioFileList[0].size)
            }}</span>
          </div>
          <el-icon
            :size="12"
            class="cursor-pointer ml-2"
            @click="audioFileList = []"
            ><Close
          /></el-icon>
        </div>
        <Player :audioUrl="currentAudio?.url || ''" />
      </div>
      <!-- <AudioPlayer :audioUrl="currentAudio?.url || ''" /> -->
      <div>
        <Recording />
      </div>
      <div class="content">
        <span class="tips">音频1文本</span>
        <el-input
          v-if="audioFileList.length === 0"
          v-model="referenceText"
          :autosize="{ minRows: 7, maxRows: 7 }"
          type="textarea"
          placeholder="音频1的参考文案"
        />
        <el-input
          v-else
          v-model="referenceText"
          :autosize="{ minRows: 8, maxRows: 8 }"
          type="textarea"
          placeholder="音频1的参考文案"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Recording from "./recording.vue";
import Player from "./player.vue";
import type { UploadRawFile } from "element-plus";
import { Close } from "@element-plus/icons-vue";
const props = defineProps({
  title: {
    type: String,
    default: ""
  }
});
const referenceText = ref("");
// 音频文件列表（上传组件用）
const audioFileList = ref<UploadRawFile[]>([]);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const playingFileName = ref("");
const emit = defineEmits(["playAudio1", "playAudio2"]);
const handlePlayAudio = (file: UploadRawFile) => {
  // 若还未创建音频实例，初始化一个
  if (!audioPlayer.value) {
    audioPlayer.value = new Audio();
    // 监听音频播放结束，重置状态
    audioPlayer.value.onended = () => {
      playingFileName.value = "";
    };
  }

  const currentPlayer = audioPlayer.value;
  const targetUrl = URL.createObjectURL(file.raw as Blob); // 获取文件的临时URL

  // 判断当前是否正在播放该音频
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

//  处理文件选择/变化
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
  const validFormats = [".mp3", ".wav", ".ogg", ".webm", ".m4a"];
  const fileExt = file.name.slice(file.name.lastIndexOf("."));
  if (!validFormats.includes(fileExt)) {
    uploadError.value = "仅支持mp3、wav、ogg、webm、m4a格式";
  }
  if (!validFormats.includes(fileExt)) {
    uploadError.value = "仅支持mp3、wav、ogg、webm、m4a格式";
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
  emit("playAudio1", currentAudio.value);
};

// 处理文件超出限制（已限制1个，再次选择时触发）
const handleExceed = () => {
  uploadError.value = "最多只能上传1个音频文件";
};

// 手动触发文件选择（点击“选择文件”按钮）
const handleSelectFile = () => {
  // 触发upload组件的文件选择 dialog
  const uploadInput = document.querySelector(
    ".el-upload__input"
  ) as HTMLInputElement;
  uploadInput?.click();
};

// 处理录音组件返回的音频（假设Recording组件会通过事件传递录音文件）
const handleAudioGenerated = (audio: {
  url: string;
  name: string;
  size: number;
}) => {
  // 清空上传的文件，优先显示录音
  audioFileList.value = [];
  currentAudio.value = audio;
};

// 清除当前音频（释放URL资源）
const clearAudio = () => {
  if (currentAudio.value) {
    URL.revokeObjectURL(currentAudio.value.url); // 释放临时URL，避免内存泄漏
  }
  currentAudio.value = null;
  audioFileList.value = [];
};

// 格式化文件大小（字节 → KB/MB）
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};
</script>
<style scoped lang="scss">
.body {
  position: relative;
  .mark {
    position: absolute;
    top: 0;
    left: 0;
    width: 88px;
    height: 20px;
    font-family: Roboto-Regular;
    font-weight: 400;
    font-size: 12px;
    border-radius: 8px 0 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #2d5bff;
    background: #d5edf9;
  }
}
.audio {
  // width: 448px;
  height: 505px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .upload-demo {
    .icon {
      width: 32px;
      height: 30px;
    }
  }
  :deep(.el-upload-dragger) {
    background-color: #f9fcff;
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
    }
    .tips {
      color: #999999;
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
    gap: 12px;
    .el-textarea {
      width: 100%;
      --el-input-bg-color: #f7f7f7;
      font-weight: 400;
      font-size: 13px;
      line-height: 15px;
    }
  }
  .file {
    // margin-top: 16px;
    padding: 19px 12px;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #ffffff;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
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
}
</style>
