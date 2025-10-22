<template>
  <div class="voice-recorder">
    <!-- 录音控制 -->
    <div class="recording" @click="toggleRecording">
      <img src="@/assets/home/recording.png" />
    </div>
    <!-- <button :class="{ recording: isRecording }" @click="toggleRecording">
      {{ isRecording ? "停止录音" : "开始录音" }}
    </button> -->

    <!-- 生成的音频文件列表 -->
    <div v-if="audioFiles.length > 0" class="audio-list">
      <div v-for="(audio, index) in audioFiles" :key="index">
        <audio controls :src="audio.url" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";

// 1. 定义核心类型，明确数据结构
// 音频文件信息类型
interface AudioFile {
  name: string;
  url: string;
}

// 2. 定义响应式变量并指定类型
const isRecording = ref<boolean>(false);
// 明确 mediaRecorder 为 MediaRecorder 类型（null 表示初始未创建）
const mediaRecorder = ref<MediaRecorder | null>(null);
// 音频片段为 Blob 类型数组
const audioChunks = ref<Blob[]>([]);
// 音频文件列表为 AudioFile 类型数组
const audioFiles = ref<AudioFile[]>([]);

// 3. 开始录音（补全参数类型和返回值类型）
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

    // 4. 事件回调补全参数类型
    mediaRecorder.value.ondataavailable = (e: BlobEvent) => {
      audioChunks.value.push(e.data);
    };
    mediaRecorder.value.onstop = () => {
      const audioBlob: Blob = new Blob(audioChunks.value, {
        type: "audio/webm"
      });
      const audioURL: string = URL.createObjectURL(audioBlob);
      // 严格按照 AudioFile 类型添加数据
      audioFiles.value.push({
        name: `recording_${Date.now()}.${getFileExtension(audioBlob.type)}`,
        url: audioURL
      });
      audioChunks.value = [];
    };

    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (error) {
    // 明确 error 类型为 Error
    console.error("录音错误:", error as Error);
  }
};

// 5. 停止录音（补全类型判断）
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

// 6. 获取文件扩展名（补全参数类型和返回值类型）
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

// 7. 切换录音状态（补全逻辑和类型）
const toggleRecording = (): void => {
  if (!isRecording.value) {
    startRecording();
  } else {
    stopRecording();
  }
  // 注意：stopRecording 中已修改 isRecording，此处无需重复赋值（避免状态冲突）
};

// 8. 清理资源（组件卸载时停止录音）
onUnmounted(() => {
  stopRecording();
  // 释放所有音频 URL 资源（避免内存泄漏）
  audioFiles.value.forEach(file => {
    URL.revokeObjectURL(file.url);
  });
});
</script>

<style lang="scss" scoped>
.voice-recorder {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  button {
    padding: 12px 24px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
    &.recording {
      background: #ff4444;
    }
  }

  button:hover {
    background: #3aa876;
  }

  button:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
}

.recording {
  background-color: #ff4444;
  color: white;
}

.audio-list {
  margin-top: 20px;
}
</style>
