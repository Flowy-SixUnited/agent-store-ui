<template>
  <el-form
    ref="formRef"
    style="max-width: 600px"
    :model="userForm"
    label-width="auto"
    label-position="top"
    :rules="formRules"
  >
    <el-form-item :label="$t('manage.user.username')">
      <el-input
        v-model="userForm.username"
        :placeholder="$t('manage.user.inputPlaceholder')"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.email')" prop="email">
      <el-input
        v-model="userForm.email"
        :placeholder="$t('manage.user.inputPlaceholder')"
        type="email"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.number')" prop="phone">
      <el-input
        v-model="userForm.phone"
        :placeholder="$t('manage.user.inputPlaceholder')"
        type="tel"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.code')">
      <el-input
        v-model="userForm.agent_code"
        :placeholder="$t('manage.user.inputPlaceholder')"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.password')">
      <el-input
        v-model="userForm.passwd"
        :placeholder="$t('manage.user.inputPlaceholder')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.role')">
      <el-select
        :v-model="userForm.role == '1' ? '用户' : '管理员'"
        :placeholder="$t('manage.user.selectPlaceholder')"
      >
        <el-option label="管理员" value="2" />
        <el-option label="用户" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('manage.user.enable')">
      <el-switch v-model="userForm.enable" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{
        $t("manage.user.save")
      }}</el-button>
      <el-button>{{ $t("manage.user.cancel") }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useManageStoreHook } from "@/store/modules/manage";
import type { FormInstance, FormRules } from "element-plus"; // 导入 Element Plus 表单类型
import { defineEmits } from "vue";
import { ElMessage } from "element-plus";
const emit = defineEmits<{
  (e: "refresh-list"): void; // 声明事件名为 refresh-list，无参数
}>();
const { t } = useI18n();
const formRef = ref<FormInstance | null>(null);
const formRules = reactive<FormRules>({
  // 用户名：必填
  username: [
    {
      required: true,
      message: t("manage.user.usernameRequired"),
      trigger: "blur"
    }
  ],
  // 邮箱：必填 + 格式校验（支持主流邮箱格式）
  email: [
    {
      required: true,
      message: t("manage.user.emailRequired"),
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: t("manage.user.emailInvalid"),
      trigger: "blur"
    }
  ],
  // 手机号：必填 + 中国大陆手机号格式校验（11位数字，以13/14/15/17/18/19开头）
  phone: [
    {
      required: true,
      message: t("manage.user.phoneRequired"),
      trigger: "blur"
    },
    {
      pattern: /^(\+86|86)?\s?1[3-9]\d{9}$/i,
      message: t("manage.user.phoneInvalid"),
      trigger: "blur"
    }
  ],
  // 代理码：必填
  agent_code: [
    { required: true, message: t("manage.user.codeRequired"), trigger: "blur" }
  ]
});
const props = defineProps({
  form: {
    type: Object,
    default: () => {}
  }
});
const userForm = reactive(
  props.form && !isObjectEmpty(props.form)
    ? { ...props.form } // 深拷贝避免直接修改 props
    : {
        id: -1,
        username: "",
        email: "",
        phone: "",
        agent_code: "",
        passwd: "",
        role: 1,
        enable: false
      }
);
function isObjectEmpty(obj: object): boolean {
  // 排除非对象类型、null、数组（如果需要区分数组可补充）
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return true;
  }
  // 检查自身属性是否为空（不包括原型链属性）
  return Object.keys(obj).length === 0;
}
watch(
  () => props.form, // 监听源：props.form
  newForm => {
    // 当 form 变化时，同步更新 userForm
    if (isObjectEmpty(newForm)) {
      // 为空对象时，重置为默认值
      Object.assign(userForm, {
        id: -1,
        username: "",
        email: "",
        phone: "",
        agent_code: "",
        passwd: "",
        role: 1,
        enable: false
      });
    } else {
      // 非空时，同步新值
      Object.assign(userForm, newForm);
    }
  },
  {
    deep: true, // 深度监听（关键：感知对象内部属性变化）
    immediate: true // 初始化时立即执行一次（确保初始状态正确）
  }
);
function onSubmit() {
  if (isObjectEmpty(props.form)) {
    const data = {
      username: userForm.username,
      passwd: userForm.passwd,
      email: userForm.email,
      phone: userForm.phone,
      agent_code: userForm.agent_code,
      role: userForm.role
    };
    useManageStoreHook()
      .createUser(data)
      .then(res => {
        console.log("新增成功：", res);
        ElMessage.success("新增用户成功");
        emit("refresh-list");
      })
      .catch(err => {
        console.error("新增失败：", err);
      });
  } else {
    const data = {
      id: userForm.id,
      username: userForm.username,
      passwd: userForm.passwd,
      email: userForm.email,
      phone: userForm.phone,
      agent_code: userForm.agent_code,
      status: !userForm.enable ? 1 : 2,
      role: userForm.role == "1" ? 1 : 2
    };
    useManageStoreHook()
      .updateUserInfo(data)
      .then(res => {
        console.log("更新成功：", res);
        ElMessage.success("用户信息更新成功");
        emit("refresh-list");
      })
      .catch(err => {
        console.error("更新失败：", err);
      });
  }
}
</script>

<style>
.el-radio-group {
  margin-right: 12px;
}
</style>
