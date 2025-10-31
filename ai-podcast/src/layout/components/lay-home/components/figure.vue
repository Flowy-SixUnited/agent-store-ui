<template>
  <div class="body">
    <div class="mark" :class="curType === 'girl' ? 'girl' : 'boy'">
      选择说话人{{ title }}
    </div>
    <div class="container">
      <div class="flex mt-4 gap-8 items-center justify-center">
        <div
          class="girl"
          :class="{ active: curType === 'girl' }"
          @click="curType = 'girl'"
        >
          <img
            class="w-10 h-10"
            src="@/assets/home/select-girl.png"
            alt="girl"
          />
        </div>
        <div
          class="boy"
          :class="{ active: curType === 'boy' }"
          @click="curType = 'boy'"
        >
          <img class="w-10 h-10" src="@/assets/home/select-boy.png" alt="boy" />
        </div>
      </div>
      <div class="tips-container">
        <img
          :class="curType === 'girl' ? 'girl' : 'boy'"
          :src="curType === 'girl' ? girlImg : boyImg"
        />
        <div
          class="tips"
          :style="{ background: curType === 'girl' ? '#fff5fb' : '#F5F9FF' }"
        >
          <div class="tips-content">
            哈喽～我是你的 AI
            播客小助手！超简单操作：先选我的性别，再点下方挑你喜欢的声线，配上你的对话脚本，就能智能生成专属对话啦～
          </div>
        </div>
      </div>
      <div class="select">
        <span class="tips">声线选择：</span>
        <div class="select-group">
          <div
            v-for="(item, index) in curVoices.slice(0, 2)"
            :key="index"
            class="voice"
            :class="{ active: item.active }"
            :style="{
              background:
                curType === 'girl' && item.active
                  ? '#F9D5E5'
                  : curType === 'boy' && item.active
                    ? '#D5EDF9'
                    : '#F7F7F7',
              color:
                curType === 'girl' && item.active
                  ? '#FF2D93'
                  : curType === 'boy' && item.active
                    ? '#2D5BFF'
                    : '#202A2F'
            }"
            @click="handleVoiceClick(curVoices, 0, index)"
          >
            <span>{{ item.name }}</span>
            <img
              class="w-4 h-4"
              :src="item.active ? item.activeIcon : item.defaultIcon"
              :alt="item.name"
            />
          </div>
        </div>
        <div class="select-group">
          <div
            v-for="(item, index) in curVoices.slice(2)"
            :key="index"
            class="voice"
            :class="{ active: item.active }"
            :style="{
              background:
                curType === 'girl' && item.active
                  ? '#F9D5E5'
                  : curType === 'boy' && item.active
                    ? '#D5EDF9'
                    : '#F7F7F7',
              color:
                curType === 'girl' && item.active
                  ? '#FF2D93'
                  : curType === 'boy' && item.active
                    ? '#2D5BFF'
                    : '#202A2F'
            }"
            @click="handleVoiceClick(curVoices, 1, index)"
          >
            <span>{{ item.name }}</span>
            <img
              class="w-4 h-4"
              :src="item.active ? item.activeIcon : item.defaultIcon"
              :alt="item.name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, provide, inject } from "vue";
import girlImg from "@/assets/home/girl.png";
import boyImg from "@/assets/home/boy.png";
import girlVoiceActive from "@/assets/home/girl-voice-active.png";
import voiceDefault from "@/assets/home/voice-default.png";
import boyVoiceActive from "@/assets/home/boy-voice-active.png";
const emit = defineEmits(["curVocice1", "curVocice2"]);
const props = defineProps({
  type: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  }
});
const audioController = inject("audioController");
if (!audioController) {
  throw new Error("请在父组件中提供 audioController");
}
const girlVoices = ref([
  {
    name: "播音声",
    active: false,
    defaultIcon: voiceDefault,
    activeIcon: girlVoiceActive,
    audio: "audio/female/播音声.mp3"
  },
  {
    name: "萌趣声",
    active: false,
    defaultIcon: voiceDefault,
    activeIcon: girlVoiceActive,
    audio: "audio/female/萌趣声.mp3"
  },
  {
    name: "元气声",
    active: false,
    defaultIcon: voiceDefault,
    activeIcon: girlVoiceActive,
    audio: "audio/female/元气声.mp3"
  },
  {
    name: "自然声", // 默认选中
    active: true,
    defaultIcon: voiceDefault,
    activeIcon: girlVoiceActive,
    audio: "audio/female/自然声.mp3"
  }
]);
const boyVoices = ref([
  {
    name: "播音声",
    active: false,
    defaultIcon: voiceDefault,
    activeIcon: boyVoiceActive,
    audio: "audio/male/播音声.mp3"
  },
  {
    name: "萌趣声",
    active: false,
    defaultIcon: voiceDefault,
    activeIcon: boyVoiceActive,
    audio: "audio/male/萌趣声.mp3"
  },
  {
    name: "元气声",
    active: false,
    defaultIcon: voiceDefault,
    activeIcon: boyVoiceActive,
    audio: "audio/male/元气声.mp3"
  },
  {
    name: "自然声", // 默认选中
    active: true,
    defaultIcon: voiceDefault,
    activeIcon: boyVoiceActive,
    audio: "audio/male/自然声.mp3"
  }
]);
const curType = ref(props.type);
const curVoices = computed(() => {
  return curType.value === "girl" ? girlVoices.value : boyVoices.value;
});
let currentAudio: HTMLAudioElement | null = null;
const handleVoiceClick = (voices: any[], position: number, index: number) => {
  const realIndex = position === 1 ? index + 2 : index;
  const selectedVoice = voices[realIndex];
  audioController.stop();
  // 更新声线选中状态
  voices.forEach(item => {
    item.active = false;
  });
  voices[realIndex].active = true;
  // 播放当前选中的音频
  const audioUrl = `/${selectedVoice.audio}`;
  const newAudio = new Audio(audioUrl);
  // 将新音频实例交给全局控制器管理
  audioController.set(newAudio);
  // 播放音频
  newAudio.play().catch(err => {
    console.error(`音频播放失败：${selectedVoice.name}`, err);
  });
  //触发回调
  if (props.title === "1") {
    emit("curVocice1", voices[realIndex].audio);
  } else {
    emit("curVocice2", voices[realIndex].audio);
  }
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
    &.girl {
      color: #ff2d93;
      background: #f9d5e5;
    }
    &.boy {
      color: #2d5bff;
      background: #d5edf9;
    }
  }
}

.container {
  height: 505px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 16px;

  .girl,
  .boy {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .girl.active {
    border: 2px solid #ff2d93;
    border-radius: 50%;
  }
  .boy.active {
    border: 2px solid #2d5bff;
    border-radius: 50%;
  }
  .tips-container {
    position: relative;
    height: 217px;
    margin-top: 28px;
    img {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      &.girl {
        width: 100px;
        height: 100px;
      }
      &.boy {
        width: 87px;
        height: 100px;
      }
    }

    .tips {
      padding: 53px 16px 16px 16px;
      height: 171px;
      // background: #fff5fb;
      box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 24px 24px 24px 24px;
      border: 1px solid #ffffff;
      opacity: 0.65;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .tips-content {
        padding: 16px;
        height: 102px;
        background: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 24px;
        font-family: HarmonyOS Sans SC-Medium;
        font-weight: 500;
        font-size: 13px;
        color: #202a2f;
        line-height: 22px;
      }
    }
  }
  .select {
    margin-top: 24px;
    font-family: HarmonyOS Sans SC-Regular;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    .tips {
      color: #80868f;
    }
    .select-group {
      display: flex;
      gap: 24px;
      margin-top: 16px;
    }
    .voice {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      color: #202a2f;
      height: 40px;
      background: #f7f7f7;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ffffff;
      cursor: pointer;
      &.active {
        background: #f9d5e5;
        color: #ff2d93;
      }
    }
  }
}
</style>
