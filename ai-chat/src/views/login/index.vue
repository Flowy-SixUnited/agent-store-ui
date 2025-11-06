<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { ref, reactive, toRaw } from "vue";
import { debounce } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { useChatStoreHook } from "@/store/modules/chat";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
// import Lock from "~icons/ri/lock-fill";
import User from "~icons/ri/user-3-fill";
import Language from "@/layout/components/lay-home/components/language.vue";
import { Lock } from "@element-plus/icons-vue";
import { storageLocal } from "@pureadmin/utils";
import { userKey } from "@/utils/auth";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
defineOptions({
  name: "Login",
});

const router = useRouter();
const loading = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  username: "admin",
  email: "",
  password: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  disabled.value = true;
  // const mockUserInfo = { id: 1, username: "admin", roles: ["admin"] };
  // storageLocal().setItem(userKey, mockUserInfo);
  // router.push({ path: "/" });
  // message(t("login.loginSuccess"), { type: "success" });
  // disabled.value = false;
  const data = {
    email: ruleForm.email,
    passwd: ruleForm.password
  };
  useChatStoreHook()
    .login(data)
    .then(res => {
      console.log(res);
      const mockUserInfo = { id: 1, username: "admin", roles: ["admin"] };
      storageLocal().setItem(userKey, mockUserInfo);
      storageLocal().setItem("token", res.data.token);
      storageLocal().setItem("user", res.data.user);
      router.push({ path: "/" });
      message(t("login.loginSuccess"), { type: "success" });
      disabled.value = false;
    });
  // await formEl.validate(valid => {
  //   if (valid) {
  //     loading.value = true;
  //     useUserStoreHook()
  //       .loginByUsername({
  //         username: ruleForm.username,
  //         password: ruleForm.password
  //       })
  //       .then(res => {
  //         if (res.success) {
  //           // 获取后端路由
  //           return initRouter().then(() => {
  //             disabled.value = true;
  //             router
  //               .push(getTopMenu(true).path)
  //               .then(() => {
  //                 message("登录成功", { type: "success" });
  //               })
  //               .finally(() => (disabled.value = false));
  //           });
  //         } else {
  //           message("登录失败", { type: "error" });
  //         }
  //       })
  //       .finally(() => (loading.value = false));
  //   }
  // });
};

const immediateDebounce: any = debounce(
  (formRef) => onLogin(formRef),
  1000,
  true
);

useEventListener(document, "keydown", ({ code }) => {
  if (
    ["Enter", "NumpadEnter"].includes(code) &&
    !disabled.value &&
    !loading.value
  )
    immediateDebounce(ruleFormRef.value);
});
</script>

<template>
  <div class="container">
    <Language class="lang" />
    <div class="card">
      <img class="w-10 h-10" src="@/assets/home/login/logo.png" alt="logo" />
      <span class="title">{{ $t("login.title") }}</span>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        label-width="auto"
        class="form-demo"
        :rules="loginRules"
      >
        <el-form-item
          prop="email"
          :rules="[
            {
              type: 'email',
              message: $t('login.emailPlaceholder'),
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('login.emailPlaceholder')"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            show-password
            :placeholder="$t('login.passwordPlaceholder')"
            type="password"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            color="#2173FC"
            class="w-full login-btn"
            @click="onLogin(ruleFormRef)"
            >{{ $t("login.login") }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;

  margin: 0;
  padding: 0;
  font-family: HarmonyOS Sans SC, HarmonyOS Sans SC;
  background-image: url("@/assets/home/login/bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  position: relative;
  .lang {
    position: absolute;
    top: 0;
    right: 0;
  }
  .card {
    margin: 0 auto;
    width: 400px;
    height: 420px;
    background: #ffffff;
    box-shadow: 0px 0px 20px 0px rgba(73, 156, 200, 0.2);
    border-radius: 24px 24px 24px 24px;
    border: 1px solid #ffffff;
    padding: 31px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 27px;
    .title {
      font-weight: 700;
      font-size: 28px;
      color: #000000;
      line-height: 33px;
    }
    .form-demo {
      width: 320px;
      margin-top: 7px;
      .login-btn {
        margin-top: 38px;
      }
    }
  }
}
</style>
