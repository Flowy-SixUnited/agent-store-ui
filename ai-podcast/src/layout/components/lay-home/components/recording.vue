<template>
  <div class="voice-recorder">
    <!-- 录音控制 -->
    <div
      v-if="audioFiles.length === 0"
      class="recording"
      @click="toggleRecording"
    >
      <Canvas v-if="isRecording" />
      <img v-else src="@/assets/home/recording.png" />
    </div>
    <!-- 生成的音频文件列表 -->
    <div class="audio-list">
      <div v-for="(audio, index) in audioFiles" :key="index">
        <audio
          :ref="el => el && (audioElements[index] = el)"
          controls
          :src="audio.url"
        />
      </div>
    </div>
    <div v-if="audioFiles.length > 0" class="result">
      <div class="flex items-center gap-2">
        <img class="w-4 h-2" src="@/assets/home/audio-icon.png" alt="voice" />
        <!-- 实时更新的播放时长 -->
        <span class="time"
          >{{ formattedPlayTime }} /
          {{ formatDuration(audioFiles[currentAudioIndex]?.duration) }}</span
        >
      </div>
      <div class="flex items-center gap-4">
        <!-- 播放/暂停按钮：根据播放状态切换图标和逻辑 -->
        <img
          class="w-6 h-6 cursor-pointer"
          :src="isPlaying ? pausePlay : startPlay"
          :alt="isPlaying ? 'pause-play' : 'start-play'"
          @click="toggleAudioPlay"
        />
        <!-- 停止按钮：重置播放进度 -->
        <img
          class="w-6 h-6 cursor-pointer"
          src="@/assets/home/stop-play.png"
          alt="stop-play"
          @click="stopAudioPlay"
        />
        <el-icon class="w-6 h-6 cursor-pointer" @click="audioFiles = []"
          ><Close
        /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, watch } from "vue";
import pausePlay from "@/assets/home/pause-play.png";
import startPlay from "@/assets/home/start-play.png";
import { Close } from "@element-plus/icons-vue";
import { usePodcastStoreHook } from "@/store/modules/podcast";
import Canvas from "./canvas.vue";
// 音频文件信息类型
interface AudioFile {
  name: string;
  url: string;
  duration?: number;
}

const isRecording = ref<boolean>(false);
// 明确 mediaRecorder 为 MediaRecorder 类型（null 表示初始未创建）
const mediaRecorder = ref<MediaRecorder | null>(null);
// 音频片段为 Blob 类型数组
const audioChunks = ref<Blob[]>([]);
// 音频文件列表为 AudioFile 类型数组
const audioFiles = ref<AudioFile[]>([]);
const audioElements = ref<(HTMLAudioElement | null)[]>([]); // 存储所有音频DOM实例
const currentAudioIndex = ref<number>(0); // 当前选中的音频索引
const isPlaying = ref<boolean>(false); // 当前是否在播放
const currentPlayTime = ref<number>(0); // 当前播放进度（秒）
const timeUpdateHandler = ref<((e: Event) => void) | null>(null); // 存储进度监听函数，用于移除
// ---------------------- 格式化时长（秒转 00:00） ----------------------
const formatDuration = (duration?: number): string => {
  if (!duration) return "00:00";
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
// 开始录音
const startRecording = async (): Promise<void> => {
  if (isRecording.value) return;
  try {
    audioChunks.value = [];
    // 明确 stream 类型为 MediaStream
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    // 创建 MediaRecorder 实例并指定类型
    mediaRecorder.value = new MediaRecorder(stream);

    // 事件回调补全参数类型
    mediaRecorder.value.ondataavailable = (e: BlobEvent) => {
      audioChunks.value.push(e.data);
    };
    mediaRecorder.value.onstop = async () => {
      const audioBlob: Blob = new Blob(audioChunks.value, {
        type: "audio/webm"
      });
      const audioURL: string = URL.createObjectURL(audioBlob);
      const tempAudio = new Audio(audioURL);
      await new Promise(resolve => {
        tempAudio.onloadedmetadata = resolve; // 加载元数据（含时长）后触发
      });
      // 严格按照 AudioFile 类型添加数据
      audioFiles.value.push({
        name: `recording_${Date.now()}.${getFileExtension(audioBlob.type)}`,
        url: audioURL,
        duration: tempAudio.duration
      });
      audioChunks.value = [];
      // 默认选中最新音频
      currentAudioIndex.value = audioFiles.value.length - 1;
      currentPlayTime.value = 0; // 初始进度重置为 0
      const formdata = new FormData();
      const audioFile = new File([audioBlob], audioFiles.value[0].name, {
        type: "audio/wav"
      });
      formdata.append("file", audioFile);
      usePodcastStoreHook()
        .upload(formdata)
        .then(res => {
          console.log(res);
        });
    };

    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (error) {
    // 明确 error 类型为 Error
    console.error("录音错误:", error as Error);
  }
};
const formattedPlayTime = computed(() => {
  const minutes = Math.floor(currentPlayTime.value / 60);
  const seconds = Math.floor(currentPlayTime.value % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});
const bindAudioTimeUpdate = (audio: HTMLAudioElement | null) => {
  if (!audio) return;

  // 定义进度更新函数
  const handler = (e: Event) => {
    const target = e.target as HTMLAudioElement;
    currentPlayTime.value = target.currentTime; // 实时同步播放进度

    // 播放结束时自动重置状态
    if (target.currentTime >= target.duration * 0.999) {
      stopAudioPlay();
    }
  };

  // 存储监听函数（用于后续移除）
  timeUpdateHandler.value = handler;
  audio.addEventListener("timeupdate", handler);
};
const unbindAudioTimeUpdate = (audio: HTMLAudioElement | null) => {
  if (!audio || !timeUpdateHandler.value) return;
  audio.removeEventListener("timeupdate", timeUpdateHandler.value);
  timeUpdateHandler.value = null;
};
// 停止录音（补全类型判断）
const stopRecording = (): void => {
  console.log("停止录音");
  isRecording.value = false;
  // 先判断 mediaRecorder 不为 null，再调用方法（避免类型错误）
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    // 遍历 MediaStreamTrack 数组，明确 track 类型
    mediaRecorder.value.stream
      .getTracks()
      .forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    // 停止后重置 mediaRecorder（避免重复使用旧实例）
    mediaRecorder.value = null;
  }
};

// 获取文件扩展名（补全参数类型和返回值类型）
const getFileExtension = (mimeType: string): string => {
  // 明确映射对象的键值类型
  const extensions: Record<string, string> = {
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/wav": "wav"
  };
  // 找不到时返回默认值 "webm"
  return extensions[mimeType] || "webm";
};

// 切换录音状态（补全逻辑和类型）
const toggleRecording = (): void => {
  if (!isRecording.value) {
    startRecording();
  } else {
    stopRecording();
  }
  // 注意：stopRecording 中已修改 isRecording，此处无需重复赋值（避免状态冲突）
};
const setCurrentAudio = (index: number): void => {
  // 先暂停当前播放的音频
  if (audioElements.value[currentAudioIndex.value]) {
    stopAudioPlay();
    unbindAudioTimeUpdate(audioElements.value[currentAudioIndex.value]);
  }
  // 更新当前选中索引，重置进度
  currentAudioIndex.value = index;
  currentPlayTime.value = 0;

  // 绑定新选中音频的进度监听
  const newAudio = audioElements.value[index];
  if (newAudio) {
    newAudio.currentTime = 0; // 重置音频播放位置
    bindAudioTimeUpdate(newAudio);
  }
};

// 播放/暂停切换
const toggleAudioPlay = (): void => {
  const currentAudio = audioElements.value[currentAudioIndex.value];
  if (!currentAudio) return;

  if (isPlaying.value) {
    currentAudio.pause();
  } else {
    if (!timeUpdateHandler.value) {
      // 避免重复绑定
      bindAudioTimeUpdate(currentAudio);
    }
    currentAudio.play();
  }
  isPlaying.value = !isPlaying.value;
};
const stopAudioPlay = (): void => {
  const currentAudio = audioElements.value[currentAudioIndex.value];
  if (!currentAudio) return;

  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentPlayTime.value = 0;
  isPlaying.value = false;
  //解绑进度监听（避免内存泄漏）
  unbindAudioTimeUpdate(currentAudio);
};

const clearAllAudio = (): void => {
  // 先停止当前播放
  stopAudioPlay();
  //  释放所有音频 URL 资源
  audioFiles.value.forEach(file => {
    URL.revokeObjectURL(file.url);
  });
  //重置所有状态
  audioFiles.value = [];
  audioElements.value = [];
  currentAudioIndex.value = 0;
  currentPlayTime.value = 0;
};
watch(
  audioFiles,
  newFiles => {
    if (newFiles.length > 0 && !audioElements.value[currentAudioIndex.value]) {
      // 首个音频加载后，自动绑定监听
      const firstAudio = audioElements.value[0];
      if (firstAudio) {
        bindAudioTimeUpdate(firstAudio);
      }
    }
  },
  { immediate: true }
);
// 清理资源（组件卸载时停止录音）
onUnmounted(() => {
  stopRecording();
  stopAudioPlay();
  clearAllAudio();
});
</script>

<style lang="scss" scoped>
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
.result {
  background: #f9fcff;
  border: 1px dashed #d8d8d8;
  border-radius: 4px;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  .time {
    font-family: HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 12px;
    color: #0091ff;
  }
}
.audio-list {
  display: none;
}
</style>
