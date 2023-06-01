import { createRouter, createWebHistory } from 'vue-router'
import {baseRoutes} from './base'
import {useUserStore} from '@/stores/user'
import {usePermissionStore} from '@/stores/permission'
import { getRouter } from '@/api/user/user'
import {to as hander, deepCopy} from "js-fragment";

let userStore
let permissionStore

export const constantRoutes = [
  ...baseRoutes
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})
export const whiteList = ['/login', '/register', '/resetPassword'] // 无需登录的页面

router.beforeEach((to, from, next) => {

  if(!userStore) userStore = useUserStore()
  if(!permissionStore) permissionStore = usePermissionStore()

  if (!userStore.getUserInfo?.token) { // 未登录

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
        // 获取路由信息
        const [ err, data ] = await hander(getRouter({
          userName: userStore.getUserInfo.userName,
          token: userStore.getUserInfo.token,
        }))
        if(err) return false

        const menuInfo = data.data.userMenuinfo
        let subMenu = []
        let menuList = []

        // 分离一二级菜单
        for (let i = 0; i < menuInfo.length; i++) {
          subMenu.push(deepCopy(menuInfo[i]))
          if(menuList.indexOf(menuInfo[i].firstTitleId) === -1) {
            menuList.push(deepCopy(menuInfo[i].firstTitleId))
          }
        }

        // 一级菜单去重
        for (let i = 0; i < menuList.length; i++) {
          for (let j = i+1; j < menuList.length; j++) {
            if(menuList[i].firstTitle === menuList[j].firstTitle) {
              menuList.splice(i+1, 1)
            }
          }
        }

        // 追加二级菜单
        for (let i = 0; i < subMenu.length; i++) {
          for (let j = 0; j < menuList.length; j++) {
            if(subMenu[i].firstTitleId.firstTitle === menuList[j].firstTitle) {
              if(!menuList[j].children) {
                menuList[j].children = []
              }
              menuList[j].children.push(subMenu[i])
            }

          }
        }

        // 根据orderNum排序
        function sort(menuList) {
          for (let i = 0; i < menuList.length; i++) {
            menuList.sort((a, b) => {
              return a.orderNum - b.orderNum
            })
          }
          if(menuList.children && menuList.children > 0) {
            sort(menuList.children)
          }
        }
        sort(menuList)

        // 修改字段名
        for (let i = 0; i < menuList.length; i++) {
          menuList[i].meta = {
            icon: menuList[i].icon,
            title: menuList[i].firstTitle,
            hidden: menuList[i].hidden === true ? 1 : 0
          }
          for (let j = 0; j < menuList[i].children.length; j++) {
            menuList[i].children[j].meta = {
              icon: menuList[i].children[j].icon,
              title: menuList[i].children[j].secondTitle,
              hidden: menuList[i].children[j].hidden === true ? 1 : 0
            }
            delete menuList[i].children[j].firstTitleId
          }
        }
        // console.log(deepCopy(menuList))
        await permissionStore.updateRouter(menuList) // 并合进pina和vue-router
        next({ ...to, replace: true }) // 合并成功后重新进入beforeEach
      })()
    }

  }
})
