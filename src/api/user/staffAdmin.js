import axios from '@/axios'

// 获取公司管理员列表
export function getStaffList(params) {
  return new Promise(resolve => {
    resolve({
      code: 0,
      data: [
        {
          createTime: '2021-12-29 16:50:55',
          userId: '111111111111',
          userName: 'zhangsan',
          fullName: '张三',
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
          fullName: '张三',
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

// 新增公司管理员
export function addStaff(data) {
  return axios({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

// 编辑公司管理员
export function editStaff(data) {
  return axios({
    url: '/api/user/update',
    method: 'put',
    data
  })
}

// 删除公司管理员
export function delStaff(data) {
  return axios({
    url: '/api/user/del',
    method: 'delete',
    data
  })
}