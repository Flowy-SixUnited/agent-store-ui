<template>
  <div class="wh-full flex">
    <div class="flex flex-1 flex-col items-center bg-[#fcfcfc]">
      <div class="bg-cover bg-center bg-no-repeat header">
        <div class="flex items-center gap-1 pr-6 pt-6">
          <img class="w-4 h-4" src="@/assets/home/language.png" />
          <el-dropdown>
            <span class="el-dropdown-link flex items-center">
              {{ currentLang }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLangChange('简体中文')"
                  >简体中文</el-dropdown-item
                >
                <el-dropdown-item @click="handleLangChange('繁体中文')"
                  >繁体中文</el-dropdown-item
                >
                <el-dropdown-item @click="handleLangChange('英文')"
                  >英文</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
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
            :is-ai="item.isAi"
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
import { ref } from "vue";
import { Plus, Close, ArrowDown } from "@element-plus/icons-vue";
import Inputs from "@/layout/components/lay-home/components/inputs.vue";
import Chat from "@/layout/components/lay-home/components/chat.vue";
import FileItem from "@/layout/components/lay-home/components/file-item.vue";
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n();
defineOptions({
  name: "home"
});
const currentLang = ref("简体中文");
const handleLangChange = (lang: string) => {
  currentLang.value = lang;
  locale.value = lang == "简体中文" ? "zh" : lang == "繁体中文" ? "ft" : "en";
};
const messageList = ref([]);
const inputValue = ref("");
const autosize = ref({ minRows: 3, maxRows: 12 });
const isConversation = ref(false);
// 发送消息
const sendMessage = () => {
  if (!inputValue.value.trim()) return; // 过滤空消息

  messageList.value.push({
    content: inputValue.value.trim(),
    isAi: false // 标记为“用户消息”
  });

  inputValue.value = "";
  autosize.value.minRows = 1.5;
  isConversation.value = true;
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
