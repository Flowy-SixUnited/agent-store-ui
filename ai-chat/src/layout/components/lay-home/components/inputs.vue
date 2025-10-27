<template>
  <div class="content">
    <div class="input-area-wrap">
      <div class="input-wrap">
        <div w-full>
          <el-input
            ref="inputRef"
            v-model="inputValue"
            :type="type"
            :rows="rows"
            :autosize="autosize"
            resize="none"
            :placeholder="placeholder"
            @keydown.enter="keyCodeAction"
          />
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between mt-2">
      <div
        class="flex items-center justify-center bg-[#F0F0F0] h-8 w-8 rounded-[50px] cursor-pointer"
      >
        <el-icon><Plus /></el-icon>
      </div>
      <img
        class="h-8 w-8 cursor-pointer"
        :src="!inputValue ? disableSendIcon : sendIcon"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import { Plus } from "@element-plus/icons-vue";
import disableSendIcon from "@/assets/home/disable-send.png";
import sendIcon from "@/assets/home/send.png";
const props = defineProps({
  inputs: {
    type: String,
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: "textarea"
  },
  placeholder: {
    type: String,
    default: "请问我有什么能帮助你的？"
  },
  rows: {
    type: Number,
    default: 3
  },
  autosize: {
    type: Object,
    default: () => {
      return { minRows: 3, maxRows: 12 };
    }
  }
});

const emits = defineEmits(["update:inputs", "sendMessage"]);

const { inputs, type, placeholder, autosize, rows } = toRefs(props);
const inputRef = ref(null);
const inputValue = ref(null);

watch(inputs, val => {
  inputValue.value = val;
});

watch(inputValue, val => {
  emits("update:inputs", val);
});
const sendMessage = () => {
  emits("sendMessage", inputValue.value);
};
const keyCodeAction = event => {
  // shift + enter 换行
  if (event.shiftKey) {
    return;
  }
  // 阻止enter默认事件
  event.preventDefault();

  // 信息
  emits("sendMessage", inputValue.value);
};

defineExpose({
  focus() {
    inputRef.value.focus();
  }
});
</script>

<style lang="scss" scoped>
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
.input-area-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;

  .input-wrap {
    position: relative;
    width: 100%;
    box-sizing: border-box;

    :deep(.el-textarea) {
      width: 100%;

      .el-textarea__inner {
        font-size: 15px;
        font-weight: 400;
        color: rgb(64, 64, 64);
        line-height: 28px;
        padding: 0 6px;
        border: none;
        box-shadow: none;
        background-color: #fff;
      }
    }

    .text-placeholder {
      width: 100%;
      line-height: 28px;
      font-size: 15px;
      font-weight: 400;
      color: rgb(64, 64, 64);
      visibility: hidden;
    }
  }
}
</style>
