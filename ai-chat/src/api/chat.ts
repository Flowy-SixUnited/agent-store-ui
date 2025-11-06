import { http } from "@/utils/http";

export type ChatResult = {
  content: boolean;
  success: boolean;
  status: string;
  filename: string;
  file: string;
  size: string;
  id?: number;
  event?: "Message" | "Done";
  data?: {
    content: string;
    content_type: string;
    node_is_finish: boolean;
    token: string;
    user: object;
  };
};
export type StreamResponse = {
  id: number;
  event: "Message" | "Done";
  data: object;
};
/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<ChatResult>("post", "/api/v1/user/login", { data });
};

export const getChat = (data?: object) => {
  return http.request<StreamResponse[]>(
    "post",
    "/coze/v1/workflow/stream_run",
    {
      data,
      headers: {
        Authorization:
          "Bearer pat_250803ff0d28f62881a866e0c630b0fd8338663448d449bf76dd2a98ddbbe039",
        Accept: "text/event-stream",
        "Content-Type": "application/json"
      }
    }
  );
};
export const getDownload = (name?: string, download?: boolean) => {
  return http.request<ChatResult>(
    "post",
    `/api/download?name=${name}&is_download=${download}`,
    {
      responseType: "blob" // 新增：指定响应类型为 blob
    }
  );
};
export const getUpload = (data: FormData) => {
  // 明确接收 FormData 类型
  return http.request<ChatResult>("post", "/api/upload", {
    data,
    headers: {
      "Content-Type": "multipart/form-data" // 配置上传类型
    }
  });
};
export const downloadFile = (fileId: string) => {
  return http.request<ChatResult>(
    "get",
    `/download/v1/files/retrieve?file_id=${fileId}`
  );
};
export const getFileId = (data?: object) => {
  return http.request<ChatResult>("post", "/coze/v1/workflow/run", { data });
};
