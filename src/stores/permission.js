import {defineStore} from "pinia";
import { router, constantRoutes } from '@/router'
import layout from '@/layout/layout.vue'
import routeWrapper from '@/layout/routeWrapper.vue'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    addRouterStatus: false, // 路由是否已合并
    routers: [], // 完整路由
    accessedRoutes: [] // 从后台获取的路由
  }),
  getters: {
    getAddRouterStatus: (state) => state.addRouterStatus,
    getRouters: (state) => state.routers,
    getAccessedRoutes: (state) => state.accessedRoutes
  },
  actions: {
    // 改变合并路由状态
    changeRouterState(bool) {
      this.addRouterStatus = bool
    },
    // 更新router
    updateRouter(routers) {
      return new Promise((resolve) => {
        const accessedRoutes = filterAsyncRouter(routers)
        this.accessedRoutes = accessedRoutes
        this.routers = constantRoutes.concat(accessedRoutes)
        // 向vue-router中添加accessedRoutes
        for (let i = 0; i < accessedRoutes.length; i++) {
          router.addRoute(accessedRoutes[i])
        }
        // 改变合并路由状态为已完成
        this.changeRouterState(true)
        resolve(accessedRoutes)
      })
    }
  }
})

// 把后端返回的路由信息转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'layout') {
        route.component = layout
      }else if (route.component === 'routeWrapper') {
        route.component = routeWrapper
      }else {
        route.component = loadComponent(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

const modules = import.meta.glob('../views/**/*.vue')
export const loadComponent = (view) => {
  return modules[`../views${view}.vue`]
}
