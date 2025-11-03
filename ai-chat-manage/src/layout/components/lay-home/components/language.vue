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
    <img
      v-if="userInfo"
      class="w-6 h-6 ml-7"
      src="@/assets/home/login/avatar.png"
    />
    <el-dropdown v-if="userInfo">
      <span class="el-dropdown-link">
        {{ userInfo.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">{{
            $t("login.logout")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ArrowDown } from "@element-plus/icons-vue";
import { storageLocal } from "@pureadmin/utils";
import { type DataInfo, userKey } from "@/utils/auth";
import { useNav } from "@/layout/hooks/useNav";
const { logout } = useNav();
const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);

const { locale, t } = useI18n();
const currentLang = ref("简体中文");
const handleLangChange = (lang: string) => {
  currentLang.value = lang;
  locale.value = lang == "简体中文" ? "zh" : lang == "繁体中文" ? "ft" : "en";
};
</script>
<style lang="scss" scoped>
.el-dropdown {
  color: #2e5de0;
}
</style>
