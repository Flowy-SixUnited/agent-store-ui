import { defineStore } from "pinia";
import { store } from "../utils";
// import { getGenerate } from "@/api/podcast";
// import { useMultiTagsStoreHook } from "./multiTags";
// import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
import {
  type PodcastResult,
  getDownload,
  getGenerate,
  getUpload
} from "@/api/podcast";
export const usePodcastStore = defineStore("ai-podcast", {
  // state: (): userType => ({
  //   // 头像
  //   avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
  //   // 用户名
  //   username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
  //   // 昵称
  //   nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
  //   // 页面级别权限
  //   roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
  //   // 按钮级别权限
  //   permissions:
  //     storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
  //   // 是否勾选了登录页的免登录
  //   isRemembered: false,
  //   // 登录页的免登录存储几天，默认7天
  //   loginDay: 7
  // }),
  actions: {
    /** 生成 */
    async generate(data) {
      return new Promise<PodcastResult>((resolve, reject) => {
        getGenerate(data)
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
      return new Promise<PodcastResult>((resolve, reject) => {
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
      return new Promise<PodcastResult>((resolve, reject) => {
        getUpload(data)
          .then(data => {
            console.log(data);
            // if (data?.status === "ok") {
            //   data.success = true;
            //   data.file = data.file;
            // }
            // data.file = data;
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

export function usePodcastStoreHook() {
  return usePodcastStore(store);
}
