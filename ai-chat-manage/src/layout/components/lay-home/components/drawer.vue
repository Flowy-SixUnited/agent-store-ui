<template>
  <el-form
    style="max-width: 600px"
    :model="userForm"
    label-width="auto"
    label-position="top"
  >
    <el-form-item :label="$t('manage.user.username')">
      <el-input
        v-model="userForm.username"
        :placeholder="$t('manage.user.inputPlaceholder')"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.email')">
      <el-input
        v-model="userForm.email"
        :placeholder="$t('manage.user.inputPlaceholder')"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.number')">
      <el-input
        v-model="userForm.number"
        :placeholder="$t('manage.user.inputPlaceholder')"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.code')">
      <el-input
        v-model="userForm.code"
        :placeholder="$t('manage.user.inputPlaceholder')"
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.password')">
      <el-input
        v-model="userForm.password"
        :placeholder="$t('manage.user.inputPlaceholder')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item :label="$t('manage.user.role')">
      <el-select
        v-model="userForm.role"
        :placeholder="$t('manage.user.selectPlaceholder')"
      >
        <el-option label="管理员" value="manager" />
        <el-option label="用户" value="user" />
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
import { reactive, ref } from "vue";

import { useI18n } from "vue-i18n";
import { object, string } from "vue-types";
const { t } = useI18n();
const props = defineProps({
  form: {
    type: Object,
    default: () => {}
  }
});
const userForm = reactive(
  props.form
    ? props.form
    : {
        username: "",
        email: "",
        number: "",
        code: "",
        password: "",
        role: "",
        enable: false
      }
);

function onSubmit() {
  console.log(userForm);
}
</script>

<style>
.el-radio-group {
  margin-right: 12px;
}
</style>
