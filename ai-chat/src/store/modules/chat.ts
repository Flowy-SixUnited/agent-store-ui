import { defineStore } from "pinia";
import { store } from "../utils";

import {
  type ChatResult,
  getDownload,
  getChat,
  getLogin,
  downloadFile,
  getFileId
} from "@/api/chat";
export const useChatStore = defineStore("chat", {
  actions: {
    /** 聊天 */
    async goChat(content: string, onMessage?: (content: string) => void) {
      const params = {
        workflow_id: "7568754314164830208",
        parameters: {
          query: content,
          db_name: "test",
          qa_id: "abcbcbc"
        }
      };
      return new Promise<string>((resolve, reject) => {
        getChat(params)
          .then(data => {
            if (typeof data === "string") {
              // 更健壮的 SSE 解析
              const events = this.parseSSEData(data);
              let fullContent = "";
              events.forEach(event => {
                if (event.event === "Message" && event.data) {
                  try {
                    const parsedData =
                      typeof event.data === "string"
                        ? JSON.parse(event.data)
                        : event.data;
                    if (parsedData.content && onMessage) {
                      onMessage(parsedData.content);
                      fullContent += parsedData.content;
                    }
                  } catch (error) {
                    console.error("解析消息内容失败:", error);
                  }
                }
              });
              resolve(fullContent);
            } else {
              resolve("");
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // SSE 数据解析方法
    parseSSEData(data: string) {
      const events = [];
      const lines = data.split("\n");
      let currentEvent: any = {};
      lines.forEach(line => {
        if (line.startsWith("id:")) {
          currentEvent.id = line.substring(3).trim();
        } else if (line.startsWith("event:")) {
          currentEvent.event = line.substring(6).trim();
        } else if (line.startsWith("data:")) {
          const dataStr = line.substring(5).trim();
          if (dataStr) {
            try {
              currentEvent.data = JSON.parse(dataStr);
            } catch (e) {
              console.log(e);
              currentEvent.data = dataStr;
            }
          }
        } else if (line.trim() === "") {
          // 空行表示一个事件结束
          if (currentEvent.event || currentEvent.data) {
            events.push({ ...currentEvent });
            currentEvent = {};
          }
        }
      });
      // 添加最后一个事件
      if (currentEvent.event || currentEvent.data) {
        events.push(currentEvent);
      }
      return events;
    },
    async download(name, download) {
      return new Promise<ChatResult>((resolve, reject) => {
        getDownload(name, download)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async login(data) {
      return new Promise<ChatResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async downloadChatFile(id) {
      return new Promise<ChatResult>((resolve, reject) => {
        downloadFile(id)
          .then(res => {
            // console.log(res);
            res.success = true;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async getFile(data) {
      return new Promise<ChatResult>((resolve, reject) => {
        getFileId(data)
          .then(res => {
            // console.log(res);
            res.success = true;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useChatStoreHook() {
  return useChatStore(store);
}
