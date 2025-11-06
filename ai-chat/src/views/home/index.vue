<template>
  <div class="wh-full flex">
    <div class="flex flex-1 flex-col items-center bg-[#fcfcfc]">
      <div class="bg-cover bg-center bg-no-repeat header">
        <Language />
      </div>
      <div v-if="!isConversation" class="main">
        <div class="title">{{ $t("chat.title") }}</div>
        <Inputs
          ref="inputsRef"
          v-model:inputs="inputValue"
          :autosize="autosize"
          @send-message="sendMessage"
        />
      </div>
      <div
        v-else
        class="flex flex-col justify-between h-screen position-relative chat"
      >
        <div class="chat-list">
          <Chat
            v-for="(item, index) in messageList"
            :key="index"
            :content="item.content"
            :message="item.message"
            :file-list="item.fileList"
            :is-ai="item.isAi"
            :is-streaming="item.isStreaming"
            @open-origin="handleOpenOrigin"
          />
        </div>
        <div class="input-fixed">
          <div
            class="new-chat"
            @click="((isConversation = false), (autosize.minRows = 3))"
          >
            <el-icon :size="12" color="#2173FC"><Plus /></el-icon>
            {{ $t("chat.newChat") }}
          </div>
          <Inputs
            ref="inputsRef"
            v-model:inputs="inputValue"
            :autosize="autosize"
            @send-message="sendMessage"
          />
        </div>
      </div>
    </div>
    <div v-if="sideVisible" class="bg-[#FFFFFF] w-70 p-4">
      <div class="flex items-center justify-between">
        <span class="color-[#202B2F]"
          >{{ $t("chat.citationSources")
          }}<span class="color-[#999999]"
            >（{{ messageList[messageList.length - 1].fileList.length }}）</span
          ></span
        >
        <el-icon
          :size="16"
          class="cursor-pointer"
          @click="sideVisible = !sideVisible"
          ><Close
        /></el-icon>
      </div>
      <FileItem
        class="mt-4"
        :file-list="messageList[messageList.length - 1].fileList"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Plus, Close } from "@element-plus/icons-vue";
import Inputs from "@/layout/components/lay-home/components/inputs.vue";
import Chat from "@/layout/components/lay-home/components/chat.vue";
import FileItem from "@/layout/components/lay-home/components/file-item.vue";
import Language from "@/layout/components/lay-home/components/language.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { storageLocal } from "@pureadmin/utils";
import { userKey, type DataInfo } from "@/utils/auth"; // DataInfo 是用户信息的类型定义
import { useChatStoreHook } from "@/store/modules/chat";
const userInfo = storageLocal().getItem("user");
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { da } from "element-plus/es/locale/index.mjs";
// import { getChat } from "@/api/chat";
// 读取用户信息（指定类型，确保 TypeScript 类型安全）

// 使用用户信息（如打印、渲染到页面）
console.log("当前登录用户：", userInfo);
defineOptions({
  name: "home"
});

const messageList = ref<
  Array<{
    content: string;
    message: string;
    isAi: boolean;
    isStreaming: boolean;
    fileList: Array<{}>;
  }>
>([]);
const fileList = ref([]);
const inputValue = ref("");
const autosize = ref({ minRows: 3, maxRows: 12 });
const isConversation = ref(false);
const isLoading = ref(false);
const currentAiMessageIndex = ref(-1);
// 发送消息
const sendMessage = async () => {
  if (!inputValue.value.trim()) return; // 过滤空消息
  const userMessage = inputValue.value.trim();
  // 添加用户消息
  messageList.value.push({
    content: userMessage,
    message: "",
    isAi: false,
    isStreaming: false,
    fileList: []
  });
  const aiMessageIndex = messageList.value.length;
  currentAiMessageIndex.value = aiMessageIndex;
  inputValue.value = "";
  autosize.value.minRows = 1.5;
  isConversation.value = true;

  await attemptFetch(aiMessageIndex - 1);
};

let abortController = null;
const attemptFetch = async (aiMessageIndex: number) => {
  if (abortController) abortController.abort();
  abortController = new AbortController();
  messageList.value[aiMessageIndex].message = "内容加载中...";
  messageList.value[aiMessageIndex].isStreaming = true;
  scrollToBottom();
  const timestamp = Date.now();
  await fetchEventSource("/coze/v1/workflow/stream_run", {
    method: "post",
    headers: {
      Authorization:
        "Bearer pat_250803ff0d28f62881a866e0c630b0fd8338663448d449bf76dd2a98ddbbe039",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      {
        workflow_id: "7568754314164830208",
        parameters: {
          query: messageList.value[aiMessageIndex].content,
          message_id: `${userInfo.id}-${timestamp}`
        }
      }
      // stream: true // 启用流式响应
    ),
    signal: abortController.signal, // 绑定 AbortController
    openWhenHidden: true,
    onmessage(event) {
      // 忽略流结束的信号（部分后端会返回空数据或特定标识）
      if (!event.data || event.data === "[DONE]") return;

      try {
        const data = JSON.parse(event.data);
        const chunk = data.content || "";
        if (chunk) {
          // 实时追加分片内容
          if (
            messageList.value[aiMessageIndex].message === "内容加载中..." ||
            messageList.value[aiMessageIndex].message === "请求失败，请重试"
          ) {
            messageList.value[aiMessageIndex].message = ""; // 清空临时文本
          }
          messageList.value[aiMessageIndex].message += chunk;
          scrollToBottom();
        }
      } catch (err) {
        console.error("解析流式数据失败:", err);
      }
    },
    // 流错误处理
    onerror(error) {
      console.error("流式请求错误:", error);
      messageList.value[aiMessageIndex].message = "请求失败，请重试";
      messageList.value[aiMessageIndex].isStreaming = false;
      // 非超时错误才重新尝试（避免死循环）
      if (error.name !== "AbortError") {
        abortController = null;
      }
    },
    // 流关闭（结束加载状态）
    onclose() {
      console.log("流式连接已关闭");
      messageList.value[aiMessageIndex].isStreaming = false;
      abortController = null;
    }
  });
  const params = {
    workflow_id: "7569540054134030336",
    parameters: {
      message_id: `${userInfo.id}-${timestamp}`
    }
  };
  useChatStoreHook()
    .getFile(params)
    .then(res => {
      let data = JSON.parse(res.data);
      data = JSON.parse(data.data);
      messageList.value[aiMessageIndex].fileList = data.results;
      console.log(data);
    });
};
// 滚动到底部
const scrollToBottom = () => {
  const chatList = document.querySelector(".chat-list");
  if (chatList) {
    chatList.scrollTop = chatList.scrollHeight;
  }
};
const sideVisible = ref(false);
const handleOpenOrigin = (visible: boolean) => {
  sideVisible.value = visible;
};
</script>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 130px;
  background-image: url("@/assets/home/bg.png");
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  color: #2e5de0;
}
.main {
  height: calc(100vh - 130px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    padding-top: 42px;
    font-family: HarmonyOS Sans SC;
    font-weight: 700;
    font-size: 32px;
    color: #1f2937;
    line-height: 32px;
    text-align: center;
    margin-bottom: 40px;
  }
}
.chat {
  height: calc(100vh - 80px);
  padding-bottom: 80px;
  margin-top: -50px;
  .chat-list {
    gap: 12px;
    display: flex;
    flex-direction: column;
    max-height: 638px;
    overflow-y: auto;
  }
}
.input-fixed {
  position: absolute;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .new-chat {
    width: 104px;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(83, 100, 131, 0.22);
    border-radius: 100px;
    padding: 5px 8px;
    font-family: HarmonyOS Sans SC;
    font-weight: 400;
    font-size: 14px;
    color: #2173fc;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 16px;
    cursor: pointer;
  }
}
</style>
