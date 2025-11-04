<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside width="200px">
      <el-scrollbar>
        <div class="flex items-center justify-center py-4 gap-3">
          <div class="side-logo" />
          <div class="side-title">{{ $t("manage.title") }}</div>
        </div>
        <el-menu
          default-active="user"
          v-model="currentMenu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="user" class="flex justify-between">
            <div class="flex items-center gap-3">
              <img
                class="w-4 h-4"
                :src="currentMenu == 'user' ? userSelected : userUnselect"
              />
              <span>{{ $t("manage.user.title") }}</span>
            </div>
            <el-icon :size="15"><ArrowRight /></el-icon>
          </el-menu-item>
          <el-menu-item index="knowledge" class="flex justify-between">
            <div class="flex items-center gap-3">
              <img
                class="w-4 h-4"
                :src="
                  currentMenu == 'knowledge'
                    ? knowledgeSelected
                    : knowledgeUnselect
                "
              />
              <span>{{ $t("manage.knowledge.title") }}</span>
            </div>
            <el-icon :size="15"><ArrowRight /></el-icon>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="flex items-center justify-between">
        <span class="header-title">{{
          currentMenu === "user"
            ? $t("manage.user.title")
            : $t("manage.knowledge.title")
        }}</span>
        <div class="toolbar">
          <Language />
        </div>
      </el-header>

      <el-main>
        <User v-if="currentMenu === 'user'" />
        <Knowledge v-if="currentMenu === 'knowledge'" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Menu as IconMenu, Message, ArrowRight } from "@element-plus/icons-vue";
import Language from "@/layout/components/lay-home/components/language.vue";
import User from "@/layout/components/lay-home/components/user.vue";
import Knowledge from "@/layout/components/lay-home/components/knowledge.vue";
import userUnselect from "@/assets/home/manage/user-unselected.png";
import userSelected from "@/assets/home/manage/user-selected.png";
import knowledgeUnselect from "@/assets/home/manage/knowledge-unselected.png";
import knowledgeSelected from "@/assets/home/manage/knowledge-selected.png";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { t } = useI18n();
const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles"
};
const currentMenu = ref("user");
const tableData = ref(Array.from({ length: 20 }).fill(item));
const handleMenuSelect = (key: string) => {
  currentMenu.value = key;
};
</script>

<style scoped lang="scss">
.layout-container-demo .el-header {
  position: relative;
  background-color: white;
  color: var(--el-text-color-primary);
  font-family:
    HarmonyOS Sans SC,
    HarmonyOS Sans SC;
  .header-title {
    font-weight: 700;
    font-size: 14px;
    color: #202a2f;
    line-height: 15px;
  }
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: white;
  border-right: 1px solid #eef2f7;
  .side-logo {
    width: 24px;
    height: 24px;
    background: #d8d8d8;
  }
  .side-title {
    font-family:
      HarmonyOS Sans SC,
      HarmonyOS Sans SC;
    font-weight: 900;
    font-size: 16px;
    color: #202a2f;
    line-height: 24px;
  }
}
.layout-container-demo .el-menu {
  border-right: none;
  font-family:
    HarmonyOS Sans SC,
    HarmonyOS Sans SC;
  .el-menu-item.is-active {
    background-color: #f8f9fb;
    color: #202a2f;
  }
}
.layout-container-demo .el-main {
  padding: 24px;
  background: #f2f3f4;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.el-table--fit {
  box-shadow: 0px 2px 12px 0px rgba(188, 188, 188, 0.3);
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #ffffff;
}
</style>
