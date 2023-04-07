import axios from '@/axios'

// 获取公司管理员列表
export function getStaffList(params) {
  return axios({
    url: '/api/management/staff',
    method: 'get',
    params
  })
}

// 新增公司管理员
export function addStaff(data, params) {
  return axios({
    url: '/api/management/staff',
    method: 'post',
    data,
    params,
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