<template>
  <div class="home">
    <div class="header" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="content">
        <img class="icon" src="@/assets/home/icon.png" alt="icon" />
        <span class="title"
          >AI 播客智能体是 AI + 播客新应用，可自动选题 / 脚本 / 语音 / 翻译，凭
          NLP
          与知识图谱快出高质量内容，支持智能剪辑配乐，还能互动收反馈优化，降创作门槛、推行业发展。</span
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
        <Audio title="1" @playAudio1="handlePlayAudio1" @text1="handleText1"/>
      </div>
      <div class="tool-item">
        <Audio title="2" @playAudio2="handlePlayAudio2" @text2="handleText2"/>
      </div>
      <div class="tool-item">
        <Script @update:fileList="handleFileChange" @updata:text="handleScriptText"/>
      </div>
    </div>
    <div v-else class="tools">
      <div class="tool-item">
        <Figure type="girl" title="1" />
      </div>
      <div class="tool-item">
        <Figure type="boy" title="2" />
      </div>
      <div class="tool-item">
        <Script @update:fileList="handleFileChange" @updata:text="handleScriptText" />
      </div>
    </div>
    <div
      class="generate"
      :class="{ disabled: fileList.length === 0 }"
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
import { ref } from "vue";
import { title } from "process";
import { List } from "echarts";
defineOptions({
  name: "home"
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
  audio1: "xzy 音频2.MP3",
  audio2: "genji老师声音10.17.MP3",
  text1:
    "[S1]嗯你也想吃那个菜了吗?啊让我想一想啊，这个菜虽然简单，但是呢?也有一些小窍门，嗯首先呢?你得先准备一些食材，呃准备两个西红柿，两个鸡蛋，然后还有一些葱和蒜，呃然后呢?呃其中一个小窍门就是，你得先拿刀把西红柿划个十字花刀，然后用开水烫一下，呃这样呢?它的皮呢?就会很轻易的剥掉，这样西红柿炒出来呢?也会更容易出汁，呃另一个小窍门就是你得先把锅烧热，然后呢?把鸡蛋放下去，把锅烧热的原因呢?是这样的话会更容易让鸡蛋成型。",
  text2:
    "[S2]啊对对对，而且其实过段时间呢，我们还会去跑一个叫做去重合并的这个步骤啊。去重就是把过去相似的这个条目去合并，啊，防止咱们这笔记本变得更臃肿。是啊是啊，只增加少量的文字呢，其实也会让我们这个算力的消耗啊去大范围的下降。其实在文里面说呢，我们用ACE去跑一个比如像办公助理的任务，它会比传统方法其实要节省至少百分之三十的时间。它比传统办法至少要节省百分之八十的时间，你其实算力费下来啊，也就是几块钱的事。",
  text_list: [
    "[S1]那可能说对对，没有去过美国来说去去看到美国线下。巴斯曼也好，沃尔玛也好，他们线下不管说，因为深圳出去的还是电子周边的会表达，会发现哇对这个价格真的是很高呀。都是卖三十五美金、四十美金，甚至一个手机壳，就是二十五美金开。",
    "[S2]对，没错，我每次都觉得不不可思议。我什么人会买三五十美金的手机壳？但是其实在在那个target啊，就塔吉特这种超级市场，大家都是这样的，定价也很多人买。"
  ]
});
const handleGenerate = () => {
  if (fileList.value.length === 0) {
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
  console.log(textList);
  rawData.value.text_list = textList;
};
const handleStatusUpdate = (newStatus: string) => {
  status.value = newStatus;
};
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
