import axios from '@/axios'
// 获取菜单列表
export function getMenuList() {
  return new Promise(resolve => {
    resolve({
      code: 0,
      data: [
        {
          id: 23,
          parentId: "",
          name: "user",
          path: "/user",
          component: "layout",
          title: "用户",
          hidden: 0,
          status: 1,
          cache: 0,
          orderNum: 2,
          createTime: "2022-09-08 14:56:31",
          updateTime: "2022-09-08 14:56:31",
          children: [
            {
              id: 24,
              parentId: "23",
              name: "userList",
              path: "userList",
              component: "/user/userList",
              title: "用户列表",
              hidden: 0,
              status: 1,
              cache: 0,
              orderNum: 1,
              createTime: "2022-09-08 15:02:41",
              updateTime: "2022-09-08 15:02:41"
            }
          ]
        },
        {
          id: 18,
          parentId: "",
          name: "sys",
          path: "/sys",
          component: "layout",
          title: "系统管理",
          hidden: 0,
          status: 1,
          cache: 0,
          orderNum: 4,
          createTime: "2022-09-02 11:08:20",
          updateTime: "2022-09-06 14:11:21",
          children: [
            {
              id: 19,
              parentId: "18",
              name: "menuList",
              path: "menuList",
              component: "/menu/menuList",
              title: "菜单列表",
              hidden: 0,
              status: 1,
              cache: 0,
              orderNum: 1,
              createTime: "2022-09-06 14:01:41",
              updateTime: "2022-09-06 14:01:41"
            }
          ]
        }
      ]
    })
  })
  return axios({
    url: '/api/menu/list',
    method: 'get',
  })
}

// 获取菜单详情
export function getMenuDetail(id) {
  return axios({
    url: '/api/menu/detail/' + id,
    method: 'get',
  })
}

// 新增菜单
export function addMenu(data) {
  return axios({
    url: '/api/menu/add',
    method: 'post',
    data
  })
}

// 编辑菜单
export function editMenu(data) {
  return axios({
    url: '/api/menu/update',
    method: 'put',
    data
  })
}

// 删除菜单
export function delMenu(id) {
  return axios({
    url: '/api/menu/del/' + id,
    method: 'delete',
  })
}
