import { defineStore } from "pinia";
import { store } from "../utils";

import {
  type ManageResult,
  getDownload,
  getLogin,
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  uploadUser,
  getBizTypeList,
  uploadKnowledge,
  getFileList,
  deleteKnowledge,
  downloadKnowledge
} from "@/api/manage";
export const useManageStore = defineStore("mange", {
  state: () => {
    return {
      userList: [] //用户列表信息
    };
  },
  actions: {
    /** 登录 */
    async login(data: object) {
      return new Promise<ManageResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async download(name, download) {
      return new Promise<ManageResult>((resolve, reject) => {
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
    async userList(page, pageSize, keywork) {
      return new Promise<ManageResult>((resolve, reject) => {
        getUserList(page, pageSize, keywork)
          .then(res => {
            // this.userList = res.data;
            res.success = true;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async createUser(data: object) {
      return new Promise<ManageResult>((resolve, reject) => {
        addUser(data)
          .then(res => {
            console.log(res);
            res.success = true;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async updateUserInfo(data: object) {
      return new Promise<ManageResult>((resolve, reject) => {
        updateUser(data)
          .then(res => {
            console.log(res);
            res.success = true;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async deleteUserInfo(data: object) {
      return new Promise<ManageResult>((resolve, reject) => {
        deleteUser(data)
          .then(res => {
            console.log(res);
            res.success = true;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async upload(data: object) {
      return new Promise<ManageResult>((resolve, reject) => {
        uploadUser(data)
          .then(res => {
            console.log(res);
            res.success = true;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取业务类型列表
    async getTypeList() {
      return new Promise<ManageResult>((resolve, reject) => {
        getBizTypeList()
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
    async uploadKnowledge(data: object) {
      return new Promise<ManageResult>((resolve, reject) => {
        uploadKnowledge(data)
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
    async getKnowledgeFileList(page, pageSize, keywork) {
      return new Promise<ManageResult>((resolve, reject) => {
        getFileList(page, pageSize, keywork)
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
    async deleteKnowledgeInfo(data: object) {
      return new Promise<ManageResult>((resolve, reject) => {
        deleteKnowledge(data)
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
    async downloadFile(id) {
      return new Promise<ManageResult>((resolve, reject) => {
        downloadKnowledge(id)
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

export function useManageStoreHook() {
  return useManageStore(store);
}
