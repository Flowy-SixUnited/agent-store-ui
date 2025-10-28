<template>
  <div class="agent bg-[#FCFCFC]">
    <div class="bg-[#ffffff] flex items-center justify-between header">
      <span>Agent Store</span>
      <div class="new-btn">新增</div>
    </div>
    <div class="p-6 flex flex-wrap gap-6">
      <div
        v-for="(item, index) in agentList"
        :key="index"
        class="item"
        :class="{ active: item.status == 'running' }"
        @click="handleItemClick(index)"
      >
        <div class="flex gap-2 items-center">
          <img class="h-6 w-6" :src="item.icon" />
          <span class="title">{{ item.name }}</span>
        </div>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="item.desc"
          placement="bottom"
        >
          <span class="desc">{{ item.desc }}</span>
        </el-tooltip>
        <div class="flex items-center justify-between">
          <div
            v-if="
              curStatus.id === item.id &&
              (curStatus.status === 'loading' || curStatus.status === 'loaded')
            "
            class="flex justify-between items-center w-full"
          >
            <div
              :class="
                curStatus.status === 'loading' ? 'loading-btn' : 'loaded-btn'
              "
            >
              {{ curStatus.status === "loading" ? "加载中" : "加载完成" }}
            </div>
            <div v-if="curStatus.status === 'loaded'" class="go-to-btn">
              前往使用
            </div>
          </div>
          <div v-else>
            <!-- 有正在运行的Agent时，其他Agent显示提示 -->
            <div v-if="curAgent">
              <el-tooltip class="box-item" effect="dark" placement="bottom">
                <div
                  class="run-btn"
                  style="
                    color: #202a2f;
                    background: #e6e6e6;
                    border: 1px solid #e6e6e6;
                  "
                >
                  开始运行
                </div>
                <template #content>
                  <div class="flex items-center gap-1 run-tips">
                    <span
                      >⚠️当前{{ curAgent }}Agent正在运行，是否停止{{
                        curAgent
                      }}Agent运行并开启该Agent？</span
                    >
                    <el-button type="info" size="small">否</el-button>
                    <el-button size="small" @click.stop="startAgent(item)"
                      >是</el-button
                    >
                  </div>
                </template>
              </el-tooltip>
            </div>
            <!-- 没有运行的Agent时，显示可点击按钮 -->
            <div v-else>
              <div class="run-btn" @click.stop="startAgent(item)">开始运行</div>
            </div>
          </div>
        </div>
        <!-- <div
            v-else
            :class="item.status == 'loading' ? 'loading-btn' : 'loaded-btn'"
          >
            {{ item.status == "loading" ? "加载中" : "加载完成" }}
          </div>
          <div v-if="item.status == 'loaded'" class="go-to-btn">前往使用</div> -->
        <!-- <div v-if="item.status == 'unload'">
            <div v-if="curAgent == item.title" class="run-btn">开始运行</div>
            <el-tooltip
              v-else
              class="box-item"
              effect="dark"
              placement="bottom"
            >
              <div
                class="run-btn"
                style="
                  color: #202a2f;
                  background: #e6e6e6;
                  border: 1px solid #e6e6e6;
                "
              >
                开始运行
              </div>
              <template #content>
                <div class="flex items-center gap-1 run-tips">
                  <span
                    >⚠️当前{{ curAgent }}Agent正在运行，是否停止{{
                      curAgent
                    }}Agent运行并开启该Agent？</span
                  >
                  <el-button type="info" size="small">否</el-button>
                  <el-button size="small">是</el-button>
                </div>
              </template>
            </el-tooltip>
          </div>

          <div
            v-else
            :class="item.status == 'loading' ? 'loading-btn' : 'loaded-btn'"
          >
            {{ item.status == "loading" ? "加载中" : "加载完成" }}
          </div>
          <div v-if="item.status == 'loaded'" class="go-to-btn">前往使用</div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import aiPodcastIcon from "@/assets/home/ai-podcast.png";
import textToPicIcon from "@/assets/home/text-to-pic.png";
import textToVideoIcon from "@/assets/home/text-to-video.png";
import documentParseIcon from "@/assets/home/document-parse.png";
import aiChatIcon from "@/assets/home/ai-chat.png";
import coStormIcon from "@/assets/home/co-storm.png";
import meetingIcon from "@/assets/home/meeting.png";
import { useAgentStoreHook } from "@/store/modules/agent";
import { id, tr } from "element-plus/es/locales.mjs";
import { status } from "nprogress";
defineOptions({
  name: "home"
});

// const agentList = ref([
//   {
//     id: 1,
//     icon: aiPodcastIcon,
//     name: "AI博客",
//     desc: "一站式智能辅助工具，智能内容生成、内容质量优化、运营自动化、个性化定制赋能博客全流程",
//     link: "",
//     running: true,
//     status: "unload",
//   },
//   {
//     id: 2,
//     icon: textToPicIcon,
//     name: "文生图",
//     desc: "可将文字描述精准转化为图像，赋能创作、设计、营销等多元场景",
//     link: "",
//     running: false,
//     status: "loaded",
//   },
//   {
//     id: 3,
//     icon: textToVideoIcon,
//     name: "文生视频",
//     desc: "可将文字描述生成动态视频，支持风格定制，赋能多场景且提升视频制作效率",
//     link: "",
//     running: false,
//     status: "loading",
//   },
//   {
//     id: 4,
//     icon: documentParseIcon,
//     name: "文档解析",
//     desc: "可解析 PDF/Word 等多格式文档，提取文本、表格、图片信息并结构化，赋能办公、科研等场景",
//     link: "",
//     running: false,
//     status: "unload",
//   },
//   {
//     id: 5,
//     icon: aiChatIcon,
//     name: "智能客服",
//     desc: "可多渠道实时响应咨询、自动处理常见问题，赋能企业服务、售后等场景",
//     link: "",
//     running: false,
//     status: "unload",
//   },
//   {
//     id: 5,
//     icon: coStormIcon,
//     name: "Co-STORM",
//     desc: "支持多主体协同研讨，拆解问题、生成方案并管控流程，赋能企业决策、项目攻坚等场景",
//     link: "",
//     running: false,
//     status: "unload",
//   },
//   {
//     id: 6,
//     icon: meetingIcon,
//     name: "会议纪要&同声传译",
//     desc: "可实时多语言同声传译、自动整理会议议题 / 决议 / 待办，赋能高效会议管理",
//     link: "",
//     running: false,
//     status: "unload",
//   },
// ]);
const curStatus = ref({ id: -1, status: "unload" });
const agentList = ref([]);
const initialize = () => {
  useAgentStoreHook()
    .agentList()
    .then(res => {
      agentList.value = res.agents;
      const runningItem = agentList.value.find(
        item => item.status === "running"
      );
      if (runningItem) {
        curStatus.value = {
          id: runningItem.id,
          status: "loaded" // 已运行的Agent状态为loaded
        };
      } else {
        curStatus.value = { id: -1, status: "unload" };
      }
    });
};
// initialize();
const curAgent = computed(() => {
  const runningAgent = agentList.value.find(item => item.status == "running");
  return runningAgent ? runningAgent.name : "";
});
const handleItemClick = (clickedIndex: number) => {
  agentList.value = agentList.value.map((item, index) => ({
    ...item,
    running: index === clickedIndex,
  }));
};
const startAgent = (item: object) => {
  if (curStatus.value.id === item.id && curStatus.value.status === "loaded")
    return;
  curStatus.value = {
    id: item.id,
    status: "loading"
  };
  useAgentStoreHook()
    .openAgent(item.id)
    .then(res => {
      curStatus.value.status = "loaded";
      initialize();
    })
    .catch(err => {
      // 失败时重置状态，避免UI错误
      console.error("开启Agent失败", err);
      curStatus.value = { id: -1, status: "unload" };
      initialize(); // 重新拉取状态
    });
};
</script>
<style scoped lang="scss">
.agent {
  height: 100vh;
  .header {
    border-bottom: 1px solid #eef2f7;
    padding: 24px;
    span {
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 14px;
      color: #202a2f;
      line-height: 15px;
    }
  }
  .new-btn {
    background-color: #202a2f;
    font-family: HarmonyOS Sans SC;
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .run-btn {
      display: flex;
      width: 64px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #1096fd;
      font-family: HarmonyOS Sans SC;
      font-weight: 500;
      font-size: 12px;
      color: #1096fd;
      text-align: center;
      padding: 5px 0;
      justify-content: center;
      &.disable {
        color: #202a2f;
        background: #e6e6e6;
        border: 1px solid #e6e6e6;
      }
    }
    .loading-btn {
      width: 64px;
      background: #d3f4ff;
      border-radius: 4px 4px 4px 4px;
      font-family: HarmonyOS Sans SC;
      font-weight: 500;
      font-size: 12px;
      color: #1096fd;
      padding: 5px 14px;
    }
    .loaded-btn {
      width: 64px;
      background: #d3ffd7;
      border-radius: 4px 4px 4px 4px;
      font-family: HarmonyOS Sans SC;
      font-weight: 500;
      font-size: 12px;
      color: #00a64b;
      padding: 5px 8px;
    }
    .go-to-btn {
      font-family: HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 13px;
      color: #202a2f;
      line-height: 15px;
      text-align: center;
      font-style: normal;
      text-decoration-line: underline;
    }
    .run-tips {
      font-family: HarmonyOS Sans SC;
      font-weight: 400;
      font-size: 12px;
      .no-btn {
        color: #ffffff;
        background-color: #808080;
        width: 48px;
      }
      .yes-btn {
        color: #000000;
        background-color: #ffffff;
        padding: 3px 18px;
      }
    }
  }
}
</style>
