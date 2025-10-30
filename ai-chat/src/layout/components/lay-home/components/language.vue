<template>
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
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ArrowDown } from "@element-plus/icons-vue";
const { locale, t } = useI18n();
const currentLang = ref("简体中文");
const handleLangChange = (lang: string) => {
  currentLang.value = lang;
  locale.value = lang == "简体中文" ? "zh" : lang == "繁体中文" ? "ft" : "en";
};
</script>
