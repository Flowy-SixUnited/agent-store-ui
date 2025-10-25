<template>
  <div class="agent bg-[#FCFCFC]">
    <div class="bg-[#ffffff] p-6 flex items-center justify-between header">
      <span>Agent Store</span>
      <div class="new-btn">新增</div>
    </div>
    <div class="p-6 flex flex-wrap gap-6">
      <div
        v-for="(item, index) in agentList"
        :key="index"
        class="item"
        :class="{ active: item.running }"
        @click="handleItemClick(index)"
      >
        <div class="flex gap-2 items-center">
          <img class="h-6 w-6" :src="item.icon" />
          <span class="title">{{ item.title }}</span>
        </div>
        <span class="desc">{{ item.desc }}</span>
        <div class="run-btn">开启运行</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import aiPodcastIcon from "@/assets/home/ai-podcast.png";
import textToPicIcon from "@/assets/home/text-to-pic.png";
import textToVideoIcon from "@/assets/home/text-to-video.png";
import documentParseIcon from "@/assets/home/document-parse.png";
import aiChatIcon from "@/assets/home/ai-chat.png";
import coStormIcon from "@/assets/home/co-storm.png";
import meetingIcon from "@/assets/home/meeting.png";
defineOptions({
  name: "home",
});

const agentList = ref([
  {
    icon: aiPodcastIcon,
    title: "AI博客",
    desc: "一站式智能辅助工具，智能内容生成、内容质量优化、运营自动化、个性化定制赋能博客全流程",
    link: "",
    running: true,
    status: "unload",
  },
  {
    icon: textToPicIcon,
    title: "文生图",
    desc: "可将文字描述精准转化为图像，赋能创作、设计、营销等多元场景",
    link: "",
    running: false,
    status: "loaded",
  },
  {
    icon: textToVideoIcon,
    title: "文生视频",
    desc: "可将文字描述生成动态视频，支持风格定制，赋能多场景且提升视频制作效率",
    link: "",
    running: false,
    status: "loading",
  },
  {
    icon: documentParseIcon,
    title: "文档解析",
    desc: "可解析 PDF/Word 等多格式文档，提取文本、表格、图片信息并结构化，赋能办公、科研等场景",
    link: "",
    running: false,
    status: "unload",
  },
  {
    icon: aiChatIcon,
    title: "智能客服",
    desc: "可多渠道实时响应咨询、自动处理常见问题，赋能企业服务、售后等场景",
    link: "",
    running: false,
    status: "unload",
  },
  {
    icon: coStormIcon,
    title: "Co-STORM",
    desc: "支持多主体协同研讨，拆解问题、生成方案并管控流程，赋能企业决策、项目攻坚等场景",
    link: "",
    running: false,
    status: "unload",
  },
  {
    icon: meetingIcon,
    title: "会议纪要&同声传译",
    desc: "可实时多语言同声传译、自动整理会议议题 / 决议 / 待办，赋能高效会议管理",
    link: "",
    running: false,
    status: "unload",
  },
]);
const handleItemClick = (clickedIndex: number) => {
  agentList.value = agentList.value.map((item, index) => ({
    ...item,
    running: index === clickedIndex,
  }));
};
</script>
<style scoped lang="scss">
.agent {
  height: 100vh;
  .header {
    border-bottom: 1px solid #eef2f7;
  }
  .new-btn {
    background-color: #202a2f;
    font-family: HarmonyOS Sans SC, HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 13px;
    color: #ffffff;
    text-align: center;
    padding: 9px 25px;
    border-radius: 8px;
  }
  .item {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    gap: 12px;
    width: 314px;
    padding: 16px;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(173, 192, 202, 0.3);
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #ffffff;
    &.active {
      border: 1px solid #1849eb;
    }
    .title {
      color: #101011;
      font-size: 16px;
      font-weight: 700;
      line-height: 19px;
    }
    .desc {
      color: #666667;
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
    }
    .run-btn {
      display: flex;
      width: 64px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #1096fd;
      font-family: HarmonyOS Sans SC, HarmonyOS Sans SC;
      font-weight: 500;
      font-size: 12px;
      color: #1096fd;
      text-align: center;
      padding: 5px 0;
      justify-content: center;
    }
  }
}
</style>
