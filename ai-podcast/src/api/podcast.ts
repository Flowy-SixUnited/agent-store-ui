import { http } from "@/utils/http";

export type PodcastResult = {
  success: boolean;
  status: string;
  filename: string;
  file: string;
  size: string;
  data: {
    /** 文件名 */
    filename: string;
    expires: Date;
  };
};
/** 登录 */
export const getGenerate = (data?: object) => {
  return http.request<PodcastResult>("post", "/api/generate", { data });
};
export const getDownload = (name?: string, download?: boolean) => {
  return http.request<PodcastResult>(
    "post",
    `/api/download?name=${name}&is_download=${download}`,
    {
      responseType: "blob" // 新增：指定响应类型为 blob
    }
  );
};
export const getUpload = (data: FormData) => {
  // 明确接收 FormData 类型
  return http.request<PodcastResult>("post", "/api/upload", {
    data,
    headers: {
      "Content-Type": "multipart/form-data" // 配置上传类型
    }
  });
};
