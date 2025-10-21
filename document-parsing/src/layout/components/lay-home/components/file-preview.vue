<template>
  <div class="wrap">
    <VueOfficePdf :src="pdfSrc" style="height: 100%" @rendered="rendered" @error="HandlError"> </VueOfficePdf>
	   <!-- <video v-if="fileInfo.fileType === 'video' && fileInfo.filePath"
   			 width="100%" controls controlslist="nodownload">
   			 /**  controlslist="nodownload" 隐藏下载按钮 */
	        <source :src="fileInfo.filePath"/>
	        Download the
	      	<a :href="fileInfo.filePath">MP4</a>
      </video>
	  <audio v-if="fileInfo.fileType === 'audio' && fileInfo.filePath"
          controls controlsList="nodownload" style="width: 100%;">
          <source :src="fileInfo.filePath" type="audio/mp3" />
          您的浏览器不支持audio标签。
      </audio> -->
  </div>
</template>
<script setup>
import { ref } from "vue";
// const props = defineProps({
//   fileInfo: {
//     type: Object,
//     required: true
//   }
// });
const pdfSrc = ref("/六联EAM使用手册_V1.4.pdf");
const loading = ref(true);
/** rendered：渲染完成后调用 */
const HandlError = (err) => {
  console.error("PDF 加载失败：", err);
};
const rendered = () => {
  console.log("PDF 渲染完成");
};

</script>
