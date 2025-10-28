<template>
  <div>
    <div v-html="parsedContent" class="message markdown-body" />
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, nextTick } from "vue";
import MarkdownIt from "markdown-it";
import mdKatex from "@traptitech/markdown-it-katex";
import hljs from "highlight.js";
import ClipboardJS from "clipboard";
import markdownItTaskLists from "markdown-it-task-lists";

const props = defineProps({
  content: {
    required: true
  }
});

// 初始化剪贴板
let clipboard = null;

// 创建并配置 markdown-it 实例
const mdi = new MarkdownIt({
  html: true, // 启用HTML标签（关键：允许HTML注入）
  xhtmlOut: true, // 使用'/'关闭单标签
  breaks: true, // 转换'\n'为<br>
  linkify: true, // 自动转换URL文本为链接
  typographer: true, // 启用一些语言中性的替换和引号美化
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language));
    if (validLang) {
      const lang = language ?? "";
      return highlightBlock(
        hljs.highlight(code, { language: lang }).value,
        lang
      );
    }
    return highlightBlock(hljs.highlightAuto(code).value, "");
  }
});

// 使用任务列表插件
mdi.use(markdownItTaskLists, {
  enabled: true,
  label: true,
  labelAfter: false
});

// 启用数学公式插件
mdi.use(mdKatex, {
  blockClass: "katexmath-block rounded-md p-[10px]",
  errorColor: "#cc0000"
});

// 修正后的预处理内容函数，按章节重置编号
function preprocessNumbering(content) {
  const lines = content.split("\n");
  const result = [];
  let sectionCounter = 0;

  // 更新的正则表达式，处理包含空格、标题（有或没有冒号）等的情况
  const pattern = /^(.*?)(\d+\.)(\s+)(.*?)(:|\s*：)?(.*)$/;
  const headerPattern = /^#{1,6}\s/; // 检测Markdown标题（1-6级）

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 如果是标题行，重置计数器
    if (headerPattern.test(line)) {
      sectionCounter = 0;
      result.push(line);
      continue;
    }

    const match = line.match(pattern);

    if (match) {
      sectionCounter++;
      const [_, indent, number, space, title, colon, suffix] = match;

      // 使用新的递增编号替换
      const newLine = `${indent}<span style="display:inline-block;width:0;overflow:hidden;">0</span>${sectionCounter}.${space}${title}${
        colon || ""
      }${suffix}`;
      result.push(newLine);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

// 解析代码块的渲染方法
function highlightBlock(str, lang) {
  const uniqueId = `code-${Math.random().toString(36).substr(2, 9)}`;
  lang = lang || "text";

  // 去除代码末尾的换行符
  const trimmedStr = str.replace(/\n$/, "");

  return `<pre><div class="code-header"><span>${lang}</span><button class="copy-btn" data-clipboard-target="#${uniqueId}">复制</button></div><div><code id="${uniqueId}" class="hljs ${lang}" style="border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;font-family: '微软雅黑';">${trimmedStr}</code></div></pre>`;
}

const parsedContent = ref("");

// 确保正确处理Markdown内容
const parseMarkdown = content => {
  // 预处理内容，替换固定编号为递增编号
  const processedContent = preprocessNumbering(content);

  // 渲染处理后的内容
  return mdi.render(processedContent);
};

// 初始化剪贴板并处理复制反馈
const initClipboard = () => {
  clipboard && clipboard.destroy();
  clipboard = new ClipboardJS(".copy-btn", {
    text: trigger => {
      const target = document.querySelector(
        trigger.getAttribute("data-clipboard-target")
      );
      return target.innerText;
    }
  });

  // 复制成功提示
  clipboard.on("success", e => {
    const btn = e.trigger;
    btn.textContent = "已复制!";
    setTimeout(() => (btn.textContent = "复制"), 2000);
    e.clearSelection();
  });
};

watchEffect(async () => {
  const currentItem = props.content;
  if (currentItem) {
    // 使用修复后的解析方法
    parsedContent.value = parseMarkdown(currentItem);
    await nextTick();
    initClipboard();
  }
});

const styles = `
  .code-header {
    height: 30px;
    background-color: #50505a;
    padding: 6px;
    color: white;
    font-size: 10px;
    font-family: "微软雅黑";
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .copy-btn {
    height: 20px;
    background: #6b6b76;
    border: none;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .copy-btn:hover {
    background: #888;
  }
`;

// 动态注入样式
onMounted(() => {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = styles + markdownStyles;
  document.head.appendChild(styleTag);
});

// Markdown样式
const markdownStyles = `
  .markdown-body {
    font-size: 12px;
    font-family: "微软雅黑";
    line-height: 1.2;
    word-wrap: break-word;
  }
  .markdown-body p {
    line-height: 1.7;
  }

  .markdown-body h1 {
    font-size: 2em;
    margin: 0.67em 0;
    font-weight: bold;
  }

  .markdown-body h2 {
    font-size: 1.5em;
    margin: 0.83em 0;
    font-weight: bold;
  }

  .markdown-body h3 {
    font-size: 1.17em;
    margin: 1em 0;
    font-weight: bold;
  }

  .markdown-body h4 {
    font-size: 1em;
    margin: 1.33em 0;
    font-weight: bold;
  }

  .markdown-body h5 {
    font-size: 0.83em;
    margin: 1.67em 0;
    font-weight: bold;
  }

  .markdown-body h6 {
    font-size: 0.67em;
    margin: 2.33em 0;
    font-weight: bold;
  }

  .markdown-body strong {
    font-weight: bold;
  }

  .markdown-body em {
    font-style: italic;
  }

  .markdown-body blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 0 0 16px 0;
  }

  .markdown-body ul,
  .markdown-body ol {
    list-style: none !important; /* 强制覆盖默认样式 */
    padding-left: 1.5em !important;
    margin-bottom: 10px !important;
    margin-left: 10px !important;
  }

  .markdown-body li {
    position: relative !important;
    margin-bottom: 0.25em !important;
    display: block !important;
  }

  .markdown-body ul > li::before {
    content: '•' !important;
    position: absolute !important;
    left: -1.5em !important;
    width: 1em !important;
    display: inline-block !important;
    text-align: center !important;
  }

  .markdown-body ol > li::before {
    content: counter(list-item) "." !important;
    position: absolute !important;
    left: -1.5em !important;
    width: 1em !important;
    display: inline-block !important;
    text-align: right !important;
    margin-right: 0.5em !important;
  }

  .markdown-body table {
    border-collapse: collapse;
    margin: 0 0 16px 0;
    width: 100%;
  }

  .markdown-body table th,
  .markdown-body table td {
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }

  .markdown-body table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }

  .markdown-body table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }

  .markdown-body hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #e1e4e8;
    border: 0;
  }

  .markdown-body code:not(.hljs) {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27,31,35,0.05);
    border-radius: 3px;
    font-family: monospace;
  }

  .markdown-body img {
    max-width: 100%;
    box-sizing: content-box;
  }
`;
</script>

<style scoped>
.message {
  font-size: 14px;
  font-family: "微软雅黑";
}
</style>
