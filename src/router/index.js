import { createRouter, createWebHistory } from 'vue-router'
import {baseRoutes} from './base'
import {useUserStore} from '@/stores/user'
import {usePermissionStore} from '@/stores/permission'
import { getRouter } from '@/api/user/user'

let userStore
let permissionStore

export const constantRoutes = [
  ...baseRoutes
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export const whiteList = ['/login', '/register'] // 无需登录的页面

router.beforeEach((to, from, next) => {

  if(!userStore) userStore = useUserStore()
  if(!permissionStore) permissionStore = usePermissionStore()

  if (!userStore.getUserInfo.token) { // 未登录

    if (whiteList.indexOf(to.path) !== -1) { // 白名单页面直接放行
      next()
    } else {
      next('/login')
    }

  } else { // 已登录

    if(permissionStore.getAddRouterStatus) { // 路由合并已完成
      next()
    } else { // 路由合并未开始
      (async () => {
        const { data } = await getRouter() // 获取路由信息(同步)
        await permissionStore.updateRouter(data) // 并合进pina和vue-router(同步)
        next({ ...to, replace: true }) // 合并成功后重新进入beforeEach
      })()
    }

  }
})
