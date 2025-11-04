import { http } from "@/utils/http";

export type ManageResult = {
  success: boolean;
  status: string;
  filename: string;
  file: string;
  size: string;
  data: {
    /** 文件名 */
    filename: string;
    expires: Date;
    token: string;
  };
};
/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<ManageResult>("post", "/api/v1/admin/login", { data });
};
export const getDownload = (name?: string, download?: boolean) => {
  return http.request<ManageResult>(
    "post",
    `/api/download?name=${name}&is_download=${download}`,
    {
      responseType: "blob" // 新增：指定响应类型为 blob
    }
  );
};
export const getUpload = (data: FormData) => {
  // 明确接收 FormData 类型
  return http.request<ManageResult>("post", "/api/upload", {
    data,
    headers: {
      "Content-Type": "multipart/form-data" // 配置上传类型
    }
  });
};

export const getUserList = (
  page: number,
  pageSize: number,
  keywork: string
) => {
  return http.request<ManageResult>(
    "get",
    `/api/v1/admin/user/list?page=${page}&page_size=${pageSize}&keywork=${keywork}`
  );
};

export const addUser = (data?: object) => {
  return http.request<ManageResult>("post", "/api/v1/admin/user/create", {
    data
  });
};
export const updateUser = (data?: object) => {
  return http.request<ManageResult>("post", "/api/v1/admin/user/update", {
    data
  });
};
export const deleteUser = (data?: object) => {
  return http.request<ManageResult>("post", "/api/v1/admin/user/remove", {
    data
  });
};
export const uploadUser = (data?: object) => {
  return http.request<ManageResult>("post", "/api/v1/admin/user/multi_create", {
    data,
    headers: {
      "Content-Type": "multipart/form-data" // 配置上传类型
    }
  });
};
