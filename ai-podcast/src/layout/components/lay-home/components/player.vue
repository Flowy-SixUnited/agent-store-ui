<template>
  <div class="custom-audio-player">
    <div class="sound">
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <img src="@/assets/home/audio/sound-bg.png" alt="sound" />
      <div class="sound-mask" :style="{ width: `${calculateMaskWidth()}%` }" />
    </div>
    <el-slider
      v-model="currentTime"
      :max="duration || 100"
      placement="bottom"
      :show-tooltip="false"
      @input="seek"
    />
    <div class="flex items-center justify-between btn">
      <span class="time"
        >{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span
      >
      <div class="flex items-center gap-6 operate">
        <img
          class="icon"
          src="@/assets/home/audio/rewind.png"
          alt="forward"
          @click="rewind"
        />
        <img
          class="icon"
          :src="isPlaying ? playingIcon : playIcon"
          alt="play"
          @click="togglePlay"
        />
        <img
          class="icon"
          src="@/assets/home/audio/forward.png"
          alt="rewind"
          @click="fastForward"
        />
      </div>
      <el-popover
        placement="top"
        :width="24"
        trigger="click"
        :show-arrow="false"
        :popper-style="{
          'min-width': '30px',
          padding: '8px 6px',
          display: 'flex',
          'justify-content': 'center',
        }"
      >
        <template #reference>
          <img class="icon" src="@/assets/home/audio/sound.png" alt="sound" />
        </template>
        <el-slider
          v-model="volume"
          :max="1"
          step="0.1"
          vertical
          @input="setVolume"
          height="64px"
          :show-tooltip="false"
          tooltip-class="volume-tooltip"
        />
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import playingIcon from "@/assets/home/audio/playing.png";
import playIcon from "@/assets/home/audio/play.png";
const props = defineProps({
  audioUrl: {
    type: String,
    required: true,
  },
});

const audio = ref(new Audio(props.audioUrl));
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.5);

onMounted(() => {
  audio.value.volume = volume.value;
  audio.value.addEventListener("timeupdate", () => {
    currentTime.value = audio.value.currentTime;
  });
  audio.value.addEventListener("loadedmetadata", () => {
    duration.value = audio.value.duration;
  });
  audio.value.addEventListener("ended", () => {
    audio.value.pause();
    isPlaying.value = false; // 播放结束后，重置为“未播放”状态
  });
});

const togglePlay = () => {
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const seek = () => {
  audio.value.currentTime = currentTime.value;
};

const setVolume = () => {
  audio.value.volume = volume.value;
};

const fastForward = () => {
  audio.value.currentTime += 15;
};

const rewind = () => {
  audio.value.currentTime -= 15;
  if (audio.value.currentTime < 0) {
    audio.value.currentTime = 0;
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
const calculateMaskWidth = () => {
  if (duration.value === 0) return "0";
  return `${(currentTime.value / duration.value) * 100}`;
};
watch(
  () => props.audioUrl,
  (newUrl, oldUrl) => {
    // 移除旧音频的事件监听
    if (audio.value) {
      audio.value.removeEventListener("timeupdate", handleTimeUpdate);
      audio.value.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.value.removeEventListener("ended", handleEnded);
    }
    // 创建新音频实例
    audio.value = new Audio(newUrl);
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
    audio.value.volume = volume.value;
    // 定义事件处理函数（方便移除监听）
    function handleTimeUpdate() {
      currentTime.value = audio.value.currentTime;
    }
    function handleLoadedMetadata() {
      duration.value = audio.value.duration;
    }
    function handleEnded() {
      audio.value.pause();
      isPlaying.value = false;
    }
    // 添加新事件监听
    audio.value.addEventListener("timeupdate", handleTimeUpdate);
    audio.value.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.value.addEventListener("ended", handleEnded);
  }
);
</script>

<style scoped lang="scss">
.custom-audio-player {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: 10px;
  margin: 10px 0;
  .sound {
    position: relative;
    display: flex;
    background: #d5edf9;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #ffffff;
    height: 48px;
    overflow: hidden;
    img {
      width: 531px;
      margin-top: 20px;
      height: 56px;
    }
    .sound-mask {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: rgba(
        150,
        211,
        242,
        0.5
      ); // 蓝色半透明蒙层，可调整颜色和透明度
      transition: width 0.1s linear; // 平滑过渡效果
    }
  }
  .icon {
    // width: 24px;
    height: 16px;
    cursor: pointer;
  }
  .time {
    font-family: HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 13px;
    color: #202a2f;
    line-height: 18px;
  }
  .btn {
    position: relative;
    .operate {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
      left: 50%;
    }
  }
}
:deep(.el-slider) {
  height: 1px;
}
:deep(.el-slider__bar) {
  background-color: #202a2f;
  height: 3px;
}
:deep(.el-slider__button) {
  border: 2px solid #202a2f;
  height: 10.5px;
  width: 10px;
}
:deep(.el-slider__runway) {
  height: 3px;
  background-color: #d8d8d8;
}

:deep(.el-popper.is-light) {
  min-width: 30px;
  padding: 8px 6px;
}
// :deep(.is-vertical .el-slider__runway),
// :deep(.is-vertical .el-slider__bar) {
//   width: 3px;
// }
:deep(.volume-tooltip) {
  .el-slider__bar {
    width: 3px;
  }
  .el-slider__runway {
    width: 3px;
  }
}
:deep(.el-slider.is-vertical .el-slider__button-wrapper) {
  left: -16px;
}
:deep(.el-slider__button-wrapper) {
  top: -16px;
}
</style>
