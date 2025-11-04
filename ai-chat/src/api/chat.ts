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
  };
};
export type StreamResponse = {
  id: number;
  event: "Message" | "Done";
  data: object;
};
/** 登录 */
export const getGenerate = (data?: object) => {
  return http.request<ChatResult>("post", "/api/generate", { data });
};

export const getChat = (data?: object) => {
  return http.request<StreamResponse[]>(
    "post",
    "/coze/v1/workflow/stream_run",
    {
      data,
      headers: {
        Authorization:
          "Bearer pat_ff0252e4fe96ed268db29f8052428c2512c654246baeff75ef385fd5748a1efe",
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
