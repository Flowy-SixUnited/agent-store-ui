import { defineStore } from "pinia";
import { store } from "../utils";

import { type MultimodalResult, getGenerate } from "@/api/multimodal";
export const useMultimodalStore = defineStore("multimodal", {
  actions: {
    /** 列表 */
    async generate(data: object) {
      return new Promise<MultimodalResult>((resolve, reject) => {
        getGenerate(data)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
    // async download(name, download) {
    //   return new Promise<AgentResult>((resolve, reject) => {
    //     getDownload(name, download)
    //       .then(data => {
    //         // console.log(data);
    //         // if (data?.status === "ok") {
    //         //   data.success = true;
    //         //   data.file = data.file;
    //         // }
    //         // data.file = data;
    //         // data.success = true;
    //         resolve(data);
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    // async openAgent(data) {
    //   return new Promise<AgentResult>((resolve, reject) => {
    //     toggleAgent(data)
    //       .then(data => {
    //         console.log(data);
    //         data.success = true;
    //         resolve(data);
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // }
  }
});

export function useMultimodalStoreHook() {
  return useMultimodalStore(store);
}
