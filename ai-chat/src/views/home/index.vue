<template>
  <div class="wh-full flex">
    <div class="flex flex-1 flex-col items-center bg-[#fcfcfc] chat">
      <div class="flex items-center gap-1 lang">
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
      <div v-if="!isConversation" class="main">
        <div class="title">你好，开始美好的一天！</div>
        <Inputs
          ref="inputsRef"
          v-model:inputs="inputValue"
          :autosize="autosize"
          @send-message="sendMessage"
        />
      </div>
      <div
        v-else
        class="flex flex-col justify-between h-screen position-relative"
      >
        <div v-for="(item, index) in messageList" :key="index">
          <Chat :content="item" @open-origin="handleOpenOrigin" />
        </div>
        <div class="input-fixed">
          <div
            class="new-chat"
            @click="((isConversation = false), (autosize.minRows = 3))"
          >
            <el-icon :size="12" color="#202B2F"><Plus /></el-icon> 开启新会话
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
    <div v-if="sideVisible" class="bg-[#F9F9F9] w-70 p-4">
      <div class="flex items-center justify-between">
        <span class="color-[#202B2F]"
          >引用来源<span class="color-[#999999]">（2）</span></span
        >
        <el-icon :size="16" @click="sideVisible = !sideVisible"
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
defineOptions({
  name: "home"
});
const currentLang = ref("简体中文");
const handleLangChange = (lang: string) => {
  currentLang.value = lang;
  // 这里可以添加实际的语言切换逻辑（如i18n切换）
  // 例如：i18n.global.locale.value = lang === '英文' ? 'en' : lang === '繁体中文' ? 'zh-TW' : 'zh-CN';
};
const messageList = ref([]);
const inputValue = ref("");
const autosize = ref({ minRows: 3, maxRows: 12 });
const isConversation = ref(false);
// 发送消息
const sendMessage = () => {
  autosize.value.minRows = 1.5;
  messageList.value.push(inputValue.value);
  isConversation.value = true;
};
const sideVisible = ref(false);
const handleOpenOrigin = (visible: boolean) => {
  sideVisible.value = visible;
};
</script>
<style scoped lang="scss">
.chat {
  position: relative;
  .lang {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}
.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    padding-top: 172px;
    font-family: HarmonyOS Sans SC;
    font-weight: 700;
    font-size: 32px;
    color: #1f2937;
    line-height: 32px;
    text-align: center;
    margin-bottom: 40px;
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
    color: #202b2f;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 16px;
    cursor: pointer;
  }
}
</style>
