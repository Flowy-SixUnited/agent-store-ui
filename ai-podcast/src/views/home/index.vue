<template>
  <div class="home">
    <div class="header" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="content">
        <img class="icon" src="@/assets/home/icon.png" alt="icon" />
        <span class="title"
          >一站式智能播客创作助手，能将文字脚本自然转换为高质量语音对话内容，自动优化语调与情感表现，支持内容润色和风格定制，让播客创作更高效、更具人声魅力。</span
        >
      </div>
      <div class="select">
        <span class="mr-2">语音模式：</span>
        <div>
          <el-radio-group v-model="type">
            <el-radio value="default">默认模式</el-radio>
            <el-radio value="clone">克隆模式</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div v-if="type === 'clone'" class="tools">
      <div class="tool-item">
        <Audio title="1" @playAudio1="handlePlayAudio1" @text1="handleText1" />
      </div>
      <div class="tool-item">
        <Audio title="2" @playAudio2="handlePlayAudio2" @text2="handleText2" />
      </div>
      <div class="tool-item">
        <Script
          @update:fileList="handleFileChange"
          @update:text="handleScriptText"
        />
      </div>
    </div>
    <div v-else class="tools">
      <div class="tool-item">
        <Figure type="girl" title="1" @curVocice1="handleVocice1" />
      </div>
      <div class="tool-item">
        <Figure type="boy" title="2" @curVocice2="handleVocice2" />
      </div>
      <div class="tool-item">
        <Script
          @update:fileList="handleFileChange"
          @update:text="handleScriptText"
        />
      </div>
    </div>
    <div
      class="generate"
      :class="{ disabled: rawData.text_list.length == 0 }"
      @click="handleGenerate"
    >
      生成对话音频
    </div>
    <div v-if="result.fileName">
      <Result
        :audioInfo="audioInfo"
        :status="status"
        @update:status="handleStatusUpdate"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import bgUrl from "@/assets/home/header-bg.png";
import Audio from "@/layout/components/lay-home/components/timbre.vue";
import Script from "@/layout/components/lay-home/components/script.vue";
import Figure from "@/layout/components/lay-home/components/figure.vue";
import Result from "@/layout/components/lay-home/components/result.vue";
import { usePodcastStoreHook } from "@/store/modules/podcast";
import type { UploadRawFile } from "element-plus";
import { provide, ref, watch } from "vue";
import { title } from "process";
import { List } from "echarts";
import { ElMessage } from "element-plus";
defineOptions({
  name: "home"
});
let globalAudio: HTMLAudioElement | null = null;

// 提供全局音频控制方法（直接用字符串"audioController"作为键名）
provide("audioController", {
  // 停止当前播放的音频
  stop: () => {
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
    }
  },
  // 设置当前播放的音频
  set: (audio: HTMLAudioElement) => {
    globalAudio = audio;
  }
});
const type = ref("default");
const fileList = ref<UploadRawFile[]>([]);
const result = ref({
  fileName: "",
  fileSize: ""
});
const status = ref("ready");
const handleFileChange = (newFileList: UploadRawFile[]) => {
  fileList.value = newFileList;
};
const audioInfo = ref({
  url: "",
  name: "",
  size: 0
});
const rawData = ref({
  audio1: "audio/female/自然声.mp3",
  audio2: "audio/male/自然声.mp3",
  text1:
    "[S1]哈喽～我是你的 AI播客小助手！超简单操作：先选我的性别，再点下方挑你喜欢的声线，配上你的对话脚本，就能智能生成专属对话啦～",
  text2:
    "[S2]哈喽～我是你的 AI播客小助手！超简单操作：先选我的性别，再点下方挑你喜欢的声线，配上你的对话脚本，就能智能生成专属对话啦～",
  text_list: []
});
const handleVocice1 = audio => {
  rawData.value.audio1 = audio;
};
const handleVocice2 = audio => {
  rawData.value.audio2 = audio;
};
const handleGenerate = () => {
  if (rawData.value.text_list.length === 0) {
    ElMessage.success("请严格按照格式输入脚本内容！");
    return;
  }
  result.value.fileName =
    "pdf_parse_jn2Ffcffb1...f_parse_results2F20251017_110929_result.zip";
  result.value.fileSize = "2.4MB";
  status.value = "loading";
  usePodcastStoreHook()
    .generate(rawData.value)
    .then(res => {
      if (res.success) {
        console.log(res);
        audioInfo.value.url = res.filename;
        status.value = "success";
      } else {
      }
    });
};

const handlePlayAudio1 = (audio: {
  url: string;
  name: string;
  size: number;
}) => {
  //audioInfo.value = audio;
  rawData.value.audio1 = audio.name;
  console.log(audio);
};
const handlePlayAudio2 = (audio: {
  url: string;
  name: string;
  size: number;
}) => {
  //audioInfo.value = audio;
  rawData.value.audio2 = audio.name;
  console.log(audio);
};
const handleText1 = (text: string) => {
  rawData.value.text1 = `[S1]${text}`;
};
const handleText2 = (text: string) => {
  rawData.value.text2 = `[S2]${text}`;
};
const handleScriptText = (textList: string[]) => {
  rawData.value.text_list = textList;
};
const handleStatusUpdate = (newStatus: string) => {
  status.value = newStatus;
};
watch(
  () => type.value, // 监听的目标：type 的值
  (newType, oldType) => {
    if (newType !== oldType) {
      fileList.value = []; // 清空文件列表
      result.value.fileName = "";
    }
  },
  {
    immediate: false,
    deep: false
  }
);
</script>
<style scoped lang="scss">
.home {
  background: #fcfcfc;
  height: 100vh;
  font-family: HarmonyOS Sans SC;
}
.header {
  height: 136px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  .content {
    display: flex;
    align-items: center;
    padding-top: 18px;
    padding-left: 24px;
  }
  .icon {
    width: 40px;
    height: 45px;
    margin-right: 16px;
  }
  .title {
    font-family: HarmonyOS Sans SC;
    font-weight: 500;
    font-size: 13px;
    color: #2e5de0;
    line-height: 18px;
  }
  .select {
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
    border-radius: 8px;
    font-family: HarmonyOS Sans SC;
    font-weight: 500;
    font-size: 13px;
    color: #202a2f;
    line-height: 15px;
    padding: 16px 24px;
    margin: 16px 24px;
    display: flex;
    align-items: center;
  }
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: white;
  border-color: #202a2f;
}

:deep(.el-radio__input.is-checked .el-radio__inner:after) {
  background-color: #202a2f;
}
:deep(.el-radio__inner:hover),
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #ffffff;
  border-color: #202a2f;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #202a2f;
}
:deep(.el-radio__inner) {
  height: 16px;
  width: 16px;
}
:deep(.el-radio__inner:after) {
  height: 8px;
  width: 8px;
}
.tools {
  display: flex;
  margin: 24px;
  gap: 24px;

  .tool-item {
    flex: 1;
  }
  .tool-item > * {
    width: 100%; /* 让子组件继承父元素的等分宽度 */
    min-width: 0; /* 取消最小宽度限制，确保空间不足时能收缩 */
  }
}

.generate {
  margin: 0 24px;
  padding: 9px 0;
  background: #2173fc;
  border-radius: 4px;
  font-family: HarmonyOS Sans SC;
  font-weight: 400;
  font-size: 13px;
  color: #ffffff;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  &.disabled {
    background: #79aafc;
    cursor: not-allowed;
  }
}
</style>
