import { defineStore } from "pinia";
import { store } from "../utils";

import {
  type AgentResult,
  getDownload,
  getAgentList,
  toggleAgent
} from "@/api/agent";
export const useAgentStore = defineStore("agent", {
  actions: {
    /** 列表 */
    async agentList() {
      return new Promise<AgentResult>((resolve, reject) => {
        getAgentList()
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async download(name, download) {
      return new Promise<AgentResult>((resolve, reject) => {
        getDownload(name, download)
          .then(data => {
            // console.log(data);
            // if (data?.status === "ok") {
            //   data.success = true;
            //   data.file = data.file;
            // }
            // data.file = data;
            // data.success = true;
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async openAgent(data) {
      return new Promise<AgentResult>((resolve, reject) => {
        toggleAgent(data)
          .then(data => {
            console.log(data);
            data.success = true;
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useAgentStoreHook() {
  return useAgentStore(store);
}
