<template>
  <div class="flex flex-col items-center bg-[#fcfcfc]">
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
      <Chat :content="inputValue" />
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
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import Inputs from "@/layout/components/lay-home/components/inputs.vue";
import Chat from "@/layout/components/lay-home/components/chat.vue";
defineOptions({
  name: "home"
});
const inputValue = ref("");
const autosize = ref({ minRows: 3, maxRows: 12 });
const isConversation = ref(false);
// 发送消息
const sendMessage = () => {
  autosize.value.minRows = 1.5;
  isConversation.value = true;
  // if (isNew.value && !disabled.value) {
  //   // 过滤失败的文件
  //   const files = filelist.value.filter(item => item.status === 'success')

  //   const item = {
  //     message: inputValue.value,
  //     files: files,
  //     reqId: undefined,
  //     withOnlineSearch: withOnlineSearch.value,
  //   }
  //   emits('onMessage', item)

  //   if (filelist.value.length > 0) {
  //     filelist.value = []
  //   }
  //   inputValue.value = ''
  // }

  // // 正在输出内容
  // if (!isNew.value && !getFinishedStatus.value) {
  //   emits('onStop')
  // }

  // if (!isNew.value && !disabled.value) {
  //   // 过滤失败的文件
  //   const files = filelist.value.filter(item => item.status === 'success')

  //   const item = {
  //     message: inputValue.value,
  //     files: files,
  //     reqId: undefined,
  //     withOnlineSearch: withOnlineSearch.value,
  //   }
  //   emits('onMessage', item)

  //   if (filelist.value.length > 0) {
  //     filelist.value = []
  //   }
  //   inputValue.value = ''
  // }
};
</script>
<style scoped lang="scss">
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
