import {defineStore} from "pinia";

export const useVisitedPagesStore = defineStore('visitedPage', {
  state: () => ({
    visitedPages: []
  }),
  getters: {
    getVisitedPages: (state) => state.visitedPages,
  },
  actions: {
    // 添加已访问页面
    addVisitedPage(visitedPage) {
      if(!this.visitedPages.some(v => v.path === visitedPage.path)) {
        this.visitedPages.push(visitedPage)
      }
    },
  }
})
