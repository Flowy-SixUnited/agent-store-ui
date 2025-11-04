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
          }}<span class="color-[#999999]">（2）</span></span
        >
        <el-icon
          :size="16"
          class="cursor-pointer"
          @click="sideVisible = !sideVisible"
          ><Close
        /></el-icon>
      </div>
      <FileItem class="mt-4" />
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
// import { getChat } from "@/api/chat";
// 读取用户信息（指定类型，确保 TypeScript 类型安全）
const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);

// 使用用户信息（如打印、渲染到页面）
console.log("当前登录用户：", userInfo);
defineOptions({
  name: "home"
});

const messageList = ref([]);
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
    isStreaming: false
  });

  // // 添加初始的AI消息（空内容）
  // messageList.value.push({
  //   content: "",
  //   message: "",
  //   isAi: true,
  //   isStreaming: true
  // });

  currentAiMessageIndex.value = messageList.value.length - 1;
  inputValue.value = "";
  autosize.value.minRows = 1.5;
  isConversation.value = true;
  // isLoading.value = true;
  try {
    await useChatStoreHook().goChat(userMessage, content => {
      console.log("content", content);
      // 流式更新AI消息内容
      if (currentAiMessageIndex.value !== -1) {
        console.log("messageList.value", messageList.value);
        const aiMessage = messageList.value[currentAiMessageIndex.value];
        aiMessage.message += content;
        // 滚动到底部
        nextTick(() => {
          scrollToBottom();
        });
      }
    });
    console.log("messageList.value", messageList.value);
    // 流式输出完成，更新状态
    if (currentAiMessageIndex.value !== -1) {
      messageList.value[currentAiMessageIndex.value].isStreaming = false;
    }
  } catch (error) {
    console.error("发送消息失败:", error);
    // 错误处理
    if (currentAiMessageIndex.value !== -1) {
      messageList.value[currentAiMessageIndex.value].message =
        "抱歉，发生了错误，请重试。";
      messageList.value[currentAiMessageIndex.value].isStreaming = false;
    }
  } finally {
    isLoading.value = false;
    currentAiMessageIndex.value = -1;
  }
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
    max-height: 550px;
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
