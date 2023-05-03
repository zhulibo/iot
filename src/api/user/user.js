import axios from '@/axios'

// 登录
export function login(data) {
  return new Promise(resolve => {
    resolve({
      code: 0,
      data: {
        userInfo: {
          userName: "test",
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemh1bGlibyIsImlkIjoxMjM0NTY3ODksImlhdCI6MTY3OTAzMzg1NywiZXhwIjoxNjgxNjI1ODU3fQ.kcaeDodVzBQbT563JrgaUPlMBhIIYnKar1r8GPCStMU",
        userId: 123456789,
        userName: "zhulibo",
        phone: "18203663961",
        email: "773520054@qq.com",
        permissions: [
          "user:add",
          "user:edit",
          "user:del"
        ]
      },
      msg: '成功'
    })
  })
  // return axios({
  //   url: '/api/login',
  //   method: 'post',
  //   data
  // })
}

// 注册
export function register(data) {
  return axios({
    url: '/api/register',
    method: 'post',
    data,
  })
}

// 重设密码
export function resetPassword(data) {
  return axios({
    url: '/api/modifyForgetPassword',
    method: 'post',
    data,
  })
}

export function getRouter(params) {
  return new Promise(resolve => {
    resolve({
      code: 0,
      data: {
        userMenuinfo: [
          {
            secondTitle: "主页",
            firstTitleId: {
              firstTitle: "主页",
              icon: "home",
              isMenu: true,
              name: "home",
              path: "/home",
              component: "layout",
              orderNum: 1,
              hidden: false
            },
            icon: "dashboard",
            isMenu: false,
            name: "dashboard",
            path: "dashboard",
            component: "/home/dashboard",
            orderNum: 1,
            hidden: false
          },
          {
            secondTitle: "公司管理员",
            firstTitleId: {
              firstTitle: "公司员工",
              icon: "staff",
              isMenu: true,
              name: "staff",
              path: "/staff",
              component: "layout",
              orderNum: 2,
              hidden: false
            },
            icon: "staffAdmin",
            isMenu: false,
            name: "staffAdmin",
            path: "staffAdmin",
            component: "/staff/staffAdmin",
            orderNum: 1,
            hidden: false
          },
          {
            secondTitle: "企业用户",
            firstTitleId: {
              firstTitle: "用户管理",
              icon: "user",
              isMenu: true,
              name: "user",
              path: "/user",
              component: "layout",
              orderNum: 3,
              hidden: false
            },
            icon: "userCompany",
            isMenu: false,
            name: "userCompany",
            path: "userCompany",
            component: "/user/userCompany",
            orderNum: 1,
            hidden: false
          },
          {
            secondTitle: "个人用户",
            firstTitleId: {
              firstTitle: "用户管理",
              icon: "user",
              isMenu: true,
              name: "user",
              path: "/user",
              component: "layout",
              orderNum: 3,
              hidden: false
            },
            icon: "userPersonal",
            isMenu: false,
            name: "userPersonal",
            path: "userPersonal",
            component: "/user/userPersonal",
            orderNum: 2,
            hidden: false
          },
          {
            secondTitle: "设备管理",
            firstTitleId: {
              firstTitle: "设备管理",
              icon: "device",
              isMenu: true,
              name: "device",
              path: "/device",
              component: "layout",
              orderNum: 4,
              hidden: false
            },
            icon: "deviceManagement",
            isMenu: false,
            name: "deviceManagement",
            path: "deviceManagement",
            component: "/device/deviceManagement",
            orderNum: 1,
            hidden: false
          },
          {
            secondTitle: "设备说明",
            firstTitleId: {
              firstTitle: "设备管理",
              icon: "device",
              isMenu: true,
              name: "device",
              path: "/device",
              component: "layout",
              orderNum: 4,
              hidden: false
            },
            icon: "deviceInstructions",
            isMenu: false,
            name: "deviceInstructions",
            path: "deviceInstructions",
            component: "/device/deviceInstructions",
            orderNum: 2,
            hidden: false
          },
          {
            secondTitle: "设备日志",
            firstTitleId: {
              firstTitle: "设备日志",
              icon: "log",
              isMenu: true,
              name: "log",
              path: "/log",
              component: "layout",
              orderNum: 5,
              hidden: false
            },
            icon: "deviceLog",
            isMenu: false,
            name: "deviceLog",
            path: "deviceLog",
            component: "/log/deviceLog",
            orderNum: 1,
            hidden: false
          },
          {
            secondTitle: "个人中心",
            firstTitleId: {
              firstTitle: "个人中心",
              icon: "my",
              isMenu: true,
              name: "my",
              path: "/my",
              component: "layout",
              orderNum: 6,
              hidden: false
            },
            icon: "myIndex",
            isMenu: false,
            name: "myIndex",
            path: "myIndex",
            component: "/my/myIndex",
            orderNum: 1,
            hidden: false
          }
        ]
      },
      msg: "请求成功"
    })
  })
}
// 获取路由信息
// export function getRouter(params) {
//   return axios({
//     url: '/api/getRouter',
//     method: 'get',
//     params
//   })
// }

// 查询用户详情
export function getUserDetail(id, params) {
  return axios({
    url: '/api/management/staff/' + id,
    method: 'get',
    params
  })
}

// // 获取用户信息
// export function getUserDetail(id) {
//   return axios({
//     url: '/api/user/detail/' + id,
//     method: 'get',
//   })
// }

// // 编辑用户个人资料
// export function editUserInfo(params) {
//   return axios({
//     url: '/api/user/edit',
//     method: 'get',
//     params
//   })
// }
