<template>
  <div class="custom-audio-player">
    <a-card class="audio-player" :bordered="false" @mouseleave="showHoverTime = false">
      <div class="player-controls">
        <!-- 自定义进度条 -->
        <div class="custom-progress-bar" @mousemove="handleMouseMove" @click="handleProgressClick" ref="progressBarRef">
          <div class="progress-marks">
            <div class="mark" v-for="i in 5" :key="i - 1" :style="{ left: `${(i) * 20}%` }">
              <div class="mark-line"></div>
            </div>
          </div>
          <!-- 进度条填充 -->
          <div class="progress-filled" :style="{ width: `${progress}%` }"></div>
          <!-- 悬停时间提示 -->
          <div class="hover-time" v-show="showHoverTime" :style="{ left: `${hoverPosition}px` }">
            {{ formatTime(hoverTime) }}
          </div>
        </div>

        <div class="controls-row">
          <!--  播放暂停 -->
          <a-button type="text" shape="circle" @click="togglePlay" class="control-button">
            <template #icon>
              <PlayCircleOutlined v-if="!isPlaying" />
              <PauseCircleOutlined v-else />
            </template>
          </a-button>

          <div style="display: flex; align-items: center;">
            <!-- 添加后退15秒按钮 -->
            <a-button type="text" shape="circle" @click="skipBackward" class="control-button">
              <span style="font-size: 12px;">-15s</span>
              <StepBackwardOutlined />
            </a-button>

            <div class="time-display">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>

            <!-- 添加前进15秒按钮 -->
            <a-button type="text" shape="circle" @click="skipForward" class="control-button">
              <StepForwardOutlined />
              <span style="font-size: 12px;">+15s</span>
            </a-button>
          </div>

          <a-dropdown>
            <a-button type="text" class="rate-button">
              {{ playbackRate }}x
            </a-button>
            <template #overlay>
              <a-menu @click="changePlaybackRate">
                <a-menu-item key="0.5">0.5x</a-menu-item>
                <a-menu-item key="1">1x</a-menu-item>
                <a-menu-item key="1.5">1.5x</a-menu-item>
                <a-menu-item key="2">2x</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

          <!-- 音量控制按钮 -->
          <a-dropdown>
            <a-button type="text" shape="circle">
              <template #icon>
                <sounOnSvg v-if="volume > 0" />
                <soundOffSvg v-else />
              </template>
            </a-button>
            <template #overlay>
              <div class="volume-control-container">
                <span>{{ volume }}</span>
                <a-slider v-model:value="volume" :min="0" :max="100" vertical @change="handleVolumeChange"
                  class="volume-slider" />
              </div>
            </template>
          </a-dropdown>

          <a-button type="text" shape="circle" class="control-button">
            <template #icon>
              <MoreOutlined />
            </template>
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';

// const props = defineProps({
//   audioUrl: {
//     type: String,
//     required: true
//   }
// });
// 音频播放相关状态
const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const playbackRate = ref(1);
const volume = ref(100); // 音量，范围0-100

// 初始化音频元素
onMounted(() => {
  audioElement.value = new Audio();
  audioElement.value.src = 'https://oss-pai-5fnubj4zh36f5kkctu-cn-shanghai.oss-cn-shanghai.aliyuncs.com/%E5%BD%95%E9%9F%B3.m4a';
  audioElement.value.volume = volume.value / 100; // 设置初始音量

  // 监听音频事件
  audioElement.value.addEventListener('timeupdate', updateProgress);
  audioElement.value.addEventListener('loadedmetadata', () => {
    duration.value = audioElement.value?.duration || 0;
  });
  audioElement.value.addEventListener('ended', () => {
    isPlaying.value = false;
  });
});

// 处理音量变化
const handleVolumeChange = (value: number) => {
  if (!audioElement.value) return;
  volume.value = value;
  audioElement.value.volume = value / 100;
};

// 进度条相关
const progressBarRef = ref<HTMLElement | null>(null);
const showHoverTime = ref(false);
const hoverTime = ref(0);
const hoverPosition = ref(0);

// 初始化音频元素
onMounted(() => {
  audioElement.value = new Audio();
  audioElement.value.src = '';  // 你的播放地址url

  // 监听音频事件
  audioElement.value.addEventListener('timeupdate', updateProgress);
  audioElement.value.addEventListener('loadedmetadata', () => {
    duration.value = audioElement.value?.duration || 0;
  });
  audioElement.value.addEventListener('ended', () => {
    isPlaying.value = false;
  });
});

// 组件卸载时清理
onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.removeEventListener('timeupdate', updateProgress);
    audioElement.value.pause();
    audioElement.value = null;
  }
});

// 更新进度
const updateProgress = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime;
    progress.value = (currentTime.value / duration.value) * 100 || 0;
  }
};

// 处理鼠标在进度条上移动
const handleMouseMove = (e: MouseEvent) => {
  if (!progressBarRef.value || !duration.value) return;

  const rect = progressBarRef.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);

  hoverTime.value = percentage * duration.value;
  hoverPosition.value = offsetX;
  showHoverTime.value = true;
};

// 处理进度条点击
const handleProgressClick = (e: MouseEvent) => {
  if (!progressBarRef.value || !audioElement.value || !duration.value) return;

  const rect = progressBarRef.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);

  const newTime = percentage * duration.value;
  audioElement.value.currentTime = newTime;
  currentTime.value = newTime;
  progress.value = percentage * 100;
};

// 播放/暂停切换
const togglePlay = () => {
  if (!audioElement.value) return;

  if (isPlaying.value) {
    audioElement.value.pause();
  } else {
    audioElement.value.play().catch(err => {
      message.error('音频播放失败，请稍后再试');
      console.error('播放错误:', err);
    });
  }

  isPlaying.value = !isPlaying.value;
};

// 切换播放速率
const changePlaybackRate = (e: any) => {
  if (!audioElement.value) return;

  const rate = parseFloat(e.key);
  playbackRate.value = rate;
  audioElement.value.playbackRate = rate;
};

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

</script>

<style scoped>
.custom-audio-player {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}
.audio-player {
  width: 100%;
  /* max-width: 600px; */
  margin-top: 20px;
  background-color: #f5f7fa;
}

.player-controls {
  width: 100%;
  padding: 8px 0;
}


.custom-progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e3e9;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  margin: 16px 0;
}

.progress-filled {
  height: 100%;
  background-color: #1890ff;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-marks {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.mark {
  position: absolute;
  transform: translateX(-50%);
}

.mark-line {
  width: 2px;
  height: 8px;
  background-color: #fff;
}

.mark-time {
  font-size: 10px;
  color: #666;
  margin-top: 4px;
  transform: translateX(-50%);
  white-space: nowrap;
}

.hover-time {
  position: absolute;
  top: -25px;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.control-button {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-display {
  font-size: 12px;
  color: #666;
  flex: 1;
  text-align: center;
}

.rate-button {
  font-size: 12px;
  color: #666;
  /* padding: 0 8px; */
  width: 55px;
}

/* 音量控制样式 */
.volume-control-container {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.volume-slider {
  height: 100px;
  margin: 10px auto;
}

</style>
