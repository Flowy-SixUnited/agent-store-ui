<template>
  <div class="main p-6">
    <div class="flex items-center justify-between mb-6">
      <el-input
        v-model="input"
        style="width: 260px"
        :placeholder="$t('manage.user.searchPlaceholder')"
        :suffix-icon="Search"
      />
      <div class="flex items-center gap-4">
        <el-button type="primary" round color="#2173FC" @click="handleNew"
          >{{ $t("manage.user.new") }}
        </el-button>
        <el-upload
          ref="fileList"
          class="upload-demo"
          action="#"
          :limit="1"
          :accept="'.xlsx,.xls,.xlsm,.xlsb,.xltx,.csv'"
          :auto-upload="false"
          :on-change="fileUpload"
          :show-file-list="false"
        >
          <template #trigger>
            <el-button type="info" round color="#F7F7F7">{{
              $t("manage.user.upload")
            }}</el-button>
          </template>
        </el-upload>
      </div>
    </div>
    <div class="table">
      <el-table :data="userList" style="width: 100%" :row-hover="true">
        <el-table-column prop="id" label="序号" align="left" width="80" />
        <el-table-column
          prop="username"
          label="用户名"
          align="left"
          width="90"
        />
        <el-table-column prop="phone" label="手机号码" align="left" />
        <el-table-column prop="email" label="邮箱" align="left" width="180" />
        <el-table-column prop="agent_code" label="Agent code" align="left" />
        <el-table-column prop="created_at" label="创建时间" align="left">
          <template #default="scope">
            {{ formatDateTime(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="启用状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'1'"
              :inactive-value="'2'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template #default="scope">
            <div class="flex items-center gap-4 justify-end">
              <img
                class="w-4 h-4 cursor-pointer"
                src="@/assets/home/manage/edit.png"
                @click="handleEdit(scope.row)"
              />
              <img
                class="w-4 h-4 cursor-pointer"
                src="@/assets/home/manage/delete.png"
                @click="handleDelete(scope.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="paginatedList.length"
        :background="true"
        @page-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </div>
    <el-drawer v-model="drawer" :direction="direction" size="354">
      <template #header="{ titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">
          {{
            curType == "new" ? $t("manage.user.new") : $t("manage.user.edit")
          }}
        </h4>
      </template>
      <Drawer :form="curForm" @refresh-list="refresh" />
    </el-drawer>
    <el-dialog
      v-model="deleteDialogVisible"
      title="Warning"
      width="350"
      align-center
      class="delete-class"
    >
      <template #header>
        <div class="title">
          <el-icon color="#FAAD14"><WarningFilled /></el-icon>
          <span>删除用户信息确认</span>
        </div>
      </template>
      <span>您确定要删除当前用户信息吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">{{
            $t("manage.user.cancel")
          }}</el-button>
          <el-button type="primary" @click="deleteUser">
            {{ $t("manage.user.sure") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRef } from "vue";
import { debounce } from "lodash-es";
import Pagination from "./pagination.vue";
import Drawer from "./drawer.vue";
import { useI18n } from "vue-i18n";
import { ElMessage, type DrawerProps } from "element-plus";
import { Search, WarningFilled } from "@element-plus/icons-vue";
import { useManageStoreHook } from "@/store/modules/manage";
const deleteDialogVisible = ref(false);
const direction = ref<DrawerProps["direction"]>();
const { t } = useI18n();
const input = ref("");
const currentPage = ref(1);
const pageSize = ref(10); // 默认10
const drawer = ref(false);
const userList = ref([]);
// 分页后的列表
// const paginatedList = computed<any[]>(() => {
//   // const startIndex = (currentPage.value - 1) * pageSize.value
//   // const endIndex = startIndex + pageSize.value
//   // return filteredList.value.slice(startIndex, endIndex)
// })
const paginatedList = ref([
  {
    id: 1,
    username: "张三",
    number: "13939722077",
    email: "dreuw@netease.com",
    code: "66666666",
    createdTime: "2025/07/31",
    password: "6666",
    role: "manager",
    enable: true
  },
  {
    id: 2,
    username: "李四",
    number: "13939722077",
    email: "dreuw@netease.com",
    code: "66666666",
    createdTime: "2025/07/31",
    password: "6666",
    role: "user",
    enable: false
  },
  {
    id: 3,
    username: "王五",
    number: "13812345678",
    email: "wangwu@qq.com",
    code: "88888888",
    createdTime: "2025/08/05",
    password: "8888",
    role: "admin",
    enable: true
  },
  {
    id: 4,
    username: "赵六",
    number: "13787654321",
    email: "zhaoliu@163.com",
    code: "99999999",
    createdTime: "2025/08/10",
    password: "9999",
    role: "user",
    enable: true
  },
  {
    id: 5,
    username: "孙七",
    number: "13656789012",
    email: "sunqi@outlook.com",
    code: "12345678",
    createdTime: "2025/08/15",
    password: "1234",
    role: "manager",
    enable: false
  },
  {
    id: 6,
    username: "周八",
    number: "13545678901",
    email: "zhouba@gmail.com",
    code: "23456789",
    createdTime: "2025/08/20",
    password: "2345",
    role: "user",
    enable: true
  },
  {
    id: 7,
    username: "吴九",
    number: "13434567890",
    email: "wujiu@hotmail.com",
    code: "34567890",
    createdTime: "2025/08/25",
    password: "3456",
    role: "admin",
    enable: false
  },
  {
    id: 8,
    username: "郑十",
    number: "13323456789",
    email: "zhengshi@126.com",
    code: "45678901",
    createdTime: "2025/09/01",
    password: "4567",
    role: "manager",
    enable: true
  },
  {
    id: 9,
    username: "钱一",
    number: "13212345678",
    email: "qianyi@sohu.com",
    code: "56789012",
    createdTime: "2025/09/05",
    password: "5678",
    role: "user",
    enable: false
  },
  {
    id: 10,
    username: "孙二",
    number: "13101234567",
    email: "suner@yeah.net",
    code: "67890123",
    createdTime: "2025/09/10",
    password: "6789",
    role: "admin",
    enable: true
  }
]);
const curType = ref("new");
const curForm = ref({});
const handleNew = (item: any) => {
  curType.value = "new";
  curForm.value = {};
  drawer.value = true;
  console.log(item);
};
const handleEdit = (item: any) => {
  curType.value = "edit";
  curForm.value = item;
  drawer.value = true;
  console.log(item);
};
const curUser = ref({});
const handleDelete = (item: any) => {
  deleteDialogVisible.value = true;
  curUser.value = item;
  console.log(item);
};
// 处理搜索
const handleSearch = debounce(() => {
  currentPage.value = 1; // 搜索时重置到第一页
  getUserList();
}, 300);

// 处理页码变更
const handlePageChange = (page: number) => {
  currentPage.value = page;
  getUserList();
};

// 处理每页条数变更
const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  getUserList();
};
const fileList = ref(null);
const fileUpload = (uploadFile, uploadFiles) => {
  if (!uploadFiles || uploadFiles.length === 0) return;
  console.log(uploadFile);
  const formdata = new FormData();
  formdata.append("file", uploadFile.raw);
  useManageStoreHook()
    .upload(formdata)
    .then(res => {
      console.log(res);
      ElMessage.success("批量上传成功");
      getUserList();
    })
    .finally(() => {
      // 无论成功/失败，最终都清除文件列表
      if (fileList.value) {
        fileList.value.clearFiles(); // 调用组件的clearFiles方法清空列表
      }
    });
};
const formatDateTime = timeStr => {
  if (!timeStr) return ""; // 处理空值
  const date = new Date(timeStr); // 解析时间字符串为 Date 对象
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 补零（如 3 → "03"）
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  // 拼接为 "YYYY-MM-DD HH:MM:SS" 格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const handleStatusChange = row => {
  console.log("当前行状态已更新为：", row.status); // 此时 row.status 已同步为 '1' 或 '0'
  // 这里可添加接口请求逻辑，如：updateStatus(row.id, row.status)
};
const getUserList = () => {
  useManageStoreHook()
    .userList(currentPage.value, pageSize.value, input.value)
    .then(res => {
      userList.value = res.data;
    });
};
const deleteUser = () => {
  useManageStoreHook()
    .deleteUserInfo({ id: curUser.value.id })
    .then(res => {
      ElMessage.success("删除成功");
      getUserList();
    });
  deleteDialogVisible.value = false;
};
const refresh = () => {
  getUserList();
};
onMounted(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.main,
.table {
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(13, 10, 44, 0.08);
  border-radius: 12px;
  overflow: hidden;
  font-family:
    HarmonyOS Sans SC,
    HarmonyOS Sans SC;
}
// .main {
//   height: 100%;
// }
.table {
  width: 100%;
}
:deep(.el-input__inner),
:deep(.el-select__selected-item) {
  font-size: 13px;
  font-weight: 400;
}
:deep(.el-table tr) {
  height: 56px;
  background-color: #ffffff;
  color: #202a2f;
  font-weight: 400;
  font-size: 13px;
}
:deep(.el-table .cell) {
  padding: 0 20px;
  .el-button {
    padding: 0;
    font-weight: 400;
    font-size: 13px;
  }
}
:deep(.el-table__header .cell) {
  // background-color: #fbfbfb;
  font-weight: 400;
  font-size: 14px;
  color: #80868f;
}
.delete-class {
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
}
.dialog-footer {
  text-align: center;
}
</style>
