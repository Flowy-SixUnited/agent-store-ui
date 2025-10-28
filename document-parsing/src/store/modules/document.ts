import { defineStore } from "pinia";
import { store } from "../utils";

import {
  type DocumentResult,
  getDownload,
  getGenerate,
  getUpload
} from "@/api/document";
export const useDocumentStore = defineStore("document-parsing", {
  actions: {
    /** 生成 */
    async generate(data) {
      return new Promise<DocumentResult>((resolve, reject) => {
        getGenerate({ filename: data })
          .then(data => {
            if (data?.status === "ok") {
              data.success = true;
              data.filename = data?.filename;
            }
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async download(name, download) {
      return new Promise<DocumentResult>((resolve, reject) => {
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
    async upload(data) {
      return new Promise<DocumentResult>((resolve, reject) => {
        getUpload(data)
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

export function useDocumentStoreHook() {
  return useDocumentStore(store);
}
