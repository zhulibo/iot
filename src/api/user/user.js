import axios from '@/axios'

// 注册
export function register(data) {
  return axios({
    url: '/api/register',
    method: 'post',
    data,
  })
}

// 登录
export function login(data) {
  console.log(data)
  // return new Promise(resolve => {
  //   resolve({
  //     code: 0,
  //     data: {
  //       userinfo: {
  //         userName: "test",
  //       },
  //       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemh1bGlibyIsImlkIjoxMjM0NTY3ODksImlhdCI6MTY3OTAzMzg1NywiZXhwIjoxNjgxNjI1ODU3fQ.kcaeDodVzBQbT563JrgaUPlMBhIIYnKar1r8GPCStMU",
  //       userId: 123456789,
  //       userName: "zhulibo",
  //       phone: "18203663961",
  //       email: "773520054@qq.com",
  //       permissions: [
  //         "user:add",
  //         "user:edit",
  //         "user:del"
  //       ]
  //     },
  //     msg: '成功'
  //   })
  // })
  return axios({
    url: '/api/login',
    method: 'post',
    data
  })
}

// 获取路由信息
export function getRouter() {
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
              updateTime: "2022-09-08 15:02:41",
              meta: {
                title: "用户列表",
                hidden: false,
                cache: false
              }
            },
          ],
          meta: {
            title: "用户",
            hidden: false,
            cache: false
          }
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
              updateTime: "2022-09-06 14:01:41",
              meta: {
                title: "菜单列表",
                hidden: false,
                cache: false
              }
            }
          ],
          meta: {
            title: "系统管理",
            hidden: false,
            cache: false
          }
        }
      ],
      msg: '成功'
    })
  })
  return axios({
    url: '/api/user/getRouter',
    method: 'get',
  })
}

// 获取用户列表
export function getUserList(params) {
  return new Promise(resolve => {
    resolve({
      code: 0,
      data: [
        {
          createTime: '2021-12-29 16:50:55',
          userId: '111111111111',
          userName: 'zhangsan',
          name: '张三',
          password: 'zhu022044',
          phone: '18203663961',
          email: '773520054@qq.com',
          userDeviceLoginid: '111111',
          userDeviceLoginpwd: 'zhu022044',
          status: 1,
        },
        {
          createTime: '2021-12-29 16:50:55',
          userId: '22222222',
          userName: 'zhangsan2',
          name: '张三',
          password: 'zhu022044',
          phone: '18203663961',
          email: '773520054@qq.com',
          userDeviceLoginid: '22222',
          userDeviceLoginpwd: 'zhu022044',
          status: 1,
        }
      ],
      total: 2
    })
  })
  return axios({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

// 新增用户
export function addUser(data) {
  return axios({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

// 编辑用户
export function editUser(data) {
  return axios({
    url: '/api/user/update',
    method: 'put',
    data
  })
}

// 删除用户
export function delUser(id) {
  return axios({
    url: '/api/user/del/' + id,
    method: 'delete',
  })
}