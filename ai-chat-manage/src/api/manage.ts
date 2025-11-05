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
  keyword: string
) => {
  return http.request<ManageResult>(
    "get",
    `/api/v1/admin/user/list?page=${page}&page_size=${pageSize}&keyword=${keyword}`
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
export const getBizTypeList = () => {
  return http.request<ManageResult>("get", "/api/v1/admin/knowledge/biz_type");
};
export const uploadKnowledge = (data?: object) => {
  return http.request<ManageResult>(
    "post",
    "/api/v1/admin/knowledge/upload_knowledge_file",
    {
      data,
      headers: {
        "Content-Type": "multipart/form-data" // 配置上传类型
      }
    }
  );
};
export const getFileList = (
  page: number,
  pageSize: number,
  keyword: string
) => {
  return http.request<ManageResult>(
    "get",
    `/api/v1/admin/knowledge/knowledge_file/list?page=${page}&page_size=${pageSize}&keyword=${keyword}`
  );
};
export const deleteKnowledge = (data?: object) => {
  return http.request<ManageResult>(
    "post",
    "/api/v1/admin/knowledge/knowledge_file/remove",
    {
      data
    }
  );
};
export const downloadKnowledge = (fileId: string) => {
  return http.request<ManageResult>(
    "get",
    `/download/v1/files/retrieve?file_id=${fileId}`
  );
};
