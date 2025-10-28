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
  }
});

export function useMultimodalStoreHook() {
  return useMultimodalStore(store);
}
