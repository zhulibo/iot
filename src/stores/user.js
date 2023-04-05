import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {}
  }),
  getters: {
    getUserInfo: (state) => state.userInfo
  },
  actions: {
    // 更新用户信息
    updateUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    // 重置用户信息
    resetUserInfo() {
      this.userInfo = null
      localStorage.removeItem('userInfo')
    }
  }
})
