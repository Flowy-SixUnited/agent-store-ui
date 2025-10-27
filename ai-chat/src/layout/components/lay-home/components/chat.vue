<script setup lang="ts">
import "deep-chat";
import { ref, onMounted } from "vue";

const chatRef = ref();

onMounted(() => {
  chatRef.value.demo = {
    response: message => {
      console.log(message);
      return {
        text: "仅演示，如需AI服务，请参考 https://deepchat.dev/docs/connect"
      };
    }
  };
});
</script>

<template>
  <div class="content">
    <!-- <el-input
      v-model="textarea"
      :rows="4"
      type="textarea"
      placeholder="请问我有什么能帮助你的？"
    />
    <div class="flex items-center justify-between">
      <div
        class="flex items-center justify-center bg-[#F0F0F0] h-8 w-8 rounded-[50px]"
      >
        <el-icon><Plus /></el-icon>
      </div>
      <img class="h-8 w-8" src="@/assets/home/disable-send.png" />
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.content {
  margin: 40px auto;
  width: 800px;
  height: 160px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(176, 198, 212, 0.3);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
