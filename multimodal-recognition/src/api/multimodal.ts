import { http } from "@/utils/http";
export type agent = {
  id: number;
  icon: string;
  name: string;
  desc: string;
  status: string;
  health_url: string;
  container_args: object;
  container_name: string;
};
export type MultimodalResult = {
  success: boolean;
  status: string;
  filename: string;
  file: string;
  size: string;
  agents: [agent];
  data: {
    /** 文件名 */
    filename: string;
    expires: Date;
  };
};
/** 获取agent列表 */
export const getGenerate = (data?: object) => {
  return http.request<MultimodalResult>("post", "/api/v1/chat/completions", {
    data,
    headers: { "Content-Type": "application/json" }
  });
};
export const getDownload = (name?: string, download?: boolean) => {
  return http.request<MultimodalResult>(
    "post",
    `/api/download?name=${name}&is_download=${download}`,
    {
      responseType: "blob" //指定响应类型为 blob
    }
  );
};
export const toggleAgent = (data: number) => {
  // 明确接收 FormData 类型
  return http.request<MultimodalResult>("post", `/api/toggle_agent?id=${data}`);
};
