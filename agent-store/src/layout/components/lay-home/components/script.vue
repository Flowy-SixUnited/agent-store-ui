<template>
  <div class="script w-124">
    <span class="tips">对话脚本</span>
    <el-input
      v-model="scriptText"
      class="textarea"
      :autosize="{ minRows: 19, maxRows: 19 }"
      type="textarea"
      placeholder="可在此处填写对话脚本或上传附件，点击 “生成对话音频”，即可结合左侧选择进行智能创作
    示例：
    说话人1：呜…… 小枫小枫，兔子钥匙扣的线又缠在一起啦，手指都被绕住啦！​
    说话人2：别急呀小桃！我帮你解 —— 你看，要先把线头轻轻拉出来，像拆礼物丝带一样慢～​
    说话人1：哇！小枫好厉害！那我们能在兔子耳朵上缝星星纽扣吗？我带了粉色的！​
    说话人2：当然可以！等下我还能帮你画腮红，这样兔子就更可爱啦～"
    />

    <el-upload
      ref="upload"
      class="upload-demo"
      action="#"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :file-list="fileList"
    >
      <div v-if="fileList.length === 0" class="add">
        <el-icon :size="9"><Plus /></el-icon>
      </div>
      <!-- <template #file-list="scope">
        <div v-if="scope.fileList.length > 0" class="custom-file-item">
          <span class="file-name">{{ scope.fileList[0].name }}</span>
          <el-icon
            class="delete-icon"
            @click="handleRemoveFile(scope.fileList[0])"
          >
            <Delete />
          </el-icon>
        </div>
      </template> -->
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { genFileId } from "element-plus";
const upload = ref<UploadInstance>();
defineOptions({
  name: "home"
});
const scriptText = ref("");

// 1. 定义文件列表响应式数据，控制插槽显示
const fileList = ref<UploadRawFile[]>([]);

// 2. 删除文件：清空文件列表，恢复显示.add
const handleRemoveFile = (file: UploadRawFile) => {
  // 从fileList中移除当前文件
  fileList.value = fileList.value.filter(item => item.uid !== file.uid);
  // 同步清空Upload组件内部的文件列表
  upload.value?.clearFiles();
};

// 3. 原有handleExceed方法修改：同步更新fileList
const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  // 同步添加到自定义fileList，触发插槽显示文件
  fileList.value = [file];
};

// 4. 原有submitUpload方法不变（如需上传可保留）
const submitUpload = () => {
  upload.value!.submit();
};
</script>
<style scoped lang="scss">
.script {
  height: 505px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(208, 208, 208, 0.3);
  border-radius: 8px;
  padding: 16px;
  .tips {
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 12px;
    color: #202a2f;
    line-height: 16px;
  }
  .textarea {
    margin-top: 12px;
  }

  .el-textarea {
    width: 100%;
    --el-input-bg-color: #f7f7f7;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
  }
}
:deep(.el-upload) {
  width: 100%;
}
.add {
  background: #f7f7f7;
  border: 1px dashed #d8d8d8;
  display: flex;
  border-radius: 4px;
  padding: 8px 0;
  cursor: pointer;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
}
</style>
