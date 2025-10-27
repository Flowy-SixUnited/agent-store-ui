<template>
  <div class="main bg-[#fcfcfc]">
    <div class="title">你好，开始美好的一天！</div>
    <div class="content">
      <!-- <el-input
        v-model="textarea"
        :rows="4"
        type="textarea"
        placeholder="请问我有什么能帮助你的？"
      /> -->
      <Inputs ref="inputsRef" v-model:inputs="inputValue" :autosize="autosize" @send-message="sendMessage" />
      <div class="flex items-center justify-between mt-2">
        <div
          class="flex items-center justify-center bg-[#F0F0F0] h-8 w-8 rounded-[50px] cursor-pointer"
        >
          <el-icon><Plus /></el-icon>
        </div>
        <img
          class="h-8 w-8 cursor-pointer"
          :src="!inputValue ? disableSendIcon : sendIcon"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import Inputs from "@/layout/components/lay-home/components/inputs.vue";
import disableSendIcon from "@/assets/home/disable-send.png";
import sendIcon from "@/assets/home/send.png";
defineOptions({
  name: "home"
});
const textarea = ref("");
const inputValue = ref("");
const autosize = ref({ minRows: 3, maxRows: 12 });
// 发送消息
const sendMessage = () => {
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
}
.title {
  padding-top: 172px;
  font-family: HarmonyOS Sans SC, HarmonyOS Sans SC;
  font-weight: 700;
  font-size: 32px;
  color: #1f2937;
  line-height: 32px;
  text-align: center;
}
.content {
  margin: 40px auto;
  width: 800px;
  min-height: 160px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(176, 198, 212, 0.3);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
